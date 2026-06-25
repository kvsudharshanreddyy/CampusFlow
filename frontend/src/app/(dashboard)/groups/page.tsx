"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, UserPlus, UserMinus, Search, Calendar, BookOpen, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useStudyGroups,
  useCreateStudyGroup,
  useJoinStudyGroup,
  useLeaveStudyGroup,
} from "@/hooks/useGroups";
import { useCreateCalendarEvent } from "@/hooks/useAppData";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateGroupForm {
  name: string;
  description: string;
}

interface ScheduleSessionForm {
  title: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}

export default function StudyGroupsPage() {
  const { data: groups = [], isLoading } = useStudyGroups();
  const createGroup = useCreateStudyGroup();
  const joinGroup = useJoinStudyGroup();
  const leaveGroup = useLeaveStudyGroup();
  const createEvent = useCreateCalendarEvent();

  const [search, setSearch] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [scheduleGroupId, setScheduleGroupId] = useState<string | null>(null);

  const { register: groupRegister, handleSubmit: handleGroupSubmit, reset: resetGroup } = useForm<CreateGroupForm>();
  const { register: sessionRegister, handleSubmit: handleSessionSubmit, reset: resetSession } = useForm<ScheduleSessionForm>();

  const onAddGroup = async (form: CreateGroupForm) => {
    await createGroup.mutateAsync(form);
    resetGroup();
    setShowAddGroup(false);
  };

  const onScheduleSession = async (form: ScheduleSessionForm) => {
    if (!scheduleGroupId) return;

    const startTimeISO = new Date(`${form.start_date}T${form.start_time}`).toISOString();
    const endTimeISO = new Date(`${form.end_date}T${form.end_time}`).toISOString();

    await createEvent.mutateAsync({
      title: `Study Session: ${form.title}`,
      description: `Study group session for group ID: ${scheduleGroupId}`,
      start_time: startTimeISO,
      end_time: endTimeISO,
      event_type: "class",
    });

    resetSession();
    setScheduleGroupId(null);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Study Groups
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Collaborate with peers, schedule sessions, and prepare together</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAddGroup(true)}>
          <Plus className="h-3.5 w-3.5" /> Create Group
        </Button>
      </div>

      {/* Toolbar */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study groups..."
          className="h-9 pl-8 text-xs bg-muted/50"
        />
      </div>

      {/* Group Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-medium">No study groups found</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            Create a group using the button above to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full border-border flex flex-col justify-between hover:border-primary/20 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold truncate flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    {g.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 flex-1 flex flex-col justify-between pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {g.description || "No description provided."}
                  </p>
                  
                  {g.profiles && (
                    <p className="text-[10px] text-muted-foreground">
                      Created by: <span className="font-semibold text-foreground">{g.profiles.first_name} {g.profiles.last_name || ""}</span>
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-xs gap-1.5 flex-1"
                      onClick={() => setScheduleGroupId(g.id)}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Schedule
                    </Button>

                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-xs gap-1.5 shrink-0"
                      onClick={() => joinGroup.mutate(g.id)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Join
                    </Button>

                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-xs gap-1 text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => leaveGroup.mutate(g.id)}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <AnimatePresence>
        {showAddGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-bold text-sm">Create Study Group</h3>
                <button onClick={() => setShowAddGroup(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleGroupSubmit(onAddGroup)} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Group Name *</span>
                  <Input placeholder="e.g. Advanced Calculus Study Crew" {...groupRegister("name", { required: true })} />
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Description</span>
                  <textarea
                    placeholder="Topics to study, schedule guidelines, resources links..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    {...groupRegister("description")}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={createGroup.isPending}>
                    Create Group
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddGroup(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Session Modal */}
      <AnimatePresence>
        {scheduleGroupId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-bold text-sm">Schedule Study Session</h3>
                <button onClick={() => setScheduleGroupId(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSessionSubmit(onScheduleSession)} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Session Title *</span>
                  <Input placeholder="e.g. Midterm Preparation Review" {...sessionRegister("title", { required: true })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Start Date</span>
                    <Input type="date" {...sessionRegister("start_date", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Start Time</span>
                    <Input type="time" {...sessionRegister("start_time", { required: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">End Date</span>
                    <Input type="date" {...sessionRegister("end_date", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">End Time</span>
                    <Input type="time" {...sessionRegister("end_time", { required: true })} />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={createEvent.isPending}>
                    Schedule Session
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setScheduleGroupId(null)}>
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
