"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Type, AlignLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Gallery } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGallery } from "@/actions/gallery";

export function EditGalleryDialog({ data }: { data: Gallery }) {
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
    } else {
      toast.error(result.message);
    }
  }

  const defaultDate = new Date(data.eventDate).toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Info Foto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Type className="w-3 h-3" /> Judul Kegiatan
            </Label>
            <Input name="title" defaultValue={data.title} required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Deskripsi
            </Label>
            <textarea
              name="description"
              defaultValue={data.description || ""}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Tanggal
            </Label>
            <Input
              type="date"
              name="eventDate"
              defaultValue={defaultDate}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-blue-600">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
