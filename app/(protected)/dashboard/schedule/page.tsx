import { Metadata } from "next";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { getSchedules } from "@/actions/schedule";
import { ScheduleView } from "@/components/dashboard/schedule-view";
import { CreateScheduleDialog } from "@/components/dashboard/create-schedule-dialog";

export const metadata: Metadata = {
  title: "Jadwal Kuliah | Web-Class",
  description: "Jadwal perkuliahan mingguan",
};

export default async function SchedulePage() {
  const [schedulesData, user] = await Promise.all([
    getSchedules(),
    getCurrentUser(),
  ]);

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-h-[40px]">
        <div></div> {/* Spacer agar tombol ada di kanan */}
        {/* Tombol Create (Admin Only) */}
        {isAdmin && <CreateScheduleDialog />}
      </div>

      {/* Main View (Pass isAdmin agar tombol edit/hapus muncul) */}
      <ScheduleView initialData={schedulesData.data} isAdmin={isAdmin} />
    </div>
  );
}
