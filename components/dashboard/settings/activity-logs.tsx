"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LogRow } from "@/components/dashboard/settings/settings-tabs";
import { cn } from "@/lib/utils";

type ActivityLogsProps = {
  logs: LogRow[];
  embedded?: boolean;
};

function formatUserName(name: string | null) {
  return name?.trim() ? name : "Unknown";
}

export function ActivityLogs({ logs, embedded = false }: ActivityLogsProps) {
  if (logs.length === 0) {
    return (
      <Card
        className={cn(
          "w-full border bg-background/40 backdrop-blur-xl shadow-sm p-6 text-center",
          embedded ? "rounded-3xl" : "rounded-2xl"
        )}
      >
        <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-3">
      {logs.map(({ id, action, details, createdAt, user }) => (
        <Card
          key={id}
          className={cn(
            "w-full border bg-background/40 backdrop-blur-xl shadow-sm p-4 sm:p-5 transition-all hover:bg-background/60",
            embedded ? "rounded-3xl" : "rounded-2xl"
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Badge
                className="rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0"
                variant="secondary"
              >
                {action}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {formatUserName(user.name)}
            </div>
          </div>

          <div className="mt-2 text-sm text-foreground break-words leading-relaxed">
            {details?.trim() ? details : "-"}
          </div>
        </Card>
      ))}
    </div>
  );
}
