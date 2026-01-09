"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OfficerSection() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">
          Struktur Pengurus
        </h2>

        <div className="flex flex-col items-center">
          {/* LEVEL 1: KETUA */}
          <div className="relative z-10">
            <OfficerCard
              name="Khaekal Lazib Luth R"
              role="Ketua Kelas"
              image="https://github.com/shadcn.png"
              isLeader
            />
            {/* Garis Vertikal Turun */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-500 to-neutral-700" />
          </div>

          {/* CONNECTOR HORIZONTAL (CABANG) */}
          <div className="relative mt-16 w-full max-w-4xl">
            {/* Garis Horizontal */}
            <div className="absolute top-0 left-[16.6%] right-[16.6%] h-px bg-neutral-700 hidden md:block" />

            {/* Garis Vertikal Naik ke Ketua */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />

            {/* LEVEL 2: WAKIL & SEKRETARIS & BENDAHARA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-8 md:pt-0">
              {/* Cabang Kiri */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                <OfficerCard
                  name="Nisa Alya Faradisa"
                  role="Sekretaris"
                  image="https://i.pravatar.cc/150?u=siti"
                />
              </div>

              {/* Cabang Tengah (Wakil) */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                <OfficerCard
                  name="Hendri Hariansyah"
                  role="Wakil Ketua"
                  image="https://i.pravatar.cc/150?u=andi"
                />
              </div>

              {/* Cabang Kanan */}
              <div className="flex flex-col items-center relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700 hidden md:block" />
                <OfficerCard
                  name="Nur Aeni Anisah"
                  role="Bendahara"
                  image="https://i.pravatar.cc/150?u=budi"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficerCard({
  name,
  role,
  image,
  isLeader,
}: {
  name: string;
  role: string;
  image: string;
  isLeader?: boolean;
}) {
  return (
    <div
      className={`
        flex flex-col items-center p-6 rounded-2xl border bg-neutral-900/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-2
        ${
          isLeader
            ? "border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] w-72"
            : "border-neutral-800 w-64 hover:border-neutral-600 shadow-lg"
        }
    `}
    >
      <Avatar
        className={`${
          isLeader ? "w-24 h-24" : "w-20 h-20"
        } border-4 border-black mb-4 shadow-sm`}
      >
        <AvatarImage src={image} />
        <AvatarFallback className="bg-neutral-800 text-white font-bold">
          {name[0]}
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
