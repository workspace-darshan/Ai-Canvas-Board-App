// ============================================================
// TopBar with Liveblocks — Version that uses Liveblocks hooks
// ============================================================

"use client";

import TopBar from "./TopBar";
import { useSelf, useOthers } from "@/liveblocks.config";

export default function TopBarWithLiveblocks() {
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
}
