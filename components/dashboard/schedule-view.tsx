"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Schedule } from "@prisma/client";
import { Calendar, Clock, MapPin, User, BookOpen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteSchedule } from "@/actions/schedule";
import { toast } from "sonner";
import { EditScheduleDialog } from "./edit-schedule-dialog"; // Import Edit Dialog

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DAYS = [
  { id: "MONDAY", label: "Senin" },
  { id: "TUESDAY", label: "Selasa" },
  { id: "WEDNESDAY", label: "Rabu" },
  { id: "THURSDAY", label: "Kamis" },
  { id: "FRIDAY", label: "Jumat" },
  { id: "SATURDAY", label: "Sabtu" },
  { id: "SUNDAY", label: "Minggu" },
];

interface ScheduleViewProps {
  initialData: Schedule[];
  isAdmin: boolean;
}

export function ScheduleView({ initialData, isAdmin }: ScheduleViewProps) {
  const [activeDay, setActiveDay] = useState<string>("MONDAY");

  const handleDelete = async (id: string) => {
    const res = await deleteSchedule(id);
    if (res?.success) toast.success("Jadwal dihapus");
    else toast.error("Gagal menghapus jadwal");
  };

  const filteredSchedules = initialData.filter(
    (item) => item.day === activeDay
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            Jadwal Kuliah
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau kegiatan akademik Anda minggu ini.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl overflow-x-auto scrollbar-hide">
        {DAYS.map((day) => (
          <button
            key={day.id}
            onClick={() => setActiveDay(day.id)}
            className={cn(
              "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none",
              activeDay === day.id
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/80"
            )}
          >
            {activeDay === day.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-lg border border-black/5 dark:border-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{day.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <ScheduleCard
                key={schedule.id}
                data={schedule}
                index={index}
                isAdmin={isAdmin}
                onDelete={() => handleDelete(schedule.id)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full py-12 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-xl"
            >
              <Calendar className="w-12 h-12 mb-4 opacity-20" />
              <p>Tidak ada jadwal kuliah untuk hari ini.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function ScheduleCard({ data, index, isAdmin, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 1. TOMBOL EDIT */}
          <EditScheduleDialog data={data} />

          {/* 2. TOMBOL HAPUS */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-all bg-white shadow-sm border">
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
                <AlertDialogDescription>
                  Mata kuliah <strong>{data.subject}</strong> akan dihapus
                  permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5" />
            {data.startTime} - {data.endTime}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg leading-tight group-hover:text-blue-500 transition-colors pr-6">
            {data.subject}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {data.credits ? `${data.credits} SKS` : "Mata Kuliah Wajib"}
          </p>
        </div>

        <div className="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span
              className="truncate max-w-[100px]"
              title={data.lecturer || "-"}
            >
              {data.lecturer || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{data.room || "Online"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
