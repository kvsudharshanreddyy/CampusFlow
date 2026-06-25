"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const subjects = [
  { code: "CS101", name: "Introduction to Computer Science", credits: 3, grade: "A", instructor: "Dr. Smith" },
  { code: "MA201", name: "Advanced Calculus", credits: 4, grade: "B+", instructor: "Prof. Johnson" },
  { code: "AI301", name: "Artificial Intelligence & ML", credits: 4, grade: "A+", instructor: "Dr. Patel" },
  { code: "DB201", name: "Database Systems", credits: 3, grade: "B", instructor: "Prof. Chen" },
  { code: "OS301", name: "Operating Systems", credits: 3, grade: "A-", instructor: "Dr. Williams" },
];

const gradeColor: Record<string, "success" | "default" | "warning" | "secondary"> = {
  "A+": "success", A: "success", "A-": "success",
  "B+": "default", B: "default", "B-": "secondary",
  "C+": "warning", C: "warning",
};

export default function SubjectsPage() {
  const totalCredits = subjects.reduce((a, s) => a + s.credits, 0);

  return (
    <div className="p-5 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{subjects.length} subjects · {totalCredits} credits</p>
        </div>
      </div>

      <div className="grid gap-3">
        {subjects.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{s.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.code} · {s.instructor} · {s.credits} credits</p>
                </div>
                <Badge variant={gradeColor[s.grade] ?? "secondary"} className="text-sm font-bold">
                  {s.grade}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
