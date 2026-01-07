"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Loader2,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) return alert("Password tidak cocok!");
    setLoading(true);

    await signUp.email(
      { email, password, name },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (ctx) => alert(ctx.error.message),
      }
    );
    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await signIn.social({ provider, callbackURL: "/dashboard" });
  };

  return (
    <AuthLayout
      title="Buat Akun"
      description="Mulai perjalanan belajar Anda di sini."
      icon={<Sparkles className="w-6 h-6" />}
      footer={
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Masuk
          </Link>
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-lg"
          onClick={() => handleSocialLogin("google")}
        >
          <GoogleIcon className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-lg"
          onClick={() => handleSocialLogin("github")}
        >
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <div className="relative group">
            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Nama Anda"
              className="pl-10 h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              type="email"
              placeholder="nama@email.com"
              className="pl-10 h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
          <Label>Konfirmasi Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Ulangi password"
              className="pl-10 h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button className="w-full h-11" onClick={handleSignUp} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center">
            Daftar Sekarang <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        )}
      </Button>
    </AuthLayout>
  );
}
