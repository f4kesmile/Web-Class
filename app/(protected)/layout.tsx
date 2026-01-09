import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { UserButton } from "@/components/auth/user-button";
import { AnimatedThemeToggler } from "@/components/ui/themeToggler";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GridBackground } from "@/components/ui/grid-background";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="relative min-h-screen w-full bg-background">
          <div className="absolute inset-0 z-0">
            <GridBackground className="h-full w-full items-start justify-start" />
          </div>
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-sm font-medium text-muted-foreground hidden md:block">
                Dashboard
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-4 px-4">
              <AnimatedThemeToggler />
              <UserButton user={user} />
            </div>
          </header>
          <main className="relative z-10 flex flex-1 flex-col p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
