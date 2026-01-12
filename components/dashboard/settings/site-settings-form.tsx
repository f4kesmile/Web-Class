"use client";

import { useState, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AtSign,
  Calendar,
  GraduationCap,
  Instagram,
  Loader2,
  Mail,
  Save,
  Settings2,
  Globe,
} from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SiteSettingsProps = {
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
};

type SiteSettingsFormProps = {
  initialData: SiteSettingsProps | null;
  embedded?: boolean;
};

export function SiteSettingsForm({
  initialData,
  embedded,
}: SiteSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateSiteSettings(formData);

    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
      return;
    }

    toast.error(result.message);
  }

  return (
    <Card
      className={cn(
        "w-full border bg-background/70 backdrop-blur overflow-hidden",
        embedded ? "rounded-3xl" : "rounded-3xl"
      )}
    >
      <CardHeader className="pb-5">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl border bg-primary/10 text-primary flex items-center justify-center">
            <Settings2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg">Pengaturan Umum</CardTitle>
            <CardDescription className="text-sm">
              Konfigurasikan identitas situs dan informasi utama kelas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Globe className="h-3.5 w-3.5" /> Nama Situs
              </Label>
              <Input
                name="siteName"
                defaultValue={initialData?.siteName ?? "Web Kelas"}
                placeholder="Contoh: Portal Kelas 4C"
                required
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> Nama Kelas
              </Label>
              <Input
                name="className"
                defaultValue={initialData?.className ?? "Informatika 4C"}
                placeholder="Contoh: Teknik Informatika A"
                required
                className="h-11 rounded-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Semester
              </Label>
              <Input
                name="semester"
                defaultValue={initialData?.semester ?? "4"}
                placeholder="Contoh: 4 (Genap)"
                required
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> Email Support
              </Label>
              <Input
                name="supportEmail"
                type="email"
                defaultValue={initialData?.supportEmail ?? ""}
                placeholder="help@kelas.com"
                className="h-11 rounded-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <AtSign className="h-3.5 w-3.5" /> Email Pengirim
              </Label>
              <Input
                name="emailSender"
                type="email"
                defaultValue={initialData?.emailSender ?? ""}
                placeholder="noreply@kelas.com"
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </Label>

              <div
                className={cn(
                  "h-11 rounded-2xl border bg-background flex overflow-hidden",
                  "focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/30"
                )}
              >
                <span className="flex items-center px-3 text-xs text-muted-foreground whitespace-nowrap">
                  instagram.com/
                </span>
                <input
                  name="instagram"
                  defaultValue={(initialData?.instagram ?? "").replace(
                    "https://instagram.com/",
                    ""
                  )}
                  placeholder="username"
                  className="w-full bg-transparent outline-none text-sm px-2"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t bg-background/40 px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Pastikan data valid sebelum menyimpan.
          </p>

          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default SiteSettingsForm;
