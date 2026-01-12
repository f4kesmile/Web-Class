import { Metadata } from "next";
import { BookOpenCheck } from "lucide-react";
import { getAgendas } from "@/actions/agenda";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { AgendaView } from "@/components/dashboard/agenda-view";
import { CreateAgendaDialog } from "@/components/dashboard/create-agenda-dialog";

export const metadata: Metadata = {
  title: "Tugas & Agenda | Web-Class",
  description: "Daftar tugas dan agenda kelas",
};

export default async function AssignmentsPage() {
  const { data } = await getAgendas();
  const user = await getCurrentUser();
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            Tugas & Agenda
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Kelola tugas kuliah, jadwal ujian, dan catatan penting lainnya.
          </p>
        </div>

        {isAdmin && <CreateAgendaDialog />}
      </div>

      <AgendaView initialData={data} isAdmin={isAdmin} />
    </div>
  );
}
