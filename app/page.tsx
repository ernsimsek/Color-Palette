"use client";
import { useState } from "react";
import { getPalette, PaletteMode } from "@/lib/color";
import { ColorInput } from "@/components/ColorInput";
import { ColorBand } from "@/components/ColorBand";
import { ColorSwatch } from "@/components/ColorSwatch";
import { ColorDetails } from "@/components/ColorDetails";
import { ExportPanel } from "@/components/ExportPanel";

const MODES: { id: PaletteMode; label: string }[] = [
  { id: "shades", label: "Shades" },
  { id: "complementary", label: "Complementary" },
  { id: "triadic", label: "Triadic" },
  { id: "analogous", label: "Analogous" },
  { id: "split", label: "Split" },
  { id: "monochromatic", label: "Mono" },
];

const COPY_MODES = ["hex", "rgb", "hsl"] as const;
type CopyMode = (typeof COPY_MODES)[number];

export default function Home() {
  const [color, setColor] = useState("#5b4fff");
  const [mode, setMode] = useState<PaletteMode>("shades");
  const [copyMode, setCopyMode] = useState<CopyMode>("hex");

  const palette = getPalette(color, mode);

  return (
    <main
      style={{
        background: "#0a0a0f",
        minHeight: "100vh",
        padding: "2.5rem 1.5rem 4rem",
        fontFamily: "var(--font-sans)",
        color: "#e8e6f0",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#6b6880",
              fontFamily: "var(--font-mono)",
              marginBottom: 6,
            }}
          >
            Color Tools
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 800,
              color: "#f0eeff",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Palette Generator
          </h1>
        </div>
        <ColorInput value={color} onChange={setColor} onGenerate={() => {}} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 5,
          background: "#13121a",
          border: "1px solid #252334",
          borderRadius: 12,
          padding: 5,
          width: "fit-content",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: mode === m.id ? "#5b4fff" : "transparent",
              color: mode === m.id ? "#fff" : "#6b6880",
              textTransform: "uppercase",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <section style={{ marginBottom: "2rem" }}>
        <SectionLabel>Visual Preview — hover to expand</SectionLabel>
        <ColorBand palette={palette} />
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <SectionLabel>{palette.length} swatches — click to copy</SectionLabel>
          <div style={{ display: "flex", gap: 5 }}>
            {COPY_MODES.map((cm) => (
              <button
                key={cm}
                onClick={() => setCopyMode(cm)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  padding: "5px 11px",
                  borderRadius: 6,
                  border: `1px solid ${copyMode === cm ? "#5b4fff" : "#252334"}`,
                  cursor: "pointer",
                  background: copyMode === cm ? "#1a1830" : "transparent",
                  color: copyMode === cm ? "#c0b8ff" : "#6b6880",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {cm}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 10,
          }}
        >
          {palette.map((stop, i) => (
            <ColorSwatch key={stop.hex + i} stop={stop} mode={copyMode} />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <SectionLabel>Base Color Details — click to copy</SectionLabel>
        <ColorDetails hex={color} />
      </section>

      <section>
        <SectionLabel>Export</SectionLabel>
        <ExportPanel palette={palette} />
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#4a4860",
        fontFamily: "var(--font-mono)",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}
