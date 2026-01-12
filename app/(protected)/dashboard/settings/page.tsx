import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import {
  getSiteSettings,
  getAllUsers,
  getLogs,
  getActiveBroadcast,
} from "@/actions/settings";
import SettingsTabs from "@/components/dashboard/settings/settings-tabs";
import { getUpcomingAgendas } from "@/actions/settings";

export const metadata: Metadata = {
  title: "Pengaturan | Web-Class",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? "";
  const immutableSuperAdminEmails = (
    process.env.SUPERADMIN_IMMUTABLE_EMAILS ?? ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const role = user?.role ?? Role.USER;
  const isAdmin = role === Role.ADMIN || role === Role.SUPER_ADMIN;

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Akses Ditolak. Halaman ini hanya untuk Pengurus.
      </div>
    );
  }

  const [settings, users, logs, activeBroadcast, upcomingAgendas] =
    await Promise.all([
      getSiteSettings(),
      getAllUsers(),
      getLogs(),
      getActiveBroadcast(),
      getUpcomingAgendas(),
    ]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Pengaturan Sistem
        </h1>
        <p className="text-muted-foreground mt-1">
          Pusat kontrol untuk manajemen kelas, pengguna, dan sistem.
        </p>
      </div>

      <SettingsTabs
        settings={settings}
        users={users}
        logs={logs}
        currentUserRole={role}
        activeBroadcast={activeBroadcast}
        upcomingAgendas={upcomingAgendas}
        currentUserId={currentUserId}
        immutableSuperAdminEmails={immutableSuperAdminEmails}
      />
    </div>
  );
}
