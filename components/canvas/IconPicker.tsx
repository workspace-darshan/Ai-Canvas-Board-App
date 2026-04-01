// ============================================================
// IconPicker — Dynamic icon loading from Iconify API
// 100+ icons per category with virtual scrolling
// ============================================================

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import { Icon } from "@iconify/react";
import { X, Search, Loader2 } from "lucide-react";

type IconCategory = "general" | "tech" | "cloud" | "brands" | "network";

interface IconItem {
  name: string;
  prefix: string;
  fullId: string; // prefix:name
  category: IconCategory;
}

interface IconSet {
  prefix: string;
  name: string;
  total: number;
  icons: string[];
}

// Category to Iconify set mapping
const CATEGORY_SETS: Record<IconCategory, { prefix: string; keywords?: string[] }[]> = {
  general: [{ prefix: "lucide" }],
  tech: [{ prefix: "logos" }],
  cloud: [
    { prefix: "carbon", keywords: ["cloud", "aws", "azure", "server", "database"] },
  ],
  brands: [{ prefix: "simple-icons" }],
  network: [
    { prefix: "mdi", keywords: ["network", "server", "lan", "wifi", "router", "ethernet", "firewall", "vpn", "dns", "ip"] },
  ],
};

const RECENT_ICONS_KEY = "canvas-recent-icons";
const MAX_RECENT = 8;
const ICONS_PER_PAGE = 50;

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IconPicker({ isOpen, onClose }: IconPickerProps) {
  const { editor } = useCanvasStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [width, setWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 72, y: 104 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<IconCategory>("general");
  const [recentIcons, setRecentIcons] = useState<IconItem[]>([]);
  const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Dynamic loading state
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState<IconItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load recent icons from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_ICONS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as IconItem[];
        setRecentIcons(parsed);
      } catch (e) {
        console.error("Failed to load recent icons", e);
      }
    }
  }, []);

  // Save icon to recent
  const addToRecent = (icon: IconItem) => {
    const updated = [icon, ...recentIcons.filter(i => i.fullId !== icon.fullId)].slice(0, MAX_RECENT);
    setRecentIcons(updated);
    localStorage.setItem(RECENT_ICONS_KEY, JSON.stringify(updated));
  };

  // Fetch icons from Iconify API
  const fetchIconsForCategory = async (category: IconCategory, pageNum: number = 0) => {
    setIsLoading(true);
    try {
      const sets = CATEGORY_SETS[category];
      const allIcons: IconItem[] = [];

      for (const set of sets) {
        const response = await fetch(`https://api.iconify.design/collection?prefix=${set.prefix}`);
        const data = await response.json();
        
        if (data && data.uncategorized) {
          let iconNames = data.uncategorized as string[];
          
          // Filter by keywords if specified
          if (set.keywords && set.keywords.length > 0) {
            iconNames = iconNames.filter(name => 
              set.keywords!.some(keyword => name.toLowerCase().includes(keyword.toLowerCase()))
            );
          }
          
          // If no icons found after filtering, try without filtering for this set
          if (iconNames.length === 0 && set.keywords) {
            console.log(`No icons found for ${set.prefix} with keywords, loading all icons`);
            iconNames = data.uncategorized as string[];
          }
          
          // Pagination
          const start = pageNum * ICONS_PER_PAGE;
          const end = start + ICONS_PER_PAGE;
          const pageIcons = iconNames.slice(start, end);
          
          pageIcons.forEach(name => {
            allIcons.push({
              name,
              prefix: set.prefix,
              fullId: `${set.prefix}:${name}`,
              category,
            });
          });
          
          // Check if there are more icons
          if (iconNames.length <= end) {
            setHasMore(false);
          }
        }
      }

      if (pageNum === 0) {
        setIcons(allIcons);
      } else {
        setIcons(prev => [...prev, ...allIcons]);
      }
    } catch (error) {
      console.error("Failed to fetch icons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search icons across all sets
  const searchIcons = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=100`);
      const data = await response.json();
      
      if (data && data.icons) {
        const results: IconItem[] = data.icons.map((fullId: string) => {
          const [prefix, name] = fullId.split(':');
          // Determine category based on prefix
          let category: IconCategory = 'general';
          if (prefix === 'logos') category = 'tech';
          else if (prefix === 'simple-icons') category = 'brands';
          else if (prefix === 'carbon') category = 'network';
          else if (prefix === 'mdi') category = 'cloud';
          
          return {
            name,
            prefix,
            fullId,
            category,
          };
        });
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchIcons(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load icons when category changes
  useEffect(() => {
    if (!searchQuery) {
      setPage(0);
      setHasMore(true);
      fetchIconsForCategory(activeCategory, 0);
    }
  }, [activeCategory]);

  // Infinite scroll observer
  const lastIconRef = useCallback((node: HTMLButtonElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchIconsForCategory(activeCategory, nextPage);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, page, activeCategory, searchQuery]);

  // Insert icon on canvas
  const handleIconSelect = async (icon: IconItem) => {
    if (!editor) return;

    addToRecent(icon);

    const viewport = editor.getViewportPageBounds();
    const x = viewport.center.x;
    const y = viewport.center.y;

    const sizeMap = { small: 60, medium: 120, large: 200 };
    const size = sizeMap[iconSize];

    await insertIconFromAPI(icon.fullId, x, y, size);
  };

  // Fetch and insert icon SVG
  const insertIconFromAPI = async (fullId: string, x: number, y: number, size: number) => {
    try {
      const [prefix] = fullId.split(':');
      
      // Determine if icon should be white based on category
      const shouldBeWhite = prefix === 'lucide' || prefix === 'carbon' || prefix === 'mdi' || prefix === 'simple-icons';
      
      const response = await fetch(`https://api.iconify.design/${fullId}.svg?height=200`);
      if (!response.ok) throw new Error("Failed to fetch icon");
      
      let svgText = await response.text();
      
      // Parse and fix SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      let aspectRatio = 1;
      
      if (svgElement) {
        const width = parseFloat(svgElement.getAttribute('width') || '200');
        const height = parseFloat(svgElement.getAttribute('height') || '200');
        const viewBox = svgElement.getAttribute('viewBox');
        
        if (viewBox) {
          const parts = viewBox.split(' ').map(parseFloat);
          if (parts.length === 4) aspectRatio = parts[2] / parts[3];
        } else {
          aspectRatio = width / height;
        }
        
        if (!viewBox) svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Change color to white for specific categories (just color change, no fill/stroke modification)
        if (shouldBeWhite) {
          svgElement.setAttribute('color', 'white');
          svgElement.setAttribute('style', 'color: white;');
        }
        
        svgText = new XMLSerializer().serializeToString(svgElement);
      }
      
      let iconWidth = size;
      let iconHeight = size;
      
      if (aspectRatio > 1) iconHeight = size / aspectRatio;
      else if (aspectRatio < 1) iconWidth = size * aspectRatio;
      
      const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
      
      if (editor) {
        const assetId = `asset:${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as any;
        
        editor.createAssets([{
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: fullId,
            src: svgDataUrl,
            w: iconWidth,
            h: iconHeight,
            mimeType: 'image/svg+xml',
            isAnimated: false,
          },
          meta: {},
        }]);
        
        editor.createShape({
          type: "image",
          x: x - iconWidth / 2,
          y: y - iconHeight / 2,
          props: { w: iconWidth, h: iconHeight, assetId },
        });
      }
    } catch (error) {
      console.error("Failed to insert icon:", error);
    }
  };

  // Drag and resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX - position.x;
        if (newWidth >= 320 && newWidth <= 600) setWidth(newWidth);
      }
      
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        const panelHeight = 550;
        const panelWidth = width;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        newX = Math.max(0, Math.min(newX, windowWidth - panelWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - panelHeight));
        
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, isDragging, position.x, dragOffset, width]);

  const columns = Math.floor((width - 32) / 60);
  const displayIcons = searchQuery ? searchResults : icons;

  if (!isOpen) return null;

  return (
    <div
      className="glass animate-fade-in"
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: width,
        height: "calc(100vh - 280px)",
        maxHeight: 550,
        zIndex: 50,
        borderRadius: "var(--radius-lg)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 8,
          cursor: "ew-resize",
          background: isResizing ? "var(--accent-primary)" : "transparent",
          transition: "background var(--transition-fast)",
          borderTopRightRadius: "var(--radius-lg)",
          borderBottomRightRadius: "var(--radius-lg)",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          if (!isResizing) e.currentTarget.style.background = "var(--border-accent)";
        }}
        onMouseLeave={(e) => {
          if (!isResizing) e.currentTarget.style.background = "transparent";
        }}
      />

      {/* Header */}
      <div
        onMouseDown={handleDragStart}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
          Icons
        </h3>
        <button className="tool-button" onClick={onClose} style={{ width: 24, height: 24 }}>
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search size={14} style={{ position: "absolute", left: 10, color: "var(--text-tertiary)" }} />
        <input
          type="text"
          placeholder="Search 200k+ icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px 8px 32px",
            background: "var(--bg-hover)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: 12,
            outline: "none",
          }}
        />
        {isSearching && (
          <Loader2 size={14} className="animate-spin" style={{ position: "absolute", right: 10, color: "var(--text-tertiary)" }} />
        )}
      </div>

      {/* Size Selector */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: 4 }}>
          Size:
        </span>
        {(['small', 'medium', 'large'] as const).map((size) => (
          <button
            key={size}
            onClick={() => setIconSize(size)}
            style={{
              flex: 1,
              padding: "4px 8px",
              background: iconSize === size ? "var(--accent-subtle)" : "var(--bg-hover)",
              border: "1px solid",
              borderColor: iconSize === size ? "var(--border-accent)" : "var(--border-default)",
              borderRadius: "var(--radius-sm)",
              color: iconSize === size ? "var(--accent-primary)" : "var(--text-secondary)",
              fontSize: 10,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              textTransform: "capitalize",
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Recent Icons */}
      {!searchQuery && recentIcons.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recent
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
            {recentIcons.map((icon) => (
              <IconButton key={icon.fullId} icon={icon} onSelect={() => handleIconSelect(icon)} />
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {!searchQuery && (
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-default)", paddingBottom: 8 }}>
          {[
            { id: "general" as IconCategory, label: "General" },
            { id: "tech" as IconCategory, label: "Tech" },
            { id: "cloud" as IconCategory, label: "Cloud" },
            { id: "brands" as IconCategory, label: "Brands" },
            { id: "network" as IconCategory, label: "Network" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              style={{
                flex: 1,
                padding: "6px 8px",
                background: activeCategory === tab.id ? "var(--accent-subtle)" : "transparent",
                border: "1px solid",
                borderColor: activeCategory === tab.id ? "var(--border-accent)" : "transparent",
                borderRadius: "var(--radius-sm)",
                color: activeCategory === tab.id ? "var(--accent-primary)" : "var(--text-secondary)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Icon Grid */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 6,
          padding: 2,
        }}
      >
        {displayIcons.map((icon, index) => {
          const isLast = index === displayIcons.length - 1;
          return (
            <IconButton
              key={icon.fullId}
              icon={icon}
              onSelect={() => handleIconSelect(icon)}
              showCategory={!!searchQuery}
              ref={isLast && !searchQuery ? lastIconRef : null}
            />
          );
        })}
        
        {/* Loading skeleton */}
        {isLoading && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                style={{
                  height: 50,
                  background: "var(--bg-hover)",
                  borderRadius: "var(--radius-md)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* No results */}
      {!isLoading && displayIcons.length === 0 && (
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-tertiary)", fontSize: 12 }}>
          {searchQuery ? "No icons found" : "Loading icons..."}
        </div>
      )}
    </div>
  );
}

/** Icon Button Component */
const IconButton = React.forwardRef<
  HTMLButtonElement,
  {
    icon: IconItem;
    onSelect: () => void;
    showCategory?: boolean;
  }
>(({ icon, onSelect, showCategory = false }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <button
      ref={ref}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={icon.name}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        background: isHovered ? "var(--accent-subtle)" : "var(--bg-hover)",
        border: "1px solid",
        borderColor: isHovered ? "var(--border-accent)" : "var(--border-default)",
        borderRadius: "var(--radius-md)",
        color: isHovered ? "var(--accent-primary)" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        position: "relative",
        minHeight: 50,
      }}
    >
      {isLoading && (
        <Loader2 size={16} className="animate-spin" style={{ position: "absolute" }} />
      )}
      <Icon
        icon={icon.fullId}
        width={20}
        height={20}
        onLoad={() => setIsLoading(false)}
        style={{ 
          opacity: isLoading ? 0 : 1,
          color: icon.prefix === 'lucide' || icon.prefix === 'carbon' || icon.prefix === 'mdi' || icon.prefix === 'simple-icons' ? 'white' : undefined,
        }}
      />
      
      {showCategory && (
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            fontSize: 8,
            padding: "2px 4px",
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
          }}
        >
          {icon.category}
        </span>
      )}
    </button>
  );
});

IconButton.displayName = "IconButton";

// Add React import at top
import React from "react";
