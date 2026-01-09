import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ChatPreview {
  id: string;
  item: {
    id: string;
    title: string;
    image_url: string | null;
  };
  otherUser: {
    id: string;
    email: string;
    avatar_url: string | null;
  };
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        setCurrentUserId(user.id);

        // Fetch chats where user is buyer or seller
        const { data: chatsData, error: chatsError } = await supabase
          .from('chats')
          .select(`
            id,
            buyer_id,
            seller_id,
            item:items!chats_item_id_fkey (
              id,
              title,
              image_url
            ),
            buyer:profiles!chats_buyer_id_fkey (
              id,
              email,
              avatar_url
            ),
            seller:profiles!chats_seller_id_fkey (
              id,
              email,
              avatar_url
            )
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false });

        if (chatsError) throw chatsError;

        // Fetch latest message for each chat
        const chatPreviews: ChatPreview[] = await Promise.all(
          (chatsData || []).map(async (chat: any) => {
            const { data: messages } = await supabase
              .from('messages')
              .select('content, created_at, sender_id')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false })
              .limit(1);

            const otherUser = chat.buyer_id === user.id ? chat.seller : chat.buyer;
            
            return {
              id: chat.id,
              item: chat.item,
              otherUser,
              lastMessage: messages?.[0],
              unreadCount: 0, // TODO: Implement unread count
            };
          })
        );

        setChats(chatPreviews);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader 
        title="Messages" 
        subtitle="Your conversations"
        showBack={false}
      />

      <div className="container py-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-2xl bg-card">
                <div className="h-14 w-14 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded w-1/3" />
                  <div className="h-3 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : chats.length > 0 ? (
          <div className="space-y-2">
            {chats.map((chat, index) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-secondary/30 transition-colors text-left border border-border/50"
              >
                {/* Avatar with Item Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {chat.otherUser?.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {chat.item?.image_url && (
                    <img
                      src={chat.item.image_url}
                      alt={chat.item.title}
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg object-cover border-2 border-background"
                    />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">
                      {chat.otherUser?.email?.split('@')[0] || 'Unknown'}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTime(chat.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.item?.title || 'Item'}
                  </p>
                  {chat.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                
                {/* Unread indicator */}
                {chat.unreadCount > 0 && (
                  <div className="h-5 min-w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary-foreground">{chat.unreadCount}</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Start a conversation by messaging a seller on any item you're interested in."
            actionLabel="Browse Items"
            onAction={() => navigate('/home')}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
