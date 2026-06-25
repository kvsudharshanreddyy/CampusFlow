"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const mockCards = [
  { id: "1", subject: "CS101", question: "What is a Binary Search Tree?", answer: "A BST is a binary tree where each node's left subtree contains only nodes with keys less than the node's key, and the right subtree contains only nodes with keys greater." },
  { id: "2", subject: "MA201", question: "State the Fundamental Theorem of Calculus", answer: "The FTC states that if f is continuous on [a,b], then the integral from a to b of f(x)dx equals F(b) - F(a), where F is any antiderivative of f." },
  { id: "3", subject: "AI301", question: "What is backpropagation?", answer: "Backpropagation is an algorithm for training neural networks by computing gradients of the loss function with respect to each weight using the chain rule of calculus." },
  { id: "4", subject: "CS101", question: "What is Big O notation?", answer: "Big O notation describes the upper bound of an algorithm's time or space complexity as a function of input size n, expressing worst-case performance." },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [subject, setSubject] = useState<string | null>(null);

  const filtered = subject ? mockCards.filter((c) => c.subject === subject) : mockCards;
  const card = filtered[currentIndex % filtered.length];
  const subjects = [...new Set(mockCards.map((c) => c.subject))];

  const next = () => { setFlipped(false); setTimeout(() => setCurrentIndex((i) => (i + 1) % filtered.length), 100); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrentIndex((i) => (i - 1 + filtered.length) % filtered.length), 100); };

  return (
    <div className="p-5 lg:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Flashcards</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} cards · Swipe to review</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Generate with AI
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Card
          </Button>
        </div>
      </div>

      {/* Subject filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => { setSubject(null); setCurrentIndex(0); }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!subject ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => { setSubject(s); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${subject === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Flashcard */}
      <div className="relative" style={{ perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setFlipped(!flipped)}
          className="relative cursor-pointer h-72 w-full"
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-border bg-card text-center shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Badge className="mb-4">{card?.subject}</Badge>
            <p className="text-lg font-semibold leading-snug">{card?.question}</p>
            <p className="text-xs text-muted-foreground mt-6">Click to reveal answer</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-primary/40 bg-primary/5 text-center shadow-lg"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <Badge variant="success" className="mb-4">Answer</Badge>
            <p className="text-base leading-relaxed text-foreground">{card?.answer}</p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={prev} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <span className="text-sm text-muted-foreground font-medium">
          {(currentIndex % filtered.length) + 1} / {filtered.length}
        </span>
        <Button variant="outline" size="sm" onClick={next} className="gap-1.5">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${(((currentIndex % filtered.length) + 1) / filtered.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
