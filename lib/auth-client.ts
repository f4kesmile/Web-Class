import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});

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

const client = authClient as AuthClientType;

export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut, 
  forgetPassword,
  resetPassword
} = client;