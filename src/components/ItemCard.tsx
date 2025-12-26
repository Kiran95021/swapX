import { motion } from "framer-motion";
import { Heart, Repeat, Gift, DollarSign, Clock, Sparkles, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import { useState } from "react";

interface ItemCardProps {
  id: string;
  title: string;
  price: number | null;
  rentalPricePerDay?: number | null;
  type: 'sell' | 'swap' | 'free' | 'rent';
  imageUrl: string;
  sellerName?: string;
  category?: string;
  onClick?: () => void;
  index?: number;
  isFavorited?: boolean;
  onFavoriteClick?: (e: React.MouseEvent) => void;
}

const typeConfig = {
  sell: { 
    icon: DollarSign, 
    label: 'Sale', 
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30'
  },
  swap: { 
    icon: Repeat, 
    label: 'Swap', 
    gradient: 'from-cyan-400 to-blue-500',
    glow: 'shadow-cyan-500/30'
  },
  free: { 
    icon: Gift, 
    label: 'Free', 
    gradient: 'from-emerald-400 to-green-500',
    glow: 'shadow-emerald-500/30'
  },
  rent: { 
    icon: Clock, 
    label: 'Rent', 
    gradient: 'from-orange-400 to-amber-500',
    glow: 'shadow-orange-500/30'
  },
};

export function ItemCard({ 
  id, 
  title, 
  price, 
  rentalPricePerDay, 
  type, 
  imageUrl, 
  sellerName, 
  category, 
  onClick, 
  index = 0, 
  isFavorited = false, 
  onFavoriteClick 
}: ItemCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer perspective-1000"
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl bg-card transition-all duration-500",
        "border border-border/50 hover:border-primary/30",
        "shadow-soft hover:shadow-elevated",
        isHovered && "glow-primary"
      )}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse shimmer" />
          )}
          
          {/* Image */}
          <motion.img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          
          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none"
          />
          
          {/* Type Badge */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.06 + 0.2 }}
            className={cn(
              "absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white",
              `bg-gradient-to-r ${config.gradient}`,
              `shadow-lg ${config.glow}`
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </motion.div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.85 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isFavorited || isHovered ? 1 : 0.7,
              scale: 1,
              y: isFavorited ? [0, -3, 0] : 0
            }}
            className={cn(
              "absolute top-3 right-3 h-10 w-10 rounded-xl flex items-center justify-center transition-all",
              isFavorited 
                ? "bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30" 
                : "glass hover:bg-white/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick?.(e);
            }}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isFavorited 
                  ? "fill-white text-white" 
                  : "text-white"
              )} 
            />
          </motion.button>

          {/* Quick View Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl glass flex items-center justify-center gap-2 text-sm font-semibold text-white backdrop-blur-xl"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </motion.button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category Tag */}
          {category && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
            >
              {category}
            </motion.span>
          )}
          
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Seller */}
          {sellerName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              by <span className="font-medium text-foreground">{sellerName}</span>
            </p>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            {type === 'free' ? (
              <span className="text-success font-bold text-lg flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Free
              </span>
            ) : type === 'swap' ? (
              <span className="text-secondary font-semibold flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                Open to swap
              </span>
            ) : type === 'rent' ? (
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-lg">
                  {formatPrice(rentalPricePerDay || 0)}
                </span>
                <span className="text-xs text-muted-foreground">per day</span>
              </div>
            ) : (
              <span className="text-foreground font-bold text-xl">
                {formatPrice(price || 0)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}