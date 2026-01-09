import { OfficerSection } from "@/components/landing/officer-section";
import { Navbar } from "@/components/landing/navbar";

export default function Page() {
    return (
    <main className="bg-black min-h-screen">
      <Navbar />

        <OfficerSection />
    </main>
  );
}