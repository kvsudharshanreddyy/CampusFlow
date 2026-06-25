"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp, Search, ArrowLeft, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "db-fallback",
    category: "Database & Supabase",
    question: "What happens if my Supabase credentials are not connected?",
    answer: "CampusFlow has built-in production fail-safes. If your Supabase credentials are missing or the database connection fails, the backend will automatically return mock mock-free data structures. This prevents the application from throwing 500 server errors, allowing you to preview and evaluate all UI modules.",
  },
  {
    id: "n8n-whatsapp",
    category: "n8n Automations",
    question: "How do the WhatsApp and Google Calendar workflows function?",
    answer: "CampusFlow communicates with n8n workflow pipelines via secure webhooks. When an event is scheduled, a task deadline nears, or attendance drops below safe values, n8n triggers the WhatsApp API logs and updates Google Calendar using your profile's configured access tokens.",
  },
  {
    id: "ai-buddy",
    category: "AI Study Buddy",
    question: "What models power the AI Flashcard and MCQ generators?",
    answer: "The AI system uses Groq (LLaMA-3-70B) as the primary engine for ultra-fast text generation and flashcard/MCQ structuring. If Groq encounters API limits, the system seamlessly triggers OpenAI's model chain fallback to ensure you never experience downtime during review sessions.",
  },
  {
    id: "attendance-risk",
    category: "Attendance & Academics",
    question: "How is the 'Attendance Risk Alerter' calculated?",
    answer: "The system monitors your attendance records for each subject. If the computed percentage drops below 75%, it automatically marks that subject as 'At Risk' and shows a banner warning on your dashboard. It also displays the exact number of consecutive classes you must attend or can safely skip.",
  },
  {
    id: "calendar-sync",
    category: "Calendar Integration",
    question: "Can I delete events from the CampusFlow Calendar?",
    answer: "Yes, you can both create and delete calendar events. Deletions will call the backend calendar event delete route and, if connected, sync the update to Google Calendar via n8n's event cancellation webhook webhook.",
  },
  {
    id: "group-scheduling",
    category: "Study Groups",
    question: "How do I invite members to my study group?",
    answer: "You can create a study group from the Study Groups tab. Other students can click the 'Join' button to add themselves as group members. Once joined, any member can use the Group Scheduler to create collaborative sessions, which will be populated in all members' calendars.",
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Back button & Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.push("/help")}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Help
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quick answers about our database schemas, automated notifications, and AI engines.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions by keyword, category, or feature..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 pl-9 text-xs bg-muted/30 border-border"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
            <HelpCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">No matching questions found</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              Try searching with different terms or categories.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <Card
                key={faq.id}
                className={`transition-all duration-200 border-border overflow-hidden ${
                  isOpen ? "border-primary/20 bg-accent/5" : "bg-card/45 hover:bg-card"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-primary/80">
                      {faq.category}
                    </span>
                    <h3 className="text-xs font-bold text-foreground leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="shrink-0 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="pt-0 p-4 border-t border-border/40 text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })
        )}
      </div>

      {/* Bottom helper prompt */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/20 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-primary/10 text-primary">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">Did not find your answer?</p>
            <p className="text-[10px] text-muted-foreground">Submit a direct query ticket to our operations team.</p>
          </div>
        </div>
        <Button size="sm" className="text-xs shrink-0" onClick={() => router.push("/contact")}>
          Submit Query
        </Button>
      </div>
    </main>
  );
}
