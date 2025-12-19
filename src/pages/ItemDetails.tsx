import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Shield, MessageCircle, DollarSign, Repeat, Gift } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MotionButton } from "@/components/ui/motion-button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Dummy data - in real app this would come from Supabase
const dummyItems: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Calculus Textbook (8th Ed)',
    description: 'Barely used calculus textbook. Some highlighting in first 3 chapters but otherwise pristine. Great for MATH 201.',
    price: 45,
    type: 'sell',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    seller: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      university: 'Stanford University',
    },
    createdAt: '2 days ago',
  },
  '2': {
    id: '2',
    title: 'MacBook Pro Charger',
    description: 'Original Apple 61W USB-C charger. Works perfectly, selling because I upgraded to a different laptop.',
    price: 25,
    type: 'sell',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    seller: {
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      university: 'MIT',
    },
    createdAt: '5 hours ago',
  },
};

const typeConfig = {
  sell: { icon: DollarSign, label: 'For Sale', color: 'bg-primary text-primary-foreground' },
  swap: { icon: Repeat, label: 'Swap', color: 'bg-accent text-accent-foreground' },
  free: { icon: Gift, label: 'Free', color: 'bg-success text-success-foreground' },
};

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Get item data (fallback to first item for demo)
  const item = dummyItems[id || '1'] || dummyItems['1'];
  const config = typeConfig[item.type as keyof typeof typeConfig];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </motion.button>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-10 w-10 rounded-full glass flex items-center justify-center"
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-destructive text-destructive" : "text-foreground")} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-10 w-10 rounded-full glass flex items-center justify-center"
            >
              <Share2 className="h-5 w-5 text-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Type Badge */}
        <div className={cn(
          "absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold",
          config.color
        )}>
          <Icon className="h-4 w-4" />
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Price & Title */}
          <div className="mb-4">
            {item.type === 'sell' && (
              <span className="text-3xl font-bold text-foreground">${item.price}</span>
            )}
            {item.type === 'free' && (
              <span className="text-3xl font-bold text-success">Free</span>
            )}
            {item.type === 'swap' && (
              <span className="text-3xl font-bold text-accent-foreground">Open to swap</span>
            )}
            <h1 className="text-2xl font-bold text-foreground mt-2">{item.title}</h1>
            <p className="text-muted-foreground mt-1">Listed {item.createdAt}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>

          {/* Seller Info */}
          <div className="p-4 rounded-2xl bg-secondary/50 flex items-center gap-4">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{item.seller.name}</h3>
              <p className="text-sm text-muted-foreground">{item.seller.university}</p>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Meet in public campus areas for safety</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-border"
      >
        <div className="container">
          <MotionButton
            variant="primary"
            size="lg"
            className="w-full animate-pulse-soft"
            onClick={() => navigate(`/chat/${item.id}`)}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat with {item.seller.name.split(' ')[0]}
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
