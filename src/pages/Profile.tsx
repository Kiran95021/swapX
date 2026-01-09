import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Package, Heart, LogOut, ChevronRight, Edit2, MessageSquare, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { MotionButton } from "@/components/ui/motion-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileStats {
  listings: number;
  sold: number;
  saved: number;
}

const menuItems = [
  { icon: Package, label: 'My Listings', path: '/my-listings', key: 'listings' },
  { icon: Heart, label: 'Saved Items', path: '/saved', key: 'saved' },
  { icon: MessageSquare, label: 'Messages', path: '/messages', key: 'messages' },
  { icon: Settings, label: 'Settings', path: '/settings', key: 'settings' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<ProfileStats>({ listings: 0, sold: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch real stats from database
          const [listingsRes, savedRes] = await Promise.all([
            supabase.from('items').select('id, status').eq('seller_id', user.id),
            supabase.from('favorites').select('id').eq('user_id', user.id),
          ]);

          const listings = listingsRes.data?.length || 0;
          const sold = listingsRes.data?.filter(item => item.status === 'sold').length || 0;
          const saved = savedRes.data?.length || 0;

          setStats({ listings, sold, saved });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getMenuCount = (key: string): number | undefined => {
    switch (key) {
      case 'listings': return stats.listings;
      case 'saved': return stats.saved;
      default: return undefined;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="container relative pt-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 shadow-lg"
              >
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-3xl font-bold text-primary">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
              >
                <Edit2 className="h-4 w-4" />
              </motion.button>
            </div>
            
            {/* User Info */}
            <h1 className="text-xl font-bold text-foreground mt-4">
              {user?.email?.split('@')[0] || 'Student'}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email || 'Loading...'}</p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-8 mt-6"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.listings}</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.sold}</p>
                <p className="text-sm text-muted-foreground">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.saved}</p>
                <p className="text-sm text-muted-foreground">Saved</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Menu Card */}
      <div className="container -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-elevated overflow-hidden border border-border/50"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const count = getMenuCount(item.key);
            return (
              <motion.button
                key={item.label}
                whileHover={{ backgroundColor: 'hsl(var(--secondary) / 0.3)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 text-left border-b border-border/50 last:border-0 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary/80 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="flex-1 font-medium text-foreground">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {count}
                  </span>
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
            onClick={() => setShowLogoutDialog(true)}
            className="w-full text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </MotionButton>
        </motion.div>

        {/* App Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          SwapX v2.0.0 • Made for students
        </motion.p>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your account and listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
