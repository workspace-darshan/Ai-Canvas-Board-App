// ============================================================
// CanvasBoard — Main tldraw canvas wrapper
// Renders the full-viewport drawing canvas with custom dark theme
// ============================================================

"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Tldraw, Editor, TLShapeId } from "tldraw";
import "tldraw/tldraw.css";
import { useCanvasStore } from "@/store/canvasStore";
import type { Tool } from "@/types";
import { getApiUrl } from "@/lib/config";
import { toast } from "sonner";

export default function CanvasBoard() {
  const { setEditor, setZoomLevel, editor, setActiveTool, activeTool, currentGeoType, boardId, setBoardTitle } = useCanvasStore();
  const [selectedShape, setSelectedShape] = useState<{ id: TLShapeId; bounds: any } | null>(null);
  const [cursorGhost, setCursorGhost] = useState<{ type: string; x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);

  // Load board content from API when editor is ready and boardId is set
  useEffect(() => {
    if (!editor || !boardId || boardId === "local" || isLoadingBoard) return;

    const loadBoard = async () => {
      setIsLoadingBoard(true);
      try {
        const response = await fetch(getApiUrl(`/api/boards/${boardId}`));
        
        if (response.ok) {
          const board = await response.json();
          
          // Set board title
          if (board.title) {
            setBoardTitle(board.title);
          }
          
          // Load board content into editor
          if (board.content) {
            try {
              const snapshot = JSON.parse(board.content);
              // Use the correct tldraw method to load snapshot
              editor.store.mergeRemoteChanges(() => {
                editor.store.put(Object.values(snapshot.store));
              });
              console.log("Board content loaded successfully");
            } catch (error) {
              console.error("Failed to parse board content:", error);
              toast.error("Failed to load board content");
            }
          }
        } else {
          console.error("Failed to fetch board");
          toast.error("Failed to load board");
        }
      } catch (error) {
        console.error("Error loading board:", error);
        toast.error("Failed to load board");
      } finally {
        setIsLoadingBoard(false);
      }
    };

    loadBoard();
  }, [editor, boardId, setBoardTitle]); // Only run when editor or boardId changes

  /**
   * Called when the tldraw editor mounts.
   */
  const handleMount = useCallback(
    (editor: Editor) => {
      setEditor(editor);
      editor.user.updateUserPreferences({ colorScheme: "dark" });

      const removeListener = editor.store.listen(
        () => {
          const zoom = editor.getZoomLevel();
          setZoomLevel(zoom);
        },
        { source: "user", scope: "session" }
      );

      // Listen for tool changes to keep store in sync
      const removeToolListener = editor.store.listen(
        () => {
          const currentTool = editor.getCurrentToolId();
          // Map tldraw tool IDs to our Tool type
          const toolMap: Record<string, Tool> = {
            'select': 'select',
            'hand': 'hand',
            'draw': 'draw',
            'eraser': 'eraser',
            'arrow': 'arrow',
            'text': 'text',
            'note': 'note',
            'frame': 'frame',
          };
          
          // For geo tool, keep the current activeTool (don't override with 'rectangle')
          if (currentTool === 'geo') {
            // Don't change activeTool - it's already set correctly (rectangle/ellipse/diamond)
            return;
          }
          
          const mappedTool = toolMap[currentTool];
          if (mappedTool) {
            setActiveTool(mappedTool);
          }
        },
        { source: "user", scope: "session" }
      );

      return () => {
        removeListener();
        removeToolListener();
        setEditor(null);
      };
    },
    [setEditor, setZoomLevel, setActiveTool]
  );

  // Track cursor position for ghost preview
  useEffect(() => {
    if (!editor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Get the current tool from tldraw
      const currentTool = editor.getCurrentToolId();
      
      // For geo shapes, use the currentGeoType from store
      if (currentTool === 'geo') {
        setCursorGhost({
          type: currentGeoType,
          x: e.clientX,
          y: e.clientY,
        });
      } else if (currentTool === 'text') {
        setCursorGhost({
          type: 'text',
          x: e.clientX,
          y: e.clientY,
        });
      } else if (currentTool === 'note') {
        setCursorGhost({
          type: 'note',
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        setCursorGhost(null);
      }
    };

    const handleClick = () => {
      // Clear ghost after placing shape (with small delay to let tldraw create the shape first)
      setTimeout(() => {
        setCursorGhost(null);
      }, 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [editor, currentGeoType]); // Removed cursorGhost from dependencies to prevent loop

  // Canvas overlay for alignment guides and ghost preview
  useEffect(() => {
    if (!editor || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDragging = false;
    let draggedShapeId: TLShapeId | null = null;

    const handlePointerDown = () => {
      const selected = editor.getSelectedShapes();
      if (selected.length === 1) {
        isDragging = true;
        draggedShapeId = selected[0].id;
      }
    };

    const handlePointerMove = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw alignment guides if dragging
      if (isDragging && draggedShapeId) {
        const draggedBounds = editor.getShapePageBounds(draggedShapeId);
        if (draggedBounds) {
          const allShapes = editor.getCurrentPageShapes();
          const guides: Array<{ type: 'vertical' | 'horizontal'; position: number }> = [];
          const SNAP_THRESHOLD = 6;

          allShapes.forEach(shape => {
            if (shape.id === draggedShapeId) return;
            
            const bounds = editor.getShapePageBounds(shape.id);
            if (!bounds) return;

            if (Math.abs(draggedBounds.center.x - bounds.center.x) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: bounds.center.x, y: 0 });
              guides.push({ type: 'vertical', position: screenPos.x });
            }

            if (Math.abs(draggedBounds.center.y - bounds.center.y) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: 0, y: bounds.center.y });
              guides.push({ type: 'horizontal', position: screenPos.y });
            }

            if (Math.abs(draggedBounds.minX - bounds.minX) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: bounds.minX, y: 0 });
              guides.push({ type: 'vertical', position: screenPos.x });
            }

            if (Math.abs(draggedBounds.maxX - bounds.maxX) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: bounds.maxX, y: 0 });
              guides.push({ type: 'vertical', position: screenPos.x });
            }

            if (Math.abs(draggedBounds.minY - bounds.minY) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: 0, y: bounds.minY });
              guides.push({ type: 'horizontal', position: screenPos.y });
            }

            if (Math.abs(draggedBounds.maxY - bounds.maxY) < SNAP_THRESHOLD) {
              const screenPos = editor.pageToScreen({ x: 0, y: bounds.maxY });
              guides.push({ type: 'horizontal', position: screenPos.y });
            }
          });

          ctx.strokeStyle = '#FF4444';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);

          guides.forEach(guide => {
            ctx.beginPath();
            if (guide.type === 'vertical') {
              ctx.moveTo(guide.position, 0);
              ctx.lineTo(guide.position, canvas.height);
            } else {
              ctx.moveTo(0, guide.position);
              ctx.lineTo(canvas.width, guide.position);
            }
            ctx.stroke();
          });
        }
      }

      // Draw cursor ghost preview
      if (cursorGhost) {
        const size = getShapeSize(cursorGhost.type);
        const x = cursorGhost.x - size.w / 2;
        const y = cursorGhost.y - size.h / 2;

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.fillStyle = 'rgba(255, 68, 68, 0.1)';

        if (cursorGhost.type === 'rectangle') {
          ctx.strokeRect(x, y, size.w, size.h);
          ctx.fillRect(x, y, size.w, size.h);
        } else if (cursorGhost.type === 'ellipse') {
          ctx.beginPath();
          ctx.ellipse(x + size.w / 2, y + size.h / 2, size.w / 2, size.h / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        } else if (cursorGhost.type === 'diamond') {
          const cx = x + size.w / 2;
          const cy = y + size.h / 2;
          ctx.beginPath();
          ctx.moveTo(cx, y);
          ctx.lineTo(x + size.w, cy);
          ctx.lineTo(cx, y + size.h);
          ctx.lineTo(x, cy);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        } else if (cursorGhost.type === 'hexagon') {
          const cx = x + size.w / 2;
          const cy = y + size.h / 2;
          const rx = size.w / 2;
          const ry = size.h / 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const px = cx + rx * Math.cos(angle);
            const py = cy + ry * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        } else if (cursorGhost.type === 'text') {
          ctx.strokeRect(x, y, size.w, size.h);
          ctx.fillRect(x, y, size.w, size.h);
          // Draw "Text" label
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = '#FF4444';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Text', x + size.w / 2, y + size.h / 2);
        } else if (cursorGhost.type === 'note') {
          ctx.strokeRect(x, y, size.w, size.h);
          ctx.fillStyle = 'rgba(255, 255, 100, 0.2)';
          ctx.fillRect(x, y, size.w, size.h);
          // Draw "Note" label
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = '#FFFF64';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Note', x + size.w / 2, y + size.h / 2);
        }

        ctx.restore();
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      draggedShapeId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [editor, cursorGhost]);



  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      <DotGrid />
      
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
        }}
      >
        <Tldraw
          onMount={handleMount}
          options={{
            maxPages: 10,
          }}
          hideUi
        />
      </div>
    </>
  );
}

function getShapeSize(shapeType: string): { w: number; h: number } {
  switch (shapeType) {
    case 'rectangle':
      return { w: 160, h: 80 };
    case 'ellipse':
      return { w: 80, h: 80 };
    case 'diamond':
      return { w: 100, h: 100 };
    case 'text':
      return { w: 120, h: 40 };
    case 'note':
      return { w: 200, h: 200 };
    case 'hexagon':
      return { w: 100, h: 86 };
    default:
      return { w: 100, h: 100 };
  }
}

function createArrowBetweenShapes(editor: Editor, fromId: TLShapeId, toId: TLShapeId) {
  const fromBounds = editor.getShapePageBounds(fromId);
  const toBounds = editor.getShapePageBounds(toId);
  
  if (!fromBounds || !toBounds) return;

  const dx = toBounds.center.x - fromBounds.center.x;
  const dy = toBounds.center.y - fromBounds.center.y;
  
  let fromAnchor: { x: number; y: number };
  let toAnchor: { x: number; y: number };
  
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      fromAnchor = { x: 1, y: 0.5 };
      toAnchor = { x: 0, y: 0.5 };
    } else {
      fromAnchor = { x: 0, y: 0.5 };
      toAnchor = { x: 1, y: 0.5 };
    }
  } else {
    if (dy > 0) {
      fromAnchor = { x: 0.5, y: 1 };
      toAnchor = { x: 0.5, y: 0 };
    } else {
      fromAnchor = { x: 0.5, y: 0 };
      toAnchor = { x: 0.5, y: 1 };
    }
  }

  const startX = fromBounds.minX + fromBounds.width * fromAnchor.x;
  const startY = fromBounds.minY + fromBounds.height * fromAnchor.y;
  const endX = toBounds.minX + toBounds.width * toAnchor.x;
  const endY = toBounds.minY + toBounds.height * toAnchor.y;

  editor.createShape({
    type: 'arrow',
    x: startX,
    y: startY,
    props: {
      start: { x: 0, y: 0 },
      end: { x: endX - startX, y: endY - startY },
      arrowheadStart: 'none',
      arrowheadEnd: 'arrow',
    },
  });
}

function DotGrid() {
  const { zoomLevel } = useCanvasStore();
  
  const shouldShow = zoomLevel > 1.5;
  const opacity = shouldShow ? Math.min((zoomLevel - 1.5) * 0.3, 0.15) : 0;
  
  if (!shouldShow) return null;
  
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(124, 92, 252, ${opacity}) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        transition: "opacity var(--transition-base)",
      }}
    />
  );
}
