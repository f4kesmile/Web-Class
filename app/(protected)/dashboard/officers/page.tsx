import { Metadata } from "next";
import { Role } from "@prisma/client";
import { Users, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOfficers, getUsersList } from "@/actions/officer";
import { OfficerView } from "@/components/dashboard/officer-view";
import { AddOfficerDialog } from "@/components/dashboard/add-officer-dialog";

export const metadata: Metadata = {
  title: "Pengurus Kelas | Web-Class",
  description: "Struktur organisasi dan pengurus kelas",
};

export default async function OfficersPage() {
  const [officersData, allUsers, currentUser] = await Promise.all([
    getOfficers(),
    getUsersList(),
    getCurrentUser(),
  ]);

  const { data } = officersData;
  const isAdmin =
    currentUser?.role === Role.ADMIN || currentUser?.role === Role.SUPER_ADMIN;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Pengurus Kelas
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Kenali orang-orang hebat di balik layar kelas kita.
          </p>
        </div>

        {isAdmin && <AddOfficerDialog users={allUsers} />}
      </div>

      <OfficerView officers={data} isAdmin={isAdmin} />
    </div>
  );
}
