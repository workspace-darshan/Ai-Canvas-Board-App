// ============================================================
// ExportModal — Export board as PNG, SVG, PDF, or JSON
// ============================================================

"use client";

import { useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { X, Download, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

type ExportFormat = "png" | "svg" | "pdf" | "json";
type ExportScale = 1 | 2 | 4;

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { editor, boardTitle } = useCanvasStore();
  const [format, setFormat] = useState<ExportFormat>("png");
  const [scale, setScale] = useState<ExportScale>(2);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [allPages, setAllPages] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!editor) {
      toast.error("Editor not ready");
      return;
    }

    setIsExporting(true);

    try {
      const fileName = `${boardTitle || "canvas"}-${Date.now()}`;

      if (format === "json") {
        await exportJSON(fileName);
      } else if (format === "pdf") {
        await exportPDF(fileName);
      } else {
        await exportImage(format, fileName);
      }

      toast.success(`Downloaded as ${format.toUpperCase()}!`, {
        icon: <Check size={16} />,
      });
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportImage = async (fmt: "png" | "svg", fileName: string) => {
    if (!editor) return;

    const shapeIds = allPages
      ? Array.from(editor.getCurrentPageShapeIds())
      : Array.from(editor.getSelectedShapeIds());

    if (shapeIds.length === 0) {
      toast.error("No shapes to export");
      return;
    }

    // Get SVG string from editor
    const result = await editor.getSvgString(shapeIds, {
      background: includeBackground,
      padding: 0,
      scale: fmt === "png" ? scale : 1,
    });

    if (!result) {
      toast.error("Failed to generate export");
      return;
    }

    if (fmt === "svg") {
      // Download SVG directly
      const blob = new Blob([result.svg], { type: "image/svg+xml" });
      downloadBlob(blob, `${fileName}.svg`);
    } else {
      // Convert SVG to PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([result.svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = result.width * scale;
        canvas.height = result.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, `${fileName}.png`);
          }
          URL.revokeObjectURL(url);
        }, "image/png");
      };

      img.src = url;
    }
  };

  const exportPDF = async (fileName: string) => {
    if (!editor) return;

    // First export as PNG at 2x scale
    const shapeIds = allPages
      ? Array.from(editor.getCurrentPageShapeIds())
      : Array.from(editor.getSelectedShapeIds());

    if (shapeIds.length === 0) {
      toast.error("No shapes to export");
      return;
    }

    // Export to PNG blob first
    const svg = await editor.getSvgString(shapeIds, {
      background: includeBackground,
      padding: 0,
    });

    if (!svg) {
      toast.error("Failed to generate export");
      return;
    }

    // Convert SVG to canvas for PDF
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svg.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileName}.pdf`);

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const exportJSON = async (fileName: string) => {
    if (!editor) return;

    const snapshot = editor.store.getStoreSnapshot();
    const json = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([json], { type: "application/json" });

    downloadBlob(blob, `${fileName}.json`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        className="glass animate-fade-in"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          maxWidth: "90vw",
          zIndex: 101,
          borderRadius: "var(--radius-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Export Board
          </h3>
          <button className="tool-button" onClick={onClose} style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Format Selection */}
        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
            Format
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {(["png", "svg", "pdf", "json"] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                style={{
                  padding: "10px 12px",
                  background: format === fmt ? "var(--accent-subtle)" : "var(--bg-hover)",
                  border: "1px solid",
                  borderColor: format === fmt ? "var(--border-accent)" : "var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  color: format === fmt ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  textTransform: "uppercase",
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Quality (PNG only) */}
        {format === "png" && (
          <div>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
              Quality
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {([1, 2, 4] as ExportScale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  style={{
                    padding: "10px 12px",
                    background: scale === s ? "var(--accent-subtle)" : "var(--bg-hover)",
                    border: "1px solid",
                    borderColor: scale === s ? "var(--border-accent)" : "var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    color: scale === s ? "var(--accent-primary)" : "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Include</label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "8px 12px",
              background: "var(--bg-hover)",
              borderRadius: "var(--radius-md)",
              transition: "background var(--transition-fast)",
            }}
          >
            <input
              type="checkbox"
              checked={includeBackground}
              onChange={(e) => setIncludeBackground(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-primary)" }}>Background</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "8px 12px",
              background: "var(--bg-hover)",
              borderRadius: "var(--radius-md)",
              transition: "background var(--transition-fast)",
            }}
          >
            <input
              type="checkbox"
              checked={allPages}
              onChange={(e) => setAllPages(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-primary)" }}>All shapes</span>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              opacity: isExporting ? 0.5 : 1,
              transition: "all var(--transition-fast)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: isExporting ? "var(--bg-hover)" : "var(--accent-primary)",
              border: "1px solid var(--border-accent)",
              borderRadius: "var(--radius-md)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: isExporting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all var(--transition-fast)",
            }}
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={14} />
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
