import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md gradient-primary flex items-center justify-center">
            <GraduationCap className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">CampusFlow</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} CampusFlow. AI-Powered Student Productivity.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
