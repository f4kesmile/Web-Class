"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Role } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { banUser, unbanUser, updateUserRole } from "@/actions/settings";
import { SendReminderDialog } from "@/components/dashboard/settings/send-reminder-dialog";
import type { UpcomingAgendaRow } from "@/components/dashboard/settings/settings-tabs";
import { Ban, CheckCircle2, Shield, UserRound } from "lucide-react";

export type UserProps = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isBanned: boolean;
  image: string | null;
};

type RoleOption = {
  value: Role;
  label: string;
};

export type UserManagementClientProps = {
  users: UserProps[];
  currentUserRole: Role;
  currentUserId: string;
  upcomingAgendas: UpcomingAgendaRow[];
  immutableSuperAdminEmails: string[];
  embedded?: boolean;
};

function formatName(name: string | null) {
  return name?.trim() ? name : "Unknown";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isSuperAdmin(role: Role) {
  return role === Role.SUPER_ADMIN;
}

function isAdminOrSuper(role: Role) {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

function StatusPill({ isBanned }: { isBanned: boolean }) {
  if (isBanned) {
    return (
      <Badge variant="destructive" className="rounded-xl">
        BANNED
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="rounded-xl bg-primary/10 text-primary border border-primary/20"
    >
      ACTIVE
    </Badge>
  );
}

function RolePill({ role }: { role: Role }) {
  return (
    <Badge variant="outline" className="rounded-xl">
      {role}
    </Badge>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  const initials = getInitials(name);

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border bg-secondary/50 flex items-center justify-center">
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <span className="text-sm font-bold text-muted-foreground tracking-widest">
          {initials}
        </span>
      )}
    </div>
  );
}

const UserManagementClient = ({
  users,
  currentUserRole,
  currentUserId,
  upcomingAgendas,
  immutableSuperAdminEmails,
  embedded = false,
}: UserManagementClientProps) => {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const immutableSet = useMemo(() => {
    return new Set(immutableSuperAdminEmails.map(normalizeEmail));
  }, [immutableSuperAdminEmails]);

  const roleOptions = useMemo<RoleOption[]>(
    () => [
      { value: Role.USER, label: "USER" },
      { value: Role.ADMIN, label: "ADMIN" },
      { value: Role.SUPER_ADMIN, label: "SUPER_ADMIN" },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter(({ name, email }) => {
      const n = (name ?? "").toLowerCase();
      const e = email.toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [users, search]);

  const canView = isAdminOrSuper(currentUserRole);
  const canSensitive = isSuperAdmin(currentUserRole);

  const isImmutableTarget = (targetRole: Role, targetEmail: string) => {
    if (targetRole !== Role.SUPER_ADMIN) return false;
    return immutableSet.has(normalizeEmail(targetEmail));
  };

  const canEditRole = (
    targetId: string,
    targetRole: Role,
    targetEmail: string
  ) => {
    if (!canSensitive) return false;
    if (targetId === currentUserId) return false;
    if (isImmutableTarget(targetRole, targetEmail)) return false;
    return true;
  };

  const canBanToggle = (
    targetId: string,
    targetRole: Role,
    targetEmail: string
  ) => {
    if (!canSensitive) return false;
    if (targetId === currentUserId) return false;
    if (isImmutableTarget(targetRole, targetEmail)) return false;
    return true;
  };

  const onChangeRole = (userId: string, nextRole: Role) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, nextRole);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  const onBanOrUnban = (userId: string, isBanned: boolean) => {
    startTransition(async () => {
      const result = isBanned ? await unbanUser(userId) : await banUser(userId);
      toast[result.success ? "success" : "error"](result.message);
    });
  };

  if (!canView) {
    return (
      <Card
        className={cn(
          "w-full border bg-background/40 backdrop-blur-xl shadow-sm",
          embedded ? "rounded-3xl p-6" : "rounded-2xl p-6"
        )}
      >
        <p className="text-sm text-muted-foreground">
          Anda tidak memiliki akses untuk melihat manajemen user.
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card
        className={cn(
          "w-full border bg-background/40 backdrop-blur-xl shadow-sm",
          embedded ? "rounded-3xl p-5 sm:p-6" : "rounded-2xl p-5"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl border bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Users</p>
              <p className="text-sm text-muted-foreground">
                Admin hanya kirim reminder. Super Admin mengelola role dan ban.
              </p>
            </div>
          </div>

          <Input
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            placeholder="Cari nama / email"
            className="h-11 rounded-2xl w-full sm:w-[340px]"
          />
        </div>

        {!canSensitive ? (
          <div className="mt-4 rounded-2xl border bg-background/60 backdrop-blur p-4">
            <p className="text-sm font-medium">Mode Admin</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kontrol role dan ban disembunyikan.
            </p>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {filteredUsers.map(({ id, name, email, role, isBanned, image }) => {
          const displayName = formatName(name);
          const immutableTarget = isImmutableTarget(role, email);
          const roleEditable = canEditRole(id, role, email);
          const banAllowed = canBanToggle(id, role, email);

          return (
            <Card
              key={id}
              className="w-full rounded-3xl border bg-background/40 backdrop-blur-xl shadow-sm p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={displayName} image={image} />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {email}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusPill isBanned={isBanned} />
                      <RolePill role={role} />
                      {immutableTarget ? (
                        <Badge
                          variant="secondary"
                          className="rounded-xl bg-primary/10 text-primary border border-primary/20"
                        >
                          IMMUTABLE
                        </Badge>
                      ) : null}
                      {id === currentUserId ? (
                        <Badge variant="outline" className="rounded-xl">
                          YOU
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                  {canSensitive ? (
                    <Select
                      value={role}
                      onValueChange={(value) => onChangeRole(id, value as Role)}
                      disabled={!roleEditable || isPending}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl lg:w-[220px]">
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
                  ) : null}

                  <div className="flex items-center gap-3">
                    {id !== currentUserId ? (
                      <SendReminderDialog
                        userId={id}
                        userName={displayName}
                        email={email}
                        upcomingAgendas={upcomingAgendas}
                      />
                    ) : null}

                    {canSensitive ? (
                      <Button
                        type="button"
                        variant={isBanned ? "outline" : "destructive"}
                        className={cn(
                          "h-11 w-11 p-0 rounded-2xl",
                          isBanned
                            ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                            : ""
                        )}
                        disabled={!banAllowed || isPending}
                        onClick={() => onBanOrUnban(id, isBanned)}
                        title={
                          !banAllowed
                            ? immutableTarget
                              ? "Target tidak bisa disentuh"
                              : id === currentUserId
                              ? "Tidak bisa membanned diri sendiri"
                              : "Tidak diizinkan"
                            : isBanned
                            ? "Unban"
                            : "Ban"
                        }
                      >
                        {isBanned ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Ban className="h-5 w-5" />
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredUsers.length === 0 ? (
          <Card className="w-full rounded-3xl border bg-background/40 backdrop-blur-xl shadow-sm p-6">
            <p className="text-sm text-muted-foreground">
              User tidak ditemukan.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export { UserManagementClient };
export default UserManagementClient;
