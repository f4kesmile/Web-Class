import { UserButton } from "@/components/auth/user-button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Calendar, Clock, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/themeToggler";

// --- HELPER: FORMAT TANGGAL ---
// Mengubah tanggal DB menjadi format "DD MMM" (Contoh: 25 Jan)
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

// --- FUNGSI AMBIL DATA ---
async function getDashboardData(userId: string) {
  // 1. Ambil Agenda Terbaru
  // Menggunakan 'createdAt' karena field 'date' tidak ada di schema default
  const upcomingAgendas = await prisma.agenda
    .findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  // 2. Ambil Jadwal (Limit 5)
  const todaySchedules = await prisma.schedule
    .findMany({
      take: 5,
    })
    .catch(() => []);

  // 3. Hitung Statistik Sederhana (Opsional, agar card statistik ada isinya)
  const totalAgenda = await prisma.agenda.count().catch(() => 0);
  // const totalMapel = await prisma.subject.count().catch(() => 0); // Jika ada tabel subject

  return {
    upcomingAgendas,
    todaySchedules,
    stats: {
      totalAgenda,
      totalMapel: 12, // Placeholder jika belum ada tabel mapel
    },
  };
}

// --- HALAMAN UTAMA ---
export default async function DashboardPage() {
  // 1. Cek User Login
  const user = await getCurrentUser();

  // 2. Jika user belum login, redirect ke sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // 3. Ambil data dashboard
  const { upcomingAgendas, todaySchedules, stats } = await getDashboardData(
    user.id
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 font-sans">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler />
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden md:block">
              Kelas<span className="text-blue-500">Pintar</span>
            </span>
          </div>

          {/* Tombol User (Profil & Logout) */}
          <UserButton user={user} />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 container py-8 px-4 md:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Halo, {user.name} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              Selamat datang kembali! Berikut ringkasan aktivitas belajarmu.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-sm text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Status:{" "}
            <span className="capitalize">
              {user.role?.toLowerCase() || "Siswa"}
            </span>{" "}
            Aktif
          </div>
        </div>

        {/* Grid Statistik */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Mapel */}
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Mapel</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalMapel}
                </h3>
              </div>
            </div>
          </div>

          {/* Card 2: Agenda */}
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Agenda</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalAgenda}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Konten Utama */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Kiri: Jadwal (Lebar 4) */}
          <div className="col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Jadwal Hari Ini
              </h2>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 min-h-[300px] flex flex-col justify-center text-slate-500">
              {todaySchedules.length > 0 ? (
                <ul className="w-full space-y-3">
                  {todaySchedules.map((s: any) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-blue-500/30 transition-colors"
                    >
                      <span className="font-medium text-slate-200">
                        {s.subject}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">
                        08:00 - 09:30
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center">
                  <Clock className="w-12 h-12 mb-4 opacity-20" />
                  <p>Tidak ada jadwal kelas hari ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: Agenda (Lebar 3) */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-xl font-semibold text-white">Agenda Terbaru</h2>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 min-h-[300px]">
              {upcomingAgendas.length > 0 ? (
                <ul className="space-y-0">
                  {upcomingAgendas.map((a: any) => {
                    const dateParts = formatDate(a.createdAt).split(" "); // ["25", "Jan"]

                    return (
                      <li
                        key={a.id}
                        className="flex gap-4 items-start py-4 border-b border-slate-800 last:border-0 last:pb-0 first:pt-0 group cursor-pointer"
                      >
                        {/* Tanggal Box */}
                        <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-xs font-bold text-slate-500 group-hover:border-purple-500/50 group-hover:text-purple-400 transition-colors">
                          <span className="uppercase text-[10px]">
                            {dateParts[1]}
                          </span>
                          <span className="text-xl text-white group-hover:text-purple-400">
                            {dateParts[0]}
                          </span>
                        </div>

                        {/* Detail Agenda */}
                        <div className="flex-1">
                          <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                            {a.title}
                          </h4>
                          <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                            {a.description || "Tidak ada deskripsi tambahan."}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Calendar className="w-12 h-12 mb-4 opacity-20" />
                  <p>Belum ada agenda tugas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
