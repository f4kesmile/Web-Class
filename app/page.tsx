"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// HAPUS SEMUA IMPORT CLERK
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen, Layers, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { useSession } from "@/lib/auth-client"; // GANTI DENGAN INI

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function LandingPage() {
  // Ambil status session user dari Better Auth
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* ... (Bagian Background & Icon Tetap Sama) ... */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#4f4f4f 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 max-w-4xl w-full text-center space-y-8"
      >
        {/* ... (Bagian Header Icon & Judul Tetap Sama) ... */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
            <AnimatedIcon icon={Layers} className="w-16 h-16 text-blue-400" />
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Portal Kelas <span className="text-blue-500">Interaktif</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          Platform manajemen kelas modern dengan integrasi 3D, database
          real-time, dan keamanan tingkat tinggi.
        </motion.p>

        {/* --- BAGIAN TOMBOL LOGIN (YANG DIUBAH) --- */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4 pt-4"
        >
          {/* Logika: Jika TIDAK ADA session (!session), tampilkan tombol Masuk */}
          {!session ? (
            <Link href="/sign-in">
              <Button
                size="lg"
                className="group bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                Masuk Sekarang
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            /* Jika ADA session, tampilkan tombol Dashboard */
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-blue-500/50 text-blue-400 hover:bg-blue-950 hover:text-blue-300"
              >
                <Zap className="mr-2 w-4 h-4" />
                Dashboard Saya
              </Button>
            </Link>
          )}
        </motion.div>
        {/* --- END BAGIAN TOMBOL --- */}

        {/* Fitur Cards (Tetap Sama) */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 text-left"
        >
          <FeatureCard
            icon={ShieldCheck}
            title="Aman & Privat"
            desc="Login terproteksi dengan Better Auth."
          />
          <FeatureCard
            icon={BookOpen}
            title="Materi Lengkap"
            desc="Akses modul pelajaran kapan saja."
          />
          <FeatureCard
            icon={Zap}
            title="Super Cepat"
            desc="Dibangun dengan Next.js 16 & Prisma."
          />
        </motion.div>
      </motion.div>
    </main>
  );
}

// ... (Komponen FeatureCard Tetap Sama)
function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors duration-300 group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-500/20 transition-colors">
          <AnimatedIcon
            icon={Icon}
            className="w-6 h-6 text-slate-300 group-hover:text-blue-400"
          />
        </div>
        <div>
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
