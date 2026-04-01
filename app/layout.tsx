// ============================================================
// Root Layout — Dark theme, Inter font, Toaster
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Canvas Board — Smart Drawing & Flowchart Tool",
  description:
    "AI-powered collaborative drawing board with tldraw: create flowcharts, diagrams, and illustrations using natural language prompts.",
  keywords: [
    "AI drawing",
    "canvas",
    "flowchart",
    "tldraw",
    "collaborative whiteboard",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          {children}

          {/* Global toast notifications with dark theme */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
              },
            }}
            richColors
            closeButton
          />
        </SessionProvider>
      </body>
    </html>
  );
}
