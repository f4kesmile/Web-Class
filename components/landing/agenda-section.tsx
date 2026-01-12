"use client";

import {
  Calendar,
  Clock,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Agenda, AgendaType } from "@prisma/client";
import { GlareCard } from "@/components/ui/glare-card";

export interface AgendaSectionProps {
  agendas: Agenda[];
}

export function AgendaSection({ agendas }: AgendaSectionProps) {
  if (!agendas || agendas.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white px-6 relative z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
            Agenda Terdekat
          </h2>
          <div className="mt-12 p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-500">
            <Inbox className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Belum ada agenda mendatang.</p>
            <p className="text-sm">Selamat, Anda bisa bersantai sejenak!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="-mt-[40vh] md:mt-0 py-24 bg-white dark:bg-black text-neutral-900 dark:text-white px-6 relative z-10 transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400">
          Agenda Terdekat
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-16 max-w-lg mx-auto">
          Sorot kartu di bawah untuk melihat detail agenda penting Anda.
        </p>

        <div className="grid md:grid-cols-3 gap-8 justify-items-center">
          {agendas.map((item, idx) => {
            const { Icon, color } = getAgendaBadge(item.type);

            return (
              <GlareCard
                key={item.id || idx}
                className="flex flex-col justify-between p-6 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-xl dark:shadow-none border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative z-20">
                  <div
                    className={`w-fit px-3 py-1 mb-4 rounded-full text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900/50 ${color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {item.type}
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.description || "Tidak ada deskripsi tambahan."}
                  </p>
                </div>

                <div className="relative z-20 mt-auto border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <ul className="space-y-2">
                    <Step
                      text={format(new Date(item.deadline), "dd MMMM yyyy", {
                        locale: id,
                      })}
                      icon={Calendar}
                    />
                    <Step
                      text={format(new Date(item.deadline), "HH:mm 'WIB'", {
                        locale: id,
                      })}
                      icon={Clock}
                    />
                    <Step text="Wajib" icon={CheckCircle2} highlight />
                  </ul>
                </div>
              </GlareCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getAgendaBadge(type: AgendaType | string): {
  Icon: LucideIcon;
  color: string;
} {
  let Icon: LucideIcon = Bookmark;
  let color = "text-blue-400";

  if (type === "UJIAN") {
    Icon = AlertCircle;
    color = "text-red-400";
  } else if (type === "EVENT") {
    Icon = Calendar;
    color = "text-green-400";
  }

  return { Icon, color };
}

function Step({
  text,
  icon: Icon,
  highlight,
  isDark = true,
}: {
  text: string;
  icon: LucideIcon;
  highlight?: boolean;
  isDark?: boolean;
}) {
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
}
