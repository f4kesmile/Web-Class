"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, AgendaType } from "@/lib/enums";
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

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function immutableSuperAdminEmailSet() {
  const raw = process.env.SUPERADMIN_IMMUTABLE_EMAILS ?? "";
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeEmail);

  return new Set(list);
}

async function getTargetUserCore(targetUserId: string) {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true, role: true, isBanned: true },
  });

  if (!target) throw new Error("USER_NOT_FOUND");

  const { role, ...rest } = target;

  return {
    ...rest,
    role: role as unknown as Role,
  };
}

function isImmutableSuperAdmin(target: { email: string; role: Role }) {
  if (target.role !== Role.SUPER_ADMIN) return false;
  const set = immutableSuperAdminEmailSet();
  return set.has(normalizeEmail(target.email));
}

function assertNotSelf(actorId: string, targetUserId: string) {
  if (actorId === targetUserId) throw new Error("CANNOT_TOUCH_SELF");
}

async function assertAdmin(): Promise<{ id: string; role: Role; isBanned: boolean; email: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { role: prismaRole, ...rest } = user;
  const role = prismaRole as unknown as Role;

  if (rest.isBanned) throw new Error("BANNED");
  if (role !== Role.ADMIN && role !== Role.SUPER_ADMIN) throw new Error("FORBIDDEN");

  return { ...rest, role };
}

async function assertSuperAdmin(): Promise<{ id: string; role: Role; isBanned: boolean; email: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { role: prismaRole, ...rest } = user;
  const role = prismaRole as unknown as Role;

  if (rest.isBanned) throw new Error("BANNED");
  if (role !== Role.SUPER_ADMIN) throw new Error("FORBIDDEN");

  return { ...rest, role };
}

async function createLog(userId: string, action: string, details: string) {
  await prisma.activityLog.create({
    data: { userId, action, details },
  });

  const count = await prisma.activityLog.count();
  if (count > 50) {
    const logsToKeep = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true },
    });

    const idsToKeep = logsToKeep.map((log) => log.id);

    await prisma.activityLog.deleteMany({
      where: {
        id: { notIn: idsToKeep },
      },
    });
  }
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

    return users.map((user) => {
      const { role, ...rest } = user;
      return {
        ...rest,
        role: role as unknown as Role,
      };
    });
  } catch {
    return [];
  }
}

export async function updateUserRole(targetUserId: string, newRole: Role): Promise<ActionResult> {
  try {
    const { id: actorId } = await assertSuperAdmin();

    assertNotSelf(actorId, targetUserId);

    const target = await getTargetUserCore(targetUserId);
    if (isImmutableSuperAdmin(target)) {
      return { success: false, message: "Target adalah Super Admin yang tidak bisa disentuh." };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as unknown as import("@prisma/client").Role },
    });

    await createLog(actorId, "UPDATE_ROLE", `Mengubah role user ${targetUserId} menjadi ${newRole}`);
    revalidatePath("/dashboard/settings");
    return { success: true, message: "Role user diperbarui" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";

    if (msg === "CANNOT_TOUCH_SELF") return { success: false, message: "Tidak bisa mengubah role diri sendiri." };
    if (msg === "USER_NOT_FOUND") return { success: false, message: "User tidak ditemukan" };

    return { success: false, message: "Hanya Super Admin yang bisa mengubah Role" };
  }
}

export async function toggleBanUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: actorId } = await assertSuperAdmin();

    assertNotSelf(actorId, targetUserId);

    const target = await getTargetUserCore(targetUserId);
    if (isImmutableSuperAdmin(target)) {
      return { success: false, message: "Target adalah Super Admin yang tidak bisa disentuh." };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { isBanned: !target.isBanned },
    });

    const action = target.isBanned ? "UNBAN_USER" : "BAN_USER";
    await createLog(actorId, action, `${action} user ${target.email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: target.isBanned ? "User diaktifkan kembali" : "User telah dibanned" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";

    if (msg === "CANNOT_TOUCH_SELF") return { success: false, message: "Tidak bisa mem-banned diri sendiri." };
    if (msg === "USER_NOT_FOUND") return { success: false, message: "User tidak ditemukan" };

    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

export async function banUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: actorId } = await assertSuperAdmin();

    assertNotSelf(actorId, targetUserId);

    const target = await getTargetUserCore(targetUserId);
    if (isImmutableSuperAdmin(target)) {
      return { success: false, message: "Target adalah Super Admin yang tidak bisa disentuh." };
    }

    if (target.isBanned) return { success: true, message: "User sudah dalam status banned" };

    await prisma.user.update({ where: { id: targetUserId }, data: { isBanned: true } });
    await createLog(actorId, "BAN_USER", `BAN_USER user ${target.email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: "User telah dibanned" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";

    if (msg === "CANNOT_TOUCH_SELF") return { success: false, message: "Tidak bisa membanned diri sendiri." };
    if (msg === "USER_NOT_FOUND") return { success: false, message: "User tidak ditemukan" };

    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

export async function unbanUser(targetUserId: string): Promise<ActionResult> {
  try {
    const { id: actorId } = await assertSuperAdmin();

    assertNotSelf(actorId, targetUserId);

    const target = await getTargetUserCore(targetUserId);
    if (isImmutableSuperAdmin(target)) {
      return { success: false, message: "Target adalah Super Admin yang tidak bisa disentuh." };
    }

    if (!target.isBanned) return { success: true, message: "User sudah aktif" };

    await prisma.user.update({ where: { id: targetUserId }, data: { isBanned: false } });
    await createLog(actorId, "UNBAN_USER", `UNBAN_USER user ${target.email}`);

    revalidatePath("/dashboard/settings");
    return { success: true, message: "User diaktifkan kembali" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";

    if (msg === "CANNOT_TOUCH_SELF") return { success: false, message: "Tidak bisa unban diri sendiri." };
    if (msg === "USER_NOT_FOUND") return { success: false, message: "User tidak ditemukan" };

    return { success: false, message: "Hanya Super Admin yang bisa mem-banned user" };
  }
}

function getEmailFooter() {
  const year = new Date().getFullYear();
  const appName = process.env.NEXT_PUBLIC_SITE_NAME || "Aplikasi Kelas";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return `
    <div style="background-color: #f4f4f5; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
      <p style="font-size: 12px; color: #71717a; margin: 0 0 8px 0; line-height: 1.5;">
        Pesan ini dikirim secara otomatis oleh sistem <strong>${appName}</strong>.<br>
        Mohon jangan membalas email ini secara langsung.
      </p>
      <p style="font-size: 11px; color: #a1a1aa; margin: 0;">
        &copy; ${year} ${appName}. All rights reserved.<br>
        <a href="${appUrl}" style="color: #a1a1aa; text-decoration: underline;">Privacy Policy</a> • <a href="${appUrl}" style="color: #a1a1aa; text-decoration: underline;">Support</a>
      </p>
    </div>
  `;
}

export async function inviteUser(email: string): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Web Kelas";

    const userPlusIcon = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#18181b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Undangan</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
        
        <div style="max-width: 480px; margin: 0 auto; padding: 64px 24px 32px 24px; text-align: center;">
          
          <div style="margin-bottom: 32px;">
            ${userPlusIcon}
          </div>

          <h1 style="color: #18181b; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;">
            Undangan Masuk
          </h1>
          
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">
            Anda telah diundang untuk bergabung ke <strong>${siteName}</strong>.
          </p>

          <div>
            <a href="${appUrl}/sign-up" style="display: inline-block; background-color: #18181b; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 100px; font-weight: 600; font-size: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
              Gabung Sekarang
            </a>
          </div>

        </div>

        <div style="max-width: 480px; margin: 0 auto; margin-top: 32px;">
            ${getEmailFooter()}
        </div>
      </body>
      </html>
    `;

    const emailResult = await sendEmail({ to: email, subject: `Undangan Bergabung ke ${siteName}`, html });
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
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Web Kelas";

    const bellIcon = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
      </svg>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Baru</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
        
        <div style="max-width: 480px; margin: 0 auto; padding: 64px 24px 32px 24px; text-align: center;">
          
          <div style="margin-bottom: 32px;">
            ${bellIcon}
          </div>

          <h1 style="color: #18181b; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;">
            Pesan Penting
          </h1>
          
          <p style="color: #52525b; font-size: 16px; margin: 0 0 32px 0;">
            Halo <strong>${name}</strong>, ada pesan untuk Anda:
          </p>

          <div style="background-color: #fffbeb; padding: 24px; border-radius: 12px; margin-bottom: 40px;">
            <p style="color: #92400e; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic;">
              "${message.replace(/\n/g, "<br>")}"
            </p>
          </div>

          <div>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #71717a; text-decoration: none; font-weight: 600; font-size: 14px;">
              Buka Dashboard Saya &rarr;
            </a>
          </div>
        </div>

        <div style="max-width: 480px; margin: 0 auto; margin-top: 32px;">
            ${getEmailFooter()}
        </div>
      </body>
      </html>
    `;

    const emailResult = await sendEmail({ to: email, subject: `Pesan dari ${siteName}`, html });
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

export async function upsertActiveBroadcast(formData: FormData): Promise<ActionResult> {
  try {
    const { id: userId } = await assertAdmin();

    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!title || !content) return { success: false, message: "Judul dan isi pesan wajib diisi" };

    await prisma.$transaction(async (tx) => {
      const active = await tx.announcement.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true },
      });

      if (active) {
        await tx.announcement.updateMany({
          where: { isActive: true, id: { not: active.id } },
          data: { isActive: false },
        });

        await tx.announcement.update({
          where: { id: active.id },
          data: { title, content, isActive: true },
        });

        await createLog(userId, "UPDATE_BROADCAST", `Update broadcast: ${active.title} -> ${title}`);
        return;
      }

      await tx.announcement.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      await tx.announcement.create({
        data: { title, content, isActive: true, authorId: userId },
      });

      await createLog(userId, "CREATE_BROADCAST", `Membuat pengumuman: ${title}`);
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    return { success: true, message: "Broadcast berhasil diaktifkan." };
  } catch {
    return { success: false, message: "Akses ditolak" };
  }
}

export async function getUpcomingAgendas(): Promise<
  { id: string; title: string; type: AgendaType; deadline: Date }[]
> {
  try {
    await assertAdmin();

    const now = new Date();

    const rows = await prisma.agenda.findMany({
      where: { deadline: { gte: now } },
      orderBy: { deadline: "asc" },
      take: 10,
      select: { id: true, title: true, type: true, deadline: true },
    });

    return rows.map((row) => {
      const { type, ...rest } = row;
      return {
        ...rest,
        type: type as unknown as AgendaType,
      };
    });
  } catch {
    return [];
  }
}