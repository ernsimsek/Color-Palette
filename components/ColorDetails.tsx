"use client";
import { hexToRgb, rgbToHsl } from "@/lib/color";
import { useToast } from "@/context/ToastContext";
import { useClipboard } from "@/hooks/useClipboard";

interface Props {
  hex: string;
}

export function ColorDetails({ hex }: Props) {
  const { show } = useToast();
  const { copy } = useClipboard();

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  // CMYK approx
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const cm = k === 1 ? 0 : (1 - rn - k) / (1 - k);
  const mg = k === 1 ? 0 : (1 - gn - k) / (1 - k);
  const yk = k === 1 ? 0 : (1 - bn - k) / (1 - k);

  const details = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "HSL", value: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)` },
    {
      label: "CMYK",
      value: `cmyk(${Math.round(cm * 100)}%, ${Math.round(mg * 100)}%, ${Math.round(yk * 100)}%, ${Math.round(k * 100)}%)`,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
        marginTop: 20,
      }}
    >
      {details.map(({ label, value }) => (
        <div
          key={label}
          onClick={async () => {
            await copy(value);
            show(`${label} copied: ${value}`);
          }}
          style={{
            background: "#13121a",
            border: "1px solid #1e1c2e",
            borderRadius: 12,
            padding: "14px 16px",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#3a3660")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#1e1c2e")}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#4a4860",
              fontFamily: "var(--font-mono)",
              marginBottom: 6,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 500,
              color: "#c8c5d8",
              letterSpacing: "0.03em",
            }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
