"use client";

import { motion } from "framer-motion";
import { Briefcase, Plus, ExternalLink, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";

const applications = [
  { company: "Google", role: "Software Engineer Intern", status: "interviewing" as const, date: "Jun 10", logo: "G" },
  { company: "Microsoft", role: "Product Intern", status: "applied" as const, date: "Jun 14", logo: "M" },
  { company: "Stripe", role: "Frontend Engineer", status: "offered" as const, date: "Jun 5", logo: "S" },
  { company: "Notion", role: "Design Intern", status: "rejected" as const, date: "Jun 1", logo: "N" },
  { company: "Vercel", role: "DX Engineer Intern", status: "applied" as const, date: "Jun 18", logo: "V" },
];

const statusVariant: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  applied: "secondary",
  interviewing: "warning",
  offered: "success",
  rejected: "destructive",
  accepted: "success",
};

export default function PlacementPage() {
  const counts = {
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offered: applications.filter((a) => a.status === "offered").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="p-5 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Placement Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{applications.length} total applications</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Application
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Applied" value={counts.applied} icon={Briefcase} color="blue" delay={0} />
        <StatCard label="Interviewing" value={counts.interviewing} icon={Briefcase} color="amber" delay={0.08} />
        <StatCard label="Offers" value={counts.offered} icon={Briefcase} color="green" delay={0.16} />
        <StatCard label="Rejected" value={counts.rejected} icon={Briefcase} color="rose" delay={0.24} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {applications.map((app, i) => (
            <motion.div
              key={`${app.company}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/30 transition-colors group"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground shrink-0">
                {app.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{app.company}</p>
                <p className="text-xs text-muted-foreground truncate">{app.role}</p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">{app.date}</p>
              <Badge variant={statusVariant[app.status]} className="capitalize shrink-0 text-xs">
                {app.status}
              </Badge>
              <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
