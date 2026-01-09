"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserX } from "lucide-react";

interface OfficerSectionProps {
  data: any[];
}

export function OfficerSection({ data }: OfficerSectionProps) {
  // Logic Empty State
  if (!data || data.length === 0) {
    return (
      <section className="py-24 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-8">Struktur Pengurus</h2>
        <div className="flex flex-col items-center text-neutral-500">
          <UserX className="w-12 h-12 mb-4" />
          <p>Data pengurus belum diinput.</p>
        </div>
      </section>
    );
  }

  // Filter Data berdasarkan Jabatan (Sesuaikan stringnya dengan data di DB)
  const ketua = data.find(
    (o) =>
      o.position.toLowerCase().includes("ketua") &&
      !o.position.toLowerCase().includes("wakil")
  );
  const wakil = data.find((o) => o.position.toLowerCase().includes("wakil"));
  const sekretaris = data.find((o) =>
    o.position.toLowerCase().includes("sekretaris")
  );
  const bendahara = data.find((o) =>
    o.position.toLowerCase().includes("bendahara")
  );

  // Jika tidak menemukan spesifik, ambil sisa data untuk ditampilkan grid
  const others = data.filter(
    (o) => ![ketua, wakil, sekretaris, bendahara].includes(o)
  );

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">
          Struktur Pengurus
        </h2>

        <div className="flex flex-col items-center">
          {/* LEVEL 1: KETUA (Jika Ada) */}
          {ketua && (
            <div className="relative z-10">
              <OfficerCard
                name={ketua.user?.name || ketua.name}
                role={ketua.position}
                image={ketua.user?.image || ""}
                isLeader
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-500 to-neutral-700" />
            </div>
          )}

          {/* CONNECTOR & LEVEL 2 */}
          <div className="relative mt-16 w-full max-w-4xl">
            <div className="absolute top-0 left-16 right-16 h-px bg-neutral-700 hidden md:block" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-8 md:pt-0">
              {/* Sekretaris */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                {sekretaris ? (
                  <OfficerCard
                    name={sekretaris.user?.name || sekretaris.name}
                    role={sekretaris.position}
                    image={sekretaris.user?.image || ""}
                  />
                ) : (
                  <EmptySlot role="Sekretaris" />
                )}
              </div>

              {/* Wakil */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                {wakil ? (
                  <OfficerCard
                    name={wakil.user?.name || wakil.name}
                    role={wakil.position}
                    image={wakil.user?.image || ""}
                  />
                ) : (
                  <EmptySlot role="Wakil Ketua" />
                )}
              </div>

              {/* Bendahara */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                {bendahara ? (
                  <OfficerCard
                    name={bendahara.user?.name || bendahara.name}
                    role={bendahara.position}
                    image={bendahara.user?.image || ""}
                  />
                ) : (
                  <EmptySlot role="Bendahara" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Komponen Helper untuk Slot Kosong
function EmptySlot({ role }: { role: string }) {
  return (
    <div className="w-48 h-20 border border-dashed border-neutral-700 rounded-lg flex items-center justify-center text-neutral-600 text-sm">
      Posisi {role} Kosong
    </div>
  );
}

function OfficerCard({ name, role, image, isLeader }: any) {
  // ... (Kode UI Card sama persis seperti sebelumnya) ...
  return (
    <div
      className={`flex flex-col items-center p-6 rounded-2xl border bg-neutral-900/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 ${
        isLeader
          ? "border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] w-72"
          : "border-neutral-800 w-64 hover:border-neutral-600 shadow-lg"
      }`}
    >
      <Avatar
        className={`${
          isLeader ? "w-24 h-24" : "w-20 h-20"
        } border-4 border-black mb-4 shadow-sm`}
      >
        <AvatarImage src={image} />
        <AvatarFallback className="bg-neutral-800 text-white font-bold">
          {name?.[0]}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-lg font-bold text-white text-center">{name}</h3>
      <p
        className={`text-sm font-medium mt-1 ${
          isLeader ? "text-blue-400" : "text-neutral-400"
        }`}
      >
        {role}
      </p>
    </div>
  );
}
