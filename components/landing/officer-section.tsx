"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Officer, User } from "@prisma/client";

type OfficerWithUser = Officer & {
  user: Pick<User, "name" | "image" | "email"> | null;
};

export interface OfficerSectionProps {
  officers: OfficerWithUser[];
}

export function OfficerSection({ officers }: OfficerSectionProps) {
  // kosong
  if (!officers || officers.length === 0) {
    return (
      <section className="py-24 bg-black text-white text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Struktur Pengurus
        </h2>
        <p className="text-neutral-500">Data pengurus belum diinput.</p>
      </section>
    );
  }

  // 1) Sort by displayOrder asc (sesuai DB)
  const sorted = [...officers].sort((a, b) => a.displayOrder - b.displayOrder);

  // 2) Group by displayOrder (displayOrder dianggap LEVEL)
  const levelMap = new Map<number, OfficerWithUser[]>();
  for (const o of sorted) {
    const level = o.displayOrder ?? 999;
    const arr = levelMap.get(level) ?? [];
    arr.push(o);
    levelMap.set(level, arr);
  }

  // 3) Urutkan level
  const levels = Array.from(levelMap.keys()).sort((a, b) => a - b);

  // Jika level paling atas punya >1 orang, tetap sejajar (sesuai aturan “nomor sama = sejajar”)
  const topLevel = levels[0];
  const topNodes = levelMap.get(topLevel) ?? [];

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* background grid lembut */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Struktur Pengurus
        </h2>

        {/* TREE */}
        <div className="relative">
          {/* LEVEL 1 (Top) */}
          <TreeRow>
            {topNodes.map((o) => (
              <OfficerCard
                key={o.id}
                name={o.user?.name ?? "Pengurus"}
                role={o.position}
                image={o.user?.image ?? ""}
                isLeader
              />
            ))}
          </TreeRow>

          {/* Connector dari Top ke level berikutnya (jika ada) */}
          {levels.length > 1 && <ConnectorBetweenRows variant="fromTop" />}

          {/* LEVEL berikutnya */}
          {levels.slice(1).map((lvl, idx) => {
            const nodes = levelMap.get(lvl) ?? [];
            const isLast = idx === levels.slice(1).length - 1;

            return (
              <div key={lvl} className="relative">
                {/* Garis horizontal + cabang ke tiap card (untuk level ini) */}
                <BranchConnector count={nodes.length} />

                <TreeRow className="mt-10">
                  {nodes.map((o) => (
                    <OfficerCard
                      key={o.id}
                      name={o.user?.name ?? "Pengurus"}
                      role={o.position}
                      image={o.user?.image ?? ""}
                    />
                  ))}
                </TreeRow>

                {/* Connector turun ke level selanjutnya (kalau masih ada level lagi) */}
                {!isLast && <ConnectorBetweenRows />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Row layout */
function TreeRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex flex-wrap justify-center gap-8 md:gap-10",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/**
 * Garis turun di tengah (dari row atas ke area branch row berikutnya).
 * variant fromTop sedikit lebih panjang supaya kelihatan jelas.
 */
function ConnectorBetweenRows({ variant }: { variant?: "fromTop" }) {
  return (
    <div className="relative h-10">
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 w-px bg-neutral-700",
          variant === "fromTop" ? "h-10" : "h-10",
        ].join(" ")}
      />
    </div>
  );
}

/**
 * Membuat “cabang”:
 * - ada garis horizontal di tengah
 * - dan garis vertikal kecil menuju tiap card (secara visual).
 *
 * Ini connector sederhana (level-based), bukan parent-child spesifik.
 */
function BranchConnector({ count }: { count: number }) {
  // Jika cuma 1 node, cukup garis vertikal saja (tidak perlu horizontal panjang)
  if (count <= 1) {
    return (
      <div className="relative h-8">
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700" />
      </div>
    );
  }

  return (
    <div className="relative h-10">
      {/* vertikal dari atas menuju garis horizontal */}
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-700" />

      {/* garis horizontal */}
      <div className="absolute left-1/2 -translate-x-1/2 top-6 h-px bg-neutral-700 w-[min(900px,90vw)]" />

      {/* tick (cabang) ke tiap card secara visual:
          kita pakai grid dummy supaya “rasa bercabang” muncul. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-6 w-[min(900px,90vw)]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

type OfficerCardProps = {
  name: string;
  role: string;
  image: string;
  isLeader?: boolean;
};

function OfficerCard({ name, role, image, isLeader }: OfficerCardProps) {
  return (
    <div
      className={[
        "flex flex-col items-center p-6 rounded-2xl border bg-neutral-900/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-2",
        isLeader
          ? "border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] w-72"
          : "border-neutral-800 w-64 hover:border-neutral-600 shadow-lg",
      ].join(" ")}
    >
      <Avatar
        className={[
          isLeader ? "w-24 h-24" : "w-20 h-20",
          "border-4 border-black mb-4 shadow-sm",
        ].join(" ")}
      >
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-neutral-800 text-white font-bold">
          {name?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-lg font-bold text-white text-center">{name}</h3>
      <p
        className={
          isLeader
            ? "text-blue-400 text-sm mt-1"
            : "text-neutral-400 text-sm mt-1"
        }
      >
        {role}
      </p>
    </div>
  );
}
