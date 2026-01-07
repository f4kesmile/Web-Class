"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client"; // Client Auth Better Auth
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function UserButton({ user }: UserButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in"); // Redirect ke login setelah logout
        },
      },
    });
  };

  // Ambil inisial nama (Misal: "Dimas" -> "D")
  const initials = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-slate-700">
            {/* Tampilkan gambar jika ada, jika null pakai fallback */}
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-slate-900 border-slate-800 text-slate-200"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.name}
            </p>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />

        {/* Menu Item Profil (Opsional) */}
        <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white">
          <UserIcon className="mr-2 h-4 w-4" />
          Profil Saya
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-800" />

        {/* Tombol Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 cursor-pointer focus:bg-red-900/20 focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
