"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <GridBackground>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-6 ring-1 ring-border/50 backdrop-blur-sm animate-bounce">
            <Ghost className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 mb-2">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Halaman Hilang?
          </h2>

          <p className="text-muted-foreground max-w-[500px] mb-8 text-sm md:text-base leading-relaxed">
            Sepertinya halaman yang kamu cari sudah pindah atau memang tidak
            pernah ada. Jangan tersesat sendirian.
          </p>

          <Link href="/">
            <Button
              size="lg"
              className="rounded-2xl gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <MoveLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </GridBackground>
    </div>
  );
}
