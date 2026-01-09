import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { MotionButton } from "@/components/ui/motion-button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6"
      >
        <Icon className="h-10 w-10 text-muted-foreground" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <MotionButton variant="primary" onClick={onAction}>
          {actionLabel}
        </MotionButton>
      )}
    </motion.div>
  );
}
