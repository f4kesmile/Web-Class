"use client";

import { useMemo, useState, type FormEvent } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendUserReminder } from "@/actions/settings";
import type { UpcomingAgendaRow } from "@/components/dashboard/settings/settings-tabs";

type TemplateItem = {
  key: string;
  label: string;
  message: string;
};

type SendReminderDialogProps = {
  userId: string;
  userName: string;
  email: string;
  upcomingAgendas: UpcomingAgendaRow[];
};

function agendaLabel(type: string) {
  if (type === "ASSIGNMENT") return "Tugas";
  if (type === "EXAM") return "Ujian";
  if (type === "EVENT") return "Event";
  return "Agenda";
}

export function SendReminderDialog({
  userId,
  userName,
  email,
  upcomingAgendas,
}: SendReminderDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateKey, setTemplateKey] = useState<string>("custom");
  const [message, setMessage] = useState<string>("");

  const templates = useMemo<TemplateItem[]>(() => {
    const base: TemplateItem[] = [
      {
        key: "custom",
        label: "Custom",
        message: "",
      },
      {
        key: "kas",
        label: "Pengingat Kas",
        message:
          "Halo, ini pengingat untuk segera membayar kas bulan ini. Terima kasih.",
      },
    ];

    const agendaTemplates: TemplateItem[] = upcomingAgendas.map(
      ({ id, title, type, deadline }) => ({
        key: `agenda-${id}`,
        label: `${agendaLabel(String(type))}: ${title}`,
        message: `Halo, ini pengingat: ${title}. Deadline: ${new Date(
          deadline
        ).toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}.`,
      })
    );

    return [...base, ...agendaTemplates];
  }, [upcomingAgendas]);

  const onPickTemplate = (value: string) => {
    setTemplateKey(value);
    const picked = templates.find(({ key }) => key === value);
    setMessage(picked?.message ?? "");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const text = message.trim();
    const result = await sendUserReminder(userId, text);

    setIsLoading(false);

    if (result.success) {
      toast.success(`Pesan terkirim ke ${email}`);
      setOpen(false);
      return;
    }

    toast.error(result.message || "Gagal mengirim pesan");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 rounded-2xl border-border/60 bg-background/50 backdrop-blur hover:bg-background/80"
          title={`Kirim Pesan ke ${userName}`}
        >
          <Mail className="w-4 h-4 text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Kirim Reminder
          </DialogTitle>
          <DialogDescription>
            Kirim notifikasi email ke <strong>{userName}</strong> ({email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={templateKey} onValueChange={onPickTemplate}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Pilih template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Isi Pesan</Label>
            <Textarea
              id="message"
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
              placeholder="Contoh: Halo, tolong segera lunasi uang kas bulan ini ya..."
              className="min-h-[140px] rounded-2xl"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-2xl"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
