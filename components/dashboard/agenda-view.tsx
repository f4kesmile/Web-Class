"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  Trash2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { deleteAgenda } from "@/actions/agenda";
import { cn } from "@/lib/utils";
import { EditAgendaDialog } from "./edit-agenda-dialog";
import { Agenda } from "@prisma/client";

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

interface AgendaViewProps {
  initialData: Agenda[];
  isAdmin: boolean;
}

const TABS = [
  { id: "ALL", label: "Semua" },
  { id: "ASSIGNMENT", label: "Tugas" },
  { id: "EXAM", label: "Ujian" },
  { id: "EVENT", label: "Acara" },
];

export function AgendaView({ initialData, isAdmin }: AgendaViewProps) {
  const [filter, setFilter] = useState("ALL");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("completed_agendas");
    if (saved) setCompletedIds(JSON.parse(saved));
  }, []);

  const toggleComplete = (id: string) => {
    const newIds = completedIds.includes(id)
      ? completedIds.filter((i) => i !== id)
      : [...completedIds, id];
    setCompletedIds(newIds);
    localStorage.setItem("completed_agendas", JSON.stringify(newIds));
    if (!completedIds.includes(id)) toast.success("Tugas selesai");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAgenda(id);
    if (res?.success) toast.success("Agenda dihapus");
    else toast.error("Gagal menghapus");
  };

  const filteredData = initialData.filter((item) => {
    if (filter === "ALL") return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              filter === tab.id
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-background border-border text-muted-foreground hover:border-blue-600/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredData.length > 0 ? (
            filteredData.map((agenda, index) => (
              <AgendaCard
                key={agenda.id}
                data={agenda}
                isAdmin={isAdmin}
                isCompleted={completedIds.includes(agenda.id)}
                onToggle={() => toggleComplete(agenda.id)}
                onDelete={() => handleDelete(agenda.id)}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-muted-foreground text-center border-2 border-dashed rounded-xl"
            >
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>Tidak ada agenda dalam kategori ini.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface AgendaCardProps {
  data: Agenda;
  isAdmin: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  index: number;
}

function AgendaCard({
  data,
  isAdmin,
  isCompleted,
  onToggle,
  onDelete,
  index,
}: AgendaCardProps) {
  const [showEdit, setShowEdit] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EXAM":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "EVENT":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-blue-600 bg-blue-500/10 border-blue-500/20";
    }
  };
  const typeLabel =
    {
      ASSIGNMENT: "Tugas",
      EXAM: "Ujian",
      EVENT: "Acara",
      OTHER: "Lainnya",
    }[data.type as string] || "Info";
  const isPast = new Date(data.deadline) < new Date();

  return (
    <>
      <EditAgendaDialog
        data={data}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={cn(
          "group relative flex flex-col p-5 rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-blue-500/30",
          isCompleted ? "opacity-60 grayscale-[0.5]" : "opacity-100"
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border",
              getTypeColor(data.type)
            )}
          >
            {typeLabel}
          </span>

          {isAdmin && (
            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={() => setShowEdit(true)}
                className="p-1.5 text-muted-foreground/50 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-md transition-all"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-1.5 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-md transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Agenda?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Agenda <strong>{data.title}</strong> akan dihapus
                      permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h3
            className={cn(
              "font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {data.title}
          </h3>
          {data.subject && (
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              {data.subject}
            </p>
          )}
          {data.description && (
            <p className="text-sm text-muted-foreground/80 line-clamp-2 mt-2">
              {data.description}
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t flex items-center justify-between">
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              isPast ? "text-red-500" : "text-emerald-600"
            )}
          >
            {isPast ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {formatDistanceToNow(new Date(data.deadline), {
              addSuffix: true,
              locale: id,
            })}
          </div>

          <button
            onClick={onToggle}
            className={cn(
              "p-2 rounded-full transition-colors",
              isCompleted
                ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}
