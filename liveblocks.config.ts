import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "",
});

// Presence represents the properties that exist on every user in the Room
type Presence = {
  cursor: { x: number; y: number } | null;
  user: {
    name: string;
    avatar?: string;
  };
  selectedShapes?: string[]; // IDs of shapes selected by this user
};

// Storage represents the shared document that persists in the Room
type Storage = {
  snapshot: any; // tldraw snapshot
};

// Optionally, UserMeta represents static/readonly metadata on each user
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    avatar?: string;
  };
};

// Optionally, the type of custom events broadcast and listened to in this room
type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
