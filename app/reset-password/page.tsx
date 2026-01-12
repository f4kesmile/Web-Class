"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Harap isi semua kolom password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    await resetPassword(
      {
        newPassword: password,
        token: token,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password berhasil diubah!");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal mereset password.");
        },
      }
    );

    setLoading(false);
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Berhasil Diubah"
        description="Silakan login dengan password baru Anda."
        icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
      >
        <div className="space-y-4">
          <Link href="/sign-in">
            <Button className="w-full h-11">Login Sekarang</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (errorParam === "invalid_token") {
    return (
      <AuthLayout
        title="Link Tidak Valid"
        description="Link reset password ini sudah kadaluarsa atau tidak valid."
        icon={<AlertCircle className="w-6 h-6 text-red-500" />}
      >
        <div className="space-y-4">
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full h-11">
              Kirim Ulang Link
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" className="w-full h-11">
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Masukkan password baru untuk akun Anda."
      icon={<Lock className="w-6 h-6" />}
      footer={
        <Link
          href="/sign-in"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Batal
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password Baru</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-11"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Ubah Password"
          )}
        </Button>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
