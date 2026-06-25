"use client";

import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Lock, Database, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <main className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.push("/help")}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Help
        </Button>

        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy Policy & Terms
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last Updated: June 25, 2026. Review our terms of data processing, encryption, and third-party model integrations.
          </p>
        </div>
      </div>

      {/* Main card */}
      <Card className="border-border bg-card/45">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Lock className="h-4.5 w-4.5 text-primary" />
            Data Protection Guidelines
          </CardTitle>
          <CardDescription className="text-xs">
            We prioritize the security of academic and personal records through Supabase encryption and strict policy configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-5 text-xs text-muted-foreground leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary shrink-0" />
              1. Database & Supabase Hosting
            </h3>
            <p>
              All academic information—including subject records, attendance history, task deadlines, and calendar events—is written to Supabase PostgreSQL instances. Row-Level Security (RLS) is activated across all database schemas. This ensures that only authenticated tokens can write, query, or edit their respective profile records.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-primary shrink-0" />
              2. Third-Party Integrations & APIs
            </h3>
            <p>
              CampusFlow leverages advanced automation hooks and AI frameworks to perform tasks:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">AI Engines:</strong> Prompts sent to the flashcard and study planners are securely processed by Groq or OpenAI APIs. Prompts do not store user database identifiers and are treated as transient query structures.
              </li>
              <li>
                <strong className="text-foreground">n8n Automations:</strong> Event reminders, attendance notifications, and placement trackers use n8n server logs. These systems process WhatsApp template dispatches only on explicit request triggers.
              </li>
              <li>
                <strong className="text-foreground">Google Calendar Sync:</strong> Access tokens generated during profile calendar integration are encrypted before entry into database states.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground">3. Authentication & Sessions</h3>
            <p>
              Your session is authenticated via secure JSON Web Tokens (JWT) stored in browser memory/cookies. Passwords stored in Supabase are hashed using bcrypt. We do not inspect or save raw passwords on backend logs.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground">4. Compliance & Contact</h3>
            <p>
              You maintain full control of your academic data. You can completely modify your profile parameters or request complete account deletion at any time via Settings. If you have questions regarding data privacy, please raise a ticket on our contact portal.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
