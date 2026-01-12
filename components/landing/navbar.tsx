"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import type { AuthUser } from "@/lib/auth";
import { Role } from "@/lib/enums";
import { AnimatedThemeToggler } from "@/components/ui/themeToggler";

interface NavbarProps {
  user?: AuthUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;

  return (
    <nav className="fixed top-4 inset-x-4 sm:inset-x-0 sm:max-w-3xl sm:mx-auto z-50 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl transition-all hover:bg-white/80 dark:hover:bg-black/70">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
      >
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>

        <span>
          Kelas<span className="text-blue-600 dark:text-blue-500">Pintar</span>
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <AnimatedThemeToggler />

        {user ? (
          <>
            {isAdmin && (
              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 gap-2 h-9"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}

            <div className="pl-2 border-l border-neutral-200 dark:border-white/10">
              <UserButton user={user} />
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full h-9 w-9 sm:w-auto px-0 sm:px-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 gap-2"
                title="Masuk"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Masuk</span>
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button
                size="sm"
                className="rounded-full h-9 w-9 sm:w-auto px-0 sm:px-4 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 gap-2 font-medium"
                title="Daftar"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Daftar</span>
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
