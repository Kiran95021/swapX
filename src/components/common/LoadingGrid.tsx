import { motion } from "framer-motion";

interface LoadingGridProps {
  count?: number;
  columns?: string;
}

export function LoadingGrid({ 
  count = 8, 
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
}: LoadingGridProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="animate-pulse"
        >
          <div className="relative overflow-hidden rounded-2xl bg-card shadow-soft">
            <div className="aspect-[4/5] bg-secondary" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-secondary rounded-full w-3/4" />
              <div className="h-3 bg-secondary rounded-full w-1/2" />
              <div className="h-5 bg-secondary rounded-full w-1/3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
