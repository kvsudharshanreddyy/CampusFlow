"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Database, Server, Cpu, Zap, ArrowLeft, Heart, Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stackItems = [
  {
    layer: "Frontend Interface",
    tech: "Next.js 15 / TS / Tailwind",
    description: "Sleek, responsive app router utilizing Framer Motion, TanStack Query, and Shadcn/UI primitives for high performance.",
    icon: GraduationCap,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    layer: "Backend Service",
    tech: "Node.js / Express / REST",
    description: "Modular Clean Architecture API routes with Express Validator, Helmet security, JWT role guards, and structured Winston logging.",
    icon: Server,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    layer: "Database / Auth",
    tech: "Supabase / PostgreSQL",
    description: "Robust database schemas with RLS policies, indexing, relational foreign keys, profile buckets, and secure session management.",
    icon: Database,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    layer: "Orchestration Pipelines",
    tech: "n8n / Webhooks / APIs",
    description: "Automated event flows checking attendance risks, syncing calendar dates, and firing WhatsApp message templates.",
    icon: Zap,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
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

        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            About CampusFlow
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            The modern, unified operating system designed to elevate student academic performance.
          </p>
        </div>
      </div>

      {/* Main Vision Banner */}
      <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-card to-card overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />
        <div className="space-y-3 relative z-10 max-w-2xl">
          <h2 className="text-sm font-bold text-foreground">Our Core Mission</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CampusFlow was built from the ground up to solve academic fragmentation. By linking study schedules, attendance forecasts, AI generation models, and WhatsApp notification updates into one unified environment, we help students manage tasks efficiently and avoid academic risk.
          </p>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Architecture</h3>
          <p className="text-[10px] text-muted-foreground">A breakdown of the microservice layers running under the hood</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stackItems.map((item, i) => (
            <motion.div
              key={item.layer}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full border-border bg-card/50 hover:border-primary/20 transition-all">
                <CardHeader className="p-4 pb-2 flex-row items-center gap-3 space-y-0">
                  <div className={`p-2 rounded-lg ${item.bg}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold">{item.layer}</CardTitle>
                    <CardDescription className="text-[10px] font-mono font-medium mt-0.5">
                      {item.tech}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI & Automation Engine */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card/45">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-green-500" />
              Dual-Model AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed space-y-2">
            <p>
              Our AI study buddy operates on a fallback model system. All requests (Flashcard/MCQ generation, deadline prioritization, and resume suggestions) prioritize the high-speed Groq API.
            </p>
            <p>
              If the engine experiences connection issues, a fallback interceptor routes calls to OpenAI, ensuring zero interruptions in your study preparation flow.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/45">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-primary" />
              Automated Notification Loop
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground leading-relaxed space-y-2">
            <p>
              Integrated via n8n workflows, CampusFlow sends daily summary logs and low attendance warnings directly to you via WhatsApp.
            </p>
            <p>
              Google Calendar Synchronization processes events bi-directionally, meaning whenever a study session is created inside a CampusFlow group, the date updates your Google Calendar automatically.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer credits */}
      <div className="border-t border-border/60 pt-6 flex items-center justify-between text-[10px] text-muted-foreground">
        <p className="flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Academic Success
        </p>
        <p className="font-mono">v1.2.0 (Production Build)</p>
      </div>
    </main>
  );
}
