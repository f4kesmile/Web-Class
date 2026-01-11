"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { Schedule } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSchedule } from "@/actions/schedule";

interface EditScheduleDialogProps {
  data: Schedule;
}

export function EditScheduleDialog({ data }: EditScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateSchedule(data.id, null, formData);
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
        <button className="p-2 text-muted-foreground/50 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-md transition-all">
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-500" /> Edit Jadwal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>Mata Kuliah</Label>
              <Input name="subject" defaultValue={data.subject} required />
            </div>
            <div className="space-y-2">
              <Label>SKS</Label>
              <Input
                name="credits"
                type="number"
                defaultValue={data.credits || 0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hari</Label>
              <Select name="day" defaultValue={data.day}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Ruangan</Label>
              <Input name="room" defaultValue={data.room || ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Waktu</Label>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                name="startTime"
                defaultValue={data.startTime}
                required
              />
              <span>-</span>
              <Input
                type="time"
                name="endTime"
                defaultValue={data.endTime}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dosen</Label>
            <Input name="lecturer" defaultValue={data.lecturer || ""} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-blue-600">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}{" "}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
