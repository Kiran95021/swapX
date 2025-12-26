import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Package, Heart, LogOut, ChevronRight, Edit2, 
  Sparkles, Star, TrendingUp, Camera, Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useMyItems } from "@/hooks/useItems";
import { useFavorites } from "@/hooks/useFavorites";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const { items: myItems } = useMyItems();
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { 
      icon: Package, 
      label: 'My Listings', 
      count: myItems.length,
      path: '/my-listings',
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      icon: Heart, 
      label: 'Saved Items', 
      count: favoriteIds.size,
      path: '/saved',
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      icon: Settings, 
      label: 'Settings',
      path: '/settings',
      gradient: 'from-slate-500 to-slate-600'
    },
  ];

  const stats = [
    { label: 'Listings', value: myItems.length, icon: Package },
    { label: 'Sold', value: 0, icon: TrendingUp },
    { label: 'Saved', value: favoriteIds.size, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background pb-28 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Header */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        
        {/* Mesh Pattern */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative container pt-12 pb-8"
        >
          {/* Profile Avatar */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="relative group">
              {/* Animated Ring */}
              <motion.div 
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-75 blur-md"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Avatar Container */}
              <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-primary to-accent p-[3px]">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gradient">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-lg glow-primary"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </motion.button>

              {/* Pro Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <Crown className="h-4 w-4 text-white" />
              </motion.div>
            </div>
            
            {/* User Info */}
            <motion.div variants={itemVariants} className="text-center mt-5">
              <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                {profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Student'}
                <Sparkles className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {profile?.university_name || user?.email || 'Loading...'}
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-1 mt-6 p-1 rounded-2xl glass"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center px-6 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">{stat.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Menu Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mt-2"
      >
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-3xl overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-4 p-5 text-left border-b border-border/50 last:border-0 group transition-colors hover:bg-muted/30"
              >
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <span className="font-semibold text-foreground block">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-sm text-muted-foreground">{item.count} items</span>
                  )}
                </div>
                
                {item.count !== undefined && (
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {item.count}
                  </motion.span>
                )}
                
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 text-destructive font-semibold transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </motion.button>
        </motion.div>

        {/* App Version */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Swapx v1.0.0 • Made with ❤️ for students
        </motion.p>
      </motion.div>

      <BottomNav />
    </div>
  );
}