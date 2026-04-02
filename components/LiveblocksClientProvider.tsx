// ============================================================
// Liveblocks Client Provider — App-level Liveblocks setup
// ============================================================

"use client";

import { ReactNode } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { LIVEBLOCKS_PUBLIC_KEY } from "@/lib/liveblocks";

export default function LiveblocksClientProvider({ children }: { children: ReactNode }) {
  if (!LIVEBLOCKS_PUBLIC_KEY) {
    return <>{children}</>;
  }

  return (
    <LiveblocksProvider publicApiKey={LIVEBLOCKS_PUBLIC_KEY}>
      {children}
    </LiveblocksProvider>
  );
}
