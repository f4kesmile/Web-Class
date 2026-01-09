import { Suspense } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DayOfWeek } from "@prisma/client";

// --- TYPES & HELPER ---
const getPrismaDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return days[date.getDay()];
};

async function getDashboardData(userId: string) {
  const today = new Date();
  const prismaDay = getPrismaDayOfWeek(today);

  const upcomingAgendas = await prisma.agenda.findMany({
    where: { deadline: { gte: today } },
    take: 5,
    orderBy: { deadline: "asc" },
  });

  const todaySchedules = await prisma.schedule.findMany({
    where: { day: prismaDay },
    orderBy: { startTime: "asc" },
  });

  const totalAgenda = await prisma.agenda.count();
  const totalSchedule = await prisma.schedule.count();

  return {
    upcomingAgendas,
    todaySchedules,
    stats: { totalAgenda, totalSchedule },
  };
}

// --- SUB-COMPONENTS ---
function GreetingHeader({ name, role }: { name: string; role: string }) {
  return (
    <div className="mb-8 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Selamat datang kembali, {name}.</p>
      </div>
      <Badge variant="outline" className="w-fit px-3 py-1 text-sm capitalize">
        Role: {(role || "user").toLowerCase().replace("_", " ")}
      </Badge>
    </div>
  );
}

// --- MAIN PAGE ---
export default async function DashboardPage() {
  // User sudah dicek di layout.tsx, tapi kita ambil lagi untuk data
  const user = await getCurrentUser();
  if (!user) return null; // Defensive

  const { upcomingAgendas, todaySchedules, stats } = await getDashboardData(
    user.id
  );

  return (
    <div className="space-y-6">
      <GreetingHeader name={user.name} role={user.role} />

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agenda</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgenda}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchedule}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Akun</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Aktif</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semester</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">IV</div>
          </CardContent>
        </Card>
      </div>

      {/* CONTENT GRID */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        {/* SCHEDULE (Kiri/Atas) */}
        <Card className="col-span-4 h-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Jadwal Hari Ini
            </CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedules.length > 0 ? (
              <div className="space-y-4">
                {todaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{schedule.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.lecturer || "-"} •{" "}
                        {schedule.room ? `R. ${schedule.room}` : "Online"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {schedule.startTime}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center space-y-3 text-muted-foreground">
                <Clock className="h-10 w-10 opacity-20" />
                <p>Tidak ada kelas hari ini.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AGENDA (Kanan/Bawah) */}
        <Card className="col-span-3 h-full shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Agenda Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAgendas.length > 0 ? (
              <div className="space-y-6">
                {upcomingAgendas.map((agenda) => (
                  <div key={agenda.id} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background font-bold text-xs flex-col leading-none text-muted-foreground">
                      <span className="text-[10px] uppercase">
                        {format(agenda.deadline, "MMM")}
                      </span>
                      <span className="text-base text-foreground">
                        {format(agenda.deadline, "d")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {agenda.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {agenda.description || "Tanpa deskripsi."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center space-y-3 text-muted-foreground">
                <AlertCircle className="h-10 w-10 opacity-20" />
                <p>Tidak ada tugas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
