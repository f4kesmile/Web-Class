import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { eventDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat galeri" }, { status: 500 });
  }
}