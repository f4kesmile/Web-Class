"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Calendar,
  FileText,
  AlignLeft,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Pastikan punya komponen textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAgenda } from "@/actions/agenda";

export function CreateAgendaDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createAgenda(null, formData);

    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Buat Agenda</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Agenda Baru
          </DialogTitle>
          <DialogDescription>
            Tambahkan tugas, ujian, atau acara kelas baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Judul */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Judul Agenda
            </Label>
            <Input
              name="title"
              placeholder="Contoh: Pengumpulan Makalah"
              required
              className="bg-muted/30"
            />
          </div>

          {/* Mata Pelajaran & Tipe (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Mata Kuliah (Opsional)
              </Label>
              <Input
                name="subject"
                placeholder="Ex: Basis Data"
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tipe
              </Label>
              <Select name="type" defaultValue="ASSIGNMENT">
                <SelectTrigger className="bg-muted/30">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSIGNMENT">Tugas</SelectItem>
                  <SelectItem value="EXAM">Ujian</SelectItem>
                  <SelectItem value="EVENT">Acara</SelectItem>
                  <SelectItem value="OTHER">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Tenggat Waktu
            </Label>
            <Input
              type="datetime-local"
              name="deadline"
              required
              className="bg-muted/30 block"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Deskripsi
            </Label>
            <Textarea
              name="description"
              placeholder="Detail instruksi..."
              className="bg-muted/30 min-h-[100px]"
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
