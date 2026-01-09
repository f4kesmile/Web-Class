"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role, AgendaType } from "@prisma/client";
import { revalidatePath } from "next/cache";

const AgendaSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  subject: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Format tanggal tidak valid"),
  type: z.enum(["ASSIGNMENT", "EXAM", "EVENT", "OTHER"]),
});

export async function createAgenda(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    return { success: false, message: "Akses ditolak." };
  }

  const validatedFields = AgendaSchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
    type: formData.get("type"),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    await prisma.agenda.create({
      data: {
        title: validatedFields.data.title,
        subject: validatedFields.data.subject || "",
        description: validatedFields.data.description || "",
        deadline: new Date(validatedFields.data.deadline),
        type: validatedFields.data.type as AgendaType,
        createdBy: user.id,
      },
    });
    revalidatePath("/dashboard/assignments");
    return { success: true, message: "Agenda berhasil dibuat." };
  } catch (error) {
    return { success: false, message: "Gagal menyimpan agenda." };
  }
}

export async function updateAgenda(id: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    return { success: false, message: "Akses ditolak." };
  }

  const validatedFields = AgendaSchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
    type: formData.get("type"),
  });

  if (!validatedFields.success) return { success: false, message: validatedFields.error.issues[0].message };

  try {
    await prisma.agenda.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        subject: validatedFields.data.subject || "",
        description: validatedFields.data.description || "",
        deadline: new Date(validatedFields.data.deadline),
        type: validatedFields.data.type as any,
      },
    });
    revalidatePath("/dashboard/assignments");
    return { success: true, message: "Agenda diperbarui!" };
  } catch (error) {
    return { success: false, message: "Gagal update." };
  }
}

export async function deleteAgenda(agendaId: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) return;

  try {
    await prisma.agenda.delete({ where: { id: agendaId } });
    revalidatePath("/dashboard/assignments");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getAgendas() {
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: { deadline: "asc" },
      where: {
        deadline: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      }
    });
    return { success: true, data: agendas };
  } catch (error) {
    return { success: false, data: [] };
  }
}