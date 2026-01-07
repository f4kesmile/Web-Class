"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpenCheck,
  Images,
  Users,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Jadwal Kuliah", url: "/dashboard/schedule", icon: CalendarDays },
  {
    title: "Tugas & Agenda",
    url: "/dashboard/assignments",
    icon: BookOpenCheck,
  },
  { title: "Galeri Kelas", url: "/dashboard/gallery", icon: Images },
  { title: "Pengurus", url: "/dashboard/officers", icon: Users },
  { title: "Pengaturan", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/sign-in") },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-20 border-b border-sidebar-border/50 flex items-center justify-center px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="
                w-full 
                hover:bg-sidebar-accent/50 
                transition-all 
                group-data-[collapsible=icon]:!w-full 
                group-data-[collapsible=icon]:!h-auto
                group-data-[collapsible=icon]:!p-2
                group-data-[collapsible=icon]:justify-center
              "
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all group-data-[collapsible=icon]:size-12 group-data-[collapsible=icon]:rounded-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-base">
                    KelasPintar
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Sistem Akademik
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="
                        h-10 
                        transition-all 
                        duration-200
                        group-data-[collapsible=icon]:!w-full
                        group-data-[collapsible=icon]:!size-auto
                        group-data-[collapsible=icon]:justify-center
                      "
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="!h-5 !w-5" />

                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="
                h-10 
                text-muted-foreground 
                hover:text-destructive hover:bg-destructive/10
                group-data-[collapsible=icon]:!w-full
                group-data-[collapsible=icon]:justify-center
              "
            >
              <LogOut className="!h-5 !w-5" />

              <span className="group-data-[collapsible=icon]:hidden">
                Keluar
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
