"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { useRouter } from "next/navigation";

export function SiteSettingsForm({ initialData }: { initialData: any }) {
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
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identitas & Konfigurasi</CardTitle>
        <CardDescription>
          Ubah nama situs, semester aktif, dan informasi kontak.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Situs</Label>
              <Input
                name="siteName"
                defaultValue={initialData?.siteName || "Web Kelas"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Kelas</Label>
              <Input
                name="className"
                defaultValue={initialData?.className || "Informatika 4C"}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Semester Saat Ini</Label>
              <Input
                name="semester"
                defaultValue={initialData?.semester || "4"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email Support (Kontak)</Label>
              <Input
                name="supportEmail"
                defaultValue={initialData?.supportEmail || ""}
                placeholder="help@kelas.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Pengirim Sistem (SMTP)</Label>
            <Input
              name="emailSender"
              defaultValue={initialData?.emailSender || ""}
              placeholder="noreply@kelas.com"
            />
            <p className="text-[10px] text-muted-foreground">
              Email ini akan muncul sebagai pengirim notifikasi otomatis.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Link Instagram</Label>
            <Input
              name="instagram"
              defaultValue={initialData?.instagram || ""}
              placeholder="https://instagram.com/..."
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="ml-auto bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}{" "}
            Simpan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
