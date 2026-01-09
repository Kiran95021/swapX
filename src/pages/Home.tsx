import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ItemCard } from "@/components/ItemCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ListItemModal } from "@/components/ListItemModal";
import { BottomNav } from "@/components/BottomNav";
import { LoadingGrid } from "@/components/common/LoadingGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import { useItems, createItem } from "@/hooks/useItems";
import { useFavorites } from "@/hooks/useFavorites";
import { useWishlistAlerts } from "@/hooks/useWishlists";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ItemType } from "@/types";

const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Swaps', 'Rentals'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { items, loading, refetch } = useItems();
  const { toggleFavorite, isFavorited } = useFavorites();
  
  useWishlistAlerts();

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
        className="sticky top-0 z-30 glass-strong border-b border-border/50"
      >
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SwapX</h1>
              <p className="text-sm text-muted-foreground">Campus Marketplace</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative h-10 w-10 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
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
          <LoadingGrid count={8} />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                type={item.type as ItemType}
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
          <EmptyState
            icon={Search}
            title="No items found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          />
        )}
      </main>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <ListItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleListItem}
      />

      <BottomNav />
    </div>
  );
}
