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
  if (!officers || officers.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white text-center transition-colors duration-300">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Struktur Pengurus
        </h2>
        <p className="text-neutral-500">Data pengurus belum diinput.</p>
      </section>
    );
  }

  const sorted = [...officers].sort((a, b) => a.displayOrder - b.displayOrder);

  const levelMap = new Map<number, OfficerWithUser[]>();
  for (const o of sorted) {
    const level = o.displayOrder ?? 999;
    const arr = levelMap.get(level) ?? [];
    arr.push(o);
    levelMap.set(level, arr);
  }

  const levels = Array.from(levelMap.keys()).sort((a, b) => a - b);
  const topLevel = levels[0];
  const topNodes = levelMap.get(topLevel) ?? [];

  return (
    <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Struktur Pengurus
        </h2>

        <div className="relative">
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

          {levels.length > 1 && <ConnectorBetweenRows variant="fromTop" />}

          {levels.slice(1).map((lvl, idx) => {
            const nodes = levelMap.get(lvl) ?? [];
            const isLast = idx === levels.slice(1).length - 1;

            return (
              <div key={lvl} className="relative">
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

                {!isLast && <ConnectorBetweenRows />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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

function ConnectorBetweenRows({ variant }: { variant?: "fromTop" }) {
  return (
    <div className="relative h-10">
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 w-px bg-neutral-300 dark:bg-neutral-700",
          variant === "fromTop" ? "h-10" : "h-10",
        ].join(" ")}
      />
    </div>
  );
}

function BranchConnector({ count }: { count: number }) {
  if (count <= 1) {
    return (
      <div className="relative h-8">
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-300 dark:bg-neutral-700" />
      </div>
    );
  }

  return (
    <div className="relative h-10">
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-300 dark:bg-neutral-700" />
      <div className="absolute left-1/2 -translate-x-1/2 top-6 h-px bg-neutral-300 dark:bg-neutral-700 w-[min(900px,90vw)]" />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-6 w-[min(900px,90vw)]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-300 dark:bg-neutral-700" />
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
        "flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2",
        "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md",
        isLeader
          ? "border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] w-72"
          : "border-neutral-200 dark:border-neutral-800 w-64 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-lg",
      ].join(" ")}
    >
      <Avatar
        className={[
          isLeader ? "w-24 h-24" : "w-20 h-20",
          "border-4 border-white dark:border-black mb-4 shadow-sm",
        ].join(" ")}
      >
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold">
          {name?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-lg font-bold text-neutral-900 dark:text-white text-center">
        {name}
      </h3>
      <p
        className={
          isLeader
            ? "text-blue-600 dark:text-blue-400 text-sm mt-1"
            : "text-neutral-500 dark:text-neutral-400 text-sm mt-1"
        }
      >
        {role}
      </p>
    </div>
  );
}
