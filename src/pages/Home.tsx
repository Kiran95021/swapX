import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ItemCard } from "@/components/ItemCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ListItemModal } from "@/components/ListItemModal";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useItems, createItem } from "@/hooks/useItems";
import { useFavorites } from "@/hooks/useFavorites";
import { useWishlistAlerts } from "@/hooks/useWishlists";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Swaps', 'Rentals'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { items, loading, refetch } = useItems();
  const { toggleFavorite, isFavorited } = useFavorites();
  
  // Enable wishlist alerts
  useWishlistAlerts();

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category === selectedCategory ||
      (selectedCategory === 'Swaps' && item.type === 'swap') ||
      (selectedCategory === 'Rentals' && item.type === 'rent');
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  const handleListItem = async (data: any) => {
    try {
      await createItem({
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        category: data.category,
        imageFile: data.imageFile,
        rental_price_per_day: data.rental_price_per_day,
        max_rental_days: data.max_rental_days,
      });
      toast.success("Item listed successfully!");
      refetch();
    } catch (error: any) {
      console.error("Error listing item:", error);
      toast.error("Failed to list item");
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    toggleFavorite(itemId);
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Swapx</h1>
              <p className="text-sm text-muted-foreground">Campus Marketplace</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary" />
            </motion.button>
          </div>
          
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search textbooks, electronics..."
          />
          
          <div className="mt-4">
            <FilterChips
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </motion.header>

      {/* Item Grid */}
      <main className="container py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-2xl mb-3" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                type={item.type}
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
        )}

        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-muted-foreground">No items found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </main>

      {/* FAB */}
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {/* List Item Modal */}
      <ListItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleListItem}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
