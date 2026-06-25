"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Bot, Calendar, CheckSquare, GraduationCap,
  Layers, Briefcase, ClipboardList, Users, Zap, Shield, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    icon: Bot,
    title: "AI Study Assistant",
    desc: "Chat with an AI tutor that knows your syllabus, deadlines, and learning style.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: CheckSquare,
    title: "Smart Task Manager",
    desc: "Organize assignments with due dates, subjects, and priority tracking.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Google Calendar Sync",
    desc: "Sync your class schedule and exams with Google Calendar automatically.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: ClipboardList,
    title: "Attendance Tracker",
    desc: "Never miss the attendance threshold. Get alerts before it's too late.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Layers,
    title: "Flashcard Engine",
    desc: "Create AI-generated flashcards and MCQs for every subject.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Briefcase,
    title: "Placement Tracker",
    desc: "Track every company application from applied to offer stage.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "98%", label: "Task Completion" },
  { value: "4.9★", label: "User Rating" },
  { value: "24/7", label: "AI Support" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">CampusFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Zap className="h-3 w-3" />
              AI-Powered Student Productivity
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your campus life,{" "}
            <span className="gradient-text">supercharged by AI</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            CampusFlow brings together tasks, calendar, attendance, placement prep,
            AI tutoring, and WhatsApp automation — all in one beautifully crafted platform.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Sign in to dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mt-16 mx-auto max-w-5xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">campusflow.app/dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-4 gap-3">
              {[
                { label: "Tasks Due", value: "12", color: "bg-violet-500/10 text-violet-600" },
                { label: "Attendance", value: "87%", color: "bg-green-500/10 text-green-600" },
                { label: "Study Streak", value: "14d", color: "bg-amber-500/10 text-amber-600" },
                { label: "Applications", value: "5", color: "bg-blue-500/10 text-blue-600" },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-border p-4 text-left">
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color} rounded-lg inline-block`}>{card.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-3 gap-3">
              {["📚 CS101 assignment due tomorrow", "🤖 AI generated 12 new flashcards", "📅 Exam schedule synced to calendar"].map((item) => (
                <div key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Everything you need to excel
            </motion.h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              One platform, all the tools. Built for students who refuse to settle for average.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
              >
                <div className={`inline-flex rounded-xl p-3 ${f.bg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            {[
              { icon: Shield, label: "Bank-grade security" },
              { icon: Globe, label: "99.9% uptime" },
              { icon: Zap, label: "Sub-second AI responses" },
              { icon: Users, label: "Team collaboration" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-12"
          >
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Ready to level up your campus life?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students already using CampusFlow to stay ahead.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-12 px-10 text-base gap-2">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
