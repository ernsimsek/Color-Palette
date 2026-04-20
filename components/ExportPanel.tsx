"use client";
import { ColorStop } from "@/lib/color";
import { useToast } from "@/context/ToastContext";
import { useClipboard } from "@/hooks/useClipboard";
import { Code2, Braces, Copy, Palette } from "lucide-react";

interface Props {
  palette: ColorStop[];
  baseName?: string;
}

export function ExportPanel({ palette, baseName = "brand" }: Props) {
  const { show } = useToast();
  const { copy } = useClipboard();

  const act = async (text: string, label: string) => {
    await copy(text);
    show(label + " copied to clipboard");
  };

  const exportCSS = () => {
    const lines = palette
      .map((c) => {
        const key = c.name.toLowerCase().replace(/\s+/g, "-");
        return "  --color-" + baseName + "-" + key + ": " + c.hex + ";";
      })
      .join("\n");
    act(":root {\n" + lines + "\n}", "CSS Variables");
  };

  const exportJSON = () => {
    const obj: Record<string, string> = {};
    palette.forEach((c) => { obj[c.name] = c.hex; });
    const wrapper: Record<string, Record<string, string>> = {};
    wrapper[baseName] = obj;
    act(JSON.stringify(wrapper, null, 2), "JSON");
  };

  const exportTailwind = () => {
    const obj: Record<string, string> = {};
    palette.forEach((c) => { obj[c.name] = c.hex; });
    const inner = JSON.stringify(obj, null, 8);
    const indented = inner.split("\n").join("\n        ");
    const tw =
      "/** @type {import('tailwindcss').Config} */\n" +
      "module.exports = {\n" +
      "  theme: {\n" +
      "    extend: {\n" +
      "      colors: {\n" +
      "        " + baseName + ": " + indented + "\n" +
      "      }\n" +
      "    }\n" +
      "  }\n" +
      "}";
    act(tw, "Tailwind Config");
  };

  const exportScss = () => {
    const lines = palette
      .map((c) => {
        const key = c.name.toLowerCase().replace(/\s+/g, "-");
        return "$" + baseName + "-" + key + ": " + c.hex + ";";
      })
      .join("\n");
    act(lines, "SCSS Variables");
  };

  const copyAllHex = () =>
    act(palette.map((c) => c.hex.toUpperCase()).join("\n"), "All HEX");

  const copyAllRgb = () =>
    act(
      palette.map((c) => "rgb(" + c.rgb.r + ", " + c.rgb.g + ", " + c.rgb.b + ")").join("\n"),
      "All RGB"
    );

  const btns = [
    { label: "CSS Vars", icon: <Code2 size={13} />, fn: exportCSS },
    { label: "JSON", icon: <Braces size={13} />, fn: exportJSON },
    { label: "Tailwind", icon: <Palette size={13} />, fn: exportTailwind },
    { label: "SCSS", icon: <Code2 size={13} />, fn: exportScss },
    { label: "All HEX", icon: <Copy size={13} />, fn: copyAllHex },
    { label: "All RGB", icon: <Copy size={13} />, fn: copyAllRgb },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {btns.map(({ label, icon, fn }) => (
        <button
          key={label}
          onClick={fn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#13121a",
            border: "1px solid #252334",
            borderRadius: 9,
            color: "#9490b0",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 500,
            padding: "8px 14px",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            transition: "border-color 0.15s, color 0.15s, background 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#5b4fff";
            e.currentTarget.style.color = "#c0b8ff";
            e.currentTarget.style.background = "#1a1830";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#252334";
            e.currentTarget.style.color = "#9490b0";
            e.currentTarget.style.background = "#13121a";
          }}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
