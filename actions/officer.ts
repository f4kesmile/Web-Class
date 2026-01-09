"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const OfficerSchema = z.object({
  userId: z.string().min(1, "Wajib memilih siswa"),
  position: z.string().min(3, "Jabatan minimal 3 karakter"),
  displayOrder: z.coerce.number().min(1, "Urutan minimal 1"),
});

export async function getUsersList() {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return [];

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, image: true },
    });
    return users;
  } catch (error) {
    return [];
  }
}

export async function upsertOfficer(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    return { success: false, message: "Akses ditolak." };
  }

  const rawData = {
    userId: formData.get("userId"),
    position: formData.get("position"),
    displayOrder: formData.get("displayOrder"),
  };

  const validatedFields = OfficerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    await prisma.officer.upsert({
      where: { userId: validatedFields.data.userId },
      update: {
        position: validatedFields.data.position,
        displayOrder: validatedFields.data.displayOrder,
      },
      create: {
        userId: validatedFields.data.userId,
        position: validatedFields.data.position,
        displayOrder: validatedFields.data.displayOrder,
      },
    });

    revalidatePath("/dashboard/officers");
    return { success: true, message: "Data pengurus berhasil disimpan!" };
  } catch (error) {
    return { success: false, message: "Gagal menyimpan data." };
  }
}

export async function deleteOfficer(officerId: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return;

  try {
    await prisma.officer.delete({ where: { id: officerId } });
    revalidatePath("/dashboard/officers");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getOfficers() {
  try {
    const officers = await prisma.officer.findMany({
      include: {
        user: { select: { name: true, image: true, email: true } },
      },
      orderBy: { displayOrder: "asc" },
    });
    return { success: true, data: officers };
  } catch (error) {
    return { success: false, data: [] };
  }
}