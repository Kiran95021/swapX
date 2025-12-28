import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Item {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  type: 'sell' | 'swap' | 'free' | 'rent';
  category: string;
  image_url: string | null;
  seller_id: string;
  status: string;
  rental_price_per_day: number | null;
  max_rental_days: number | null;
  created_at: string;
  updated_at: string;
  seller?: {
    id: string;
    email: string;
    avatar_url: string | null;
    university_name: string | null;
  };
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select(`
          *,
          seller:profiles!items_seller_id_fkey (
            id,
            email,
            avatar_url,
            university_name
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data as Item[] || []);
    } catch (error: any) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return { items, loading, refetch: fetchItems };
}

export function useMyItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data as Item[] || []);
    } catch (error: any) {
      console.error("Error fetching my items:", error);
      toast.error("Failed to load your items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  return { items, loading, refetch: fetchMyItems };
}

export function useSavedItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          item:items (
            *,
            seller:profiles!items_seller_id_fkey (
              id,
              email,
              avatar_url,
              university_name
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      const savedItems = data?.map((f: any) => f.item).filter(Boolean) || [];
      setItems(savedItems as Item[]);
    } catch (error: any) {
      console.error("Error fetching saved items:", error);
      toast.error("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedItems();
  }, [fetchSavedItems]);

  return { items, loading, refetch: fetchSavedItems };
}

export async function createItem(itemData: {
  title: string;
  description: string;
  price: number | null;
  type: string;
  category: string;
  imageFile?: File;
  rental_price_per_day?: number | null;
  max_rental_days?: number | null;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let image_url = null;

  // Upload image if provided
  if (itemData.imageFile) {
    const fileExt = itemData.imageFile.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, itemData.imageFile);

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);
      image_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      type: itemData.type,
      category: itemData.category,
      image_url,
      seller_id: user.id,
      rental_price_per_day: itemData.rental_price_per_day,
      max_rental_days: itemData.max_rental_days,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
