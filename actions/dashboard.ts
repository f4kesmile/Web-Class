// actions/dashboard.ts
'use server'

import { prisma } from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";

export async function getDashboardData() {
  // 1. Ambil Agenda yang belum lewat (Deadline >= Sekarang)
  const upcomingAgendas = await prisma.agenda.findMany({
    where: { deadline: { gte: new Date() } },
    orderBy: { deadline: 'asc' },
    take: 5
  });

  // 2. Tentukan hari ini (untuk ambil jadwal)
  const days: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const todayEnum = days[new Date().getDay()];

  const todaySchedule = await prisma.schedule.findMany({
    where: { day: todayEnum },
    orderBy: { startTime: 'asc' }
  });

  return { upcomingAgendas, todaySchedule, todayEnum };
}