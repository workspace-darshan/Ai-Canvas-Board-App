// ============================================================
// Dashboard Page — Placeholder for now
// ============================================================

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/login" });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-default)",
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-default)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={24} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                AI Canvas Dashboard
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Welcome back, {session?.user?.name || "User"}!
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              padding: "10px 20px",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div
          className="glass"
          style={{
            padding: 40,
            borderRadius: "var(--radius-xl)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(124, 92, 252, 0.3)",
            }}
          >
            <Sparkles size={40} color="white" />
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Authentication Complete! 🎉
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            You've successfully signed in with {session?.user?.provider || "credentials"}.
            <br />
            The full dashboard with boards, folders, and AI features is coming next!
          </p>

          {/* User Info */}
          <div
            style={{
              display: "inline-block",
              padding: "16px 24px",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              textAlign: "left",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Name: </span>
              <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                {session?.user?.name}
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Email: </span>
              <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                {session?.user?.email}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Provider: </span>
              <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                {session?.user?.provider || "credentials"}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => router.push("/board/local")}
              style={{
                padding: "12px 24px",
                background: "var(--accent-primary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              Try Canvas Board
            </button>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "12px 24px",
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
