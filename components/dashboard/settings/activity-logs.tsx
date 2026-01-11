"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogRow } from "@/components/dashboard/settings/settings-tabs";

type ActivityLogsProps = {
  logs: LogRow[];
};

function formatUserName(name: string | null) {
  return name?.trim() ? name : "Unknown";
}

export function ActivityLogs({ logs }: ActivityLogsProps) {
  return (
    <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur p-5">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
        <div>
          <div className="text-base font-semibold">Log Aktivitas</div>
          <div className="text-sm text-muted-foreground">
            Rekam jejak tindakan sensitif sistem.
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {logs.map(({ id, action, details, createdAt, user }) => (
          <Card
            key={id}
            className="rounded-xl border bg-background p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{action}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(createdAt).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 text-sm text-foreground break-words">
                {details?.trim() ? details : "-"}
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                {formatUserName(user.name)} • {user.email}
              </div>
            </div>
          </Card>
        ))}

        {logs.length === 0 && (
          <div className="text-sm text-muted-foreground mt-4">
            Belum ada aktivitas.
          </div>
        )}
      </div>
    </Card>
  );
}
