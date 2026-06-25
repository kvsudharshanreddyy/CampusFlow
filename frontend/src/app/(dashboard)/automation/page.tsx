"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Lock,
  Terminal,
  Play,
  Copy,
  Check,
  Server,
} from "lucide-react";
import { useAutomationLogs } from "@/hooks/useAppData";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";

// SSE / Webhook configuration constants for copy-pasting
const WEBHOOK_URL = "http://localhost:5000/api/v1/automation-logs/webhooks";
const SECURE_TOKEN = "dev_automation_secret_123";

const statusConfig = {
  success: { icon: CheckCircle, color: "text-green-500 bg-green-500/10", border: "border-green-500/20" },
  failed: { icon: XCircle, color: "text-rose-500 bg-rose-500/10", border: "border-rose-500/20" },
  pending: { icon: RefreshCw, color: "text-amber-500 bg-amber-500/10", border: "border-amber-500/20" },
};

export default function AutomationDashboardPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useAutomationLogs();
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const logs = data?.data ?? [];
  const stats = data?.meta?.stats ?? { success: 0, failed: 0, total: 0 };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setCopiedUrl(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(SECURE_TOKEN);
    setCopiedToken(true);
    toast.success("Security Token copied to clipboard");
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Simulate an n8n webhook execution call to the backend
  const handleTriggerSimulation = async () => {
    setSimulating(true);
    const mockWorkflows = [
      { name: "Deadline Reminder", status: "success", msg: "Sent 4 WhatsApp reminders for assignments due tomorrow." },
      { name: "Attendance Reminder", status: "failed", msg: "Failed to dispatch WhatsApp warning: Rate limit reached." },
      { name: "Welcome Workflow", status: "success", msg: "Welcome messages successfully sent to 2 new registered users." },
      { name: "Notice Broadcast", status: "success", msg: "Broadcasted notice 'End Semester Exam Schedule' to all CS groups." },
      { name: "Calendar Sync", status: "success", msg: "Synced 5 new events from Google Calendar to local dashboard." },
    ];

    const randomRun = mockWorkflows[Math.floor(Math.random() * mockWorkflows.length)];

    try {
      // Direct call to webhook endpoint with authentication token
      await axios.post(
        WEBHOOK_URL,
        {
          workflow_name: randomRun.name,
          status: randomRun.status,
          message: randomRun.msg,
        },
        {
          headers: {
            "X-Automation-Token": SECURE_TOKEN,
          },
        }
      );

      toast.success(`Simulation completed: logged "${randomRun.name}"`);
      queryClient.invalidateQueries({ queryKey: ["automation", "logs"] });
      refetch();
    } catch (err: any) {
      console.error("Failed to run webhook log simulation:", err);
      toast.error("Failed to trigger simulation. Verify backend server is running.");
    } finally {
      setSimulating(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.workflow_name.toLowerCase().includes(search.toLowerCase()) ||
    (log.message && log.message.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary fill-primary/20" />
            n8n Automation Workflows
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure webhooks, verify retry logs, and monitor background sync actions.
          </p>
        </div>
        <Button
          onClick={handleTriggerSimulation}
          disabled={simulating}
          className="gap-1.5 shrink-0 self-start sm:self-auto"
        >
          {simulating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
          Trigger simulation
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Workflow Runs</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total ?? 0}</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Success Rate</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.total > 0
                  ? `${Math.round(((stats.success ?? 0) / stats.total) * 100)}%`
                  : "0%"}
              </h3>
            </div>
            <div className="h-10 w-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Execution Failures</p>
              <h3 className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
                {stats.failed ?? 0}
              </h3>
            </div>
            <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
              <XCircle className="h-5 w-5 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left Logs / Right Setup Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Workflow Logs</CardTitle>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="h-8 pl-8 text-xs bg-muted"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Terminal className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">No automation logs registered</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    Try clicking "Trigger simulation" to write mock logs.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-medium">
                        <th className="py-2.5">Workflow Name</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Outcome Detail</th>
                        <th className="py-2.5 text-right">Run Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => {
                        const conf = statusConfig[log.status] || statusConfig.pending;
                        const StatusIcon = conf.icon;
                        const date = new Date(log.created_at);

                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-border hover:bg-accent/20 transition-colors"
                          >
                            <td className="py-3 font-semibold text-foreground flex items-center gap-2">
                              <Zap className="h-3 w-3 text-primary shrink-0" />
                              {log.workflow_name}
                            </td>
                            <td className="py-3">
                              <Badge
                                variant={log.status === "success" ? "success" : log.status === "failed" ? "destructive" : "warning"}
                                className="text-[10px] py-0 px-1.5 capitalize font-semibold shrink-0"
                              >
                                <StatusIcon className="h-2.5 w-2.5 mr-1 inline-block" />
                                {log.status}
                              </Badge>
                            </td>
                            <td className="py-3 text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                              {log.message || "Execution completed."}
                            </td>
                            <td className="py-3 text-right text-muted-foreground">
                              {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Setup column */}
        <div className="space-y-4">
          {/* Security & Endpoint Setup */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-primary" />
                Connection Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs pt-0">
              {/* Webhook Endpoint */}
              <div className="space-y-1.5">
                <span className="font-medium text-muted-foreground">Log Webhook URL</span>
                <div className="flex items-center gap-2 rounded-lg bg-muted border border-border px-3 py-1.5">
                  <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <code className="text-[10px] text-foreground font-mono flex-1 truncate">
                    {WEBHOOK_URL}
                  </code>
                  <button onClick={handleCopyUrl} className="text-muted-foreground hover:text-foreground">
                    {copiedUrl ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security Header Token */}
              <div className="space-y-1.5">
                <span className="font-medium text-muted-foreground">Security Header Token</span>
                <div className="flex items-center gap-2 rounded-lg bg-muted border border-border px-3 py-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <code className="text-[10px] text-foreground font-mono flex-1 truncate">
                    X-Automation-Token: {SECURE_TOKEN}
                  </code>
                  <button onClick={handleCopyToken} className="text-muted-foreground hover:text-foreground">
                    {copiedToken ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 space-y-1.5 text-muted-foreground leading-relaxed text-[11px]">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <Terminal className="h-3.5 w-3.5 text-primary" /> How it works:
                </p>
                <p>
                  1. n8n workflow finishes run.<br />
                  2. n8n triggers POST request to log endpoint.<br />
                  3. CampusFlow backend validates signature header.<br />
                  4. Log entry registers successfully in dashboard history logs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
