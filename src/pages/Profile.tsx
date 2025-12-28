import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Package, Heart, LogOut, ChevronRight, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { MotionButton } from "@/components/ui/motion-button";

const menuItems = [
  { icon: Package, label: 'My Listings', count: 5 },
  { icon: Heart, label: 'Saved Items', count: 12 },
  { icon: Settings, label: 'Settings' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-mesh">
        <div className="container pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-3xl font-bold text-primary">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Edit2 className="h-4 w-4" />
              </motion.button>
            </div>
            
            <h1 className="text-xl font-bold text-foreground mt-4">
              {user?.email?.split('@')[0] || 'Student'}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email || 'Loading...'}</p>
            
            <div className="flex gap-8 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Saved</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Menu */}
      <div className="container -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-soft overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                whileHover={{ backgroundColor: 'hsl(var(--secondary) / 0.5)' }}
                className="w-full flex items-center gap-4 p-4 text-left border-b border-border last:border-0"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="flex-1 font-medium text-foreground">{item.label}</span>
                {item.count && (
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <MotionButton
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </MotionButton>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
