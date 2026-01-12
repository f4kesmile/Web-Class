'use server'

import { prisma } from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";

export async function getDashboardData() {
  const upcomingAgendas = await prisma.agenda.findMany({
    where: { deadline: { gte: new Date() } },
    orderBy: { deadline: 'asc' },
    take: 5
  });

  const days: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const todayEnum = days[new Date().getDay()];

  const todaySchedule = await prisma.schedule.findMany({
    where: { day: todayEnum },
    orderBy: { startTime: 'asc' }
  });

  return { upcomingAgendas, todaySchedule, todayEnum };
}