// ============================================================
// Centralized Configuration
// Switch between local and production URLs
// ============================================================

const isDevelopment = process.env.NODE_ENV === "development";

export const config = {
  // API Base URL
  apiUrl: isDevelopment 
    ? "http://localhost:5000" 
    : process.env.NEXT_PUBLIC_API_URL || "https://api.yourproductiondomain.com",
  
  // Frontend Base URL (for share links)
  appUrl: isDevelopment
    ? "http://localhost:3001"
    : process.env.NEXT_PUBLIC_APP_URL || "https://yourproductiondomain.com",
};

// Helper to get full API endpoint
export const getApiUrl = (path: string) => {
  return `${config.apiUrl}${path}`;
};

// Helper to get share link
export const getShareLink = (permission: "view" | "edit" | "none", token: string) => {
  if (permission === "none") {
    return `${config.appUrl}/board/view/${token}`; // Default to view if none
  }
  return `${config.appUrl}/board/${permission}/${token}`;
};
