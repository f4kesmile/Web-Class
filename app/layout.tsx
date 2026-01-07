// app/layout.tsx
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
      <body className="min-h-screen bg-background text-foreground">
        <GridBackground>
          {/* seluruh aplikasi di-render di atas grid */}
          <div className="min-h-screen flex flex-col">{children}</div>
        </GridBackground>
      </body>
    </html>
  );
}
