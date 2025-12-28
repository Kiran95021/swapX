import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, Shield, MessageCircle, DollarSign, Repeat, Gift, Clock, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MotionButton } from "@/components/ui/motion-button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { getOrCreateChat } from "@/hooks/useChats";
import { createRentalRequest } from "@/hooks/useRentals";
import { formatPrice, formatPricePerDay } from "@/lib/currency";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ItemData {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  type: string;
  image_url: string | null;
  rental_price_per_day: number | null;
  max_rental_days: number | null;
  created_at: string;
  seller_id: string;
  seller?: {
    id: string;
    email: string;
    avatar_url: string | null;
    university_name: string | null;
  };
}

const typeConfig = {
  sell: { icon: DollarSign, label: 'For Sale', color: 'bg-primary text-primary-foreground' },
  swap: { icon: Repeat, label: 'Swap', color: 'bg-accent text-accent-foreground' },
  free: { icon: Gift, label: 'Free', color: 'bg-success text-success-foreground' },
  rent: { icon: Clock, label: 'For Rent', color: 'bg-warning text-warning-foreground' },
};

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [rentalLoading, setRentalLoading] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();
  
  // Rental date state
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showRentalForm, setShowRentalForm] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("items")
          .select(`
            *,
            seller:profiles!items_seller_id_fkey (
              id,
              email,
              avatar_url,
              university_name
            )
          `)
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        setItem(data as ItemData);
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleMessage = async () => {
    if (!item || !item.seller) return;
    
    try {
      setMessageLoading(true);
      const chatId = await getOrCreateChat(item.id, item.seller_id);
      navigate(`/chat/${chatId}`);
    } catch (error: any) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start conversation");
    } finally {
      setMessageLoading(false);
    }
  };

  const handleRentalRequest = async () => {
    if (!item || !startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    if (!item.rental_price_per_day) {
      toast.error("Rental price not set");
      return;
    }

    try {
      setRentalLoading(true);
      await createRentalRequest(
        item.id,
        item.seller_id,
        startDate,
        endDate,
        item.rental_price_per_day
      );
      toast.success("Rental request sent! The owner will be notified.");
      setShowRentalForm(false);
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error: any) {
      console.error("Error creating rental request:", error);
      toast.error("Failed to send rental request");
    } finally {
      setRentalLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (item) {
      toggleFavorite(item.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Item not found</p>
        <MotionButton variant="primary" onClick={() => navigate(-1)}>Go Back</MotionButton>
      </div>
    );
  }

  const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.sell;
  const Icon = config.icon;
  const sellerName = item.seller?.email?.split('@')[0] || 'Unknown';
  const createdAt = new Date(item.created_at).toLocaleDateString();

  const calculateRentalTotal = () => {
    if (!startDate || !endDate || !item.rental_price_per_day) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * item.rental_price_per_day;
  };

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
          src={item.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'}
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
              onClick={handleFavoriteClick}
              className="h-10 w-10 rounded-full glass flex items-center justify-center"
            >
              <Heart className={cn("h-5 w-5", isFavorited(item.id) ? "fill-destructive text-destructive" : "text-foreground")} />
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
            {item.type === 'sell' && item.price !== null && (
              <span className="text-3xl font-bold text-foreground">{formatPrice(item.price)}</span>
            )}
            {item.type === 'rent' && item.rental_price_per_day !== null && (
              <span className="text-3xl font-bold text-warning">{formatPricePerDay(item.rental_price_per_day)}</span>
            )}
            {item.type === 'free' && (
              <span className="text-3xl font-bold text-success">Free</span>
            )}
            {item.type === 'swap' && (
              <span className="text-3xl font-bold text-accent-foreground">Open to swap</span>
            )}
            <h1 className="text-2xl font-bold text-foreground mt-2">{item.title}</h1>
            <p className="text-muted-foreground mt-1">Listed {createdAt}</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{item.description || 'No description provided'}</p>
          </div>

          {/* Rental Form */}
          {item.type === 'rent' && (
            <motion.div 
              className="mb-6 p-4 rounded-2xl bg-warning/10 border border-warning/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                Request Rental
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {startDate ? format(startDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {endDate ? format(endDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {startDate && endDate && (
                <div className="mb-4 p-3 rounded-xl bg-background">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold text-foreground">{formatPrice(calculateRentalTotal())}</span>
                  </div>
                </div>
              )}

              <MotionButton
                variant="primary"
                className="w-full bg-warning hover:bg-warning/90"
                onClick={handleRentalRequest}
                disabled={!startDate || !endDate || rentalLoading}
              >
                {rentalLoading ? "Sending..." : "Request Rental"}
              </MotionButton>
            </motion.div>
          )}

          {/* Seller Info */}
          <div className="p-4 rounded-2xl bg-secondary/50 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{sellerName}</h3>
              <p className="text-sm text-muted-foreground">{item.seller?.university_name || 'Campus Student'}</p>
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
            onClick={handleMessage}
            disabled={messageLoading}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {messageLoading ? "Opening chat..." : `Chat with ${sellerName}`}
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
