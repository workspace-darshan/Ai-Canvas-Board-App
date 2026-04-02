// ============================================================
// Liveblocks Client — Real-time collaboration config
// ============================================================

export const LIVEBLOCKS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ||
  "pk_dev_n8xpWfhSxZSnX53S7BpoRGq1oRB9k99DO5IdhMf6WSKOnkbWOEL9JouF-c5FOJKH";

export function getRoomId(boardId: string): string {
  return `ai-canvas-board:${boardId}`;
}
