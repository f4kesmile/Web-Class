import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";
import { GridBackground } from "@/components/ui/grid-background";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-[100dvh] w-screen overflow-x-hidden bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GridBackground>
            <div className="min-h-[100dvh] w-full flex flex-col">
              <AnnouncementBanner />
              {children}
            </div>
          </GridBackground>
          <Toaster position="top-center" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
