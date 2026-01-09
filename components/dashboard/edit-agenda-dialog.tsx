"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Agenda } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAgenda } from "@/actions/agenda";

interface EditAgendaDialogProps {
  data: Agenda;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAgendaDialog({
  data,
  open,
  onOpenChange,
}: EditAgendaDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await updateAgenda(data.id, null, formData);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  const defaultDate = new Date(data.deadline).toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Agenda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input name="title" defaultValue={data.title} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Matkul (Opsional)</Label>
              <Input name="subject" defaultValue={data.subject || ""} />
            </div>
            <div className="space-y-2">
              <Label>Tipe</Label>
              <Select name="type" defaultValue={data.type}>
                <SelectTrigger>
                  <SelectValue />
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

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="datetime-local"
              name="deadline"
              defaultValue={defaultDate}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              name="description"
              defaultValue={data.description || ""}
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
