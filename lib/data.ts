import { prisma } from "@/lib/prisma";

export async function getLandingPageData() {
  try {
    // Kita return hasil Promise.all agar bisa di-destructure di page.tsx
    return await Promise.all([
      // 1. Agendas
      prisma.agenda.findMany({
        where: { deadline: { gte: new Date() } },
        orderBy: { deadline: "asc" },
        take: 3,
      }),
      // 2. Schedules
      prisma.schedule.findMany({
        orderBy: { startTime: "asc" },
      }),
      // 3. Officers
      prisma.officer.findMany({
        include: { user: { select: { name: true, image: true, email: true } } },
        orderBy: { displayOrder: "asc" },
      }),
      // 4. Gallery
      prisma.gallery.findMany({
        orderBy: { eventDate: "desc" },
        take: 5,
      }),
    ]);
  } catch (error) {
    console.error("Database Error:", error);
    // Return array kosong jika error, agar website tidak crash total
    return [[], [], [], []];
  }
}