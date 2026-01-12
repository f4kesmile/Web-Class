"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DayOfWeek } from "@/lib/enums";

export async function getDashboardData() {
  const upcomingAgendas = await prisma.agenda.findMany({
    where: { deadline: { gte: new Date() } },
    orderBy: { deadline: "asc" },
    take: 5,
  });

  const days = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];

  const todayEnum = days[new Date().getDay()];

  const todaySchedule = await prisma.schedule.findMany({
    where: { 
      day: todayEnum as unknown as Prisma.ScheduleWhereInput["day"] 
    },
    orderBy: { startTime: "asc" },
  });

  return { upcomingAgendas, todaySchedule, todayEnum };
}