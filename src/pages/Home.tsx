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

// Dummy data for initial display
const dummyItems = [
  {
    id: '1',
    title: 'Calculus Textbook (8th Ed)',
    price: 45,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    sellerName: 'Alex Chen',
    category: 'Textbooks',
  },
  {
    id: '2',
    title: 'MacBook Pro Charger',
    price: 25,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
    sellerName: 'Maya Patel',
    category: 'Electronics',
  },
  {
    id: '3',
    title: 'Vintage Desk Lamp',
    price: null,
    type: 'swap' as const,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    sellerName: 'Jordan Lee',
    category: 'Furniture',
  },
  {
    id: '4',
    title: 'Gaming Controller',
    price: null,
    type: 'free' as const,
    imageUrl: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80',
    sellerName: 'Sam Wilson',
    category: 'Electronics',
  },
  {
    id: '5',
    title: 'Psychology 101 Notes',
    price: 15,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    sellerName: 'Emma Davis',
    category: 'Textbooks',
  },
  {
    id: '6',
    title: 'Yoga Mat (Like New)',
    price: null,
    type: 'swap' as const,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80',
    sellerName: 'Chris Park',
    category: 'Sports',
  },
  {
    id: '7',
    title: 'Wireless Earbuds',
    price: 35,
    type: 'sell' as const,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    sellerName: 'Riley Johnson',
    category: 'Electronics',
  },
  {
    id: '8',
    title: 'Dorm Microwave',
    price: null,
    type: 'free' as const,
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
    sellerName: 'Taylor Kim',
    category: 'Furniture',
  },
];

const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Swaps'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(dummyItems);
  const navigate = useNavigate();

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category === selectedCategory ||
      (selectedCategory === 'Swaps' && item.type === 'swap');
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (id: string) => {
    navigate(`/item/${id}`);
  };

  const handleListItem = (data: any) => {
    const newItem = {
      id: Date.now().toString(),
      ...data,
      sellerName: 'You',
    };
    setItems([newItem, ...items]);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <ItemCard
              key={item.id}
              {...item}
              index={index}
              onClick={() => handleItemClick(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
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
