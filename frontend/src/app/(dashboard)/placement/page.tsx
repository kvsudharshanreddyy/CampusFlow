"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, ExternalLink, Trash2, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  usePlacementApplications,
  usePlacementCompanies,
  useCreatePlacementApplication,
  useUpdatePlacementApplication,
  useDeletePlacementApplication,
} from "@/hooks/usePlacement";
import { useForm } from "react-hook-form";
import type { PlacementEntry } from "@/types";

const statusVariant: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  applied: "secondary",
  interviewing: "warning",
  offered: "success",
  rejected: "destructive",
  accepted: "success",
};

interface CreateAppForm {
  company_id: string;
  role_title: string;
  date_applied: string;
  status: string;
  notes?: string;
}

export default function PlacementPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { data: applications = [], isLoading: appsLoading } = usePlacementApplications();
  const { data: companies = [], isLoading: cosLoading } = usePlacementCompanies();

  const createMutation = useCreatePlacementApplication();
  const updateMutation = useUpdatePlacementApplication();
  const deleteMutation = useDeletePlacementApplication();

  const { register, handleSubmit, reset } = useForm<CreateAppForm>();

  const counts = {
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offered: applications.filter((a) => a.status === "offered").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const onSubmit = async (form: CreateAppForm) => {
    await createMutation.mutateAsync({
      company_id: form.company_id,
      role_title: form.role_title,
      status: form.status as any,
      date_applied: form.date_applied,
      notes: form.notes || "",
    });
    reset();
    setShowAdd(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Placement Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{applications.length} total tracked applications</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Applied" value={counts.applied} icon={Briefcase} color="blue" delay={0} />
        <StatCard label="Interviewing" value={counts.interviewing} icon={Briefcase} color="amber" delay={0.08} />
        <StatCard label="Offers" value={counts.offered} icon={Briefcase} color="green" delay={0.16} />
        <StatCard label="Rejected" value={counts.rejected} icon={Briefcase} color="rose" delay={0.24} />
      </div>

      {/* Applications list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Active Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {appsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium">No job applications tracked yet</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Add an application using the button above to begin tracking.
              </p>
            </div>
          ) : (
            applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/20 hover:bg-accent/10 transition-all group"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 capitalize">
                  {app.companies?.name?.substring(0, 2) ?? "CO"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{app.companies?.name ?? "Unknown Company"}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.role_title}</p>
                </div>
                
                <span className="text-[10px] text-muted-foreground hidden sm:inline shrink-0">
                  {new Date(app.date_applied).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>

                {/* Status selector */}
                <select
                  value={app.status}
                  onChange={(e) => updateMutation.mutate({ id: app.id, updates: { status: e.target.value as any } })}
                  className="text-xs bg-transparent border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>

                <Badge variant={statusVariant[app.status]} className="capitalize shrink-0 text-[10px] py-0 px-1.5 font-semibold">
                  {app.status}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteMutation.mutate(app.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Application Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-bold text-sm">Track Job Application</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Select Company *</span>
                  <select
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("company_id", { required: true })}
                  >
                    <option value="">Choose a company...</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Role Title *</span>
                  <Input placeholder="e.g. Software Engineer Intern" {...register("role_title", { required: true })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Date Applied *</span>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} {...register("date_applied", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Status</span>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-transparent px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                      {...register("status", { required: true })}
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offered">Offered</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Notes</span>
                  <Input placeholder="Additional details, referral codes, links..." {...register("notes")} />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                    Add Application
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
