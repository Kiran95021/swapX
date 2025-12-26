import { motion } from "framer-motion";
import { Home, Search, MessageCircle, User, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px]"
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-xl opacity-50" />
        
        {/* Main Container */}
        <div className="relative glass-strong rounded-3xl px-2 py-2 shadow-elevated">
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl transition-all duration-300",
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 gradient-primary rounded-2xl shadow-lg glow-primary"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}

                  {/* Icon Container */}
                  <motion.div 
                    className="relative z-10"
                    animate={isActive ? { y: -2 } : { y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive && "drop-shadow-lg"
                    )} />
                    
                    {/* Sparkle effect for active */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="h-3 w-3 text-primary-foreground animate-pulse" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <span className={cn(
                    "relative z-10 text-[10px] font-semibold transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}