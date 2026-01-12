"use server";

import { prisma } from "@/lib/prisma";
import { DayOfWeek, AgendaType } from "@/lib/enums";

type PrismaDayOfWeek = "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";

export async function getDashboardData() {
  const upcomingAgendasData = await prisma.agenda.findMany({
    where: { deadline: { gte: new Date() } },
    orderBy: { deadline: "asc" },
    take: 5,
  });

  const upcomingAgendas = upcomingAgendasData.map((agenda) => ({
    ...agenda,
    type: agenda.type as unknown as AgendaType,
  }));

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

  const todayScheduleData = await prisma.schedule.findMany({
    where: {
      day: todayEnum as unknown as PrismaDayOfWeek,
    },
    orderBy: { startTime: "asc" },
  });

  const todaySchedule = todayScheduleData.map((schedule) => ({
    ...schedule,
    day: schedule.day as unknown as DayOfWeek,
  }));

  return { upcomingAgendas, todaySchedule, todayEnum };
}