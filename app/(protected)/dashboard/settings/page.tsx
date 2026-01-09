import { Metadata } from "next";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getSiteSettings, getAllUsers, getLogs } from "@/actions/settings";
import { SettingsTabs } from "@/components/dashboard/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Pengaturan | Web-Class",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Akses Ditolak. Halaman ini hanya untuk Pengurus.
      </div>
    );
  }

  // Fetch Data di Server (Parallel Fetching agar cepat)
  const [siteSettings, users, logs] = await Promise.all([
    getSiteSettings(),
    getAllUsers(),
    getLogs(),
  ]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header Statis */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-slate-700 dark:text-slate-200" />
          Pengaturan Sistem
        </h1>
        <p className="text-muted-foreground mt-1">
          Pusat kontrol untuk manajemen kelas, pengguna, dan sistem.
        </p>
      </div>

      {/* Panggil Client Component untuk UI Tabs */}
      <SettingsTabs
        settings={siteSettings}
        users={users}
        logs={logs}
        currentUserRole={user?.role || "USER"}
      />
    </div>
  );
}
