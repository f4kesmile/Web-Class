"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";


export type ProfileActionState = {
  success: boolean;
  message: string;
};

const ProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  image: z.string().optional(),
});

export async function updateProfile(
  prevState: ProfileActionState | null, 
  formData: FormData
): Promise<ProfileActionState> { 
  
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: "Anda harus login." };
  }

  const rawData = {
    name: formData.get("name"),
    image: formData.get("image"),
  };

  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    };
  }

  try {
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: validatedFields.data.name,
    };

    if (
      validatedFields.data.image &&
      typeof validatedFields.data.image === "string" && 
      validatedFields.data.image.trim() !== "" &&
      validatedFields.data.image !== user.image
    ) {
      dataToUpdate.image = validatedFields.data.image;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    revalidatePath("/");
    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Gagal memperbarui profil." };
  }
}