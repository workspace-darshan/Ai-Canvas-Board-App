// ============================================================
// PropertiesPanel — Right sidebar for shape properties
// Shows color, size, opacity, font controls for selected shapes
// Uses tldraw v4 StyleProp API
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import {
  DefaultColorStyle,
  DefaultSizeStyle,
  DefaultFillStyle,
  DefaultDashStyle,
  DefaultFontStyle,
} from "@tldraw/tlschema";
import {
  Palette,
  Maximize,
  Eye,
  ChevronRight,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Type,
} from "lucide-react";

/** Available tldraw colors */
const SHAPE_COLORS: { name: string; value: string }[] = [
  { name: "Black", value: "black" },
  { name: "Grey", value: "grey" },
  { name: "White", value: "white" },
  { name: "Red", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Yellow", value: "yellow" },
  { name: "Green", value: "green" },
  { name: "Blue", value: "blue" },
  { name: "Violet", value: "violet" },
  { name: "Light Red", value: "light-red" },
  { name: "Light Green", value: "light-green" },
  { name: "Light Blue", value: "light-blue" },
  { name: "Light Violet", value: "light-violet" },
];

/** CSS color map for the palette swatches */
const COLOR_MAP: Record<string, string> = {
  black: "#1e1e1e",
  grey: "#9ca3af",
  white: "#ffffff",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  "light-red": "#fca5a5",
  "light-green": "#86efac",
  "light-blue": "#93c5fd",
  "light-violet": "#c4b5fd",
};

/** Size options */
const SIZES = [
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
] as const;

/** Fill modes */
const FILLS = [
  { label: "None", value: "none" },
  { label: "Semi", value: "semi" },
  { label: "Solid", value: "solid" },
  { label: "Pattern", value: "pattern" },
] as const;

/** Dash styles for lines and shapes */
const DASH_STYLES = [
  { label: "Solid", value: "draw" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
] as const;

/** Font families */
const FONTS = [
  { label: "Sans", value: "sans" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "mono" },
  { label: "Draw", value: "draw" },
] as const;

/** Font sizes */
const FONT_SIZES = [
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
] as const;

export default function PropertiesPanel() {
  const { editor, isRightSidebarOpen, toggleRightSidebar } = useCanvasStore();

  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedFill, setSelectedFill] = useState("semi");
  const [selectedDash, setSelectedDash] = useState("draw");
  const [selectedFont, setSelectedFont] = useState("sans");
  const [selectedFontSize, setSelectedFontSize] = useState("m");
  const [opacity, setOpacity] = useState(1);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedShapeType, setSelectedShapeType] = useState<string | null>(null);

  // Listen for selection changes to sync panel state
  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      const selectedShapes = editor.getSelectedShapes();
      setHasSelection(selectedShapes.length > 0);

      if (selectedShapes.length > 0) {
        const shape = selectedShapes[0];
        setSelectedShapeType(shape.type);
        const props = shape.props as Record<string, unknown>;
        if (props.color) setSelectedColor(props.color as string);
        if (props.size) {
          setSelectedSize(props.size as string);
          setSelectedFontSize(props.size as string);
        }
        if (props.fill) setSelectedFill(props.fill as string);
        if (props.dash) setSelectedDash(props.dash as string);
        if (props.font) setSelectedFont(props.font as string);
        if (shape.opacity !== undefined) setOpacity(shape.opacity);
      } else {
        setSelectedShapeType(null);
      }
    };

    // Poll selection — tldraw v4 doesn't expose selection events easily
    const interval = setInterval(handleSelectionChange, 300);
    return () => clearInterval(interval);
  }, [editor]);

  /** Apply color using tldraw's StyleProp system */
  const applyColor = (color: string) => {
    setSelectedColor(color);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      // Apply to selected shapes
      editor.setStyleForSelectedShapes(DefaultColorStyle, color as never);
    } else {
      // Set for next shapes
      editor.setStyleForNextShapes(DefaultColorStyle, color as never);
    }
  };

  /** Apply size using tldraw's StyleProp system */
  const applySize = (size: string) => {
    setSelectedSize(size);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      editor.setStyleForSelectedShapes(DefaultSizeStyle, size as never);
    } else {
      editor.setStyleForNextShapes(DefaultSizeStyle, size as never);
    }
  };

  /** Apply fill using tldraw's StyleProp system */
  const applyFill = (fill: string) => {
    setSelectedFill(fill);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      editor.setStyleForSelectedShapes(DefaultFillStyle, fill as never);
    } else {
      editor.setStyleForNextShapes(DefaultFillStyle, fill as never);
    }
  };

  /** Apply dash style using tldraw's StyleProp system */
  const applyDash = (dash: string) => {
    setSelectedDash(dash);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      editor.setStyleForSelectedShapes(DefaultDashStyle, dash as never);
    } else {
      editor.setStyleForNextShapes(DefaultDashStyle, dash as never);
    }
  };

  /** Apply font using tldraw's StyleProp system */
  const applyFont = (font: string) => {
    setSelectedFont(font);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      editor.setStyleForSelectedShapes(DefaultFontStyle, font as never);
    } else {
      editor.setStyleForNextShapes(DefaultFontStyle, font as never);
    }
  };

  /** Apply font size using tldraw's StyleProp system */
  const applyFontSize = (size: string) => {
    setSelectedFontSize(size);
    if (!editor) return;
    const selectedIds = editor.getSelectedShapeIds();
    if (selectedIds.length > 0) {
      editor.setStyleForSelectedShapes(DefaultSizeStyle, size as never);
    } else {
      editor.setStyleForNextShapes(DefaultSizeStyle, size as never);
    }
  };

  /** Alignment functions */
  const alignLeft = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'left');
  };

  const alignCenter = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'center-horizontal');
  };

  const alignRight = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'right');
  };

  const alignTop = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'top');
  };

  const alignMiddle = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'center-vertical');
  };

  const alignBottom = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length === 0) return;
    editor.alignShapes(editor.getSelectedShapeIds(), 'bottom');
  };

  const distributeHorizontal = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length < 3) return;
    editor.distributeShapes(editor.getSelectedShapeIds(), 'horizontal');
  };

  const distributeVertical = () => {
    if (!editor) return;
    const shapes = editor.getSelectedShapes();
    if (shapes.length < 3) return;
    editor.distributeShapes(editor.getSelectedShapeIds(), 'vertical');
  };

  /** Apply opacity directly via updateShapes */
  const applyOpacity = (newOpacity: number) => {
    setOpacity(newOpacity);
    if (!editor) return;
    const ids = editor.getSelectedShapeIds();
    if (ids.length === 0) return;
    editor.updateShapes(
      ids.map((id) => ({
        id,
        type: editor.getShape(id)!.type,
        opacity: newOpacity,
      }))
    );
  };

  /** Delete selected shapes */
  const handleDelete = () => {
    if (!editor) return;
    editor.deleteShapes(editor.getSelectedShapeIds());
  };

  /** Duplicate selected shapes */
  const handleDuplicate = () => {
    if (!editor) return;
    editor.duplicateShapes(editor.getSelectedShapeIds());
  };

  /** Layer ordering */
  const handleBringForward = () => {
    if (!editor) return;
    editor.bringForward(editor.getSelectedShapeIds());
  };

  const handleSendBackward = () => {
    if (!editor) return;
    editor.sendBackward(editor.getSelectedShapeIds());
  };

  // Section header common style
  const sectionHeader: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 8,
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <>
      {/* Toggle button when panel is closed */}
      {!isRightSidebarOpen && (
        <button
          className="tool-button animate-fade-in"
          onClick={toggleRightSidebar}
          style={{
            position: "fixed",
            top: 72,
            right: 12,
            zIndex: 50,
            width: 32,
            height: 32,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
          aria-label="Open properties"
        >
          <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
        </button>
      )}

      {/* Properties Panel */}
      {isRightSidebarOpen && (
        <div
          className="glass animate-fade-in"
          style={{
            position: "fixed",
            top: 64,
            right: 12,
            bottom: 130,
            width: 240,
            zIndex: 50,
            borderRadius: "var(--radius-lg)",
            padding: "12px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div style={{ paddingRight: 8 }}>
            {/* Panel Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Properties
              </span>
              <button
                className="tool-button"
                onClick={toggleRightSidebar}
                style={{ width: 28, height: 28 }}
                aria-label="Close properties"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {!hasSelection && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  marginTop: 16,
                  lineHeight: 1.5,
                }}
              >
                Select a shape to edit its properties, or set defaults for new shapes.
              </p>
            )}

            {/* Color Section */}
            <div style={sectionHeader}>
              <Palette size={12} />
              Color
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 6,
              }}
            >
              {SHAPE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => applyColor(color.value)}
                  title={color.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "var(--radius-sm)",
                    background: COLOR_MAP[color.value],
                    border:
                      selectedColor === color.value
                        ? "2px solid var(--accent-primary)"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    boxShadow:
                      selectedColor === color.value
                        ? "var(--shadow-glow)"
                        : "none",
                  }}
                  aria-label={color.name}
                />
              ))}
            </div>

            {/* Size Section */}
            <div style={sectionHeader}>
              <Maximize size={12} />
              Size
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => applySize(size.value)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor:
                      selectedSize === size.value
                        ? "var(--border-accent)"
                        : "var(--border-default)",
                    background:
                      selectedSize === size.value
                        ? "var(--accent-subtle)"
                        : "var(--bg-hover)",
                    color:
                      selectedSize === size.value
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>

            {/* Fill Section */}
            <div style={sectionHeader}>Fill</div>
            <div style={{ display: "flex", gap: 4 }}>
              {FILLS.map((fill) => (
                <button
                  key={fill.value}
                  onClick={() => applyFill(fill.value)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor:
                      selectedFill === fill.value
                        ? "var(--border-accent)"
                        : "var(--border-default)",
                    background:
                      selectedFill === fill.value
                        ? "var(--accent-subtle)"
                        : "var(--bg-hover)",
                    color:
                      selectedFill === fill.value
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {fill.label}
                </button>
              ))}
            </div>

            {/* Dash Style Section */}
            <div style={sectionHeader}>Line Style</div>
            <div style={{ display: "flex", gap: 4 }}>
              {DASH_STYLES.map((dash) => (
                <button
                  key={dash.value}
                  onClick={() => applyDash(dash.value)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor:
                      selectedDash === dash.value
                        ? "var(--border-accent)"
                        : "var(--border-default)",
                    background:
                      selectedDash === dash.value
                        ? "var(--accent-subtle)"
                        : "var(--bg-hover)",
                    color:
                      selectedDash === dash.value
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {dash.label}
                </button>
              ))}
            </div>

            {/* Font Family Section */}
            <div style={sectionHeader}>Font</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => applyFont(font.value)}
                  style={{
                    flex: "1 1 calc(50% - 2px)",
                    padding: "6px 0",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor:
                      selectedFont === font.value
                        ? "var(--border-accent)"
                        : "var(--border-default)",
                    background:
                      selectedFont === font.value
                        ? "var(--accent-subtle)"
                        : "var(--bg-hover)",
                    color:
                      selectedFont === font.value
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {font.label}
                </button>
              ))}
            </div>

            {/* Font Size Section */}
            {(selectedShapeType === 'text' || selectedShapeType === 'note' || !hasSelection) && (
              <>
                <div style={sectionHeader}>
                  <Type size={12} />
                  Font Size
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => applyFontSize(size.value)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid",
                        borderColor:
                          selectedFontSize === size.value
                            ? "var(--border-accent)"
                            : "var(--border-default)",
                        background:
                          selectedFontSize === size.value
                            ? "var(--accent-subtle)"
                            : "var(--bg-hover)",
                        color:
                          selectedFontSize === size.value
                            ? "var(--accent-primary)"
                            : "var(--text-secondary)",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Alignment Section (visible when shapes are selected) */}
            {hasSelection && (
              <>
                <div style={sectionHeader}>Alignment</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Horizontal alignment */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="tool-button"
                      onClick={alignLeft}
                      title="Align left"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      className="tool-button"
                      onClick={alignCenter}
                      title="Align center"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      className="tool-button"
                      onClick={alignRight}
                      title="Align right"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  {/* Vertical alignment */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="tool-button"
                      onClick={alignTop}
                      title="Align top"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignVerticalJustifyStart size={16} />
                    </button>
                    <button
                      className="tool-button"
                      onClick={alignMiddle}
                      title="Align middle"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignVerticalJustifyCenter size={16} />
                    </button>
                    <button
                      className="tool-button"
                      onClick={alignBottom}
                      title="Align bottom"
                      style={{
                        flex: 1,
                        height: 32,
                        justifyContent: "center",
                      }}
                    >
                      <AlignVerticalJustifyEnd size={16} />
                    </button>
                  </div>
                  {/* Distribution (only show if 3+ shapes selected) */}
                  {editor && editor.getSelectedShapes().length >= 3 && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="tool-button"
                        onClick={distributeHorizontal}
                        title="Distribute horizontally"
                        style={{
                          flex: 1,
                          height: 32,
                          justifyContent: "center",
                          fontSize: 11,
                        }}
                      >
                        <AlignHorizontalJustifyCenter size={16} />
                      </button>
                      <button
                        className="tool-button"
                        onClick={distributeVertical}
                        title="Distribute vertically"
                        style={{
                          flex: 1,
                          height: 32,
                          justifyContent: "center",
                          fontSize: 11,
                        }}
                      >
                        <AlignVerticalJustifyCenter size={16} style={{ transform: "rotate(90deg)" }} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Opacity Section */}
            <div style={sectionHeader}>
              <Eye size={12} />
              Opacity
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => applyOpacity(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: "var(--accent-primary)",
                  height: 4,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  minWidth: 36,
                  textAlign: "right",
                }}
              >
                {Math.round(opacity * 100)}%
              </span>
            </div>

            {/* Actions Section (visible when shapes are selected) */}
            {hasSelection && (
              <>
                <div style={sectionHeader}>Actions</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 4,
                  }}
                >
                  <button
                    className="tool-button"
                    onClick={handleDuplicate}
                    style={{
                      width: "100%",
                      gap: 6,
                      fontSize: 11,
                      height: 34,
                      justifyContent: "center",
                    }}
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    className="tool-button"
                    onClick={handleDelete}
                    style={{
                      width: "100%",
                      gap: 6,
                      fontSize: 11,
                      height: 34,
                      justifyContent: "center",
                      color: "var(--error)",
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  <button
                    className="tool-button"
                    onClick={handleBringForward}
                    style={{
                      width: "100%",
                      gap: 6,
                      fontSize: 11,
                      height: 34,
                      justifyContent: "center",
                    }}
                  >
                    <MoveUp size={14} />
                    Forward
                  </button>
                  <button
                    className="tool-button"
                    onClick={handleSendBackward}
                    style={{
                      width: "100%",
                      gap: 6,
                      fontSize: 11,
                      height: 34,
                      justifyContent: "center",
                    }}
                  >
                    <MoveDown size={14} />
                    Backward
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
