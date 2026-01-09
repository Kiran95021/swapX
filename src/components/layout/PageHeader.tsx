import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightContent?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showBack = true, 
  rightContent,
  onBack 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 glass-strong border-b border-border/50"
    >
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="h-10 w-10 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {rightContent && (
            <div className="flex items-center gap-2">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
