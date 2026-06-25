"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "Summarize my upcoming deadlines",
  "Create flashcards for Operating Systems",
  "What's my attendance status?",
  "Help me prepare for my CS exam",
];

const initialMessage: Message = {
  id: "0",
  role: "assistant",
  content: "Hi! I'm your CampusFlow AI assistant 🎓 I can help you with:\n\n• **Study planning** — create schedules and revision plans\n• **Flashcard generation** — auto-create cards for any topic\n• **Deadline tracking** — summarize what's due soon\n• **Exam preparation** — practice questions and explanations\n\nWhat can I help you with today?",
  timestamp: new Date(),
};

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className={cn("text-xs", isUser ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary")}>
          {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={line === "" ? "mt-2" : ""}>
            {line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}
          </p>
        ))}
        <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/60" : "text-muted-foreground")}>
          {message.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulated AI response (replace with actual API call)
    await new Promise((r) => setTimeout(r, 1200));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Great question! I'm processing your request about "${content}". Once the backend AI integration is connected, I'll provide detailed, context-aware responses based on your academic data, subjects, and deadlines. 🚀`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3 bg-background/80 backdrop-blur-md">
        <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Study Assistant</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <Sparkles className="h-3 w-3 text-primary" />
          Powered by AI
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-end gap-2.5">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-primary/15 text-primary text-xs">
                <Bot className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none py-1.5"
            disabled={loading}
          />
          <Button type="submit" size="icon-sm" disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
