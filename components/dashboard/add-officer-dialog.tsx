"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, User, Medal, ArrowUp } from "lucide-react";
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
import { upsertOfficer } from "@/actions/officer";

interface AddOfficerDialogProps {
  users: { id: string; name: string; email: string }[];
}

export function AddOfficerDialog({ users }: AddOfficerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await upsertOfficer(null, formData);

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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/10">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Kelola Pengurus</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Angkat Pengurus
          </DialogTitle>
          <DialogDescription>
            Pilih siswa dan berikan jabatan dalam struktur kelas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> Pilih Siswa
            </Label>

            <Select name="userId" required>
              <SelectTrigger className="bg-muted/30">
                <SelectValue placeholder="Cari nama siswa..." />
              </SelectTrigger>
              <SelectContent>
                {users.length > 0 ? (
                  users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    Tidak ada user tersedia.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <Medal className="w-3 h-3" /> Jabatan
            </Label>
            <Input
              name="position"
              placeholder="Contoh: Ketua Kelas"
              required
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Urutan Tampilan
            </Label>
            <Input
              type="number"
              name="displayOrder"
              placeholder="1"
              defaultValue="99"
              required
              className="bg-muted/30"
            />
            <p className="text-[10px] text-muted-foreground">
              Angka kecil (1, 2, 3) akan muncul paling atas/depan.
            </p>
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
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddOfficerDialog;
