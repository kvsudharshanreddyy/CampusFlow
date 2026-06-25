"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  BookOpen,
  Users,
  Bot,
  Zap,
  ClipboardList,
  ArrowRight,
  Shield,
  LifeBuoy,
  FileText,
  Mail,
  Info,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn how to configure your academic calendar, sync subjects, and navigate the platform.",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "AI Study Buddy",
    description: "Generate flashcards, practice questions, summarize documents, and chat with AI models.",
    icon: Bot,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Attendance Tracker",
    description: "Manage subject attendance, compute threshold percentages, and forecast required class hours.",
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Study Groups",
    description: "Create collaboration rooms, invite classmates, schedule group review calendar events, and share study logs.",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "n8n Automations",
    description: "Understand webhook schedules, WhatsApp broadcasts, and Google Calendar event sync pipelines.",
    icon: Zap,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Privacy & Security",
    description: "Control your database parameters, profile visibility, session tokens, and authentication credentials.",
    icon: Shield,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const quickLinks = [
  { title: "Frequently Asked Questions", href: "/faq", description: "Answers to common billing, feature, and connection questions.", icon: HelpCircle },
  { title: "Contact Support Team", href: "/contact", description: "Send a ticket, report bugs, or submit request suggestions.", icon: Mail },
  { title: "About CampusFlow", href: "/about", description: "Read about the mission, stack, and development roadmap.", icon: Info },
  { title: "Privacy Policy & Terms", href: "/privacy", description: "Learn how we store session records and secure your data.", icon: FileText },
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredCategories = helpCategories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-4 lg:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative text-center py-10 rounded-2xl border border-border bg-gradient-to-b from-accent/30 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-lg mx-auto space-y-4 px-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <LifeBuoy className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight">Help Center</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Find detailed guides, workflow explanations, and contact information.
            </p>
          </div>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, setup answers, database topics..."
              className="h-10 pl-9 text-xs bg-background border-border shadow-sm focus-visible:ring-1"
            />
          </div>
        </div>
      </div>

      {/* Main categories grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight">Explore Categories</h2>
          <p className="text-[11px] text-muted-foreground">Select a category to browse detailed feature sheets</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredCategories.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="h-full border-border hover:border-primary/20 hover:shadow-sm transition-all group cursor-pointer">
                <CardHeader className="p-4 pb-2">
                  <div className={`p-2 rounded-lg w-fit ${c.bg}`}>
                    <c.icon className={`h-4 w-4 ${c.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5 justify-between">
                    {c.title}
                    <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </CardTitle>
                  <CardDescription className="text-[10.5px] leading-relaxed text-muted-foreground">
                    {c.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support and Quick Links */}
      <div className="grid gap-6 md:grid-cols-2 border-t border-border pt-8">
        {/* Quick links list */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Resources</h3>
            <p className="text-[10px] text-muted-foreground">Direct paths to platform information and support forms</p>
          </div>

          <div className="space-y-2.5">
            {quickLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <div
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/20 hover:bg-accent/10 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded bg-muted text-muted-foreground mt-0.5">
                    <LinkIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                      {link.title}
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{link.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact panel card */}
        <div className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card/45 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LifeBuoy className="h-28 w-28 text-foreground" />
          </div>

          <div className="space-y-3 relative z-10">
            <h3 className="text-sm font-bold text-foreground">Still need help?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you did not find the answers you were looking for or encountered a custom Supabase configuration or Google API sync bug, please open a direct ticket. Our academic developers are here to support your integration.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <Button
              className="w-full text-xs font-semibold"
              onClick={() => router.push("/contact")}
            >
              Contact Support Team
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
