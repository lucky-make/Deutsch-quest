/**
 * Hand-authored SVG icon set — flat, two-tone line icons, one palette,
 * one stroke weight (1.8), everywhere. No image generator involved.
 * Palette (single source of truth, mirrored in styles.css):
 *   ink #23262F · accent #C2452D · teal #2E6E64 · gold #E9A13B · sky #3B6EA5
 */

export const PALETTE = {
  ink: '#23262F',
  accent: '#C2452D',
  teal: '#2E6E64',
  gold: '#E9A13B',
  sky: '#3B6EA5',
  muted: '#9AA0AC',
}

const S = (inner: string) => inner

export const ICONS: Record<string, string> = {
  // ——— mobilität ———
  train: S(`
    <rect x="4" y="3" width="16" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 10h16" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="9" cy="13" r="1.4" fill="${PALETTE.accent}"/><circle cx="15" cy="13" r="1.4" fill="${PALETTE.accent}"/>
    <path d="M7 19l2-3M17 19l-2-3M8 19h8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),
  tram: S(`
    <rect x="5" y="4" width="14" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 2v2M5 10h14" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 1.5l2.5 2.5h-5L12 1.5z" fill="${PALETTE.gold}"/>
    <path d="M8 19l1.5-3M16 19l-1.5-3M7 19h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  bike: S(`
    <circle cx="6" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="18" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6 16l4-8h5l3 8M10 8h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="15.5" cy="6.5" r="1.3" fill="${PALETTE.accent}"/>`),
  haltestelle: S(`
    <path d="M7 21V5a2 2 0 012-2h6a2 2 0 012 2v16" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="9" y="6" width="6" height="4" rx="1" fill="${PALETTE.gold}"/>
    <path d="M7 12h10M5 21h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  strasse: S(`
    <path d="M9 3h6l4 18H5L9 3z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 6v2.4M12 10.8v2.4M12 15.6v2.4" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),
  koffer: S(`
    <rect x="4" y="8" width="16" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 8V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 11.5v5M16 11.5v5" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),

  // ——— wohnung ———
  haus: S(`
    <path d="M4 11l8-7 8 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 10v10h12V10" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="10" y="13" width="4" height="7" fill="${PALETTE.accent}"/>
    <rect x="7" y="12" width="3" height="3" fill="${PALETTE.gold}"/><rect x="14" y="12" width="3" height="3" fill="${PALETTE.gold}"/>`),
  wohnung: S(`
    <rect x="5" y="3" width="14" height="18" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 9h14M5 15h14M12 3v18" stroke="currentColor" stroke-width="1.8"/>
    <rect x="7" y="5" width="3" height="2.4" fill="${PALETTE.gold}"/><rect x="14" y="11" width="3" height="2.4" fill="${PALETTE.teal}"/>
    <rect x="7" y="17" width="3" height="2.4" fill="${PALETTE.accent}"/>`),
  schlüssel: S(`
    <circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M11 11l9 9M17 17l2-2M14 14l2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="8" cy="8" r="1.4" fill="${PALETTE.accent}"/>`),
  bett: S(`
    <path d="M3 18v-7h18v7M3 11V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M3 15h18" stroke="currentColor" stroke-width="1.8"/>
    <rect x="5" y="8.5" width="5" height="2.5" rx="1.2" fill="${PALETTE.teal}"/>`),
  tisch: S(`
    <path d="M3 9h18M5 9l-1 10M19 9l1 10M12 9v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="9" y="5.5" width="6" height="3.5" rx="1" fill="${PALETTE.gold}"/>`),
  fenster: S(`
    <rect x="5" y="4" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 4v16M5 12h14" stroke="currentColor" stroke-width="1.8"/>
    <path d="M7.5 9.5a2 2 0 012-2" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),
  lampe: S(`
    <path d="M8 4h8l3 6H5l3-6z" fill="${PALETTE.gold}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M12 10v9M8 21h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  stuhl: S(`
    <path d="M7 3v10h8V3M7 8h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M7 13h10v8M15 13l3 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  treppenhaus: S(`
    <path d="M3 20h5v-4h4v-4h4V8h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 20V4" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),
  balkon: S(`
    <path d="M4 10h16M5 10v9M19 10v9M9.5 10v9M14.5 10v9M4 19h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <path d="M4 10V7h16v3" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="17" cy="6" r="1.2" fill="${PALETTE.accent}"/>`),
  kaution: S(`
    <path d="M12 3l7 3.5V12c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6.5L12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 12l2.2 2.2L15.5 9.7" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),

  // ——— essen & cafè ———
  brot: S(`
    <path d="M5 10a7 5 0 0114 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 9.5c0-1.4.8-2.5 2-3M13.5 9c.3-1.3 1-2.2 2-2.6" stroke="${PALETTE.gold}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
  apfel: S(`
    <path d="M12 7c-3.5-1.8-7 .6-7 4.5S8 20 12 20s7-4.6 7-8.5S15.5 5.2 12 7z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 7c0-2 1-3.4 3-4" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M15 3c1.8-.4 3 .3 3.4 1.6-1.6.8-3 .2-3.4-1.6z" fill="${PALETTE.teal}"/>`),
  wasser: S(`
    <path d="M8 3h8M10 3v4l-3.2 9.2A3 3 0 009.6 20h4.8a3 3 0 002.8-3.8L14 7V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 14.5h6" stroke="${PALETTE.sky}" stroke-width="1.8" stroke-linecap="round"/>`),
  kaffee: S(`
    <path d="M5 8h11v7a4 4 0 01-4 4H9a4 4 0 01-4-4V8z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16 9h1.5a2.5 2.5 0 010 5H16" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 5c0-1 .8-1 .8-2M11.5 5c0-1 .8-1 .8-2" stroke="${PALETTE.muted}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M8 11.5h5" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  tee: S(`
    <path d="M6 9h12v6a4 4 0 01-4 4h-4a4 4 0 01-4-4V9z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M18 10.5h1.5a2 2 0 010 4H18" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 9V5.5M12 5.5c1.5-1.5 3.5-1.5 4.5 0-2 1.2-3.5 1-4.5 0z" fill="${PALETTE.teal}" stroke="currentColor" stroke-width="1.4"/>`),
  kuchen: S(`
    <path d="M4 20h16v-6a8 5 0 00-16 0v6z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 15.5c2.7 1.6 13.3 1.6 16 0" stroke="${PALETTE.accent}" stroke-width="1.8" fill="none"/>
    <path d="M12 6.5V4M12 4c1-.2 1.6-.9 1.6-1.8" stroke="${PALETTE.teal}" stroke-width="1.6" stroke-linecap="round"/>`),
  gemuese: S(`
    <path d="M12 8v13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 9C7 9 5 6.5 5.5 3.5 9 4 12 5 12 9zM12 9c5 0 7-2.5 6.5-5.5C15 4 12 5 12 9z" fill="${PALETTE.teal}" stroke="currentColor" stroke-width="1.4"/>
    <path d="M12 21c-3.3 0-6-2.7-6-6 0-2.5 1.5-5 3-6.5M12 21c3.3 0 6-2.7 6-6 0-2.5-1.5-5-3-6.5" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8"/>`),
  geld: S(`
    <rect x="3" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="2.6" fill="none" stroke="${PALETTE.gold}" stroke-width="1.8"/>
    <path d="M6 10.5v3M18 10.5v3" stroke="${PALETTE.muted}" stroke-width="1.6" stroke-linecap="round"/>`),
  tüte: S(`
    <path d="M6 8h12l1 12H5L6 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 10V6a3 3 0 016 0v4" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),
  salat: S(`
    <path d="M4 12h16a8 8 0 01-16 0z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M7 12c0-3 2.2-5.5 5-5.5s5 2.5 5 5.5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8"/>
    <circle cx="10" cy="9.5" r="1" fill="${PALETTE.accent}"/><circle cx="14" cy="9" r="1" fill="${PALETTE.gold}"/>`),
  suppe: S(`
    <path d="M4 10h16v2a6 6 0 01-6 6h-4a6 6 0 01-6-6v-2z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M7 7c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0" stroke="${PALETTE.sky}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
  bratwurst: S(`
    <path d="M6.5 6.5c-1.8 1.8-1.6 5 .8 7.4s5.6 2.6 7.4.8c1.5-1.5 1.5-3.6-.2-5.3L11.8 6.7C10.1 5 8 5 6.5 6.5z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 9l3 3M11 7.5l3 3" stroke="${PALETTE.gold}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M17 17l4 4" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  getränk: S(`
    <path d="M7 4h10l-1.2 15a2 2 0 01-2 1.8h-3.6a2 2 0 01-2-1.8L7 4z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M7.6 9h8.8" stroke="${PALETTE.accent}" stroke-width="1.8"/>
    <path d="M17 6.5c2 0 3 1 3 2.5s-1.5 2.5-3.3 2.5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8"/>`),

  // ———alltag & büro ———
  handy: S(`
    <rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M10.5 18.5h3" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="9.5" y="6" width="5" height="7" rx="1" fill="${PALETTE.sky}" opacity="0.5"/>`),
  telefon: S(`
    <path d="M6 4l3 4-2 2c1 2.5 3.5 5 6 6l2-2 4 3-1.5 3c-1 .8-2.4 1-4 .3-4.6-1.8-8.3-5.5-10-10-.6-1.6-.4-3 .3-4L6 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M15 5c2.5 0 4.5 2 4.5 4.5" stroke="${PALETTE.teal}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),
  brief: S(`
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 7l8 6 8-6" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  formular: S(`
    <path d="M6 3h9l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 11h7M9 14.5h7M9 18h4" stroke="${PALETTE.teal}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M14.5 3.5V8H19" fill="none" stroke="currentColor" stroke-width="1.8"/>`),
  pass: S(`
    <rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="10" r="3.2" fill="none" stroke="${PALETTE.sky}" stroke-width="1.8"/>
    <path d="M8.8 10h6.4M12 6.8v6.4M9.6 8.3c1.5 1 3.3 1 4.8 0M9.6 11.7c1.5-1 3.3-1 4.8 0" stroke="${PALETTE.sky}" stroke-width="1.1" fill="none"/>
    <path d="M9 18h6" stroke="${PALETTE.accent}" stroke-width="1.6" stroke-linecap="round"/>`),
  unterschrift: S(`
    <path d="M4 17c2.5 0 2-8 4.5-8s1 9 3.5 9 1.5-6 3.5-6 1.5 3 4.5 2.5" fill="none" stroke="${PALETTE.sky}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M3 20.5h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  kalender: S(`
    <rect x="4" y="5" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="7.5" y="13" width="3" height="3" fill="${PALETTE.accent}"/><rect x="13.5" y="13" width="3" height="3" fill="${PALETTE.teal}"/>`),
  stelle: S(`
    <rect x="4" y="8" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 8V6a3 3 0 016 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 13h16" stroke="currentColor" stroke-width="1.8"/>
    <rect x="10.5" y="11.5" width="3" height="3" rx="1.5" fill="${PALETTE.gold}"/>`),
  lebenslauf: S(`
    <path d="M6 3h9l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="11" cy="10" r="2.2" fill="none" stroke="${PALETTE.teal}" stroke-width="1.6"/>
    <path d="M8 15.5c.6-1.6 4.4-1.6 5 0M8 18h6" stroke="${PALETTE.teal}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
  kasse: S(`
    <rect x="3" y="9" width="18" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6 9l3-5h6l3 5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="6" y="12.5" width="6" height="2.6" rx="1" fill="${PALETTE.gold}"/>
    <circle cx="16.5" cy="15.5" r="1.5" fill="${PALETTE.accent}"/>`),
  kunde: S(`
    <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 20c.8-4 3.5-6 7-6s6.2 2 7 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 20.5v-2M15 20.5v-2" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),
  schürze: S(`
    <path d="M9 3h6v5l5 5v8H4v-8l5-5V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 14h6" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 11v6" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  vertrag: S(`
    <path d="M6 3h9l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 13.5l1.8 1.8 3.4-3.6" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 18h6" stroke="${PALETTE.accent}" stroke-width="1.6" stroke-linecap="round"/>`),
  münzen: S(`
    <ellipse cx="12" cy="7" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9.5 6.7h5" stroke="${PALETTE.gold}" stroke-width="1.6" stroke-linecap="round"/>`),
  sonnenuntergang: S(`
    <path d="M5 16a7 7 0 0114 0" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 5v3M5.6 9.6l2 2M18.4 9.6l-2 2M3 16h2M19 16h2M7 20h10" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),

  // ——— gesundheit ———
  stand: S(`
    <path d="M5 9h14l-2-4H7L5 9z" fill="${PALETTE.accent}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M6 9v10M18 9v10M6 19h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 9v10M15 9v10" stroke="currentColor" stroke-width="1.4"/>
    <rect x="9" y="12" width="6" height="3" fill="${PALETTE.gold}"/>`),
  amt: S(`
    <path d="M4 9h16v11H4z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6 9V6h12v3M12 12v5M9.5 14.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="6.5" r="1.2" fill="${PALETTE.gold}"/>`),
  praxis: S(`
    <path d="M12 20s-7-4.5-7-9.5A4.3 4.3 0 0112 8a4.3 4.3 0 017 2.5c0 5-7 9.5-7 9.5z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 11h6M12 8v6" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  stethoskop: S(`
    <path d="M6 3v5a4 4 0 008 0V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M10 12v3a5 5 0 0010 0v-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="20" cy="11" r="1.8" fill="${PALETTE.accent}"/>`),
  thermos: S(`
    <path d="M10 4a2 2 0 014 0v9a4 4 0 11-4 0V4z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="16.5" r="1.8" fill="${PALETTE.accent}"/>
    <path d="M12 13V8" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  pille: S(`
    <rect x="3.5" y="9" width="17" height="7" rx="3.5" transform="rotate(-20 12 12)" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9.3 13.7l4.8-1.8" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),
  apotheke: S(`
    <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 8v8M8 12h8" stroke="${PALETTE.accent}" stroke-width="2.2" stroke-linecap="round"/>`),
  werkzeug: S(`
    <path d="M14.5 6.5a4 4 0 015 5L9 22H4v-5L14.5 6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" transform="translate(0 -3) scale(0.9)"/>
    <path d="M4 20l9-9" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M13 4l7 7-2 2-7-7 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`),
  reifen: S(`
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="3.5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8"/>
    <path d="M12 4v4.5M12 15.5V20M4 12h4.5M15.5 12H20" stroke="currentColor" stroke-width="1.4"/>`),

  // ——— soziales ———
  geschenk: S(`
    <rect x="4" y="11" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M4 8h16v3H4zM12 8v13" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 8C10 8 8 7 8 5.5S10.5 3 12 8zM12 8c2 0 4-1 4-2.5S13.5 3 12 8z" fill="${PALETTE.accent}" stroke="currentColor" stroke-width="1.2"/>`),
  blumen: S(`
    <path d="M12 12v9M12 17c-2.5 0-4-1.5-4-3.5M12 15c2.5 0 4-1.5 4-3.5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="7" r="2" fill="${PALETTE.accent}"/>
    <circle cx="8.5" cy="9" r="2" fill="${PALETTE.gold}"/><circle cx="15.5" cy="9" r="2" fill="${PALETTE.gold}"/>`),
  gespräch: S(`
    <path d="M4 5h11a2 2 0 012 2v5a2 2 0 01-2 2H9l-4 3V7a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" transform="translate(-1 0)"/>
    <path d="M19 10h1a2 2 0 012 2v8l-3-2.5h-5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="8" cy="9.5" r="1" fill="${PALETTE.accent}"/><circle cx="11.5" cy="9.5" r="1" fill="${PALETTE.gold}"/>`),
  meinung: S(`
    <path d="M5 4h14v11H12l-4 4v-4H5V4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 9.5h6" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 12h4" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),
  laut: S(`
    <path d="M4 10v4h3l5 4V6l-5 4H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M15 9c1.5 1.5 1.5 4.5 0 6M17.5 6.5c3 3 3 8 0 11" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  ruhe: S(`
    <path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16 4.5l.6 1.6 1.6.6-1.6.6L16 9l-.6-1.7-1.6-.6 1.6-.6.6-1.6z" fill="${PALETTE.gold}"/>`),
  grill: S(`
    <path d="M5 8h14l-2 6H7L5 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M7 14l-2 6M17 14l2 6M8.5 17h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 5c.8-.8 1.6-.8 2.4 0M13 5c.8-.8 1.6-.8 2.4 0" stroke="${PALETTE.accent}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
  konzert: S(`
    <path d="M9 18V5l10-2v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="7" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="17" cy="15" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M9 8.5l10-2" stroke="${PALETTE.accent}" stroke-width="1.6"/>`),
  band: S(`
    <path d="M4 19c1-5 3-8 5-8M20 19c-1-5-3-8-5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="8" r="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 20h8" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),
  fest: S(`
    <path d="M3 4c3 3 6 3 9 0s6-3 9 0" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 4v3M9 5.5V9M12 4v3M15 5.5V9M18 4v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="8" y="13" width="3" height="3" fill="${PALETTE.teal}"/><rect x="13" y="13" width="3" height="3" fill="${PALETTE.gold}"/>
    <path d="M11 13v-2M14.5 13v-2.5" stroke="${PALETTE.accent}" stroke-width="1.4"/>`),
  mic: S(`
    <rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 6v5" stroke="${PALETTE.accent}" stroke-width="1.6" stroke-linecap="round"/>`),
  heimat: S(`
    <path d="M4 11l8-7 8 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 10v10h12V10" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 18.4s-3.4-2.2-3.4-4.6a1.9 1.9 0 013.4-1.2 1.9 1.9 0 013.4 1.2c0 2.4-3.4 4.6-3.4 4.6z" fill="${PALETTE.accent}"/>`),
  person: S(`
    <circle cx="12" cy="7.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5.5 20c.7-3.8 3.2-6 6.5-6s5.8 2.2 6.5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  team: S(`
    <circle cx="8" cy="8.5" r="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="16.5" cy="9.5" r="2.3" fill="none" stroke="${PALETTE.teal}" stroke-width="1.6"/>
    <path d="M3.5 19c.6-3.2 2.4-5 4.5-5s3.9 1.8 4.5 5M14 14.5c2.4-.6 5 .8 5.8 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),

  // ——— arbeit & planung ———
  firma: S(`
    <rect x="4" y="9" width="10" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M14 21V4h6v17M4 21h17" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="16.5" y="7" width="1.8" height="1.8" fill="${PALETTE.gold}"/><rect x="16.5" y="11" width="1.8" height="1.8" fill="${PALETTE.gold}"/>
    <rect x="6.5" y="12" width="2.2" height="2.2" fill="${PALETTE.accent}"/><rect x="10" y="12" width="2.2" height="2.2" fill="${PALETTE.accent}"/>`),
  idee: S(`
    <path d="M12 3a6.5 6.5 0 013.5 12c-.6.5-1 1.2-1 2h-5c0-.8-.4-1.5-1-2A6.5 6.5 0 0112 3z" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M10 20h4" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M10.5 13.5c0-2 1-3 1.5-4 .5 1 1.5 2 1.5 4" fill="none" stroke="${PALETTE.gold}" stroke-width="1.4"/>`),
  ziel: S(`
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="1.5" fill="${PALETTE.accent}"/>`),
  präsentation: S(`
    <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 16v3M8 21l4-2 4 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6.5 12.5l3-3 2.5 2 4-4.5" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 7h1.5v1.5" stroke="${PALETTE.accent}" stroke-width="1.4" fill="none"/>`),
  konzept: S(`
    <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <rect x="7.5" y="7.5" width="4" height="4" fill="${PALETTE.teal}"/><rect x="13" y="7.5" width="3.5" height="3.5" fill="${PALETTE.gold}"/>
    <rect x="7.5" y="13" width="3.5" height="3.5" fill="${PALETTE.gold}"/><rect x="12.5" y="13" width="4" height="4" fill="${PALETTE.accent}"/>`),
  entscheidung: S(`
    <path d="M12 3v6M12 21v-6M12 9l-4 3v3M12 9l4 3v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 3l2.5 3h-5L12 3zM8 15l-2 3h4l-2-3zM16 15l-2 3h4l-2-3z" fill="${PALETTE.accent}"/>
    <path d="M12 9v6" stroke="${PALETTE.accent}" stroke-width="1.8"/>`),
  budget: S(`
    <path d="M4 17c0-6 4-10 8-10s8 4 8 10" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M3 17h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8 17v-3M12 17v-5M16 17v-4" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round"/>`),
  urehr: S(`
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="1.2" fill="${PALETTE.accent}"/>`),
  frist: S(`
    <path d="M6 3h12M6 21h12M7 3c0 5 2.5 6.5 5 9 2.5-2.5 5-4 5-9M7 21c0-5 2.5-6.5 5-9 2.5 2.5 5 4 5 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9.5 6.5h5" stroke="${PALETTE.accent}" stroke-width="1.6"/>`),
  widerspruch: S(`
    <path d="M6 4l14 6-6 2.5L11.5 19 6 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M14 14l6 6" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round"/>`),
  beleg: S(`
    <path d="M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 7h6M9 10.5h6M9 14h3.5" stroke="${PALETTE.teal}" stroke-width="1.6" stroke-linecap="round"/>`),
  prüfen: S(`
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16 16l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8 11l2.2 2.2 3.8-4.2" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`),
  zukunft: S(`
    <path d="M4 12h9M4 12c0-4 3-7 7-7h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M13 9l4-4-4-4" fill="none" stroke="${PALETTE.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 7)"/>
    <path d="M15 12h5" stroke="${PALETTE.gold}" stroke-width="1.8" stroke-linecap="round"/>`),
}

// aliases
ICONS.fahrrad = ICONS.bike
ICONS.rede = ICONS.mic

export function icon(name: string | undefined, size = 22): string {
  if (!name) return ''
  const body = ICONS[name]
  if (!body) return ''
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`
}

export function hasIcon(name: string | undefined): boolean {
  return !!name && !!ICONS[name]
}
