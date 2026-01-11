"use client";

import React, { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  banUser,
  unbanUser,
  toggleBanUser,
  updateUserRole,
} from "@/actions/settings";

export interface UserProps {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isBanned: boolean;
  image: string | null;
}

interface UserManagementClientProps {
  users: UserProps[];
  currentUserRole: Role;
}

type RoleOption = {
  value: Role;
  label: string;
};

export function UserManagementClient({
  users,
  currentUserRole,
}: UserManagementClientProps) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState<string>("");

  const roleOptions = useMemo<RoleOption[]>(
    () => [
      { value: Role.USER, label: "USER" },
      { value: Role.ADMIN, label: "ADMIN" },
      { value: Role.SUPER_ADMIN, label: "SUPER_ADMIN" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(({ name, email }) => {
      const n = (name ?? "").toLowerCase();
      const e = email.toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [users, search]);

  const canManage =
    currentUserRole === Role.ADMIN || currentUserRole === Role.SUPER_ADMIN;
  const canManageRole = currentUserRole === Role.SUPER_ADMIN;

  const onChangeRole = (userId: string, nextRole: Role) => {
    if (!canManageRole) return;

    startTransition(async () => {
      const result = await updateUserRole(userId, nextRole);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  const onToggleBan = (userId: string) => {
    if (!canManageRole) return;

    startTransition(async () => {
      const result = await toggleBanUser(userId);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  const onBan = (userId: string) => {
    if (!canManageRole) return;

    startTransition(async () => {
      const result = await banUser(userId);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  const onUnban = (userId: string) => {
    if (!canManageRole) return;

    startTransition(async () => {
      const result = await unbanUser(userId);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  if (!canManage) {
    return (
      <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur p-6 text-sm text-muted-foreground">
        Anda tidak memiliki akses untuk mengelola user.
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl border bg-background/70 backdrop-blur p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold">Manajemen User</p>
          <p className="text-sm text-muted-foreground">
            Kelola role dan status user.
          </p>
        </div>

        <input
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          placeholder="Cari nama / email"
          className="h-10 w-[180px] sm:w-[240px] rounded-xl border bg-background px-3 text-sm outline-none"
        />
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map(({ id, name, email, role, isBanned, image }) => {
          const displayName = name ?? "Unknown";
          return (
            <div
              key={id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-3 sm:p-4",
                isBanned ? "opacity-80" : "opacity-100"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-muted">
                  {image ? (
                    <Image
                      src={image}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isBanned ? (
                  <Badge variant="destructive">BANNED</Badge>
                ) : (
                  <Badge variant="secondary">ACTIVE</Badge>
                )}

                <Select
                  value={role}
                  onValueChange={(value) => onChangeRole(id, value as Role)}
                  disabled={!canManageRole || isPending}
                >
                  <SelectTrigger className="h-10 w-[150px] rounded-xl">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl"
                  disabled={!canManageRole || isPending}
                  onClick={() => onToggleBan(id)}
                >
                  Toggle
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="h-10 rounded-xl"
                  disabled={!canManageRole || isPending || isBanned}
                  onClick={() => onBan(id)}
                >
                  Ban
                </Button>

                <Button
                  type="button"
                  className="h-10 rounded-xl"
                  disabled={!canManageRole || isPending || !isBanned}
                  onClick={() => onUnban(id)}
                >
                  Unban
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
