"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Ban, ShieldCheck } from "lucide-react"; // Hapus Loader2 jika tidak dipakai di sini
import { updateUserRole, toggleBanUser, inviteUser } from "@/actions/settings";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SendReminderDialog } from "./send-reminder-dialog"; // 1. IMPORT DIALOG BARU

export function UserManagementClient({
  users,
  currentUserRole,
}: {
  users: any[];
  currentUserRole: string;
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  // ... (Fungsi handleRoleChange, handleBan, handleInvite TETAP SAMA seperti sebelumnya) ...
  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingAction(userId);
    const res = await updateUserRole(userId, newRole as Role);
    setLoadingAction(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else toast.error(res.message);
  };

  const handleBan = async (userId: string) => {
    if (!confirm("Ubah status BAN user ini?")) return;
    setLoadingAction(userId);
    const res = await toggleBanUser(userId);
    setLoadingAction(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else toast.error(res.message);
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email) return;
    toast.info("Mengirim undangan...");
    const res = await inviteUser(email);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    (e.target as HTMLFormElement).reset();
  };
  // ... (Sampai sini sama) ...

  return (
    <div className="space-y-6">
      {/* INVITE SECTION (Tetap Sama) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4" /> Undang Pengguna Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              name="email"
              type="email"
              placeholder="Masukkan email mahasiswa..."
              required
            />
            <Button type="submit" variant="secondary">
              Kirim Undangan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* USER LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Total {users.length} pengguna terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors"
              >
                {/* INFO USER */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={u.image} />
                    <AvatarFallback>
                      {u.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{u.name}</p>
                      {u.isBanned && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] px-1 py-0 h-5"
                        >
                          BANNED
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  {/* 2. TOMBOL KIRIM PESAN (BARU) */}
                  {/* Muncul untuk semua Admin */}
                  <SendReminderDialog
                    userId={u.id}
                    userName={u.name}
                    email={u.email}
                  />

                  {/* ROLE SELECTOR */}
                  <div className="w-32">
                    <Select
                      defaultValue={u.role}
                      onValueChange={(val) => handleRoleChange(u.id, val)}
                      disabled={
                        !isSuperAdmin ||
                        loadingAction === u.id ||
                        u.role === "SUPER_ADMIN"
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* BAN BUTTON */}
                  {isSuperAdmin && u.role !== "SUPER_ADMIN" && (
                    <Button
                      variant={u.isBanned ? "outline" : "destructive"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleBan(u.id)}
                      disabled={loadingAction === u.id}
                      title={u.isBanned ? "Aktifkan User" : "Ban User"}
                    >
                      {u.isBanned ? (
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <Ban className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
