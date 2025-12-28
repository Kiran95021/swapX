import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Wishlist {
  id: string;
  user_id: string;
  keyword: string;
  created_at: string;
}

export function useWishlists() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlists = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWishlists(data as Wishlist[] || []);
    } catch (error: any) {
      console.error("Error fetching wishlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addKeyword = useCallback(async (keyword: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to add wishlist items");
        return;
      }

      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, keyword: keyword.toLowerCase().trim() });

      if (error) {
        if (error.code === "23505") {
          toast.error("This keyword is already in your wishlist");
          return;
        }
        throw error;
      }

      toast.success(`Added "${keyword}" to your wishlist`);
      fetchWishlists();
    } catch (error: any) {
      console.error("Error adding wishlist keyword:", error);
      toast.error("Failed to add keyword");
    }
  }, [fetchWishlists]);

  const removeKeyword = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setWishlists((prev) => prev.filter((w) => w.id !== id));
      toast.success("Keyword removed from wishlist");
    } catch (error: any) {
      console.error("Error removing wishlist keyword:", error);
      toast.error("Failed to remove keyword");
    }
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  return { wishlists, loading, addKeyword, removeKeyword, refetch: fetchWishlists };
}

// Hook to listen for new items matching wishlist keywords
export function useWishlistAlerts() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  useEffect(() => {
    const fetchUserWishlists = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id);

      setWishlists(data || []);
    };

    fetchUserWishlists();

    // Subscribe to new items
    const channel = supabase
      .channel("new-items-alert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "items" },
        (payload) => {
          const newItem = payload.new as { title: string; id: string };
          const title = newItem.title.toLowerCase();
          
          // Check if any wishlist keyword matches
          for (const wishlist of wishlists) {
            if (title.includes(wishlist.keyword.toLowerCase())) {
              toast.success(`New item matches your wishlist: "${newItem.title}"`, {
                action: {
                  label: "View",
                  onClick: () => window.location.href = `/item/${newItem.id}`,
                },
                duration: 10000,
              });
              break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [wishlists]);
}
