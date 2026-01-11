import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";
import { GridBackground } from "@/components/ui/grid-background";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelas Informatika",
  description: "Portal kelas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-[100dvh] w-screen overflow-x-hidden bg-background text-foreground">
        <GridBackground>
          <div className="min-h-[100dvh] w-full flex flex-col">
            <AnnouncementBanner />
            {children}
          </div>
        </GridBackground>
        <Toaster position="top-center" closeButton richColors />
      </body>
    </html>
  );
}
