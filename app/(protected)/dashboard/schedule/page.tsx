import { ScheduleSection } from "@/components/landing/schedule-section";
import { Navbar } from "@/components/landing/navbar";

export default function Page() {
    return (
    <main className="bg-black min-h-screen">
      <Navbar />

        <ScheduleSection />
    </main>
  );
}