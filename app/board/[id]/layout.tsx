// ============================================================
// Board Layout — full-viewport canvas layout
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board — AI Canvas Board",
  description: "Draw, create flowcharts, and use AI on your canvas board.",
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
