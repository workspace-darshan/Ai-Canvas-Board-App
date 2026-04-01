// ============================================================
// Auth Error Page
// ============================================================

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthSignin":
        return "Error in constructing an authorization URL.";
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider.";
      case "OAuthCreateAccount":
        return "Could not create OAuth provider user in the database.";
      case "EmailCreateAccount":
        return "Could not create email provider user in the database.";
      case "Callback":
        return "Error in the OAuth callback handler route.";
      case "OAuthAccountNotLinked":
        return "Email already exists with a different sign-in method.";
      case "EmailSignin":
        return "Sending the email with the verification token failed.";
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        padding: "20px",
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 40,
          borderRadius: "var(--radius-xl)",
          textAlign: "center",
        }}
      >
        {/* Error Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={40} style={{ color: "#ef4444" }} />
        </div>

        {/* Error Title */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 12,
          }}
        >
          Authentication Error
        </h1>

        {/* Error Message */}
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {getErrorMessage(error)}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link
            href="/auth/login"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--accent-primary)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all var(--transition-fast)",
            }}
          >
            Try Again
          </Link>

          <Link
            href="/"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all var(--transition-fast)",
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            marginTop: 24,
          }}
        >
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
