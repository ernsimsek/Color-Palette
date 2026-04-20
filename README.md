# Color Palette

A Next.js-based color tool that generates multiple palettes from a single base color and makes copying/exporting those palettes in different formats easy.

## Features

- Select a base color via HEX input or native color picker
- 6 palette modes:
  - `Shades`
  - `Complementary`
  - `Triadic`
  - `Analogous`
  - `Split`
  - `Monochromatic`
- Copy generated colors one by one in `HEX`, `RGB`, or `HSL`
- View and copy base color details
- Bulk export options:
  - CSS variables
  - JSON
  - Tailwind config snippet
  - SCSS variables
  - All HEX values
  - All RGB values
- Toast notifications for copy actions

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4 (via PostCSS integration)
- Lucide React (icons)

## Getting Started

### Requirements

- Node.js 20+ (LTS recommended)
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

### Build and Run Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
app/            # Next.js App Router pages and global styles
components/     # UI components (input, swatch, export panel, etc.)
context/        # Toast context/provider
hooks/          # Reusable React hooks
lib/            # Color conversions and palette generators
public/         # Static assets
```

## How It Works

1. Pick a base color or enter a HEX value.
2. Switch palette modes to generate different harmonies.
3. Click color swatches to copy values in your preferred format.
4. Use the `Export` section to copy the palette in the format you need.

<img width="1735" height="1079" alt="Ekran görüntüsü 2026-04-20 140745" src="https://github.com/user-attachments/assets/578b2363-cc09-48e7-9738-0f963eafc390" />

## Notes

- This project is a client-side color utility, so it does not require a separate backend service.
- Palette generation logic is implemented in `lib/color.ts` using HSL/RGB/HEX conversions.
