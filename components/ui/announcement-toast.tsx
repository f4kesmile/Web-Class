"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementToastProps {
  title: string;
  content: string;
}

export function AnnouncementToast({ title, content }: AnnouncementToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 inset-x-0 z-[100] mx-auto flex w-full max-w-md px-4 pointer-events-none">
      <div className="pointer-events-auto w-full animate-in slide-in-from-top-4 fade-in duration-700">
        <div
          className={cn(
            "relative flex items-center gap-4 p-4 pr-10 overflow-hidden border rounded-3xl", // rounded-3xl agar lebih bulat
            "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-black/5",
            "dark:bg-neutral-900/80 dark:border-white/10 dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)]"
          )}
        >
          <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Megaphone className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-foreground mb-0.5">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {content}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
