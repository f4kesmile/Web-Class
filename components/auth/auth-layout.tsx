import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({
  children,
  title,
  description,
  icon,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        <Card className="border border-border shadow-xl shadow-black/5 dark:shadow-black/40 bg-card/90 backdrop-blur-md rounded-xl">
          <CardHeader className="space-y-1 text-center pb-2 pt-8">
            {icon && (
              <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10 bg-primary text-primary-foreground">
                {icon}
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">{children}</CardContent>

          {footer && (
            <CardFooter className="justify-center pb-6">{footer}</CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
