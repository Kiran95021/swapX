import { motion } from "framer-motion";
import { Heart, Repeat, Gift, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

interface ItemCardProps {
  id: string;
  title: string;
  price: number | null;
  type: 'sell' | 'swap' | 'free' | 'rent';
  imageUrl: string;
  sellerName?: string;
  category?: string;
  rentalPricePerDay?: number | null;
  onClick?: () => void;
  index?: number;
  isFavorited?: boolean;
  onFavoriteClick?: (e: React.MouseEvent) => void;
}

const typeConfig = {
  sell: { icon: DollarSign, label: 'For Sale', color: 'bg-primary text-primary-foreground' },
  swap: { icon: Repeat, label: 'Swap', color: 'bg-accent text-accent-foreground' },
  free: { icon: Gift, label: 'Free', color: 'bg-success text-success-foreground' },
  rent: { icon: Clock, label: 'Rent', color: 'bg-warning text-warning-foreground' },
};

export function ItemCard({ 
  id, 
  title, 
  price, 
  type, 
  imageUrl, 
  sellerName, 
  category,
  rentalPricePerDay,
  onClick, 
  index = 0,
  isFavorited = false,
  onFavoriteClick
}: ItemCardProps) {
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
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type Badge */}
          <div className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm",
            config.color
          )}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </div>

          {/* Category Badge */}
          {category && (
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
              {category}
            </div>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all",
              isFavorited 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            )}
            onClick={onFavoriteClick}
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
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
            ) : type === 'rent' ? (
              <span className="text-warning font-bold text-lg">
                {formatCurrency(rentalPricePerDay || 0)}/day
              </span>
            ) : (
              <span className="text-foreground font-bold text-lg">{formatCurrency(price || 0)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
