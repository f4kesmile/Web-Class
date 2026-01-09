"use client";

import { motion } from "framer-motion";
import {
  UserX,
  Shield,
  Crown,
  Medal,
  User,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteOfficer } from "@/actions/officer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EditOfficerDialog } from "./edit-officer-dialog"; // 1. IMPORT EDIT DIALOG

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

interface OfficerViewProps {
  officers: any[];
  isAdmin: boolean;
}

export function OfficerView({ officers, isAdmin }: OfficerViewProps) {
  // ... (Bagian Logic grouping tiers TETAP SAMA seperti sebelumnya) ...
  const handleDelete = async (id: string) => {
    const res = await deleteOfficer(id);
    if (res?.success) toast.success("Pengurus diberhentikan.");
    else toast.error("Gagal menghapus.");
  };

  if (officers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
        <Shield className="w-12 h-12 mb-4 opacity-20" />
        <p>Belum ada struktur pengurus yang dibentuk.</p>
      </div>
    );
  }

  const tiers: Record<number, any[]> = {};
  officers.forEach((officer) => {
    const order = officer.displayOrder;
    if (!tiers[order]) tiers[order] = [];
    tiers[order].push(officer);
  });
  const sortedTiers = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col items-center space-y-8 py-8 w-full overflow-x-auto">
      {sortedTiers.map((tierLevel, index) => {
        const tierOfficers = tiers[tierLevel];
        const isLastTier = index === sortedTiers.length - 1;

        return (
          <div key={tierLevel} className="flex flex-col items-center w-full">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 relative z-10 px-4">
              {tierOfficers.map((officer: any) => (
                <TreeOfficerCard
                  key={officer.id}
                  data={officer}
                  isAdmin={isAdmin}
                  onDelete={() => handleDelete(officer.id)}
                />
              ))}
            </div>
            {!isLastTier && (
              <div className="flex flex-col items-center mt-2 h-8">
                <div className="w-px h-full bg-border/50"></div>
                <ChevronDown className="w-4 h-4 text-border/50 -mt-1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TreeOfficerCard({ data, isAdmin, onDelete }: any) {
  const initials = data.user.name.substring(0, 2).toUpperCase();
  const isLeader = data.displayOrder === 1;

  const getIcon = (order: number) => {
    if (order === 1)
      return <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
    if (order === 2)
      return <Medal className="w-4 h-4 text-slate-400 fill-slate-400" />;
    return <User className="w-3 h-3 text-blue-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative group flex flex-col items-center bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300",
        isLeader ? "p-6 w-64 border-yellow-500/30 bg-yellow-500/5" : "p-4 w-48"
      )}
    >
      {isAdmin && (
        <>
          {/* 2. TOMBOL EDIT (KIRI ATAS) */}
          <EditOfficerDialog data={data} />

          {/* 3. TOMBOL HAPUS (KANAN ATAS) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="absolute -top-2 -right-2 p-1.5 bg-background border rounded-full text-muted-foreground hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Berhentikan Pengurus?</AlertDialogTitle>
                <AlertDialogDescription>
                  Yakin memberhentikan <strong>{data.user.name}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ya, Berhentikan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Avatar & Info (Tetap Sama) */}
      <div className="relative mb-3">
        <Avatar
          className={cn(
            "border-4 border-background shadow-md",
            isLeader ? "w-20 h-20" : "w-14 h-14"
          )}
        >
          <AvatarImage src={data.user.image} className="object-cover" />
          <AvatarFallback className="bg-muted font-bold text-muted-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full border shadow-sm">
          {getIcon(data.displayOrder)}
        </div>
      </div>

      <div className="text-center w-full">
        <h3
          className={cn(
            "font-bold text-foreground truncate",
            isLeader ? "text-lg" : "text-sm"
          )}
        >
          {data.user.name}
        </h3>
        <p
          className={cn(
            "font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 truncate",
            isLeader ? "text-xs mt-1" : "text-[10px]"
          )}
        >
          {data.position}
        </p>
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-border/50"></div>
    </motion.div>
  );
}
