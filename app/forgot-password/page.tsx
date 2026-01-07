"use client";

import { useState } from "react";
import Link from "next/link";
import { forgetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

interface ErrorContext {
  error: {
    message: string;
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return;

    setLoading(true);

    await forgetPassword(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (ctx: ErrorContext) => {
          alert(ctx.error.message);
        },
      }
    );

    setLoading(false);
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Cek Email Anda"
        description={`Link reset telah dikirim ke ${email}`}
        icon={<CheckCircle2 className="w-6 h-6" />}
      >
        <div className="text-center pb-4">
          <p className="text-sm text-muted-foreground mb-6">
            Silakan periksa kotak masuk atau folder spam Anda untuk melanjutkan
            proses reset password.
          </p>
          <Link href="/sign-in">
            <Button variant="outline" className="w-full h-11">
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa Password"
      description="Masukkan email untuk mereset password."
      icon={<KeyRound className="w-6 h-6" />}
      footer={
        <Link
          href="/sign-in"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Login
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="pl-10 h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full h-11"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Kirim Link Reset"
          )}
        </Button>
      </div>
    </AuthLayout>
  );
}
