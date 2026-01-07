import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { AgendaSection } from "@/components/landing/agenda-section";
import { ScheduleSection } from "@/components/landing/schedule-section";
import { OfficerSection } from "@/components/landing/officer-section";
import { GallerySection } from "@/components/landing/gallery-section";

export default function LandingPage() {
  return (
    <main className="bg-black min-h-screen selection:bg-blue-500/30">
      {/* Menu Navigasi Melayang */}
      <Navbar />

      {/* 1. Hero dengan Gemini Effect (Scroll Tinggi) */}
      <HeroSection />

      {/* 2. Agenda Terdekat */}
      <AgendaSection />

      {/* 3. Jadwal Kuliah (Tracing Beam) */}
      <ScheduleSection />

      {/* 4. Struktur Pengurus (Tree Diagram) */}
      <OfficerSection />

      {/* 5. Galeri (Apple Carousel) */}
      <GallerySection />

      {/* Footer Simple */}
      <footer className="py-12 text-center text-neutral-600 text-sm bg-black border-t border-neutral-900">
        <p>
          &copy; {new Date().getFullYear()} KelasPintar System. Dibuat dengan
          semangat.
        </p>
      </footer>
    </main>
  );
}
