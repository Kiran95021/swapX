import { useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
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
    <div className="min-h-screen gradient-mesh overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-2xl bg-primary/20 rotate-12 animate-float" />
      <div className="absolute top-40 right-16 h-16 w-16 rounded-2xl bg-accent rotate-45 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 h-24 w-24 rounded-3xl bg-primary/10 -rotate-12 animate-float" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">Swapx</span>
          </div>
        </motion.header>

        {/* Hero */}
        <main className="flex-1 flex flex-col justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Campus
              <br />
              <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The easiest way for students to buy, sell, and swap everything from textbooks to furniture. Campus-exclusive and completely free.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <MotionButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/auth')}
                className="shadow-glow"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </MotionButton>
              <MotionButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </MotionButton>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm shadow-soft"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="py-6 text-center text-sm text-muted-foreground"
        >
          Made for students, by students 🎓
        </motion.footer>
      </div>
    </div>
  );
}
