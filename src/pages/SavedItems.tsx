import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ItemCard } from "@/components/ItemCard";
import { useSavedItems } from "@/hooks/useItems";
import { useFavorites } from "@/hooks/useFavorites";

export default function SavedItems() {
  const navigate = useNavigate();
  const { items, loading, refetch } = useSavedItems();
  const { toggleFavorite, isFavorited } = useFavorites();

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    await toggleFavorite(itemId);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass-strong"
      >
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Saved Items</h1>
              <p className="text-sm text-muted-foreground">{items.length} items saved</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="container py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-2xl mb-3" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                type={item.type as 'sell' | 'swap' | 'free' | 'rent'}
                imageUrl={item.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                sellerName={item.seller?.email?.split('@')[0] || 'Unknown'}
                category={item.category}
                rentalPricePerDay={item.rental_price_per_day}
                index={index}
                onClick={() => handleItemClick(item.id)}
                isFavorited={isFavorited(item.id)}
                onFavoriteClick={(e) => handleFavoriteClick(e, item.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground">No saved items yet</p>
            <p className="text-muted-foreground mt-2">Tap the heart icon on items you like!</p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
