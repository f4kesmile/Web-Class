import { Metadata } from "next";
import { Role } from "@prisma/client";
import { Images } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getGalleryImages } from "@/actions/gallery";
import { GalleryView } from "@/components/dashboard/gallery-view";
import { AddImageDialog } from "@/components/dashboard/add-image-dialog";

export const metadata: Metadata = {
  title: "Galeri Kelas | Web-Class",
  description: "Koleksi foto dan kenangan kelas",
};

export default async function GalleryPage() {
  const [imagesData, user] = await Promise.all([
    getGalleryImages(),
    getCurrentUser(),
  ]);

  const { data } = imagesData;
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Images className="w-8 h-8 text-blue-500" />
            Galeri Kelas
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Simpan momen seru dan kenangan tak terlupakan di sini.
          </p>
        </div>

        {isAdmin && <AddImageDialog />}
      </div>

      <GalleryView initialData={data} isAdmin={isAdmin} />
    </div>
  );
}
