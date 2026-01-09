"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendUserReminder } from "@/actions/settings"; // Pastikan action ini ada

interface SendReminderDialogProps {
  userId: string;
  userName: string;
  email: string;
}

export function SendReminderDialog({
  userId,
  userName,
  email,
}: SendReminderDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    // Panggil Server Action
    const result = await sendUserReminder(userId, message);

    setIsLoading(false);

    if (result.success) {
      toast.success(`Pesan terkirim ke ${email}`);
      setOpen(false);
    } else {
      toast.error(result.message || "Gagal mengirim pesan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          title={`Kirim Pesan ke ${userName}`}
        >
          <Mail className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Kirim Pesan Personal
          </DialogTitle>
          <DialogDescription>
            Kirim notifikasi email langsung ke <strong>{userName}</strong> (
            {email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="message">Isi Pesan</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Contoh: Halo, tolong segera lunasi uang kas bulan ini ya..."
              className="min-h-[120px]"
              required
            />
          </div>

          <DialogFooter>
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
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Kirim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
