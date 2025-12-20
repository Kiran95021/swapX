import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavoriteIds(new Set());
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("item_id")
        .eq("user_id", user.id);

      if (error) throw error;
      
      const ids = new Set(data?.map((f) => f.item_id) || []);
      setFavoriteIds(ids);
    } catch (error: any) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (itemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save items");
        return;
      }

      const isFavorited = favoriteIds.has(itemId);

      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId);

        if (error) throw error;

        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        toast.success("Removed from saved items");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, item_id: itemId });

        if (error) throw error;

        setFavoriteIds((prev) => new Set([...prev, itemId]));
        toast.success("Added to saved items");
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update saved items");
    }
  }, [favoriteIds]);

  useEffect(() => {
    fetchFavorites();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchFavorites();
    });

    return () => subscription.unsubscribe();
  }, [fetchFavorites]);

  return { favoriteIds, toggleFavorite, loading, isFavorited: (id: string) => favoriteIds.has(id) };
}
