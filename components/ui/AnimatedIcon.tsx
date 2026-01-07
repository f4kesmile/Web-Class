"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon; // Menerima komponen Icon dari Lucide
  className?: string;
}

export const AnimatedIcon = ({ icon: Icon, className }: AnimatedIconProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 15 }} // Animasi saat hover: membesar & miring
      whileTap={{ scale: 0.9 }} // Animasi saat klik: mengecil
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="inline-flex items-center justify-center"
    >
      <Icon className={className} />
    </motion.div>
  );
};
