"use client";

import { motion } from "framer-motion";
import { Shield, Crown, Medal, User, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteOfficer } from "@/actions/officer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EditOfficerDialog } from "./edit-officer-dialog";
import { Officer, User as PrismaUser } from "@prisma/client";

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

type OfficerWithUser = Officer & {
  user: Pick<PrismaUser, "name" | "email" | "image">;
};

interface OfficerViewProps {
  officers: OfficerWithUser[];
  isAdmin: boolean;
}

export function OfficerView({ officers, isAdmin }: OfficerViewProps) {
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

  const tiers: Record<number, OfficerWithUser[]> = {};
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
              {tierOfficers.map((officer) => (
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

interface TreeOfficerCardProps {
  data: OfficerWithUser;
  isAdmin: boolean;
  onDelete: () => void;
}

function TreeOfficerCard({ data, isAdmin, onDelete }: TreeOfficerCardProps) {
  const initials = data.user.name.substring(0, 2).toUpperCase();
  const isLeader = data.displayOrder === 1;

  const getIcon = (order: number) => {
    if (order === 1)
      return <Crown className="w-4 h-4 text-primary fill-primary" />;
    if (order === 2)
      return (
        <Medal className="w-4 h-4 text-muted-foreground fill-muted-foreground" />
      );
    return <User className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative group flex flex-col items-center bg-card border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20",
        isLeader ? "p-6 w-64 border-primary/25 bg-primary/5" : "p-4 w-48"
      )}
    >
      {isAdmin && (
        <>
          <div className="absolute top-2 left-2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
            <EditOfficerDialog data={data} />
          </div>

          <div className="absolute top-2 right-2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition">
                  {" "}
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
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Ya, Berhentikan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}

      <div className="relative mb-3">
        <Avatar
          className={cn(
            "border-4 border-background shadow-md group-hover:border-zinc-50 dark:group-hover:border-zinc-900/30 transition-colors",
            isLeader ? "w-20 h-20" : "w-14 h-14"
          )}
        >
          <AvatarImage src={data.user.image || ""} className="object-cover" />
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
            "font-bold text-foreground truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors",
            isLeader ? "text-lg" : "text-sm"
          )}
        >
          {data.user.name}
        </h3>
        <p
          className={cn(
            "font-medium uppercase tracking-wide text-muted-foreground truncate",
            isLeader ? "text-xs mt-1 text-yellow-600" : "text-[10px]"
          )}
        >
          {data.position}
        </p>
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-border/50 group-hover:bg-primary/30 transition-colors"></div>
    </motion.div>
  );
}
