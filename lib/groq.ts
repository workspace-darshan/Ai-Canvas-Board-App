// ============================================================
// Groq Client — Frontend utility for AI prompt requests
// Sends prompts to the backend which calls Groq API
// ============================================================

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface AIResponse {
  action: string;
  data: Record<string, unknown>;
  message: string;
}

/**
 * Send an AI prompt to the backend for processing
 * @param prompt - Natural language prompt from the user
 * @param context - Optional canvas context (selected shapes, etc.)
 * @returns AI response with action and data
 */
export async function sendAIPrompt(
  prompt: string,
  context?: Record<string, unknown>
): Promise<AIResponse> {
  const response = await fetch(`${BACKEND_URL}/api/ai/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Request AI image generation
 * @param prompt - Description of the image to generate
 * @returns Object with imageBase64 data URL
 */
export async function generateAIImage(
  prompt: string
): Promise<{ imageBase64: string; message: string }> {
  const response = await fetch(`${BACKEND_URL}/api/ai/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Request AI description of canvas content
 * @param imageBase64 - Base64-encoded canvas screenshot
 * @returns Object with description text
 */
export async function describeCanvas(
  imageBase64: string
): Promise<AIResponse> {
  const response = await fetch(`${BACKEND_URL}/api/ai/describe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) {
    throw new Error(`Canvas description failed: ${response.statusText}`);
  }

  return response.json();
}
