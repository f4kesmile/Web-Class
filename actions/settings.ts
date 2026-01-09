"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";

// --- 1. SITE SETTINGS ---
const SiteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "Nama situs wajib diisi" }),
  className: z.string().min(1, { message: "Nama kelas wajib diisi" }),
  semester: z.string(),

  supportEmail: z.string()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Format email support salah",
    })
    .optional(),

  instagram: z.string().optional(),
  
  emailSender: z.string()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Format email pengirim salah",
    })
    .optional(),
});

export async function updateSiteSettings(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return { success: false, message: "Akses ditolak" };

  const rawData = Object.fromEntries(formData.entries());
  const validated = SiteSettingsSchema.safeParse(rawData);

  if (!validated.success) return { success: false, message: validated.error.issues[0].message };

  const firstSetting = await prisma.siteSettings.findFirst();
  
  await prisma.siteSettings.upsert({
    where: { id: firstSetting?.id || "default-id" },
    update: validated.data,
    create: validated.data,
  });

  await createLog(user.id, "UPDATE_SETTINGS", "Mengubah pengaturan situs");

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Pengaturan disimpan" };
}

export async function getSiteSettings() {
  return await prisma.siteSettings.findFirst();
}

// --- 2. USER MANAGEMENT (Role & Ban) ---
export async function getAllUsers() {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return [];
  
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, isBanned: true, image: true }
  });
}

export async function updateUserRole(targetUserId: string, newRole: Role) {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.SUPER_ADMIN) return { success: false, message: "Hanya Super Admin yang bisa mengubah Role" };

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole }
  });

  await createLog(user.id, "UPDATE_ROLE", `Mengubah role user ${targetUserId} menjadi ${newRole}`);
  revalidatePath("/dashboard/settings");
  return { success: true, message: "Role user diperbarui" };
}

export async function toggleBanUser(targetUserId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.SUPER_ADMIN) return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) return { success: false, message: "User tidak ditemukan" };

  await prisma.user.update({
    where: { id: targetUserId },
    data: { isBanned: !target.isBanned }
  });

  const action = target.isBanned ? "UNBAN_USER" : "BAN_USER";
  await createLog(user.id, action, `${action} user ${target.email}`);

  revalidatePath("/dashboard/settings");
  return { success: true, message: target.isBanned ? "User diaktifkan kembali" : "User telah dibanned" };
}

// --- EMAIL FUNCTIONS ---

export async function inviteUser(email: string) {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return { success: false, message: "Akses ditolak" };

    const emailResult = await sendEmail({
        to: email,
        subject: "Undangan Bergabung",
        html: `
          <h1>Halo!</h1>
          <p>Anda diundang untuk bergabung ke aplikasi manajemen kelas kami.</p>
          <p>Silakan daftar menggunakan email ini di: <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-up">Link Pendaftaran</a></p>
          <br/>
          <p>Salam,<br/>Pengurus Kelas</p>
        `,
    });

    if (!emailResult.success) {
        return { success: false, message: "Gagal mengirim email (Cek konfigurasi SMTP)" };
    }

    await createLog(user.id, "INVITE_USER", `Mengundang email ${email}`);
    return { success: true, message: `Undangan terkirim ke ${email}` };
}

export async function sendUserReminder(targetUserId: string, message: string) {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return { success: false, message: "Akses Ditolak" };

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, message: "User tidak ditemukan" };

    const emailResult = await sendEmail({
        to: targetUser.email,
        subject: "📢 Pesan dari Pengurus Kelas",
        html: `
          <h3>Halo ${targetUser.name},</h3>
          <p>Ada pesan penting untukmu:</p>
          <blockquote style="border-left: 4px solid #3b82f6; padding-left: 10px; color: #555;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <br/>
          <p>Harap segera ditindaklanjuti. Terima kasih!</p>
        `,
    });

    if (emailResult.success) {
        await createLog(user.id, "SEND_MESSAGE", `Mengirim pesan ke ${targetUser.email}`);
        return { success: true, message: "Email pengingat dikirim!" };
    } else {
        return { success: false, message: "Gagal mengirim email." };
    }
}

// --- 3. ACTIVITY LOGS ---
export async function getLogs() {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return [];

    return await prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { name: true, email: true } } }
    });
}

async function createLog(userId: string, action: string, details: string) {
    await prisma.activityLog.create({
        data: { userId, action, details }
    });
}

// --- 4. BROADCAST ---
export async function createBroadcast(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return { success: false, message: "Akses ditolak" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await prisma.announcement.create({
        data: { title, content, authorId: user.id }
    });

    await createLog(user.id, "CREATE_BROADCAST", `Membuat pengumuman: ${title}`);
    revalidatePath("/dashboard/settings");
    return { success: true, message: "Pengumuman disiarkan!" };
}