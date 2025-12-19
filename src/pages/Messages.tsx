import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const conversations = [
  {
    id: '1',
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    item: {
      title: 'Calculus Textbook',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&q=80',
    },
    lastMessage: 'Sounds good! See you at 2pm',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    user: {
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
    item: {
      title: 'MacBook Charger',
      imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&q=80',
    },
    lastMessage: 'Is it compatible with the 2020 model?',
    time: '1h ago',
    unread: false,
  },
  {
    id: '3',
    user: {
      name: 'Jordan Lee',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
    },
    item: {
      title: 'Desk Lamp',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&q=80',
    },
    lastMessage: 'What would you want in exchange?',
    time: 'Yesterday',
    unread: false,
  },
];

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass-strong border-b border-border"
      >
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground">Your conversations</p>
        </div>
      </motion.header>

      {/* Conversations List */}
      <div className="container py-4">
        {conversations.map((convo, index) => (
          <motion.button
            key={convo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/chat/${convo.id}`)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-secondary/50 transition-colors text-left mb-2"
          >
            <div className="relative">
              <img
                src={convo.user.avatar}
                alt={convo.user.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <img
                src={convo.item.imageUrl}
                alt={convo.item.title}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg object-cover border-2 border-background"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{convo.user.name}</h3>
                <span className="text-xs text-muted-foreground">{convo.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{convo.item.title}</p>
              <p className={`text-sm truncate ${convo.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {convo.lastMessage}
              </p>
            </div>
            
            {convo.unread && (
              <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
