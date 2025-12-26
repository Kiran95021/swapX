import React, { useState, useEffect, useCallback, useRef } from "react";
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

      // Validate keyword
      const trimmedKeyword = keyword.trim().toLowerCase();
      if (!trimmedKeyword || trimmedKeyword.length === 0) {
        toast.error("Keyword cannot be empty");
        return;
      }
      if (trimmedKeyword.length > 100) {
        toast.error("Keyword must be less than 100 characters");
        return;
      }
      // Reject obvious script/XSS patterns
      if (/<script|javascript:|onerror=|onclick=|onload=/i.test(trimmedKeyword)) {
        toast.error("Invalid keyword format");
        return;
      }

      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, keyword: trimmedKeyword });

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

    // Subscribe to realtime updates for wishlists
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("wishlists-changes")
        .on(
          "postgres_changes",
          { 
            event: "*", 
            schema: "public", 
            table: "wishlists",
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchWishlists();
          }
        )
        .subscribe();

      return channel;
    };

    let channel: ReturnType<typeof supabase.channel> | undefined;
    setupRealtime().then(ch => { channel = ch; });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchWishlists]);

  return { wishlists, loading, addKeyword, removeKeyword, refetch: fetchWishlists };
}

// Hook to listen for new items matching wishlist keywords
export function useWishlistAlerts() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const wishlistsRef = useRef<Wishlist[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    wishlistsRef.current = wishlists;
  }, [wishlists]);

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
          
          // Use ref to get current wishlists
          for (const wishlist of wishlistsRef.current) {
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

    // Subscribe to wishlist changes to keep alerts in sync
    const wishlistChannel = supabase
      .channel("wishlist-updates-for-alerts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishlists" },
        () => {
          fetchUserWishlists();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(wishlistChannel);
    };
  }, []);
}
