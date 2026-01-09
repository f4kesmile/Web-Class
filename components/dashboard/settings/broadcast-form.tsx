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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { createBroadcast } from "@/actions/settings";
import { useRouter } from "next/navigation";

export function BroadcastForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("Kirim pengumuman ini ke semua user?")) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createBroadcast(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Pengumuman (Broadcast)</CardTitle>
        <CardDescription>
          Pesan ini akan muncul di dashboard semua pengguna.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judul Pengumuman</Label>
            <Input
              name="title"
              placeholder="Contoh: Perubahan Jadwal UTS"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Isi Pesan</Label>
            <Textarea
              name="content"
              placeholder="Tulis detail pengumuman..."
              rows={5}
              required
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
              <Send className="w-4 h-4 mr-2" />
            )}{" "}
            Kirim Broadcast
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
