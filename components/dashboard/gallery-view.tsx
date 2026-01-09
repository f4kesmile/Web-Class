"use client";

import { motion } from "framer-motion";
import { Gallery } from "@prisma/client";
import { Trash2, CalendarDays, Maximize2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { deleteGalleryImage } from "@/actions/gallery";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditGalleryDialog } from "./edit-gallery-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GalleryViewProps {
  initialData: Gallery[];
  isAdmin: boolean;
}

export function GalleryView({ initialData, isAdmin }: GalleryViewProps) {
  const handleDelete = async (id: string) => {
    const res = await deleteGalleryImage(id);
    if (res?.success) toast.success("Foto dihapus");
    else toast.error("Gagal menghapus foto");
  };

  if (initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
        <Maximize2 className="w-12 h-12 mb-4 opacity-20" />
        <p>Belum ada foto di galeri kelas.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {initialData.map((item, index) => (
        <GalleryCard
          key={item.id}
          data={item}
          isAdmin={isAdmin}
          index={index}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}

function GalleryCard({ data, isAdmin, index, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="break-inside-avoid relative group rounded-xl overflow-hidden bg-muted/20 mb-4"
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer overflow-hidden">
            <img
              src={data.imageUrl}
              alt={data.title || "Gallery Image"}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 flex justify-center items-center">
          <img
            src={data.imageUrl}
            alt={data.title}
            className="max-h-[85vh] w-auto rounded-md shadow-2xl"
          />
        </DialogContent>
      </Dialog>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white font-medium text-sm line-clamp-2">
          {data.title}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-white/70 text-xs flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {format(new Date(data.eventDate), "d MMM yyyy", { locale: id })}
          </span>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <EditGalleryDialog data={data} />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Foto ini akan dihapus permanen dari galeri.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
