"use client";

import { Sparkles, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const tips = [
  "Break large tasks into smaller chunks. Research shows tasks under 25 minutes are completed 70% more reliably.",
  "Your attendance in 2 subjects is approaching the 75% threshold. Consider attending the next 3 sessions.",
  "Try the Pomodoro technique: 25 minutes focused study + 5 minute break. Repeat 4 times, then take a longer break.",
  "Your most productive hours appear to be in the morning. Schedule difficult tasks before noon.",
  "Spaced repetition with flashcards can boost retention by up to 200% compared to re-reading.",
];

interface AITipProps {
  latestPrompt?: string;
}

export function AITip({ latestPrompt }: AITipProps) {
  const tip = latestPrompt || tips[Math.floor(Date.now() / (1000 * 60 * 60 * 24) % tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
              <Bot className="h-3 w-3" /> AI Tip
            </p>
            <p className="text-sm text-foreground leading-relaxed">{tip}</p>
          </div>
          <Link href="/ai-chat">
            <Button variant="ghost" size="sm" className="text-xs shrink-0 gap-1">
              Chat
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
