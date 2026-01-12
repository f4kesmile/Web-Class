"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AgendaType, Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteSettingsForm } from "@/components/dashboard/settings/site-settings-form";
import UserManagementClient from "@/components/dashboard/settings/user-management-client";
import { BroadcastForm } from "@/components/dashboard/settings/broadcast-form";
import { ActivityLogs } from "@/components/dashboard/settings/activity-logs";
import { ApiDocs } from "@/components/dashboard/settings/api-docs";
import { Activity, Braces, Globe, Megaphone, Users } from "lucide-react";

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
  author: { name: string | null };
} | null;

export type UpcomingAgendaRow = {
  id: string;
  title: string;
  type: AgendaType;
  deadline: Date;
};

type TabKey = "general" | "users" | "logs" | "broadcast" | "api";

export type SettingsTabsProps = {
  currentUserId: string;
  immutableSuperAdminEmails: string[];
  settings: SiteSettingsRow | null;
  users: SafeUserRow[];
  logs: LogRow[];
  currentUserRole: Role;
  activeBroadcast: ActiveBroadcastRow;
  upcomingAgendas: UpcomingAgendaRow[];
};

type TabItem = {
  key: TabKey;
  label: string;
  icon: ReactNode;
};

export default function SettingsTabs({
  settings,
  users,
  logs,
  currentUserRole,
  activeBroadcast,
  upcomingAgendas,
  currentUserId,
  immutableSuperAdminEmails,
}: SettingsTabsProps) {
  const [tab, setTab] = useState<TabKey>("general");

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="w-full space-y-4">
      <Card className="w-full rounded-3xl border bg-background/40 backdrop-blur-xl shadow-sm">
        <div className="p-2">
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-nowrap lg:gap-2">
            {tabs.map(({ key, label, icon }) => {
              const active = key === tab;

              return (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  onClick={() => setTab(key)}
                  className={cn(
                    "h-11 rounded-2xl justify-start gap-2 px-4 w-full transition",
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background/40 hover:bg-background/70",
                    "backdrop-blur-md border border-border/60"
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {icon}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="w-full min-h-[calc(100vh-200px)]">
        <div className={tab === "general" ? "block" : "hidden"}>
          <SiteSettingsForm initialData={settings} embedded />
        </div>

        <div className={tab === "users" ? "block" : "hidden"}>
          <UserManagementClient
            users={users}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
            upcomingAgendas={upcomingAgendas}
            immutableSuperAdminEmails={immutableSuperAdminEmails}
            embedded
          />
        </div>

        <div className={tab === "logs" ? "block" : "hidden"}>
          <ActivityLogs logs={logs} embedded />
        </div>

        <div className={tab === "broadcast" ? "block" : "hidden"}>
          <BroadcastForm currentBroadcast={activeBroadcast} embedded />
        </div>

        <div className={tab === "api" ? "block" : "hidden"}>
          <ApiDocs baseUrl={baseUrl} embedded />
        </div>
      </div>
    </div>
  );
}
