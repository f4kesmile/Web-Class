"use client";

import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Clock, MapPin, User, CalendarDays, Coffee } from "lucide-react";
import type { DayOfWeek, Schedule } from "@prisma/client";

export interface ScheduleSectionProps {
  schedules: Schedule[];
}

export function ScheduleSection({ schedules }: ScheduleSectionProps) {
  if (!schedules || schedules.length === 0) {
    return (
      <section className="bg-neutral-950 py-24 relative overflow-x-clip text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Jadwal Kuliah</h2>
        <div className="mt-8 flex flex-col items-center justify-center text-neutral-500">
          <Coffee className="w-16 h-16 mb-4 opacity-40" />
          <p>Jadwal kuliah belum diatur oleh Admin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-950 py-24 relative overflow-x-clip">
      <div className="max-w-2xl mx-auto mb-16 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Jadwal Kuliah
        </h2>
        <p className="text-neutral-400">Ikuti alur pembelajaran minggu ini.</p>
      </div>

      <TracingBeam className="px-4 md:px-8">
        <div className="max-w-2xl mx-auto antialiased pt-4 relative">
          {schedules.map((item, index) => (
            <div
              key={item.id || index}
              className="mb-12 relative pl-8 md:pl-12"
            >
              <h2 className="bg-black text-white rounded-full text-xs font-mono w-fit px-4 py-1 mb-4 border border-neutral-800 flex items-center gap-2">
                <CalendarDays className="w-3 h-3 text-blue-500" />
                {formatDay(item.day)}
              </h2>

              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/30 transition-all hover:bg-neutral-900 shadow-sm">
                <p className="text-xl font-bold text-white mb-4 font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {item.subject}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    {item.startTime} - {item.endTime} WIB
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    {item.room || "Ruang belum set"}
                  </div>

                  <div className="flex items-center gap-2 md:col-span-2">
                    <User className="w-4 h-4 text-neutral-500" />
                    {item.lecturer || "Dosen belum set"}
                  </div>

                  {typeof item.credits === "number" && item.credits > 0 && (
                    <div className="col-span-2 mt-2 text-xs bg-neutral-800 w-fit px-2 py-1 rounded text-neutral-500">
                      {item.credits} SKS
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
}

function formatDay(day: DayOfWeek | string) {
  const map: Record<string, string> = {
    MONDAY: "Senin",
    TUESDAY: "Selasa",
    WEDNESDAY: "Rabu",
    THURSDAY: "Kamis",
    FRIDAY: "Jumat",
    SATURDAY: "Sabtu",
    SUNDAY: "Minggu",
  };
  return map[String(day)] || String(day);
}
