"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Calendar, Type, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { Gallery } from "@prisma/client";
import { updateGallery } from "@/actions/gallery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditGalleryDialogProps {
  data: Gallery;
}

export function EditGalleryDialog({ data }: EditGalleryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateGallery(data.id, null, formData);

    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.refresh();
      return;
    }

    toast.error(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Info Foto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Type className="w-3 h-3" /> Judul Kegiatan
            </Label>
            <Input
              name="title"
              defaultValue={data.title}
              placeholder="Contoh: Kunjungan Industri"
              required
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Deskripsi
            </Label>
            <Textarea
              name="description"
              defaultValue={data.description || ""}
              className="min-h-[100px] bg-muted/30"
              placeholder="Ceritakan tentang foto ini..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Tanggal Kejadian
            </Label>
            <Input
              type="date"
              name="eventDate"
              required
              defaultValue={
                new Date(data.eventDate).toISOString().split("T")[0]
              }
              className="bg-muted/30"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditGalleryDialog;
