import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";
import { MotionButton } from "@/components/ui/motion-button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateCampusEmail = (email: string) => {
    const lowerEmail = email.toLowerCase();
    return lowerEmail.includes('.edu') || lowerEmail.includes('.ac.in') || lowerEmail.includes('.ac.uk');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateCampusEmail(email)) {
      setError("Campus Emails Only — Use your .edu or .ac email");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/home');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`
          }
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link.",
        });
      }
    } catch (err: any) {
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 gradient-mesh relative overflow-hidden"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <div className="h-32 w-32 rounded-3xl gradient-primary shadow-glow flex items-center justify-center">
              <GraduationCap className="h-16 w-16 text-primary-foreground" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-foreground text-center mb-4">
            Welcome to <span className="text-gradient">Swapx</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-md">
            The campus marketplace where students buy, sell, and swap everything they need.
          </p>

          {/* Floating items decoration */}
          <div className="absolute top-20 left-20 h-16 w-16 rounded-2xl bg-card shadow-elevated rotate-12 animate-float" />
          <div className="absolute bottom-32 right-24 h-20 w-20 rounded-2xl bg-primary/20 -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-32 h-12 w-12 rounded-xl bg-accent shadow-soft rotate-6 animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              <span className="text-gradient">Swapx</span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isLogin 
                ? "Sign in to continue to your campus marketplace" 
                : "Join thousands of students already trading"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className={`relative ${shake ? 'animate-shake' : ''}`}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@university.edu"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                  >
                    <span>🎓</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <MotionButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </MotionButton>
            </form>

            {/* Toggle Auth Mode */}
            <p className="text-center mt-6 text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
