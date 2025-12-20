import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Chat {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  item?: {
    id: string;
    title: string;
    price: number | null;
    image_url: string | null;
  };
  buyer?: {
    id: string;
    email: string;
    avatar_url: string | null;
  };
  seller?: {
    id: string;
    email: string;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  item_id: string;
  chat_id: string | null;
  created_at: string;
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("chats")
        .select(`
          *,
          item:items (id, title, price, image_url),
          buyer:profiles!chats_buyer_id_fkey (id, email, avatar_url),
          seller:profiles!chats_seller_id_fkey (id, email, avatar_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      setChats(data as Chat[] || []);
    } catch (error: any) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();

    const channel = supabase
      .channel("chats-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChats]);

  return { chats, loading, refetch: fetchChats };
}

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data as Message[] || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();

    if (!chatId) return;

    const channel = supabase
      .channel(`messages-${chatId}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages",
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, fetchMessages]);

  return { messages, loading, refetch: fetchMessages };
}

export async function getOrCreateChat(itemId: string, sellerId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if chat already exists
  const { data: existingChat } = await supabase
    .from("chats")
    .select("id")
    .eq("item_id", itemId)
    .eq("buyer_id", user.id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const { data: newChat, error } = await supabase
    .from("chats")
    .insert({
      item_id: itemId,
      buyer_id: user.id,
      seller_id: sellerId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return newChat.id;
}

export async function sendMessage(chatId: string, content: string, receiverId: string, itemId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      content,
      sender_id: user.id,
      receiver_id: receiverId,
      item_id: itemId,
    });

  if (messageError) throw messageError;

  // Update last_message_at
  await supabase
    .from("chats")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", chatId);
}
