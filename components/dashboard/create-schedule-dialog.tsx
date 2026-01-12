"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, BookOpen, Clock, User, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSchedule } from "@/actions/schedule";

export function CreateScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createSchedule(null, formData);

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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Jadwal</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Tambah Mata Kuliah
          </DialogTitle>
          <DialogDescription>
            Lengkapi form di bawah ini untuk menambahkan jadwal baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label
                htmlFor="subject"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Mata Kuliah
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Contoh: Algoritma"
                required
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="credits"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                SKS
              </Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                placeholder="3"
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Hari
              </Label>
              <Select name="day" required defaultValue="MONDAY">
                <SelectTrigger className="bg-muted/30">
                  <SelectValue placeholder="Pilih Hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONDAY">Senin</SelectItem>
                  <SelectItem value="TUESDAY">Selasa</SelectItem>
                  <SelectItem value="WEDNESDAY">Rabu</SelectItem>
                  <SelectItem value="THURSDAY">Kamis</SelectItem>
                  <SelectItem value="FRIDAY">Jumat</SelectItem>
                  <SelectItem value="SATURDAY">Sabtu</SelectItem>
                  <SelectItem value="SUNDAY">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Ruangan
              </Label>
              <Input
                name="room"
                placeholder="Ex: A.204"
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Waktu Mulai & Selesai
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                name="startTime"
                required
                className="bg-muted/30"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="time"
                name="endTime"
                required
                className="bg-muted/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> Dosen Pengampu
            </Label>
            <Input
              name="lecturer"
              placeholder="Nama Dosen"
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
                <Plus className="mr-2 h-4 w-4" />
              )}
              Simpan Jadwal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateScheduleDialog;
