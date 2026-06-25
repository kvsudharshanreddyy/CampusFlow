"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  category: z.enum(["bug", "feature", "database", "integration", "general"], {
    message: "Please select a valid query category",
  }),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSupportPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      category: "general",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmittedData(data);
      toast.success("Support ticket registered successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Back link */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.push("/help")}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Help
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!submittedData ? (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card className="border-border bg-card/60 backdrop-blur-sm shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Support Team
                </CardTitle>
                <CardDescription className="text-xs">
                  Encountered an issue or have feedback? Send us a ticket and our development operations will respond shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="font-semibold text-muted-foreground">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="h-9 text-xs bg-muted/30"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-destructive flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5" /> {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="font-semibold text-muted-foreground">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@university.edu"
                        className="h-9 text-xs bg-muted/30"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-destructive flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5" /> {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="font-semibold text-muted-foreground">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="w-full h-9 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      {...register("category")}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="bug">Bug Report / Crash</option>
                      <option value="feature">Feature Request Suggestion</option>
                      <option value="database">Supabase Database Config</option>
                      <option value="integration">n8n / Google Sync Integration</option>
                    </select>
                    {errors.category && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5" /> {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="font-semibold text-muted-foreground">
                      Subject Title *
                    </label>
                    <Input
                      id="subject"
                      placeholder="Brief summary of your query"
                      className="h-9 text-xs bg-muted/30"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5" /> {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="font-semibold text-muted-foreground">
                      Detailed Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Please provide steps to reproduce, or detailed specifications of your question..."
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none bg-muted/30"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5" /> {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full text-xs font-semibold h-9" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Submitting Ticket...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Submit Support Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            <Card className="border-border bg-card/75 max-w-md mx-auto">
              <CardContent className="pt-6 p-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto border border-green-500/25">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    Support Ticket Created!
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed max-w-sm mx-auto">
                    Hi <span className="font-semibold text-foreground">{submittedData.name}</span>, your request under subject: 
                    <span className="font-mono text-foreground font-semibold"> "{submittedData.subject}"</span> has been registered. 
                    A confirmation message has been dispatched to <span className="font-semibold text-foreground">{submittedData.email}</span>.
                  </CardDescription>
                </div>

                <div className="pt-4 flex gap-2.5">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setSubmittedData(null)}
                  >
                    Send Another Ticket
                  </Button>
                  <Button
                    className="flex-1 text-xs"
                    onClick={() => router.push("/help")}
                  >
                    Return to Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
