// lib/utils-app.ts
import { AgendaType, DayOfWeek } from "@prisma/client";
import { Book, Calendar, Trophy, Zap } from "lucide-react";

// Mapping Hari
export const DAY_TRANSLATION: Record<DayOfWeek, string> = {
  MONDAY: "Senin", TUESDAY: "Selasa", WEDNESDAY: "Rabu",
  THURSDAY: "Kamis", FRIDAY: "Jumat", SATURDAY: "Sabtu", SUNDAY: "Minggu",
};

// Mapping Icon & Warna untuk Agenda
export const AGENDA_CONFIG = (type: AgendaType) => {
  switch (type) {
    case "ASSIGNMENT": return { label: "Tugas", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/50", icon: Book };
    case "EXAM": return { label: "Ujian", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50", icon: Zap };
    case "EVENT": return { label: "Acara", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/50", icon: Trophy };
    default: return { label: "Info", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/50", icon: Calendar };
  }
};