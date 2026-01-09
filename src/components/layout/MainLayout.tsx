import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

interface MainLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function MainLayout({ 
  children, 
  showBottomNav = true,
  className = "" 
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${showBottomNav ? 'pb-24' : ''} ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
