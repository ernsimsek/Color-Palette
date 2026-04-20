"use client";
import { useState } from "react";
import { ColorStop, getContrastColor } from "@/lib/color";
import { useToast } from "@/context/ToastContext";
import { useClipboard } from "@/hooks/useClipboard";

interface Props {
  palette: ColorStop[];
}

export function ColorBand({ palette }: Props) {
  const { show } = useToast();
  const { copy, copied } = useClipboard();
  const [hovered, setHovered] = useState<number | null>(null);

  const preview = palette.slice(0, Math.min(11, palette.length));

  return (
    <div
      style={{
        display: "flex",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #1e1c2e",
        height: 110,
      }}
    >
      {preview.map((stop, i) => {
        const isHov = hovered === i;
        const isCopied = copied === stop.hex;
        const textCol = getContrastColor(stop.hex);
        return (
          <div
            key={stop.hex + i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={async () => {
              await copy(stop.hex, stop.hex);
              show(`Copied: ${stop.hex.toUpperCase()}`);
            }}
            style={{
              flex: isHov ? 2.2 : 1,
              background: stop.hex,
              transition: "flex 0.3s cubic-bezier(0.4,0,0.2,1)",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 0 10px 10px",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: textCol,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                opacity: isHov || isCopied ? 1 : 0,
                transition: "opacity 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {isCopied ? "✓" : stop.hex.toUpperCase()}
            </span>
            <span
              style={{
                color: textCol,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                opacity: isHov ? 0.7 : 0,
                transition: "opacity 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {stop.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
