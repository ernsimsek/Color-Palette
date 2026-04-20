export interface ColorStop {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export type PaletteMode =
  | "shades"
  | "complementary"
  | "triadic"
  | "analogous"
  | "split"
  | "monochromatic";

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function makeStop(hex: string, name: string): ColorStop {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex, name, rgb, hsl };
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1828" : "#f0eeff";
}

export function isLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

// ─── Palette generators ───────────────────────────────────────────────────────

export function generateShades(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  const stops = [
    { l: 97, n: "50" },
    { l: 94, n: "100" },
    { l: 86, n: "200" },
    { l: 75, n: "300" },
    { l: 62, n: "400" },
    { l: 50, n: "500" },
    { l: 38, n: "600" },
    { l: 27, n: "700" },
    { l: 18, n: "800" },
    { l: 11, n: "900" },
    { l: 6, n: "950" },
  ];
  return stops.map(({ l, n }) =>
    makeStop(hslToHex(h, Math.min(s, 92), l), n)
  );
}

export function generateComplementary(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const comp = (h + 180) % 360;
  return [
    makeStop(hslToHex(h, s, 90), "Base 100"),
    makeStop(hslToHex(h, s, 75), "Base 300"),
    makeStop(hex, "Base 500"),
    makeStop(hslToHex(h, s, 30), "Base 700"),
    makeStop(hslToHex(h, s, 15), "Base 900"),
    makeStop(hslToHex(comp, s, 90), "Comp 100"),
    makeStop(hslToHex(comp, s, 75), "Comp 300"),
    makeStop(hslToHex(comp, s, l), "Comp 500"),
    makeStop(hslToHex(comp, s, 30), "Comp 700"),
    makeStop(hslToHex(comp, s, 15), "Comp 900"),
  ];
}

export function generateTriadic(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const h2 = (h + 120) % 360,
    h3 = (h + 240) % 360;
  const ls = [85, 65, l, 35, 15];
  return [
    ...ls.map((light, i) =>
      makeStop(hslToHex(h, s, light), ["P-100","P-300","P-500","P-700","P-900"][i])
    ),
    ...ls.map((light, i) =>
      makeStop(hslToHex(h2, s, light), ["S-100","S-300","S-500","S-700","S-900"][i])
    ),
    ...ls.map((light, i) =>
      makeStop(hslToHex(h3, s, light), ["T-100","T-300","T-500","T-700","T-900"][i])
    ),
  ];
}

export function generateAnalogous(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const angles = [-30, -15, 0, 15, 30];
  return angles.flatMap((a) => {
    const hn = (h + a + 360) % 360;
    return [
      makeStop(hslToHex(hn, s, 80), `${a > 0 ? "+" : ""}${a}° Light`),
      makeStop(hslToHex(hn, s, l), `${a > 0 ? "+" : ""}${a}° Base`),
      makeStop(hslToHex(hn, s, 28), `${a > 0 ? "+" : ""}${a}° Dark`),
    ];
  });
}

export function generateSplit(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const s1 = (h + 150) % 360,
    s2 = (h + 210) % 360;
  const ls = [80, l, 25];
  const labels = ["Light", "Base", "Dark"];
  return [
    ...ls.map((light, i) => makeStop(hslToHex(h, s, light), `Base ${labels[i]}`)),
    ...ls.map((light, i) => makeStop(hslToHex(s1, s, light), `Split1 ${labels[i]}`)),
    ...ls.map((light, i) => makeStop(hslToHex(s2, s, light), `Split2 ${labels[i]}`)),
  ];
}

export function generateMonochromatic(hex: string): ColorStop[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const saturations = [s * 0.2, s * 0.4, s * 0.6, s * 0.8, s, Math.min(s * 1.1, 100), Math.min(s * 1.2, 100)];
  const lightnesses = [92, 78, 64, 52, l, 32, 18];
  return lightnesses.map((light, i) =>
    makeStop(hslToHex(h, saturations[i], light), `Mono ${i + 1}`)
  );
}

export function getPalette(hex: string, mode: PaletteMode): ColorStop[] {
  switch (mode) {
    case "shades": return generateShades(hex);
    case "complementary": return generateComplementary(hex);
    case "triadic": return generateTriadic(hex);
    case "analogous": return generateAnalogous(hex);
    case "split": return generateSplit(hex);
    case "monochromatic": return generateMonochromatic(hex);
  }
}
