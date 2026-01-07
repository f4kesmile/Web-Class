"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogIn } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-4 inset-x-0 max-w-2xl mx-auto z-50 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity"
      >
        <div className="bg-blue-600 p-1 rounded-lg">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span>
          Kelas<span className="text-blue-500">Pintar</span>
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {!session ? (
          <Link href="/sign-in">
            <Button
              size="sm"
              className="rounded-full bg-white text-black hover:bg-gray-200 gap-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-blue-500 text-blue-400 hover:bg-blue-950 gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
