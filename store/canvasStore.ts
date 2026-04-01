// ============================================================
// Zustand Store — Canvas & App State Management
// ============================================================

import { create } from "zustand";
import type { Tool, CanvasPage } from "@/types";
import type { Editor } from "tldraw";

interface CanvasState {
  // --- Editor Reference ---
  /** tldraw editor instance, set when the canvas mounts */
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;

  // --- Active Tool ---
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  
  // --- Current Geo Type (for rectangle/ellipse/diamond/hexagon) ---
  currentGeoType: string;
  setCurrentGeoType: (geoType: string) => void;

  // --- Board Meta ---
  boardId: string | null;
  boardTitle: string;
  setBoardId: (id: string | null) => void;
  setBoardTitle: (title: string) => void;

  // --- Pages ---
  pages: CanvasPage[];
  activePageId: string;
  setPages: (pages: CanvasPage[]) => void;
  setActivePageId: (id: string) => void;
  addPage: (page: CanvasPage) => void;

  // --- AI Prompt ---
  isAILoading: boolean;
  aiPrompt: string;
  setAILoading: (loading: boolean) => void;
  setAIPrompt: (prompt: string) => void;

  // --- Panels ---
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;

  // --- Theme ---
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // --- Grid/Snap ---
  isGridVisible: boolean;
  isSnapEnabled: boolean;
  toggleGrid: () => void;
  toggleSnap: () => void;

  // --- Zoom ---
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // Editor
  editor: null,
  setEditor: (editor) => set({ editor }),

  // Active Tool
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  // Current Geo Type
  currentGeoType: "rectangle",
  setCurrentGeoType: (geoType) => set({ currentGeoType: geoType }),

  // Board Meta
  boardId: null,
  boardTitle: "Untitled Board",
  setBoardId: (id) => set({ boardId: id }),
  setBoardTitle: (title) => set({ boardTitle: title }),

  // Pages
  pages: [{ id: "page:default", name: "Page 1" }],
  activePageId: "page:default",
  setPages: (pages) => set({ pages }),
  setActivePageId: (id) => set({ activePageId: id }),
  addPage: (page) =>
    set((state) => ({ pages: [...state.pages, page] })),

  // AI Prompt
  isAILoading: false,
  aiPrompt: "",
  setAILoading: (loading) => set({ isAILoading: loading }),
  setAIPrompt: (prompt) => set({ aiPrompt: prompt }),

  // Panels
  isLeftSidebarOpen: true,
  isRightSidebarOpen: false,
  toggleLeftSidebar: () =>
    set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  setLeftSidebarOpen: (open) => set({ isLeftSidebarOpen: open }),
  setRightSidebarOpen: (open) => set({ isRightSidebarOpen: open }),

  // Theme
  isDarkMode: true,
  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),

  // Grid/Snap
  isGridVisible: true,
  isSnapEnabled: true,
  toggleGrid: () =>
    set((state) => ({ isGridVisible: !state.isGridVisible })),
  toggleSnap: () =>
    set((state) => ({ isSnapEnabled: !state.isSnapEnabled })),

  // Zoom
  zoomLevel: 1,
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}));
