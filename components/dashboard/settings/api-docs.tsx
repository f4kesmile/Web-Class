"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";

export type ApiDocsProps = {
  baseUrl: string;
};

type EndpointItem = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  desc: string;
};

export function ApiDocs({ baseUrl }: ApiDocsProps) {
  const safeBaseUrl = baseUrl.trim() || "http://localhost:3000";

  const endpoints = useMemo<EndpointItem[]>(
    () => [
      {
        method: "GET",
        path: "/api/users/me",
        desc: "Ambil profil user yang sedang login",
      },
      { method: "GET", path: "/api/agenda", desc: "Ambil agenda" },
      { method: "GET", path: "/api/schedules", desc: "Ambil jadwal" },
      { method: "GET", path: "/api/officers", desc: "Ambil struktur pengurus" },
      { method: "GET", path: "/api/gallery", desc: "Ambil galeri" },
    ],
    []
  );

  return (
    <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur p-4 sm:p-6">
      <div>
        <p className="text-base font-semibold">API Docs</p>
        <p className="text-sm text-muted-foreground mt-1">
          Base URL: <span className="font-medium">{safeBaseUrl}</span>
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {endpoints.map(({ method, path, desc }) => (
          <div key={`${method}-${path}`} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {method} {path}
              </p>
              <p className="text-xs text-muted-foreground">
                {safeBaseUrl + path}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{desc}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
