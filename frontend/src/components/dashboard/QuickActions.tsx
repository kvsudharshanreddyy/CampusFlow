"use client";

import Link from "next/link";
import { Plus, CheckSquare, Calendar, Bot, Briefcase, Layers } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { label: "New Task", href: "/tasks", icon: Plus, color: "bg-violet-500/15 text-violet-600 dark:text-violet-400 hover:bg-violet-500/25" },
  { label: "View Tasks", href: "/tasks", icon: CheckSquare, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25" },
  { label: "Calendar", href: "/calendar", icon: Calendar, color: "bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/25" },
  { label: "AI Chat", href: "/ai-chat", icon: Bot, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25" },
  { label: "Placement", href: "/placement", icon: Briefcase, color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/25" },
  { label: "Flashcards", href: "/flashcards", icon: Layers, color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            href={action.href}
            className={`flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-150 ${action.color}`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
