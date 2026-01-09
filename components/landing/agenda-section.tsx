"use client";
import {
  Calendar,
  Clock,
  Bookmark,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

// Data Agenda (Sama seperti sebelumnya)
const agendas = [
  {
    title: "Ujian Akhir Semester",
    date: "12 Jan 2026",
    type: "Ujian",
    description:
      "Ujian tulis mata kuliah Algoritma & Struktur Data di Ruang J204.",
    icon: AlertCircle,
    highlightColor: "text-red-400",
  },
  {
    title: "Pengumpulan Tugas Besar",
    date: "15 Jan 2026",
    type: "Tugas",
    description:
      "Deadline submit laporan akhir project Web Development via Portal.",
    icon: Bookmark,
    highlightColor: "text-blue-400",
  },
  {
    title: "Seminar Teknologi",
    date: "20 Jan 2026",
    type: "Event",
    description:
      "Wajib hadir untuk seluruh mahasiswa semester 4. Tema: AI Future.",
    icon: Calendar,
    highlightColor: "text-green-400",
  },
];

export function AgendaSection() {
  return (
    <section className="py-24 bg-black text-white px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Agenda Terdekat
        </h2>
        <p className="text-neutral-400 text-center mb-16 max-w-lg mx-auto">
          Sorot kartu di bawah untuk melihat detail agenda penting Anda.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {agendas.map((item, idx) => (
            <CardSpotlight
              key={idx}
              className="h-full flex flex-col justify-between min-h-[300px]"
            >
              <div className="relative z-20">
                {/* Badge Type */}
                <div
                  className={`w-fit px-3 py-1 mb-4 rounded-full text-xs font-mono border border-neutral-700 flex items-center gap-2 bg-neutral-900/50 ${item.highlightColor}`}
                >
                  <item.icon className="w-3 h-3" />
                  {item.type}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Footer Info (Date & Time) */}
              <div className="relative z-20 mt-auto border-t border-neutral-800 pt-4">
                <ul className="space-y-2">
                  <Step text={item.date} icon={Calendar} />
                  <Step text="08:00 WIB" icon={Clock} />
                  <Step text="Status: Wajib" icon={CheckCircle2} highlight />
                </ul>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
}

// Komponen Kecil untuk List Item di dalam Card
const Step = ({
  text,
  icon: Icon,
  highlight,
}: {
  text: string;
  icon: any;
  highlight?: boolean;
}) => {
  return (
    <li className="flex gap-2 items-center text-sm">
      <Icon
        className={`w-4 h-4 ${
          highlight ? "text-blue-500" : "text-neutral-500"
        }`}
      />
      <p
        className={highlight ? "text-blue-400 font-medium" : "text-neutral-400"}
      >
        {text}
      </p>
    </li>
  );
};
