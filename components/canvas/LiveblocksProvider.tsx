// ============================================================
// Liveblocks Provider — Real-time collaboration wrapper
// ============================================================

"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { getRoomId } from "@/lib/liveblocks";
import { useSession } from "next-auth/react";

interface LiveblocksProviderProps {
  boardId: string;
  children: ReactNode;
}

export default function LiveblocksProvider({ boardId, children }: LiveblocksProviderProps) {
  const { data: session } = useSession();

  // If no boardId or local board, render without collaboration
  if (!boardId || boardId === "local") {
    return <>{children}</>;
  }

  const roomId = getRoomId(boardId);

  // Get user info for presence
  const userInfo = session?.user
    ? {
        name: session.user.name || "Anonymous",
        avatar: session.user.image || undefined,
      }
    : {
        name: "Anonymous",
      };

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        user: userInfo,
      }}
      initialStorage={{
        snapshot: {},
      }}
    >
      {children}
    </RoomProvider>
  );
}
