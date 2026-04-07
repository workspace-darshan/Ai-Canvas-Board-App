// ============================================================
// Collaborative Canvas — tldraw with Liveblocks integration
// Real-time multiplayer canvas with simple storage sync
// ============================================================

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { useRoom, useSelf, useStorage, useMutation, useMyPresence, useOthers } from "@/liveblocks.config";
import { useCanvasStore } from "@/store/canvasStore";

export default function CollaborativeCanvas() {
  const room = useRoom();
  const { setEditor, setZoomLevel } = useCanvasStore();
  const currentUser = useSelf();
  const editorRef = useRef<Editor | null>(null);
  const isLoadingRef = useRef(false);
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  // Fallback timeout to ensure loading screen doesn't stay forever
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isContentLoaded) {
        console.warn("Loading timeout reached, showing canvas anyway");
        setIsContentLoaded(true);
      }
    }, 10000); // 10 second max wait

    return () => clearTimeout(timeout);
  }, [isContentLoaded]);

  // Get snapshot from Liveblocks storage
  const snapshot = useStorage((root) => root.snapshot) as any;

  // Mutation to update snapshot in Liveblocks
  const updateSnapshot = useMutation(({ storage }, newSnapshot: any) => {
    storage.set("snapshot", newSnapshot);
  }, []);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      setEditor(editor);
      
      editor.user.updateUserPreferences({ 
        colorScheme: "dark",
        name: currentUser?.info?.name || "Anonymous",
      });

      // Load initial snapshot from Liveblocks
      if (snapshot && snapshot.store) {
        const records = Object.values(snapshot.store);
        if (records.length > 0 && !isLoadingRef.current) {
          isLoadingRef.current = true;
          try {
            editor.store.mergeRemoteChanges(() => {
              editor.store.put(records as any);
            });
            console.log("Loaded", records.length, "shapes from Liveblocks");
          } catch (e) {
            console.error("Failed to load snapshot:", e);
          }
        }
      }
      
      // Always show canvas after mount
      setIsContentLoaded(true);

      // Track selection changes
      const handleSelectionChange = () => {
        const selectedShapeIds = Array.from(editor.getSelectedShapeIds());
        updateMyPresence({ selectedShapes: selectedShapeIds });
      };

      editor.on("change", handleSelectionChange);

      // Listen for local changes and sync to Liveblocks
      let syncTimeout: NodeJS.Timeout;
      const unsubscribe = editor.store.listen(
        () => {
          // Debounce updates to avoid too many syncs
          clearTimeout(syncTimeout);
          syncTimeout = setTimeout(() => {
            const newSnapshot = editor.store.getStoreSnapshot();
            updateSnapshot(newSnapshot);
          }, 100);
        },
        { source: "user", scope: "document" }
      );

      // Track zoom level
      const removeZoomListener = editor.store.listen(
        () => {
          const zoom = editor.getZoomLevel();
          setZoomLevel(zoom);
        },
        { source: "user", scope: "session" }
      );

      return () => {
        clearTimeout(syncTimeout);
        unsubscribe();
        removeZoomListener();
        editor.off("change", handleSelectionChange);
        setEditor(null);
        editorRef.current = null;
      };
    },
    [setEditor, setZoomLevel, currentUser, updateSnapshot, updateMyPresence]
  );

  // Listen for remote changes from Liveblocks (from other users)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !snapshot || !snapshot.store) return;
    
    // Skip if this is the initial load
    if (isLoadingRef.current) {
      isLoadingRef.current = false;
      return;
    }

    try {
      const records = Object.values(snapshot.store);
      if (records.length > 0) {
        editor.store.mergeRemoteChanges(() => {
          editor.store.put(records as any);
        });
        console.log("Applied remote changes:", records.length, "shapes");
      }
    } catch (e) {
      console.error("Failed to apply remote changes:", e);
    }
  }, [snapshot]);

  // Track cursor position
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      updateMyPresence({
        cursor: { x: e.clientX, y: e.clientY },
        user: {
          name: currentUser?.info?.name || "Anonymous",
          avatar: currentUser?.info?.avatar,
        },
      });
    };

    const handlePointerLeave = () => {
      updateMyPresence({ cursor: null });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [updateMyPresence, currentUser]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1 }}>
      {/* Loading Overlay */}
      {!isContentLoaded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            zIndex: 10000,
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid rgba(255, 255, 255, 0.1)",
              borderTop: "4px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          
          {/* Loading Text */}
          <div
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Loading board content...
          </div>
          
          {/* Subtext */}
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Please wait while we fetch your shapes
          </div>
        </div>
      )}
      
      <Tldraw
        onMount={handleMount}
        hideUi
        options={{
          maxPages: 10,
        }}
      />
      
      {/* Render selection highlights for other users */}
      {others.map((other) => {
        const selectedShapes = other.presence?.selectedShapes || [];
        const userName = other.presence?.user?.name || "Anonymous";
        const userColor = `hsl(${(other.connectionId * 137.5) % 360}, 70%, 60%)`;
        
        return selectedShapes.map((shapeId) => {
          const editor = editorRef.current;
          if (!editor) return null;
          
          const shape = editor.getShape(shapeId as any);
          if (!shape) return null;
          
          const bounds = editor.getShapePageBounds(shapeId as any);
          if (!bounds) return null;
          
          const pagePoint = editor.pageToScreen({ x: bounds.x, y: bounds.y });
          const zoom = editor.getZoomLevel();
          
          return (
            <div
              key={`${other.connectionId}-${shapeId}`}
              style={{
                position: "fixed",
                left: pagePoint.x,
                top: pagePoint.y,
                width: bounds.width * zoom,
                height: bounds.height * zoom,
                border: `2px solid ${userColor}`,
                borderRadius: "4px",
                pointerEvents: "none",
                zIndex: 9998,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.1), 0 0 8px ${userColor}40`,
              }}
            >
              {/* User label on selection */}
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  left: 0,
                  padding: "2px 6px",
                  borderRadius: "3px",
                  background: userColor,
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {userName}
              </div>
            </div>
          );
        });
      })}
      
      {/* Render other users' cursors */}
      {others.map((other) => {
        if (!other.presence?.cursor) return null;
        
        const { x, y } = other.presence.cursor;
        const userName = other.presence.user?.name || "Anonymous";
        const userColor = `hsl(${(other.connectionId * 137.5) % 360}, 70%, 60%)`;

        return (
          <div
            key={other.connectionId}
            style={{
              position: "fixed",
              left: x,
              top: y,
              pointerEvents: "none",
              zIndex: 9999,
              transition: "left 0.1s ease-out, top 0.1s ease-out",
            }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: "translate(-2px, -2px)",
              }}
            >
              <path
                d="M5.65376 12.3673L8.84496 15.5585L12.9316 21.9L15.3557 19.4759L11.2691 13.1346L17.6103 9.04804L5.65376 12.3673Z"
                fill={userColor}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* Username label */}
            <div
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                padding: "4px 8px",
                borderRadius: "4px",
                background: userColor,
                color: "white",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {userName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
