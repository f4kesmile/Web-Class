"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Braces, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ApiDocsProps = {
  baseUrl: string;
  embedded?: boolean;
};

type EndpointItem = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "ANY";
  path: string;
  desc: string;
};

async function copyText(value: string) {
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

function useCopied(durationMs = 900) {
  const [copied, setCopied] = useState(false);

  const trigger = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), durationMs);
  };

  return { copied, trigger };
}

function CopyMenu({ fullUrl, path }: { fullUrl: string; path: string }) {
  const urlCopied = useCopied();
  const pathCopied = useCopied();

  const onCopyUrl = async () => {
    const ok = await copyText(fullUrl);
    if (ok) {
      toast.success("Tersalin ke clipboard");
      urlCopied.trigger();
    } else {
      toast.error("Gagal menyalin");
    }
  };

  const onCopyPath = async () => {
    const ok = await copyText(path);
    if (ok) {
      toast.success("Tersalin ke clipboard");
      pathCopied.trigger();
    } else {
      toast.error("Gagal menyalin");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 rounded-2xl transition",
            urlCopied.copied || pathCopied.copied
              ? "border-primary/40 bg-primary/5"
              : ""
          )}
          title="Salin"
        >
          {urlCopied.copied || pathCopied.copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="rounded-2xl">
        <DropdownMenuItem onClick={onCopyUrl} className="gap-2">
          {urlCopied.copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {urlCopied.copied ? "Tersalin" : "Salin URL"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onCopyPath} className="gap-2">
          {pathCopied.copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {pathCopied.copied ? "Tersalin" : "Salin Path"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ApiDocsComponent({ baseUrl, embedded = false }: ApiDocsProps) {
  const [origin, setOrigin] = useState<string>(() => baseUrl.trim());
  const baseCopied = useCopied();

  useEffect(() => {
    if (origin) return;
    setOrigin(window.location.origin);
  }, [origin]);

  const endpoints = useMemo<EndpointItem[]>(
    () => [
      {
        method: "GET",
        path: "/api/users/me",
        desc: "Ambil profil user yang sedang login",
      },
      { method: "GET", path: "/api/agenda", desc: "Ambil daftar agenda" },
      { method: "GET", path: "/api/gallery", desc: "Ambil galeri" },
      { method: "GET", path: "/api/officers", desc: "Ambil struktur pengurus" },
      { method: "GET", path: "/api/schedules", desc: "Ambil jadwal" },
      {
        method: "ANY",
        path: "/api/auth/[...all]",
        desc: "Endpoint auth (catch-all)",
      },
    ],
    []
  );

  const onCopyBase = async () => {
    const ok = await copyText(origin);
    if (ok) {
      toast.success("Base URL tersalin");
      baseCopied.trigger();
    } else {
      toast.error("Gagal menyalin");
    }
  };

  return (
    <Card
      className={cn(
        "w-full border bg-background/40 backdrop-blur-xl shadow-sm",
        embedded ? "rounded-3xl p-5 sm:p-6" : "rounded-2xl p-5"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl border bg-primary/10 text-primary flex items-center justify-center">
            <Braces className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-lg font-semibold">API Docs</p>
            <p className="text-sm text-muted-foreground mt-1">
              Base URL:{" "}
              <span className="font-medium break-all">
                {origin ? origin : "Mendeteksi URL..."}
              </span>
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={baseCopied.copied ? "default" : "outline"}
          className={cn(
            "h-11 rounded-2xl transition",
            baseCopied.copied
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          )}
          disabled={!origin}
          onClick={onCopyBase}
        >
          {baseCopied.copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {baseCopied.copied ? "Tersalin" : "Salin Base URL"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {endpoints.map(({ method, path, desc }) => {
          const fullUrl = origin ? `${origin}${path}` : path;

          return (
            <Card
              key={`${method}-${path}`}
              className="rounded-3xl border bg-background/60 backdrop-blur p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className="rounded-xl bg-primary/10 text-primary border border-primary/20"
                      variant="secondary"
                    >
                      {method}
                    </Badge>
                    <p className="text-sm font-semibold break-all">{path}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{desc}</p>
                </div>

                <CopyMenu fullUrl={fullUrl} path={path} />
              </div>

              <div className="mt-4 rounded-2xl border bg-background p-3">
                <p className="text-xs text-muted-foreground break-all">
                  {fullUrl}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

export default ApiDocsComponent;
export { ApiDocsComponent as ApiDocs };
