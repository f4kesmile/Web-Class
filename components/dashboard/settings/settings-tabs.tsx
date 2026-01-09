"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Users,
  Activity,
  FileCode,
  Megaphone,
  Globe,
  Copy,
  Check,
  Server,
  CalendarDays,
  Landmark,
  UserCircle,
  Info,
  Lock,
  Unlock,
  Key,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteSettingsForm } from "@/components/dashboard/settings/site-settings-form";
import { UserManagementClient } from "@/components/dashboard/settings/user-management-client";
import { BroadcastForm } from "@/components/dashboard/settings/broadcast-form";

// Definisi Tabs
const TABS = [
  { id: "general", label: "Umum", icon: <Globe className="w-4 h-4" /> },
  { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  { id: "logs", label: "Logs", icon: <Activity className="w-4 h-4" /> },
  {
    id: "broadcast",
    label: "Broadcast",
    icon: <Megaphone className="w-4 h-4" />,
  },
  { id: "api", label: "API", icon: <FileCode className="w-4 h-4" /> },
];

// --- HELPER COMPONENT UNTUK ROW API ---
function ApiEndpoint({
  method,
  url,
  desc,
  auth = false,
}: {
  method: string;
  url: string;
  desc: string;
  auth?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const fullUrl = `${origin}${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColor =
    {
      GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200",
      POST: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200",
    }[method] || "bg-gray-100 text-gray-700";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between p-3 border rounded-lg bg-card/50 hover:bg-card transition-colors gap-3">
      <div className="space-y-1 w-full overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded border",
              methodColor
            )}
          >
            {method}
          </span>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded select-all">
            {url}
          </code>
          {auth ? (
            <Badge
              variant="outline"
              className="text-[10px] h-5 px-1.5 gap-1 text-amber-600 border-amber-200 bg-amber-50"
            >
              <Lock className="w-3 h-3" /> Locked
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] h-5 px-1.5 gap-1 text-emerald-600 border-emerald-200 bg-emerald-50"
            >
              <Unlock className="w-3 h-3" /> Public
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <button
        onClick={handleCopy}
        className="self-start sm:self-center p-2 text-muted-foreground hover:bg-muted rounded-md transition-all border shrink-0"
        title="Copy Full URL"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

interface SettingsTabsProps {
  settings: any;
  users: any[];
  logs: any[];
  currentUserRole: string;
}

export function SettingsTabs({
  settings,
  users,
  logs,
  currentUserRole,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-8">
      {/* --- ANIMATED TABS NAVIGATION --- */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none flex items-center gap-2",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/80"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill-settings"
                className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-black/5 dark:border-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon} {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="mt-6 relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* TAB: UMUM */}
            {activeTab === "general" && (
              <SiteSettingsForm initialData={settings} />
            )}

            {/* TAB: USERS */}
            {activeTab === "users" && (
              <UserManagementClient
                users={users}
                currentUserRole={currentUserRole}
              />
            )}

            {/* TAB: LOGS */}
            {activeTab === "logs" && (
              <Card>
                <CardHeader>
                  <CardTitle>Log Aktivitas Sistem</CardTitle>
                  <CardDescription>
                    Memantau tindakan sensitif yang dilakukan admin.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {logs.length > 0 ? (
                      logs.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-start justify-between border-b pb-3 last:border-0"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <span className="text-blue-600 font-bold">
                                [{log.action}]
                              </span>
                              {log.details}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                {log.user.name}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Belum ada log aktivitas.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB: BROADCAST */}
            {activeTab === "broadcast" && <BroadcastForm />}

            {/* TAB: API */}
            {activeTab === "api" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-600" />
                    Dokumentasi API Publik
                  </CardTitle>
                  <CardDescription>
                    Endpoint ini siap digunakan oleh Frontend / Mobile App.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 1. SEKSI AUTHENTICATION (BARU) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                      <Key className="w-4 h-4 text-rose-500" />
                      Autentikasi (Better-Auth)
                    </h3>
                    <div className="grid gap-2">
                      <ApiEndpoint
                        method="POST"
                        url="/api/auth/sign-in/email"
                        desc="Login menggunakan Email & Password. Body: { email, password }"
                      />
                      <ApiEndpoint
                        method="POST"
                        url="/api/auth/sign-up/email"
                        desc="Mendaftar akun baru. Body: { email, password, name }"
                      />
                      <ApiEndpoint
                        method="POST"
                        url="/api/auth/sign-out"
                        desc="Logout session pengguna saat ini."
                        auth={true}
                      />
                      <ApiEndpoint
                        method="GET"
                        url="/api/auth/session"
                        desc="Cek status login & data session user saat ini."
                      />
                    </div>
                  </div>

                  {/* 2. SEKSI AKADEMIK */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      Akademik (Jadwal & Tugas)
                    </h3>
                    <div className="grid gap-2">
                      <ApiEndpoint
                        method="GET"
                        url="/api/schedules"
                        desc="Mengambil semua data jadwal kuliah (urut berdasarkan jam)."
                      />
                      <ApiEndpoint
                        method="GET"
                        url="/api/schedules?day=MONDAY"
                        desc="Filter jadwal hanya untuk hari tertentu (MONDAY, TUESDAY, dst)."
                      />
                      <ApiEndpoint
                        method="GET"
                        url="/api/agendas"
                        desc="Mengambil daftar tugas/ujian yang belum lewat deadline."
                      />
                    </div>
                  </div>

                  {/* 3. SEKSI ORGANISASI & GALERI */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                      <Landmark className="w-4 h-4 text-emerald-500" />
                      Informasi Kelas
                    </h3>
                    <div className="grid gap-2">
                      <ApiEndpoint
                        method="GET"
                        url="/api/officers"
                        desc="Mengambil struktur pengurus kelas (Ketua, Wakil, dll)."
                      />
                      <ApiEndpoint
                        method="GET"
                        url="/api/gallery"
                        desc="Mengambil semua foto dokumentasi kegiatan kelas."
                      />
                    </div>
                  </div>

                  {/* 4. SEKSI SYSTEM & USER */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      User & System
                    </h3>
                    <div className="grid gap-2">
                      <ApiEndpoint
                        method="GET"
                        url="/api/users/me"
                        desc="Mengambil profil lengkap user yang sedang login."
                        auth={true}
                      />
                      <ApiEndpoint
                        method="GET"
                        url="/api/health"
                        desc="Cek status server (Health Check)."
                      />
                    </div>
                  </div>

                  {/* FOOTER NOTE */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-xs space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Panduan Integrasi:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      <li>
                        Endpoint{" "}
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 bg-emerald-50 text-emerald-600 gap-1 border-emerald-200"
                        >
                          <Unlock className="w-3 h-3" /> Public
                        </Badge>{" "}
                        bebas akses.
                      </li>
                      <li>
                        Endpoint{" "}
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 bg-amber-50 text-amber-600 gap-1 border-amber-200"
                        >
                          <Lock className="w-3 h-3" /> Locked
                        </Badge>{" "}
                        butuh Header: <code>Authorization: Bearer [token]</code>{" "}
                        atau Cookie Session.
                      </li>
                      <li>
                        Base URL API:{" "}
                        <strong>
                          {typeof window !== "undefined"
                            ? window.location.origin
                            : "..."}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
