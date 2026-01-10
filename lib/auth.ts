import { auth } from "@/lib/auth-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role, type User as PrismaUser } from "@prisma/client";

export type AuthUser = Pick<
  PrismaUser,
  "id" | "name" | "email" | "image" | "role" | "isBanned"
>;

async function buildAuthHeadersFromCookies(): Promise<HeadersInit> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(
      (c: { name: string; value: string }) =>
        `${c.name}=${encodeURIComponent(c.value)}`
    )
    .join("; ");

  return { cookie: cookieHeader };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth.api.getSession({
    headers: await buildAuthHeadersFromCookies(),
  });

  const sessionUserId = session?.user?.id;
  if (!sessionUserId) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isBanned: true,
    },
  });

  return user ?? null;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.isBanned) redirect("/banned");

  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireSuperAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.isBanned) redirect("/banned");

  if (user.role !== Role.SUPER_ADMIN) {
    redirect("/dashboard");
  }

  return user;
}

export { auth };
