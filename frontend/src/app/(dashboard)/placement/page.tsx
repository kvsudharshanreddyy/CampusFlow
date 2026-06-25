"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Trash2, X } from "lucide-react";
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
  const { data: companies = [] } = usePlacementCompanies();

  const createMutation = useCreatePlacementApplication();
  const updateMutation = useUpdatePlacementApplication();
  const deleteMutation = useDeletePlacementApplication();

  const { register, handleSubmit, reset } = useForm<CreateAppForm>({
    defaultValues: { status: "applied", date_applied: new Date().toISOString().split("T")[0] }
  });

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
      date_applied: new Date(form.date_applied).toISOString(),
      notes: form.notes || "",
    });
    reset();
    setShowAdd(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto relative">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            Placement Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{applications.length} total tracked applications</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105 border-0">
          <Plus className="h-4 w-4" /> Add Application
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
      <Card className="bg-background/40 backdrop-blur-xl border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Active Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {appsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl bg-muted/40 backdrop-blur-sm" />
            ))
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-background/30 rounded-2xl border border-border/30">
              <Briefcase className="h-12 w-12 text-cyan-500/40 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
              <p className="text-sm font-semibold text-foreground">No applications tracked yet</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Add your first application to begin tracking your placement journey.
              </p>
            </div>
          ) : (
            applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ease: "easeOut" }}
                className="flex items-center gap-4 rounded-xl border border-border/50 p-3.5 bg-background/50 hover:bg-white/[0.02] hover:border-cyan-500/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0 uppercase border border-cyan-500/20">
                  {app.companies?.name?.substring(0, 2) ?? "CO"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-cyan-100 transition-colors">{app.companies?.name ?? "Unknown Company"}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.role_title}</p>
                </div>
                
                <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline shrink-0 bg-muted/50 px-2 py-1 rounded-md">
                  {new Date(app.date_applied).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                </span>

                {/* Status selector */}
                <select
                  value={app.status}
                  onChange={(e) => updateMutation.mutate({ id: app.id, updates: { status: e.target.value as any } })}
                  className="text-xs bg-background/60 border border-border/50 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 cursor-pointer hover:border-cyan-500/40 transition-colors font-medium"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>

                <Badge variant={statusVariant[app.status]} className="capitalize shrink-0 text-[10px] py-0.5 px-2 font-bold shadow-sm">
                  {app.status}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteMutation.mutate(app.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/20 hover:text-red-400 transition-all shrink-0 h-8 w-8 rounded-lg ml-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Application Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-background/80 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Track New Application</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company *</label>
                  <select
                    className="w-full h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 [color-scheme:dark]"
                    {...register("company_id", { required: true })}
                  >
                    <option value="" className="bg-background">Choose a company...</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id} className="bg-background">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role Title *</label>
                  <Input 
                    placeholder="e.g. Software Engineer Intern" 
                    className="bg-black/20 border-white/10 focus-visible:ring-cyan-500/50"
                    {...register("role_title", { required: true })} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Applied *</label>
                    <Input 
                      type="date" 
                      className="bg-black/20 border-white/10 focus-visible:ring-cyan-500/50 [color-scheme:dark]"
                      {...register("date_applied", { required: true })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                    <select
                      className="w-full h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 [color-scheme:dark]"
                      {...register("status")}
                    >
                      <option value="applied" className="bg-background">Applied</option>
                      <option value="interviewing" className="bg-background">Interviewing</option>
                      <option value="offered" className="bg-background">Offered</option>
                      <option value="rejected" className="bg-background">Rejected</option>
                      <option value="accepted" className="bg-background">Accepted</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-[1.02] border-0 h-10"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Saving..." : "Track Application"}
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
