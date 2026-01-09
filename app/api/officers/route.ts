import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const officers = await prisma.officer.findMany({
      include: {
        user: { select: { name: true, image: true, email: true } },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: officers,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat pengurus" }, { status: 500 });
  }
}