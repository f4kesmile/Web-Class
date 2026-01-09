"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const ScheduleSchema = z.object({
  subject: z.string().min(3, "Nama mata kuliah minimal 3 karakter"),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu salah"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu salah"),
  lecturer: z.string().optional(),
  room: z.string().optional(),
  credits: z.coerce.number().min(1, "Minimal 1 SKS").max(6, "Maksimal 6 SKS").optional(),
});

export async function createSchedule(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    return { success: false, message: "Akses ditolak. Hanya Admin yang boleh." };
  }

  const validatedFields = ScheduleSchema.safeParse({
    subject: formData.get("subject"),
    day: formData.get("day"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    lecturer: formData.get("lecturer"),
    room: formData.get("room"),
    credits: formData.get("credits"),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    await prisma.schedule.create({ data: validatedFields.data });
    revalidatePath("/dashboard/schedule");
    return { success: true, message: "Jadwal berhasil ditambahkan!" };
  } catch (error) {
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}

export async function updateSchedule(id: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    return { success: false, message: "Akses ditolak." };
  }

  const validatedFields = ScheduleSchema.safeParse({
    subject: formData.get("subject"),
    day: formData.get("day"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    lecturer: formData.get("lecturer"),
    room: formData.get("room"),
    credits: formData.get("credits"),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    await prisma.schedule.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath("/dashboard/schedule");
    return { success: true, message: "Jadwal berhasil diperbarui!" };
  } catch (error) {
    return { success: false, message: "Gagal mengupdate jadwal." };
  }
}

export async function deleteSchedule(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return;

  try {
    await prisma.schedule.delete({ where: { id } });
    revalidatePath("/dashboard/schedule");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getSchedules() {
  try {
    const schedules = await prisma.schedule.findMany({ orderBy: { startTime: "asc" } });
    return { success: true, data: schedules };
  } catch (error) {
    return { success: false, data: [] };
  }
}