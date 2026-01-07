import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return session.user as User;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

 
  if (!user) return redirect("/sign-in");

  if (user.isBanned) return redirect("/banned");

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return redirect("/dashboard");
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  
  if (!user) return redirect("/sign-in");
  if (user.isBanned) return redirect("/banned");

  if (user.role !== "SUPER_ADMIN") {

    return redirect("/dashboard"); 
  }

  return user;
}

export { auth };
