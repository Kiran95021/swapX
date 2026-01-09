import { useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles, Shield, Zap, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionButton } from "@/components/ui/motion-button";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    icon: Zap,
    title: "Instant Trading",
    description: "Buy, sell, or swap items with students on your campus in minutes.",
  },
  {
    icon: Shield,
    title: "Campus Verified",
    description: "Only .edu emails allowed. Trade safely with fellow students.",
  },
  {
    icon: Sparkles,
    title: "Zero Fees",
    description: "No listing fees, no commission. Keep 100% of your sales.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Items Listed" },
  { value: "100+", label: "Campuses" },
];

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-2xl bg-primary/10 rotate-12 animate-float" />
      <div className="absolute top-40 right-16 h-16 w-16 rounded-2xl bg-success/20 rotate-45 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 h-24 w-24 rounded-3xl bg-warning/10 -rotate-12 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-10 h-12 w-12 rounded-xl bg-accent rotate-6 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SwapX</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </motion.button>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <TrendingUp className="h-4 w-4" />
              Trusted by 10,000+ students
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Campus
              <br />
              <span className="text-primary">Marketplace</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The easiest way for students to buy, sell, swap, and rent everything from textbooks to furniture. Campus-exclusive and completely free.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <MotionButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/auth')}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </MotionButton>
              <MotionButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth')}
              >
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </MotionButton>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 max-w-lg"
          >
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-elevated transition-all cursor-default"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-8 text-center border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for students, by students
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} SwapX. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
