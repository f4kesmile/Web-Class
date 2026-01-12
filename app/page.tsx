import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { AgendaSection } from "@/components/landing/agenda-section";
import { ScheduleSection } from "@/components/landing/schedule-section";
import { OfficerSection } from "@/components/landing/officer-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { getLandingPageData } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export default async function LandingPage() {
  const user = await getCurrentUser();
  const [agendas, schedules, officers, galleries] = await getLandingPageData();

  return (
    <main
      suppressHydrationWarning
      className="bg-white dark:bg-black min-h-screen selection:bg-blue-500/30 transition-colors duration-300"
    >
      <Navbar user={user} />

      <HeroSection />
      <AgendaSection agendas={agendas} />
      <ScheduleSection schedules={schedules} />
      <OfficerSection officers={officers} />
      <GallerySection galleries={galleries} />

      <footer className="py-12 text-center text-neutral-600 dark:text-neutral-400 text-sm bg-neutral-100 dark:bg-black border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} Kelas Pintar System.</p>
      </footer>
    </main>
  );
}
