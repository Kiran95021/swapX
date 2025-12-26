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

      // Channel for new rental requests (as owner)
      const newRentalsChannel = supabase
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

      // Channel for all rental updates (as owner or renter)
      const rentalUpdatesChannel = supabase
        .channel("rental-updates")
        .on(
          "postgres_changes",
          { 
            event: "UPDATE", 
            schema: "public", 
            table: "rentals"
          },
          (payload) => {
            const rental = payload.new as Rental;
            // Only notify if user is involved
            if (rental.owner_id === user.id || rental.renter_id === user.id) {
              if (rental.status === 'approved' && rental.renter_id === user.id) {
                toast.success("Your rental request was approved!");
              } else if (rental.status === 'rejected' && rental.renter_id === user.id) {
                toast.error("Your rental request was rejected");
              }
              fetchRentals();
            }
          }
        )
        .subscribe();

      return { newRentalsChannel, rentalUpdatesChannel };
    };

    let channels: { newRentalsChannel?: ReturnType<typeof supabase.channel>; rentalUpdatesChannel?: ReturnType<typeof supabase.channel> } = {};
    setupRealtimeNotifications().then(ch => { 
      if (ch) channels = ch; 
    });

    return () => {
      if (channels.newRentalsChannel) supabase.removeChannel(channels.newRentalsChannel);
      if (channels.rentalUpdatesChannel) supabase.removeChannel(channels.rentalUpdatesChannel);
    };
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
    .rpc("update_rental_status_secure", { 
      rental_uuid: rentalId, 
      new_status: status 
    });

  if (error) throw error;
}
