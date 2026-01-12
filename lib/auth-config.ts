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

        const senderEmail = process.env.SMTP_USER || "no-reply@example.com";
        const senderName = process.env.NEXT_PUBLIC_SITE_NAME || "Web Kelas Support";

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD, 
          },
        });
        
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: user.email, 
          subject: "Reset Password Akun",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .header { background-color: #18181b; padding: 24px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; }
                .content { padding: 32px; color: #3f3f46; line-height: 1.6; }
                .button { display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 24px; transition: opacity 0.2s; }
                .button:hover { opacity: 0.9; }
                .footer { padding: 24px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid #e4e4e7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Reset Password</h1>
                </div>
                <div class="content">
                  <p>Halo <strong>${user.name ?? "User"}</strong>,</p>
                  <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Jika ini memang Anda, silakan klik tombol di bawah ini:</p>
                  <div style="text-align: center;">
                    <a href="${url}" class="button" style="color: #ffffff;">Reset Password Saya</a>
                  </div>
                  <p style="margin-top: 24px; font-size: 14px; color: #71717a;">
                    Jika tombol di atas tidak berfungsi, salin dan tempel link berikut ke browser Anda:<br>
                    <span style="word-break: break-all; color: #2563eb;">${url}</span>
                  </p>
                  <p style="margin-top: 24px;">Jika Anda tidak meminta reset password, abaikan saja email ini. Akun Anda tetap aman.</p>
                </div>
                <div class="footer">
                  <p>Email ini dikirim secara otomatis. Mohon jangan membalas.</p>
                  <p>&copy; ${new Date().getFullYear()} ${senderName}. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
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