"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteSettingsForm } from "@/components/dashboard/settings/site-settings-form";
import { UserManagementClient } from "@/components/dashboard/settings/user-management-client";
import { ActivityLogs } from "@/components/dashboard/settings/activity-logs";
import { BroadcastForm } from "@/components/dashboard/settings/broadcast-form";
import { ApiDocs } from "@/components/dashboard/settings/api-docs";
import { Globe, Users, Activity, Megaphone, Braces } from "lucide-react";

export type SiteSettingsRow = {
  id: string;
  siteName: string;
  className: string;
  semester: string;
  supportEmail: string | null;
  instagram: string | null;
  emailSender: string | null;
  description: string | null;
  academicYear: string;
  whatsapp: string | null;
  updatedAt: Date;
};

export type SafeUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isBanned: boolean;
  image: string | null;
};

export type LogRow = {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

export type ActiveBroadcastRow = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
  };
} | null;

type TabKey = "general" | "users" | "logs" | "broadcast" | "api";

export type SettingsTabsProps = {
  settings: SiteSettingsRow | null;
  users: SafeUserRow[];
  logs: LogRow[];
  currentUserRole: Role;
  activeBroadcast: ActiveBroadcastRow;
};

type TabItem = {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
};

const tabOrder: TabKey[] = ["general", "users", "logs", "broadcast", "api"];

export default function SettingsTabs({
  settings,
  users,
  logs,
  currentUserRole,
  activeBroadcast,
}: SettingsTabsProps) {
  const [tab, setTab] = useState<TabKey>("general");
  const [stableHeight, setStableHeight] = useState<number | null>(null);

  const refs = useRef<Record<TabKey, HTMLDivElement | null>>({
    general: null,
    users: null,
    logs: null,
    broadcast: null,
    api: null,
  });

  const tabs = useMemo<TabItem[]>(
    () => [
      { key: "general", label: "Umum", icon: <Globe className="h-4 w-4" /> },
      { key: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
      { key: "logs", label: "Logs", icon: <Activity className="h-4 w-4" /> },
      {
        key: "broadcast",
        label: "Broadcast",
        icon: <Megaphone className="h-4 w-4" />,
      },
      { key: "api", label: "API", icon: <Braces className="h-4 w-4" /> },
    ],
    []
  );

  const measureMaxHeight = useCallback(() => {
    const heights = tabOrder
      .map((key) => refs.current[key])
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => el.getBoundingClientRect().height);

    const maxHeight = heights.length ? Math.ceil(Math.max(...heights)) : null;
    setStableHeight(maxHeight);
  }, []);

  useLayoutEffect(() => {
    measureMaxHeight();
  }, [measureMaxHeight, tab, settings, users, logs, activeBroadcast]);

  useLayoutEffect(() => {
    const onResize = () => measureMaxHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureMaxHeight]);

  const containerClassName = "w-full max-w-[560px] mx-auto";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className={cn("w-full", containerClassName)}>
      <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
          {tabs.map(({ key, label, icon }) => {
            const active = key === tab;

            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                onClick={() => setTab(key)}
                className={cn(
                  "h-11 rounded-xl justify-start gap-2",
                  active
                    ? "bg-background shadow-sm"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      <div
        className="mt-4 relative w-full"
        style={stableHeight ? { height: stableHeight } : undefined}
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            tab === "general"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          ref={(el) => {
            refs.current.general = el;
          }}
        >
          <SiteSettingsForm initialData={settings} />
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            tab === "users"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          ref={(el) => {
            refs.current.users = el;
          }}
        >
          <UserManagementClient
            users={users}
            currentUserRole={currentUserRole}
          />
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            tab === "logs"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          ref={(el) => {
            refs.current.logs = el;
          }}
        >
          <ActivityLogs logs={logs} />
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            tab === "broadcast"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          ref={(el) => {
            refs.current.broadcast = el;
          }}
        >
          <BroadcastForm currentBroadcast={activeBroadcast} />
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            tab === "api"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          ref={(el) => {
            refs.current.api = el;
          }}
        >
          <ApiDocs baseUrl={baseUrl} />
        </div>
      </div>
    </div>
  );
}
