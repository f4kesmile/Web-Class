"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { UserButton } from "@/components/auth/user-button"; // Pastikan path ini benar

interface NavbarProps {
  user?: any; // Menerima data user dari page.tsx
}

export function Navbar({ user }: NavbarProps) {
  // Logic: Cek apakah user memiliki akses admin
  // Kita gunakan .toLowerCase() untuk jaga-jaga jika di DB tertulis "ADMIN" atau "admin"
  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin" || role === "super_admin";

  return (
    <nav className="fixed top-4 inset-x-0 max-w-3xl mx-auto z-50 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl transition-all hover:bg-black/70">
      {/* 1. LOGO */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-white hover:opacity-80 transition-opacity"
      >
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span>
          Kelas<span className="text-blue-500">Pintar</span>
        </span>
      </Link>

      {/* 2. MENU KANAN (Dinadmis) */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* JIKA ADMIN: Tampilkan Tombol Dashboard */}
            {isAdmin && (
              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-neutral-300 hover:text-white hover:bg-white/10 gap-2 h-9"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}

            {/* JIKA LOGIN (Admin/User): Tampilkan Avatar & Logout Menu */}
            <div className="pl-2 border-l border-white/10">
              <UserButton user={user} />
            </div>
          </>
        ) : (
          <>
            {/* JIKA BELUM LOGIN: Tombol Masuk & Daftar */}
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-neutral-300 hover:text-white hover:bg-white/10 gap-2"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                size="sm"
                className="rounded-full bg-white text-black hover:bg-neutral-200 gap-2 font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Daftar
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
