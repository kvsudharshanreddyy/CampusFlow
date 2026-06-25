"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-8xl font-black text-destructive mb-4">500</p>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground font-mono mb-4">Error ID: {error.digest}</p>
          )}
          <div className="flex items-center justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
