import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Rental {
  id: string;
  item_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  item?: {
    id: string;
    title: string;
    image_url: string | null;
  };
  renter?: {
    id: string;
    email: string;
    avatar_url: string | null;
  };
}

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          item:items (id, title, image_url),
          renter:profiles!rentals_renter_id_fkey (id, email, avatar_url)
        `)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRentals(data as Rental[] || []);
    } catch (error: any) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();

    // Subscribe to rental updates for owner notifications
    const setupRealtimeNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("rental-notifications")
        .on(
          "postgres_changes",
          { 
            event: "INSERT", 
            schema: "public", 
            table: "rentals",
            filter: `owner_id=eq.${user.id}`
          },
          (payload) => {
            const rental = payload.new as Rental;
            toast.info("New rental request received!", {
              description: "Someone wants to rent your item",
              action: {
                label: "View",
                onClick: () => fetchRentals(),
              },
              duration: 10000,
            });
            fetchRentals();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeNotifications();
  }, [fetchRentals]);

  return { rentals, loading, refetch: fetchRentals };
}

export async function createRentalRequest(
  itemId: string,
  ownerId: string,
  startDate: Date,
  endDate: Date,
  rentalPricePerDay: number
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = days * rentalPricePerDay;

  const { data, error } = await supabase
    .from("rentals")
    .insert({
      item_id: itemId,
      renter_id: user.id,
      owner_id: ownerId,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      total_price: totalPrice,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRentalStatus(rentalId: string, status: string) {
  const { error } = await supabase
    .from("rentals")
    .update({ status })
    .eq("id", rentalId);

  if (error) throw error;
}
