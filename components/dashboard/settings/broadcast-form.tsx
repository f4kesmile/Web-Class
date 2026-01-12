"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteActiveBroadcast,
  upsertActiveBroadcast,
} from "@/actions/settings";
import { Loader2, Megaphone } from "lucide-react";

type ActiveBroadcast = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: { name: string | null };
} | null;

export type BroadcastFormProps = {
  currentBroadcast: ActiveBroadcast;
  embedded?: boolean;
};

function formatName(name: string | null) {
  return name?.trim() ? name : "Unknown";
}

export function BroadcastForm({
  currentBroadcast,
  embedded = false,
}: BroadcastFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState<string>(currentBroadcast?.title ?? "");
  const [content, setContent] = useState<string>(
    currentBroadcast?.content ?? ""
  );

  useEffect(() => {
    setTitle(currentBroadcast?.title ?? "");
    setContent(currentBroadcast?.content ?? "");
  }, [
    currentBroadcast?.id,
    currentBroadcast?.title,
    currentBroadcast?.content,
  ]);

  const preview = useMemo(() => {
    if (!currentBroadcast) return null;
    const { title: t, content: c, createdAt, author } = currentBroadcast;
    return {
      title: t,
      content: c,
      createdAt,
      authorName: formatName(author.name),
    };
  }, [currentBroadcast]);

  const onDisable = () => {
    startTransition(async () => {
      const result = await deleteActiveBroadcast();
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      toast.error("Judul dan isi broadcast wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.set("title", t);
    formData.set("content", c);

    startTransition(async () => {
      const result = await upsertActiveBroadcast(formData);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  return (
    <Card
      className={cn(
        "w-full border bg-background/70 backdrop-blur",
        embedded ? "rounded-3xl p-5 sm:p-6" : "rounded-2xl p-4 sm:p-6"
      )}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border bg-background p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl border bg-primary/10 text-primary flex items-center justify-center">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold">Buat / Update Broadcast</p>
              <p className="text-sm text-muted-foreground mt-1">
                Broadcast aktif akan tampil untuk semua user.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Judul
              </p>
              <Input
                value={title}
                onChange={({ target: { value } }) => setTitle(value)}
                className="h-11 rounded-2xl"
                placeholder="Contoh: Informasi UTS"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Isi
              </p>
              <textarea
                value={content}
                onChange={({ target: { value } }) => setContent(value)}
                className={cn(
                  "w-full min-h-[140px] rounded-2xl border bg-background px-4 py-3 text-sm outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/30"
                )}
                placeholder="Tulis isi broadcast..."
                disabled={isPending}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Aktifkan / Simpan Broadcast
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl w-full"
              disabled={isPending || !preview}
              onClick={onDisable}
            >
              Matikan Broadcast Aktif
            </Button>
          </form>
        </div>

        <div className="rounded-3xl border bg-background p-4 sm:p-5">
          <p className="text-base font-semibold">Preview Broadcast Aktif</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tampilan broadcast yang sedang aktif.
          </p>

          <div className="mt-4">
            {preview ? (
              <div className="rounded-3xl border bg-background p-4 sm:p-5">
                <p className="text-sm font-semibold">{preview.title}</p>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {preview.content}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Aktif oleh {preview.authorName} •{" "}
                  {new Date(preview.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border bg-background p-5 text-sm text-muted-foreground">
                Tidak ada broadcast aktif.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
