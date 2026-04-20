"use client";
import { useState, useRef } from "react";

interface Props {
  value: string;
  onChange: (hex: string) => void;
  onGenerate: () => void;
}

export function ColorInput({ value, onChange, onGenerate }: Props) {
  const [focused, setFocused] = useState(false);
  const [rawInput, setRawInput] = useState(value);
  const pickerRef = useRef<HTMLInputElement>(null);

  const handleHexChange = (v: string) => {
    setRawInput(v);
    const clean = v.startsWith("#") ? v : "#" + v;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) onChange(clean);
  };

  const handlePickerChange = (v: string) => {
    setRawInput(v);
    onChange(v);
  };

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#13121a",
          border: `1px solid ${focused ? "#5b4fff" : "#252334"}`,
          borderRadius: 14,
          padding: "10px 16px",
          transition: "border-color 0.2s",
        }}
      >
        {/* Color dot */}
        <div
          onClick={() => pickerRef.current?.click()}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: value,
            border: "2px solid rgba(255,255,255,0.12)",
            cursor: "pointer",
            flexShrink: 0,
            position: "relative",
            transition: "transform 0.15s",
          }}
        >
          <input
            ref={pickerRef}
            type="color"
            value={value}
            onChange={(e) => handlePickerChange(e.target.value)}
            style={{
              position: "absolute",
              inset: -4,
              width: "calc(100% + 8px)",
              height: "calc(100% + 8px)",
              opacity: 0,
              cursor: "pointer",
              border: "none",
              padding: 0,
            }}
          />
        </div>

        {/* Hex text input */}
        <input
          type="text"
          value={rawInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onFocus={() => { setFocused(true); setRawInput(value); }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          maxLength={7}
          spellCheck={false}
          placeholder="#5b4fff"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            fontWeight: 500,
            color: "#e8e6f0",
            width: 94,
            letterSpacing: "0.05em",
          }}
        />
      </div>

      <button
        onClick={onGenerate}
        style={{
          background: "#5b4fff",
          border: "none",
          borderRadius: 12,
          color: "#fff",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px 24px",
          cursor: "pointer",
          transition: "background 0.15s, transform 0.1s",
          letterSpacing: "0.01em",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#7065ff")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#5b4fff")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Generate →
      </button>
    </div>
  );
}
