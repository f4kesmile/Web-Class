import type { Metadata } from "next";
import "./globals.css";
import { GridBackground } from "@/components/ui/grid-background";

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
          <div className="min-h-[100dvh] w-full flex flex-col">{children}</div>
        </GridBackground>
      </body>
    </html>
  );
}
