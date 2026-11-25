# Boletas App

Single-page commercial note ("nota de venta") generator built with Astro. No login and no backend.

## Features

- Company details (logo, name, phone, email, address, city) are saved in `localStorage` and restored on the next visit.
- Line items with automatic amount (`quantity x cost`).
- IVA and discount entered as percentages; subtotal, IVA, discount and total are calculated automatically.
- Live preview of the printed note and one-click PDF download.
- No logo uploaded: the company initials are shown instead.

## Commands

```bash
npm install
npm run dev      # local development
npm test         # calculation and storage tests
npm run build    # static build in dist/
npm run preview  # serve the build locally
```

## Design

The interface follows the "Estilo de Litografia de Precisao" token set: Source Sans Pro for text, Roboto Mono for technical values, scientific navy (`#003366`), silver (`#C0C0C0`), electric blue (`#00BFFF`) accents, 8 px radii and 1 px strokes over a 32 px grid. Fonts are bundled locally with Fontsource, so no external requests are needed.

The two-column layout collapses below 768 px; item rows become labelled cards below 620 px so the page never scrolls horizontally. The primary button uses white text on navy because the specified neutral-on-primary combination does not meet contrast requirements.

## Notes

- IVA and discount are percentages of the subtotal: `total = subtotal + IVA - descuento`.
- The currency symbol is `CURRENCY_SYMBOL` in `src/lib/invoice.js` (default `$`).
- Uploaded logos are downscaled to 240 px before being stored, to stay within the `localStorage` quota.
- PDF export captures a hidden, fixed-size A4 sheet (794 × 1123 px at 96 dpi) with `html2canvas` and builds the file with `jsPDF`. The preview and export sheet share the same Astro component and renderer, so the PDF is identical on desktop and mobile.
- Large amounts wrap inside their cells instead of overflowing the table.
