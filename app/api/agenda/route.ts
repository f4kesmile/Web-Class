import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: { deadline: "asc" },
      where: {
        // Hanya tampilkan agenda yang belum lewat lebih dari 7 hari yang lalu
        deadline: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      }
    });

    return NextResponse.json({
      success: true,
      data: agendas,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat agenda" }, { status: 500 });
  }
}