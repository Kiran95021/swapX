import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ArrowRight, ArrowLeft, Check, DollarSign, Repeat, Gift, Clock } from "lucide-react";
import { MotionButton } from "./ui/motion-button";
import { cn } from "@/lib/utils";

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemData) => void;
}

interface ItemData {
  title: string;
  description: string;
  price: number | null;
  type: 'sell' | 'swap' | 'free' | 'rent';
  category: string;
  imageUrl: string;
  imageFile?: File;
  rental_price_per_day: number | null;
  max_rental_days: number | null;
}

const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other'];

const typeOptions = [
  { value: 'sell', icon: DollarSign, label: 'Sell', description: 'Set a price for your item' },
  { value: 'swap', icon: Repeat, label: 'Swap', description: 'Trade for something you need' },
  { value: 'free', icon: Gift, label: 'Free', description: 'Give it away to a fellow student' },
  { value: 'rent', icon: Clock, label: 'Rent', description: 'Rent out for daily fees (Exam time!)' },
];

export function ListItemModal({ isOpen, onClose, onSubmit }: ListItemModalProps) {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ItemData>({
    title: '',
    description: '',
    price: null,
    type: 'sell',
    category: 'Other',
    imageUrl: '',
    rental_price_per_day: null,
    max_rental_days: 30,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, imageFile: imageFile || undefined });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setImagePreview(null);
    setImageFile(null);
    setFormData({
      title: '',
      description: '',
      price: null,
      type: 'sell',
      category: 'Other',
      imageUrl: '',
      rental_price_per_day: null,
      max_rental_days: 30,
    });
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!imagePreview;
    if (step === 2) return !!formData.title.trim();
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-card"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">List an Item</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      s <= step ? "bg-primary" : "bg-secondary"
                    )}
                    initial={false}
                    animate={{ scaleX: s <= step ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Upload Photo */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground">Add a Photo</h3>
                    <p className="text-muted-foreground">A great photo helps sell faster!</p>
                    
                    <label className="block cursor-pointer">
                      <div className={cn(
                        "relative aspect-square rounded-2xl border-2 border-dashed transition-colors overflow-hidden",
                        imagePreview ? "border-primary" : "border-border hover:border-primary/50"
                      )}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Upload className="h-12 w-12" />
                            <span className="font-medium">Tap to upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground">Item Details</h3>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="What are you listing?"
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell buyers about condition, size, etc."
                        rows={3}
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((cat) => (
                          <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                              formData.category === cat
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Pricing */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground">How do you want to list it?</h3>
                    
                    <div className="space-y-3">
                      {typeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, type: option.value as any })}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors text-left",
                              formData.type === option.value
                                ? "border-primary bg-accent"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center",
                              formData.type === option.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {formData.type === 'sell' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2"
                      >
                        <label className="text-sm font-medium text-foreground">Price (₹)</label>
                        <div className="relative mt-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || null })}
                            placeholder="0"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </motion.div>
                    )}

                    {formData.type === 'rent' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 space-y-4"
                      >
                        <div>
                          <label className="text-sm font-medium text-foreground">Daily Rental Price (₹)</label>
                          <div className="relative mt-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                            <input
                              type="number"
                              value={formData.rental_price_per_day || ''}
                              onChange={(e) => setFormData({ ...formData, rental_price_per_day: parseFloat(e.target.value) || null })}
                              placeholder="0"
                              className="w-full pl-10 pr-16 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/day</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Max Rental Days</label>
                          <input
                            type="number"
                            value={formData.max_rental_days || ''}
                            onChange={(e) => setFormData({ ...formData, max_rental_days: parseInt(e.target.value) || null })}
                            placeholder="30"
                            className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm px-6 py-4 border-t border-border flex gap-3">
              {step > 1 && (
                <MotionButton
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </MotionButton>
              )}
              
              {step < 3 ? (
                <MotionButton
                  variant="primary"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MotionButton>
              ) : (
                <MotionButton
                  variant="primary"
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  List Item
                </MotionButton>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
