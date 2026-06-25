import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
