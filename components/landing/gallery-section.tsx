"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function GallerySection() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-24 bg-neutral-950 border-t border-neutral-900">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-200 font-sans mb-8">
        Galeri Kegiatan Kelas
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ text }: { text: string }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          Dokumentasi
        </span>{" "}
        {text}
      </p>
    </div>
  );
};

const data = [
  {
    category: "Akademik",
    title: "Presentasi Project Akhir.",
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=3540&auto=format&fit=crop",
    content: (
      <DummyContent text="Momen presentasi project besar semester 3 di depan dosen penguji." />
    ),
  },
  {
    category: "Event",
    title: "Kunjungan Industri 2025.",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3540&auto=format&fit=crop",
    content: (
      <DummyContent text="Kunjungan ke kantor Google Indonesia untuk belajar budaya kerja startup." />
    ),
  },
  {
    category: "Olahraga",
    title: "Class Meeting Futsal.",
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=3693&auto=format&fit=crop",
    content: (
      <DummyContent text="Pertandingan persahabatan antar kelas yang sangat sengit." />
    ),
  },
  {
    category: "Sosial",
    title: "Buka Puasa Bersama.",
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=3540&auto=format&fit=crop",
    content: (
      <DummyContent text="Mempererat tali silaturahmi di bulan Ramadhan." />
    ),
  },
];
