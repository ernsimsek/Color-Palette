"use client";
import { useState } from "react";
import { ColorStop, getContrastColor } from "@/lib/color";
import { useToast } from "@/context/ToastContext";
import { useClipboard } from "@/hooks/useClipboard";

interface Props {
  stop: ColorStop;
  mode?: "hex" | "rgb" | "hsl";
  size?: "sm" | "md" | "lg";
}

export function ColorSwatch({ stop, mode = "hex", size = "md" }: Props) {
  const { show } = useToast();
  const { copy, copied } = useClipboard();
  const [hovered, setHovered] = useState(false);

  const getValue = () => {
    if (mode === "rgb") return `rgb(${stop.rgb.r}, ${stop.rgb.g}, ${stop.rgb.b})`;
    if (mode === "hsl")
      return `hsl(${Math.round(stop.hsl.h)}, ${Math.round(stop.hsl.s)}%, ${Math.round(stop.hsl.l)}%)`;
    return stop.hex.toUpperCase();
  };

  const handleClick = async () => {
    const val = getValue();
    await copy(val, stop.hex);
    show(`Copied: ${val}`);
  };

  const heights: Record<string, number> = { sm: 56, md: 76, lg: 100 };
  const h = heights[size];
  const textCol = getContrastColor(stop.hex);
  const isCopied = copied === stop.hex;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: "#13121a",
        border: `1px solid ${isCopied ? "#5b4fff" : hovered ? "#3a3660" : "#1e1c2e"}`,
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.18s ease, border-color 0.18s ease",
        userSelect: "none",
      }}
    >
      <div
        style={{
          height: h,
          background: stop.hex,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: textCol,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            opacity: hovered || isCopied ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          {isCopied ? "✓ Copied" : "Copy"}
        </span>
      </div>
      <div style={{ padding: "8px 10px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 500,
            color: "#c8c5d8",
            letterSpacing: "0.03em",
            marginBottom: 2,
          }}
        >
          {stop.hex.toUpperCase()}
        </div>
        <div style={{ fontSize: 10, color: "#4a4860", letterSpacing: "0.05em" }}>
          {stop.name}
        </div>
      </div>
    </div>
  );
}
