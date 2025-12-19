import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Clock } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ItemCard } from "@/components/ItemCard";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const trendingItems = [
  {
    id: '1',
    title: 'Calculus Textbook (8th Ed)',
    price: 45,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    sellerName: 'Alex Chen',
  },
  {
    id: '7',
    title: 'Wireless Earbuds',
    price: 35,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    sellerName: 'Riley Johnson',
  },
];

const newItems = [
  {
    id: '4',
    title: 'Gaming Controller',
    price: null,
    type: 'free' as const,
    imageUrl: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80',
    sellerName: 'Sam Wilson',
  },
  {
    id: '3',
    title: 'Vintage Desk Lamp',
    price: null,
    type: 'swap' as const,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    sellerName: 'Jordan Lee',
  },
];

const popularCategories = [
  { name: 'Textbooks', icon: '📚', color: 'from-blue-500 to-indigo-600' },
  { name: 'Electronics', icon: '💻', color: 'from-purple-500 to-pink-600' },
  { name: 'Furniture', icon: '🪑', color: 'from-amber-500 to-orange-600' },
  { name: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-600' },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass-strong border-b border-border"
      >
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Explore</h1>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="What are you looking for?"
          />
        </div>
      </motion.header>

      <main className="container py-6 space-y-8">
        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {popularCategories.map((cat, index) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative overflow-hidden p-4 rounded-2xl text-left bg-gradient-to-br",
                  cat.color
                )}
              >
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <span className="text-sm font-semibold text-white">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Now
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {trendingItems.map((item, index) => (
              <ItemCard
                key={item.id}
                {...item}
                index={index}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Just Listed
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {newItems.map((item, index) => (
              <ItemCard
                key={item.id}
                {...item}
                index={index}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
