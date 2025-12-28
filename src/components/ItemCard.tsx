import { motion } from "framer-motion";
import { Heart, Repeat, Gift, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  id: string;
  title: string;
  price: number | null;
  type: 'sell' | 'swap' | 'free';
  imageUrl: string;
  sellerName?: string;
  onClick?: () => void;
  index?: number;
}

const typeConfig = {
  sell: { icon: DollarSign, label: 'For Sale', color: 'bg-primary text-primary-foreground' },
  swap: { icon: Repeat, label: 'Swap', color: 'bg-accent text-accent-foreground' },
  free: { icon: Gift, label: 'Free', color: 'bg-success text-success-foreground' },
};

export function ItemCard({ id, title, price, type, imageUrl, sellerName, onClick, index = 0 }: ItemCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Type Badge */}
          <div className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold",
            config.color
          )}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          {sellerName && (
            <p className="text-sm text-muted-foreground mt-0.5">by {sellerName}</p>
          )}
          <div className="mt-2">
            {type === 'free' ? (
              <span className="text-success font-bold text-lg">Free</span>
            ) : type === 'swap' ? (
              <span className="text-accent-foreground font-semibold">Open to swap</span>
            ) : (
              <span className="text-foreground font-bold text-lg">${price?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
