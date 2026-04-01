// ============================================================
// Cloudinary Client — Frontend image upload utility
// ============================================================

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Upload an image file to Cloudinary via the backend
 * @param file - The image file to upload
 * @returns Upload result with URL
 */
export async function uploadImage(
  file: File
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload a base64 image to Cloudinary via the backend
 * @param imageData - Base64-encoded image data
 * @returns Upload result with URL
 */
export async function uploadBase64Image(
  imageData: string
): Promise<{ url: string; publicId: string }> {
  const response = await fetch(`${BACKEND_URL}/api/upload/base64`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageData }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}
