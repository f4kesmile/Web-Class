import { prisma } from "@/lib/prisma";

export async function getLandingPageData() {
  try {
    return await Promise.all([
      prisma.agenda.findMany({
        where: { deadline: { gte: new Date() } },
        orderBy: { deadline: "asc" },
        take: 3,
      }),
      prisma.schedule.findMany({
        orderBy: { startTime: "asc" },
      }),
      prisma.officer.findMany({
        include: { user: { select: { name: true, image: true, email: true } } },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.gallery.findMany({
        orderBy: { eventDate: "desc" },
        take: 5,
      }),
    ]);
  } catch (error) {
    console.error("Database Error:", error);
    return [[], [], [], []];
  }
}