import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CampusFlow — AI-Powered Student Productivity",
    template: "%s | CampusFlow",
  },
  description:
    "The all-in-one AI-powered platform for student productivity. Manage tasks, calendar, attendance, placement prep, and more.",
  keywords: ["student", "productivity", "AI", "campus", "tasks", "attendance"],
  authors: [{ name: "CampusFlow" }],
  openGraph: {
    title: "CampusFlow",
    description: "AI-Powered Student Productivity Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
