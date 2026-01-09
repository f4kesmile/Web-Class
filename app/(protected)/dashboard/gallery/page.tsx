import { GallerySection } from "@/components/landing/gallery-section";
import { Navbar } from "@/components/landing/navbar";

export default function Page() {
    return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
        <GallerySection />
    </main>
  );
}