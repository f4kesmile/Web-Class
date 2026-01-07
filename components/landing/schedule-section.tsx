"use client";
import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Clock, MapPin, User, CalendarDays } from "lucide-react";

export function ScheduleSection() {
  return (
    // UBAH: Gunakan 'overflow-x-clip' agar animasi vertikal aman, tapi horizontal tidak terpotong paksa
    <section className="bg-neutral-950 py-24 relative overflow-x-clip">
      <div className="max-w-2xl mx-auto mb-16 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Jadwal Kuliah
        </h2>
        <p className="text-neutral-400">Ikuti alur pembelajaran minggu ini.</p>
      </div>

      {/* px-4 md:px-8: Memberikan ruang napas di kiri kanan agar garis Beam tidak menempel tepi layar tablet
       */}
      <TracingBeam className="px-4 md:px-8">
        <div className="max-w-2xl mx-auto antialiased pt-4 relative">
          {scheduleData.map((item, index) => (
            // pl-8 md:pl-12: Memberi jarak antara GARIS BEAM dengan KARTU KONTEN
            <div
              key={`content-${index}`}
              className="mb-12 relative pl-8 md:pl-12"
            >
              <h2 className="bg-black text-white rounded-full text-xs font-mono w-fit px-4 py-1 mb-4 border border-neutral-800 flex items-center gap-2">
                <CalendarDays className="w-3 h-3 text-blue-500" />
                {item.day}
              </h2>

              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/30 transition-all hover:bg-neutral-900 shadow-sm">
                <p className="text-xl font-bold text-white mb-4 font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {item.course}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    {item.room}
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <User className="w-4 h-4 text-neutral-500" />
                    {item.lecturer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
}

const scheduleData = [
  {
    day: "Senin",
    course: "Pemrograman Web Lanjut",
    time: "08:00 - 10:30",
    room: "Lab Komputer 3",
    lecturer: "Dr. Budi Santoso",
  },
  {
    day: "Selasa",
    course: "Basis Data Terdistribusi",
    time: "10:00 - 12:00",
    room: "Ruang Teori A",
    lecturer: "Siti Aminah, M.Kom",
  },
  {
    day: "Rabu",
    course: "Kecerdasan Buatan",
    time: "13:00 - 15:30",
    room: "Smart Class",
    lecturer: "Prof. John Doe",
  },
  {
    day: "Kamis",
    course: "Etika Profesi",
    time: "09:00 - 11:00",
    room: "Aula Utama",
    lecturer: "Ahmad Yani, S.H.",
  },
];
