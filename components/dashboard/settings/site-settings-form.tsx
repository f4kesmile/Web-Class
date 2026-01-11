"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Globe,
  GraduationCap,
  Calendar,
  Mail,
  AtSign,
  Instagram,
  Settings2,
} from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SiteSettingsProps {
  id: string;
  siteName: string;
  description: string | null;
  className: string;
  semester: string;
  academicYear: string;
  supportEmail: string | null;
  instagram: string | null;
  whatsapp: string | null;
  emailSender: string | null;
  updatedAt: Date;
}

export function SiteSettingsForm({
  initialData,
}: {
  initialData: SiteSettingsProps | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateSiteSettings(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
      return;
    }

    toast.error(res.message);
  }

  return (
    <Card
      className={cn(
        "w-full overflow-hidden transition-all duration-300",
        "border border-zinc-200 dark:border-zinc-800",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
        "bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md",
        "rounded-3xl"
      )}
    >
      <CardHeader className="pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">
              Identitas & Konfigurasi
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Atur informasi utama website kelas Anda di sini.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Globe className="w-3.5 h-3.5" /> Nama Situs
              </Label>
              <Input
                name="siteName"
                defaultValue={initialData?.siteName || "Web Kelas"}
                placeholder="Contoh: Portal Kelas 4C"
                required
                className="h-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5" /> Nama Kelas
              </Label>
              <Input
                name="className"
                defaultValue={initialData?.className || "Informatika 4C"}
                placeholder="Contoh: Teknik Informatika A"
                required
                className="h-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" /> Semester
              </Label>
              <Input
                name="semester"
                defaultValue={initialData?.semester || "4"}
                placeholder="Contoh: 4 (Genap)"
                required
                className="h-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> Email Support
              </Label>
              <Input
                name="supportEmail"
                type="email"
                defaultValue={initialData?.supportEmail || ""}
                placeholder="help@kelas.com"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent my-2" />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <AtSign className="w-3.5 h-3.5" /> Email Pengirim (SMTP)
              </Label>
              <Input
                name="emailSender"
                type="email"
                defaultValue={initialData?.emailSender || ""}
                placeholder="noreply@kelas.com"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Instagram className="w-3.5 h-3.5" /> Instagram Kelas
              </Label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden h-10">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm bg-transparent">
                  instagram.com/
                </span>
                <input
                  type="text"
                  name="instagram"
                  defaultValue={
                    initialData?.instagram?.replace(
                      "https://instagram.com/",
                      ""
                    ) || ""
                  }
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-foreground placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 focus:bg-background/50 transition-colors outline-none"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 px-6 py-5">
          <p className="text-xs text-muted-foreground text-center sm:text-left flex-1 order-2 sm:order-1">
            Pastikan data yang diisi valid sebelum menyimpan.
          </p>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
