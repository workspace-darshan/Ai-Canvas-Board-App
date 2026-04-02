// ============================================================
// AI Canvas Board - Type Definitions
// ============================================================

import { TLShapeId, TLShape } from "tldraw";

// --- Board Types ---

export interface Board {
  _id: string;
  title: string;
  owner: string | User;
  content: string; // tldraw JSON snapshot
  thumbnail?: string; // Cloudinary URL
  isPublic: boolean;
  shareToken?: string;
  collaborators: string[] | User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "github" | "google" | "credentials";
  createdAt: string;
}

// --- AI Types ---

/** The possible AI action types returned from the backend */
export type AIAction =
  | "add_shapes"
  | "update_shapes"
  | "add_flowchart"
  | "add_svg"
  | "describe"
  | "style_update"
  | "add_image";

/** The response format from the AI prompt endpoint */
export interface AIPromptResponse {
  action: AIAction;
  data: {
    shapes?: Partial<TLShape>[];
    edges?: FlowchartEdge[];
    svg?: string;
    imageUrl?: string;
    description?: string;
    styleUpdates?: Record<string, unknown>;
    shapeIds?: TLShapeId[];
  };
  message: string;
}

/** Flowchart edge definition for AI-generated flowcharts */
export interface FlowchartEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

/** Flowchart node for AI-generated flowcharts */
export interface FlowchartNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type?: "rectangle" | "diamond" | "ellipse";
  color?: string;
}

// --- Canvas Types ---

export interface CanvasPage {
  id: string;
  name: string;
}

export type Tool =
  | "select"
  | "draw"
  | "eraser"
  | "arrow"
  | "rectangle"
  | "ellipse"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "star"
  | "cloud"
  | "heart"
  | "x-box"
  | "check-box"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-right"
  | "text"
  | "quote"
  | "note"
  | "frame"
  | "hand"
  | "image"
  | "icon";

export interface ExportOptions {
  format: "png" | "svg" | "pdf" | "json";
  quality?: number;
  background?: boolean;
}

// --- Collaboration Types ---

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: {
    x: number;
    y: number;
  };
}

// --- UI Types ---

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "loading";
  message: string;
  duration?: number;
}

// --- Dashboard Types ---

export interface BoardCardData {
  _id: string;
  title: string;
  thumbnail?: string;
  updatedAt: string;
  isPublic: boolean;
  collaboratorCount: number;
}
