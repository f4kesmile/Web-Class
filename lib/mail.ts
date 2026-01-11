import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    const settings = await prisma.siteSettings.findFirst();

    const senderName = settings?.siteName || "Web Kelas";
    const senderEmail = settings?.emailSender || process.env.SMTP_USER;
    const replyToAddress = settings?.supportEmail || senderEmail;

    const fromAddress = `"${senderName}" <${senderEmail}>`;

    await transporter.sendMail({
      from: fromAddress, 
      replyTo: replyToAddress,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("SMTP Error:", error); 
    return { success: false, error };
  }
}