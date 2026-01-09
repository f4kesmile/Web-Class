"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Medal, ArrowUp } from "lucide-react"; // 1. GANTI ArrowUpOA JADI ArrowUp
import { toast } from "sonner";
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
import { upsertOfficer } from "@/actions/officer";

interface EditOfficerDialogProps {
  data: any;
}

export function EditOfficerDialog({ data }: EditOfficerDialogProps) {
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
      toast.success("Jabatan diperbarui!");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="absolute -top-2 -left-2 p-1.5 bg-background border rounded-full text-muted-foreground hover:text-blue-500 hover:border-blue-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20"
          title="Edit Jabatan"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pengurus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="userId" value={data.userId} />

          <div className="space-y-2">
            <Label>Nama Siswa</Label>
            <Input value={data.user.name} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Medal className="w-3 h-3" /> Jabatan
            </Label>
            <Input name="position" defaultValue={data.position} required />
          </div>

          <div className="space-y-2">
            {/* 2. GANTI PEMAKAIAN IKON DI SINI */}
            <Label className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Level / Urutan
            </Label>
            <Input
              type="number"
              name="displayOrder"
              defaultValue={data.displayOrder}
              required
            />
            <div className="text-[10px] text-muted-foreground space-y-1 bg-muted/50 p-2 rounded-md">
              <p>
                • <strong>1</strong> = Ketua
              </p>
              <p>
                • <strong>2</strong> = Wakil
              </p>
              <p>
                • <strong>3</strong> = Sekretaris/Bendahara
              </p>
            </div>
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
