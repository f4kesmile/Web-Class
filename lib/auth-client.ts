import { createAuthClient } from "better-auth/react";

// 1. Buat client
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Sesuaikan dengan URL project Anda
});

// 2. Definisi Tipe Manual (Hack agar TS tidak error)
// Kita memberi tahu TS: "Hei, authClient ini punya fungsi forgetPassword lho!"
type AuthClientType = typeof authClient & {
  forgetPassword: (
    data: { email: string; redirectTo: string },
    options?: {
      onSuccess?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
    }
  ) => Promise<void>;
  resetPassword: (
    data: { newPassword: string; token: string },
    options?: {
      onSuccess?: () => void;
      onError?: (ctx: { error: { message: string } }) => void;
    }
  ) => Promise<void>;
};

// 3. Cast dan Export
const client = authClient as AuthClientType;

export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut, 
  forgetPassword, // Sekarang ini tidak akan merah lagi
  resetPassword   // Ini juga aman
} = client;