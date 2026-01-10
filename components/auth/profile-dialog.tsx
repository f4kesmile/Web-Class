"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Camera, Save } from "lucide-react";
import { updateProfile } from "@/actions/profile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({
  user,
  open,
  onOpenChange,
}: ProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Upload Gambar (Preview Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      // Limit 2MB
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    // Jika ada preview baru, kirim sebagai 'image'. Jika tidak, jangan kirim (atau kirim string kosong)
    if (preview && preview !== user.image) {
      formData.set("image", preview);
    } else {
      formData.delete("image");
    }

    const result = await updateProfile(null, formData);

    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Area Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="w-24 h-24 border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-colors">
                <AvatarImage src={preview || ""} className="object-cover" />
                <AvatarFallback className="text-2xl bg-muted">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Overlay Icon Kamera */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <Camera className="w-8 h-8" />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Klik gambar untuk mengganti
            </p>
          </div>

          {/* Input Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                defaultValue={user?.name}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
