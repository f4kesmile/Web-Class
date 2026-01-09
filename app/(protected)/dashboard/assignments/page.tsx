import { AgendaSection } from "@/components/landing/agenda-section";
import { Navbar } from "@/components/landing/navbar";

export default function Page() {
    return (
    <main className="bg-black min-h-screen">
      <Navbar />

        <AgendaSection />
    </main>
  );
}