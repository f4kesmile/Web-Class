import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  emailAndPassword: {  
    enabled: true,
    requireEmailVerification: false, 
    async sendResetPassword({ url, user }) {
        if (!user || !user.email) return;

        const transporter = nodemailer.createTransport({
          service: "gmail", 
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: '"KelasPintar Support" <no-reply@kelaspintar.com>',
          to: user.email, 
          subject: "Reset Password Anda",
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Reset Password</h1>
              <p>Halo ${user.name ?? "User"},</p>
              <p>Kami menerima permintaan untuk mereset password akun KelasPintar Anda.</p>
              <p>Klik tombol di bawah ini untuk membuat password baru:</p>
              <a href="${url}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
              <p>Jika Anda tidak meminta ini, abaikan saja email ini.</p>
            </div>
          `,
        });
    },
  },
  socialProviders: {
     google: {
       clientId: process.env.GOOGLE_CLIENT_ID as string,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
     },
     github: {
       clientId: process.env.GITHUB_CLIENT_ID as string,
       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
     } 
  }
});