// ============================================================
// TopBar with Liveblocks — Version that uses Liveblocks hooks
// ============================================================

"use client";

import { Suspense } from "react";
import TopBar from "./TopBar";
import { useSelf, useOthers } from "@/liveblocks.config";

function TopBarContent() {
  try {
    const currentUser = useSelf();
    const others = useOthers();

    // Build active users list
    const activeUsers = [
      // Current user
      ...(currentUser
        ? [{
            id: currentUser.connectionId,
            name: currentUser.info?.name || "You",
            image: currentUser.info?.avatar,
            color: "#4f6ef7",
          }]
        : []),
      // Other users
      ...others.map((other: any, index: number) => ({
        id: other.connectionId,
        name: other.info?.name || "Anonymous",
        image: other.info?.avatar,
        color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
      })),
    ];

    return <TopBar activeUsers={activeUsers} />;
  } catch (error) {
    // Fallback if Liveblocks hooks fail
    return <TopBar activeUsers={[]} />;
  }
}

export default function TopBarWithLiveblocks() {
  return (
    <Suspense fallback={<TopBar activeUsers={[]} />}>
      <TopBarContent />
    </Suspense>
  );
}
