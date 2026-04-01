// ============================================================
// Liveblocks Client — Real-time collaboration config
// Phase 6: Full Liveblocks integration
// ============================================================

/**
 * Liveblocks configuration for real-time collaboration.
 * In Phase 6, this will set up:
 * - Room connections for each board
 * - Live cursor tracking
 * - Presence indicators
 * - Comments
 *
 * For now, this is a placeholder.
 */

export const LIVEBLOCKS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "";

/**
 * Check if Liveblocks is configured
 */
export function isLiveblocksConfigured(): boolean {
  return !!LIVEBLOCKS_PUBLIC_KEY;
}

/**
 * Get a unique room ID for a board
 * @param boardId - The board's database ID
 * @returns A unique room ID string
 */
export function getRoomId(boardId: string): string {
  return `ai-canvas-board:${boardId}`;
}
