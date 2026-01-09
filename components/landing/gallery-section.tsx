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
    category: "Kebersamaan",
    title: "Semester 1",
    src: "/images/smstr1.jpeg",
    content: (
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl font-sans">Foto ini menjadi saksi langkah awal kami sebagai satu angkatan di semester pertama. Sebuah awal dari perjalanan panjang menuntut ilmu, membangun kebersamaan, dan merangkai masa depan. Semester 1 masih canggung, masih belajar, tapi penuh cerita. Terima kasih untuk setiap tawa, lelah, dan kebersamaan di awal perjalanan ini.</p>
    ),
  },
  {
    category: "Event",
    title: "Makrab 2024",
    src: "/images/Event makrab.jpeg",
    content: (
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl font-sans">Malam Keakraban menjadi wadah interaksi positif antar mahasiswa guna menumbuhkan rasa kekeluargaan dan kebersamaan dalam mendukung kegiatan akademik dan non-akademik.</p>
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
