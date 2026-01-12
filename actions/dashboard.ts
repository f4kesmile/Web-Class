"use server";

import { prisma } from "@/lib/prisma";
import { DayOfWeek, AgendaType } from "@/lib/enums";

export async function getDashboardData() {
  const upcomingAgendasData = await prisma.agenda.findMany({
    where: { deadline: { gte: new Date() } },
    orderBy: { deadline: "asc" },
    take: 5,
  });

  const upcomingAgendas = upcomingAgendasData.map((agenda) => {
    const { type, ...rest } = agenda;
    return {
      ...rest,
      type: type as unknown as AgendaType,
    };
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

  const todayScheduleData = await prisma.schedule.findMany({
    where: { day: todayEnum as unknown as import("@prisma/client").DayOfWeek },
    orderBy: { startTime: "asc" },
  });

  const todaySchedule = todayScheduleData.map((schedule) => {
    const { day, ...rest } = schedule;
    return {
      ...rest,
      day: day as unknown as DayOfWeek,
    };
  });

  return { upcomingAgendas, todaySchedule, todayEnum };
}