import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Send, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

// Demo data
const demoSeller = {
  id: 'seller1',
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
};

const demoItem = {
  id: '1',
  title: 'Calculus Textbook (8th Ed)',
  price: 45,
  imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80',
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! Is this textbook still available?',
    senderId: 'me',
    createdAt: new Date(Date.now() - 60000 * 5),
  },
  {
    id: '2',
    content: 'Yes it is! Are you in MATH 201 too?',
    senderId: 'seller1',
    createdAt: new Date(Date.now() - 60000 * 4),
  },
  {
    id: '3',
    content: 'Yeah! Can we meet at the library tomorrow?',
    senderId: 'me',
    createdAt: new Date(Date.now() - 60000 * 2),
  },
];

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      createdAt: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sounds good! See you at 2pm by the main entrance? 📚',
        senderId: 'seller1',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass-strong border-b border-border"
      >
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <img
              src={demoSeller.avatar}
              alt={demoSeller.name}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{demoSeller.name}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>

            <Tooltip>
              <TooltipTrigger>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center"
                >
                  <Shield className="h-5 w-5 text-success" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-center">🛡️ Safety First!<br/>Meet in public campus areas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.header>

      {/* Item Preview */}
      <div className="container py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
        >
          <img
            src={demoItem.imageUrl}
            alt={demoItem.title}
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{demoItem.title}</h3>
            <p className="text-sm font-semibold text-primary">${demoItem.price}</p>
          </div>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container py-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isMe = message.senderId === 'me';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                  "flex mb-3",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[75%] px-4 py-3 rounded-2xl",
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-br-md" 
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                )}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="sticky bottom-0 glass-strong border-t border-border p-4"
      >
        <div className="container">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
            >
              <Image className="h-5 w-5 text-muted-foreground" />
            </motion.button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            >
              <Send className="h-5 w-5 text-primary-foreground" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
