import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Ambil parameter 'day' dari URL jika ada (contoh: /api/schedules?day=MONDAY)
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");

    const where = day ? { day: day } : {};

    const schedules = await prisma.schedule.findMany({
      where: where as any,
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}