"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";

const SiteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "Nama situs wajib diisi" }),
  className: z.string().min(1, { message: "Nama kelas wajib diisi" }),
  semester: z.string(),
  description: z.string().optional(),
  academicYear: z.string().optional(),
  whatsapp: z.string().optional(),
  supportEmail: z
    .string()
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Format email support salah",
    })
    .optional(),
  instagram: z.string().optional(),
  emailSender: z
    .string()
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Format email pengirim salah",
    })
    .optional(),
});


type ActionResult = { success: true; message: string } | { success: false; message: string };

type SettingsRow = {
  id: string;
  siteName: string;
  className: string;
  semester: string;
  supportEmail: string | null;
  instagram: string | null;
  emailSender: string | null;
  description: string | null;
  academicYear: string;
  whatsapp: string | null;
  updatedAt: Date;
};


type SafeUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isBanned: boolean;
  image: string | null;
};

type LogRow = {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

type ActiveBroadcast = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: { name: string | null };
} | null;

async function assertAdmin(): Promise<{ id: string; role: Role; isBanned: boolean; email: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const { role, isBanned, id, email } = user;
  if (isBanned) throw new Error("BANNED");
  if (role !== Role.ADMIN && role !== Role.SUPER_ADMIN) throw new Error("FORBIDDEN");
  return { id, role, isBanned, email };
}

async function assertSuperAdmin(): Promise<{ id: string; role: Role; isBanned: boolean; email: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const { role, isBanned, id, email } = user;
  if (isBanned) throw new Error("BANNED");
  if (role !== Role.SUPER_ADMIN) throw new Error("FORBIDDEN");
  return { id, role, isBanned, email };
}

async function createLog(userId: string, action: string, details: string) {
  await prisma.activityLog.create({
    data: { userId, action, details },
  });
}

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    const rawData = Object.fromEntries(formData.entries());
    const validated = SiteSettingsSchema.safeParse(rawData);

    if (!validated.success) return { success: false, message: validated.error.issues[0]?.message ?? "Data tidak valid" };

    const firstSetting = await prisma.siteSettings.findFirst();

    await prisma.siteSettings.upsert({
      where: { id: firstSetting?.id ?? "default-id" },
      update: validated.data,
      create: validated.data,
    });

    await createLog(userId, "UPDATE_SETTINGS", "Mengubah pengaturan situs");

    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    return { success: true, message: "Pengaturan disimpan" };
  } catch {
    return { success: false, message: "Akses ditolak" };
  }
}

export async function getSiteSettings(): Promise<SettingsRow | null> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) return null;

  const {
    id,
    siteName,
    className,
    semester,
    supportEmail,
    instagram,
    emailSender,
    description,
    academicYear,
    whatsapp,
    updatedAt,
  } = row;

  return {
    id,
    siteName,
    className,
    semester,
    supportEmail,
    instagram,
    emailSender,
    description,
    academicYear,
    whatsapp,
    updatedAt,
  };
}


export async function getAllUsers(): Promise<SafeUserRow[]> {
  try {
    await assertAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        image: true,
      },
    });

    return users;
  } catch {
    return [];
  }
}

export async function updateUserRole(targetUserId: string, newRole: Role): Promise<ActionResult> {
  try {
    const { id: userId } = await assertSuperAdmin();

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    await createLog(userId, "UPDATE_ROLE", `Mengubah role user ${targetUserId} menjadi ${newRole}`);
    revalidatePath("/dashboard/settings");
    return { success: true, message: "Role user diperbarui" };
  } catch {
    return { success: false, message: "Hanya Super Admin yang bisa mengubah Role" };
  }
}

export async function toggleBanUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertSuperAdmin();

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return { success: false, message: "User tidak ditemukan" };

    const { isBanned, email } = target;

    await prisma.user.update({
      where: { id: targetUserId },
      data: { isBanned: !isBanned },
    });

    const action = isBanned ? "UNBAN_USER" : "BAN_USER";
    await createLog(userId, action, `${action} user ${email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: isBanned ? "User diaktifkan kembali" : "User telah dibanned" };
  } catch {
    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

export async function banUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertSuperAdmin();

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return { success: false, message: "User tidak ditemukan" };

    const { isBanned, email } = target;
    if (isBanned) return { success: true, message: "User sudah dalam status banned" };

    await prisma.user.update({ where: { id: targetUserId }, data: { isBanned: true } });
    await createLog(userId, "BAN_USER", `BAN_USER user ${email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: "User telah dibanned" };
  } catch {
    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

export async function unbanUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertSuperAdmin();

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return { success: false, message: "User tidak ditemukan" };

    const { isBanned, email } = target;
    if (!isBanned) return { success: true, message: "User sudah aktif" };

    await prisma.user.update({ where: { id: targetUserId }, data: { isBanned: false } });
    await createLog(userId, "UNBAN_USER", `UNBAN_USER user ${email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: "User diaktifkan kembali" };
  } catch {
    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

export async function inviteUser(email: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const html = `
      <h1>Halo!</h1>
      <p>Anda diundang untuk bergabung ke aplikasi manajemen kelas kami.</p>
      <p>Silakan daftar menggunakan email ini di: <a href="${appUrl}/sign-up">Link Pendaftaran</a></p>
      <br/>
      <p>Salam,<br/>Pengurus Kelas</p>
    `;

    const emailResult = await sendEmail({ to: email, subject: "Undangan Bergabung", html });
    if (!emailResult.success) return { success: false, message: "Gagal mengirim email (Cek konfigurasi SMTP)" };

    await createLog(userId, "INVITE_USER", `Mengundang email ${email}`);
    return { success: true, message: `Undangan terkirim ke ${email}` };
  } catch {
    return { success: false, message: "Akses ditolak" };
  }
}

export async function sendUserReminder(targetUserId: string, message: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, message: "User tidak ditemukan" };

    const { email, name } = targetUser;

    const html = `
      <h3>Halo ${name ?? "User"},</h3>
      <p>Ada pesan penting untukmu:</p>
      <blockquote style="border-left: 4px solid #3b82f6; padding-left: 10px; color: #555;">
        ${message.replace(/\n/g, "<br>")}
      </blockquote>
      <br/>
      <p>Harap segera ditindaklanjuti. Terima kasih!</p>
    `;

    const emailResult = await sendEmail({ to: email, subject: "📢 Pesan dari Pengurus Kelas", html });
    if (!emailResult.success) return { success: false, message: "Gagal mengirim email." };

    await createLog(userId, "SEND_MESSAGE", `Mengirim pesan ke ${email}`);
    return { success: true, message: "Email pengingat dikirim!" };
  } catch {
    return { success: false, message: "Akses Ditolak" };
  }
}

export async function getLogs(): Promise<LogRow[]> {
  try {
    await assertAdmin();

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } } },
    });

    return logs.map(({ id, action, details, createdAt, user }) => ({
      id,
      action,
      details,
      createdAt,
      user: { name: user.name, email: user.email },
    }));
  } catch {
    return [];
  }
}

export async function createBroadcast(formData: FormData): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!title || !content) return { success: false, message: "Judul dan isi pesan wajib diisi" };

    await prisma.announcement.create({
      data: { title, content, authorId: userId },
    });

    await createLog(userId, "CREATE_BROADCAST", `Membuat pengumuman: ${title}`);
    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    return { success: true, message: "Pengumuman disiarkan!" };
  } catch {
    return { success: false, message: "Akses ditolak" };
  }
}

export async function deleteActiveBroadcast(): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    await prisma.announcement.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    await createLog(userId, "DISABLE_BROADCAST", "Mematikan broadcast aktif");

    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    return { success: true, message: "Broadcast dimatikan." };
  } catch {
    return { success: false, message: "Akses ditolak" };
  }
}

export async function getActiveBroadcast(): Promise<ActiveBroadcast> {
  const announcement = await prisma.announcement.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  if (!announcement) return null;

  const { id, title, content, createdAt, author } = announcement;
  return { id, title, content, createdAt, author };
}
