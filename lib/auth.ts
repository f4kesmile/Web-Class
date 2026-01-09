import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User, Role } from "@prisma/client";
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return session.user as unknown as User;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) return redirect("/sign-in");

  if (user.isBanned) return redirect("/banned");

  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    return redirect("/dashboard");
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  
  if (!user) return redirect("/sign-in");
  if (user.isBanned) return redirect("/banned");

  if (user.role !== Role.SUPER_ADMIN) {
    return redirect("/dashboard"); 
  }

  return user;
}

export { auth };