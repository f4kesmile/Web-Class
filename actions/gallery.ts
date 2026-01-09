"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const GallerySchema = z.object({
  imageUrl: z.string().min(1, "Gambar wajib diisi"),
  title: z.string().min(1, "Judul wajib diisi").max(100, "Judul maksimal 100 karakter"),
  description: z.string().optional(),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Tanggal tidak valid"),
});

export async function createGalleryImage(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  if (!isAdmin) {
    return { success: false, message: "Akses ditolak." };
  }

  const rawData = {
    imageUrl: formData.get("imageUrl"),
    title: formData.get("title"),
    description: formData.get("description"),
    eventDate: formData.get("eventDate"),
  };

  const validatedFields = GallerySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    await prisma.gallery.create({
      data: {
        imageUrl: validatedFields.data.imageUrl,
        title: validatedFields.data.title,
        description: validatedFields.data.description || "",
        eventDate: new Date(validatedFields.data.eventDate),
      },
    });

    revalidatePath("/dashboard/gallery");
    revalidatePath("/");
    return { success: true, message: "Foto berhasil diupload!" };
  } catch (error) {
    return { success: false, message: "Gagal menyimpan foto." };
  }
}

export async function updateGallery(id: string, prevState: any, formData: FormData) {
  const user = await getCurrentUser();
   const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  if (!isAdmin) return { success: false, message: "Akses ditolak" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;

  try {
    await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
      },
    });
    revalidatePath("/dashboard/gallery");
    revalidatePath("/");
    return { success: true, message: "Info foto diperbarui!" };
  } catch (error) {
    return { success: false, message: "Gagal update." };
  }
}

export async function deleteGalleryImage(id: string) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  if (!isAdmin) return;

  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/dashboard/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getGalleryImages() {
  try {
    const images = await prisma.gallery.findMany({ orderBy: { eventDate: "desc" } });
    return { success: true, data: images };
  } catch (error) {
    return { success: false, data: [] };
  }
}