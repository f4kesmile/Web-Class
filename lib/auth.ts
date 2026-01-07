// lib/auth.ts
import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Tipe data untuk User (sesuai Schema Prisma baru)
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  role: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser() {
  // Better Auth butuh headers() untuk cek session di server component
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika tidak ada session, return null
  if (!session?.user) return null;

  // Better Auth sudah otomatis mengambil data dari database Prisma.
  // Jadi kita TIDAK PERLU query prisma manual lagi seperti di Clerk.
  return session.user as User;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  // 1. Cek Login
  if (!user) return redirect("/sign-in");

  // 2. Cek Banned (Ambil dari database langsung lewat session)
  if (user.isBanned) return redirect("/banned");

  // 3. Cek Role
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return redirect("/dashboard");
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  
  if (!user) return redirect("/sign-in");
  if (user.isBanned) return redirect("/banned");

  // Hanya SUPER_ADMIN yang boleh lewat
  if (user.role !== "SUPER_ADMIN") {
    // Redirect ke dashboard admin biasa atau dashboard user
    return redirect("/dashboard"); 
  }

  return user;
}

export { auth };
