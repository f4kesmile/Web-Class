import { Metadata } from "next";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { getSchedules } from "@/actions/schedule";
import { ScheduleView } from "@/components/dashboard/schedule-view";
import { CreateScheduleDialog } from "@/components/dashboard/create-schedule-dialog";

export const metadata: Metadata = {
  title: "Jadwal Kuliah | Web-Class",
  description: "Jadwal Perkuliahan",
};

export default async function SchedulePage() {
  const [schedulesData, user] = await Promise.all([
    getSchedules(),
    getCurrentUser(),
  ]);

  const { data } = schedulesData;
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 min-h-[40px]">
        {isAdmin && <CreateScheduleDialog />}
      </div>

      <ScheduleView initialData={data} isAdmin={isAdmin} />
    </div>
  );
}
