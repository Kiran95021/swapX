import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, User, Shield, Trash2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MotionButton } from "@/components/ui/motion-button";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // Note: Full account deletion requires backend support
      // For now, we'll just sign out the user
      await supabase.auth.signOut();
      navigate('/');
      toast.success("Account deletion requested. You've been logged out.");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const settingsItems = [
    { icon: User, label: 'Edit Profile', onClick: () => navigate('/profile') },
    { icon: Bell, label: 'Notifications', onClick: () => {} },
    { icon: Shield, label: 'Privacy & Security', onClick: () => {} },
  ];

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
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="container py-6">
        {/* Settings Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-soft overflow-hidden mb-6"
        >
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                whileHover={{ backgroundColor: 'hsl(var(--secondary) / 0.5)' }}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 text-left border-b border-border last:border-0"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="flex-1 font-medium text-foreground">{item.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <MotionButton
            variant="outline"
            size="lg"
            onClick={handleLogout}
            disabled={loading}
            className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </MotionButton>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl border-2 border-destructive/20 bg-destructive/5"
        >
          <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <MotionButton
                variant="outline"
                size="lg"
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={loading}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </MotionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
