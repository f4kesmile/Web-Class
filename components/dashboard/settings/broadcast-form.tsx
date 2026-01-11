"use client";

import React, { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteActiveBroadcast } from "@/actions/settings";

type BroadcastRow = {
  title: string;
  content: string;
};

export type BroadcastFormProps = {
  currentBroadcast: BroadcastRow | null;
};

export function BroadcastForm({ currentBroadcast }: BroadcastFormProps) {
  const [isPending, startTransition] = useTransition();

  const preview = useMemo(() => {
    if (!currentBroadcast) return null;
    const { title, content } = currentBroadcast;
    return { title, content };
  }, [currentBroadcast]);

  const onDisable = () => {
    startTransition(async () => {
      const result = await deleteActiveBroadcast();
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  return (
    <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold">Broadcast</p>
          <p className="text-sm text-muted-foreground">
            Kelola broadcast aktif yang tampil ke user.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending || !preview}
          onClick={onDisable}
        >
          Matikan Broadcast Aktif
        </Button>
      </div>

      <div className="mt-5">
        {preview ? (
          <div className="rounded-2xl border p-4">
            <p className="text-sm font-semibold">{preview.title}</p>
            <p
              className={cn(
                "mt-2 text-sm text-muted-foreground whitespace-pre-wrap"
              )}
            >
              {preview.content}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
            Tidak ada broadcast aktif.
          </div>
        )}
      </div>
    </Card>
  );
}
