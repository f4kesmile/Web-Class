"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { ImageOff, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import type { Gallery } from "@prisma/client";

export interface GallerySectionProps {
  galleries: Gallery[];
}

export function GallerySection({ galleries }: GallerySectionProps) {
  if (!galleries || galleries.length === 0) {
    return (
      <div className="w-full py-24 bg-neutral-950 border-t border-neutral-900 text-center">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-200 mb-8">
          Galeri Kegiatan
        </h2>
        <div className="flex flex-col items-center text-neutral-600">
          <ImageOff className="w-12 h-12 mb-4" />
          <p>Belum ada foto kegiatan.</p>
        </div>
      </div>
    );
  }

  const cards = galleries.map((item, index) => {
    const validUrl = item.imageUrl || "";
    const dateCategory = item.eventDate
      ? format(new Date(item.eventDate), "dd MMMM yyyy", { locale: id })
      : "Dokumentasi";

    return (
      <Card
        key={item.id || index}
        card={{
          category: dateCategory,
          title: item.title || "Kegiatan Tanpa Judul",
          src: validUrl,
          content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
              <div className="max-w-3xl mx-auto space-y-6">
                <h3 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-neutral-500">
                  <CalendarDays className="w-5 h-5" />
                  <span className="text-sm font-medium">{dateCategory}</span>
                </div>

                <div className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed font-sans">
                  {item.description ? (
                    item.description
                  ) : (
                    <span className="italic opacity-50">
                      Tidak ada deskripsi detail untuk kegiatan ini.
                    </span>
                  )}
                </div>

                {validUrl && (
                  <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mt-6 shadow-md">
                    <Image
                      src={validUrl}
                      alt={item.title || "Galeri"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ),
        }}
        index={index}
      />
    );
  });

  return (
    <div className="w-full h-full py-24 bg-neutral-950 border-t border-neutral-900">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-200 font-sans mb-8">
        Galeri Kegiatan Kelas
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
