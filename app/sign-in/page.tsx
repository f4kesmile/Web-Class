"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Github,
  Loader2,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";
import { AuthLayout } from "@/components/auth/auth-layout";
import { User, Role } from "@prisma/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn.email(
      { email, password, rememberMe },
      {
        onSuccess: async () => {
          const session = await authClient.getSession();
          if (session.data?.user) {
            const user = session.data.user as unknown as User;

            toast.success(`Selamat datang kembali, ${user.name}!`);

            if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
              router.push("/dashboard");
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal masuk. Cek email/password.");
        },
      }
    );
    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      description="Masuk ke akun Anda untuk melanjutkan."
      icon={<LogIn className="w-6 h-6" />}
      footer={
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Daftar
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
          <div className="flex justify-between items-center">
            <Label>Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Lupa password?
            </Link>
          </div>
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(c) => setRememberMe(!!c)}
          />
          <Label htmlFor="remember" className="cursor-pointer text-sm">
            Ingat saya
          </Label>
        </div>
      </div>

      <Button className="w-full h-11" onClick={handleSignIn} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center">
            Masuk <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        )}
      </Button>
    </AuthLayout>
  );
}
