"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: "violet" | "green" | "amber" | "rose" | "blue";
  delay?: number;
}

const colorMap = {
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  green: "bg-green-500/10 text-green-600 dark:text-green-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const trendMap = {
  up: { icon: TrendingUp, class: "text-green-600 dark:text-green-400" },
  down: { icon: TrendingDown, class: "text-rose-600 dark:text-rose-400" },
  neutral: { icon: Minus, class: "text-muted-foreground" },
};

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color = "violet",
  delay = 0,
}: StatCardProps) {
  const TrendIcon = trendMap[trend].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {value}
              </p>
              {change && (
                <div className={cn("flex items-center gap-1 text-xs font-medium", trendMap[trend].class)}>
                  <TrendIcon className="h-3 w-3" />
                  {change}
                </div>
              )}
            </div>
            <div className={cn("rounded-lg p-2.5", colorMap[color])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
