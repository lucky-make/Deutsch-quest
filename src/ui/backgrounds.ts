import { PALETTE as P } from './icons'

/**
 * Hand-authored minimal SVG scene backgrounds for situational content —
 * flat geometry, same palette, no external assets.
 * viewBox 0 0 400 180.
 */

const sky = '#EFE7D6'
const far = '#D9CDB4'
const near = '#C9B995'

export const BACKGROUNDS: Record<string, string> = {
  bahnhof: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="130" width="400" height="50" fill="${near}"/>
    <path d="M0 130h400" stroke="${P.muted}" stroke-width="2"/>
    <rect x="230" y="30" width="150" height="100" rx="4" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="250" y="50" width="110" height="45" fill="${P.sky}" opacity="0.45"/>
    <rect x="20" y="120" width="150" height="34" rx="6" fill="${P.teal}"/>
    <rect x="34" y="128" width="34" height="20" rx="3" fill="${P.gold}"/>
    <rect x="76" y="128" width="34" height="20" rx="3" fill="${P.gold}"/>
    <circle cx="40" cy="152" r="6" fill="${P.ink}"/><circle cx="150" cy="152" r="6" fill="${P.ink}"/>
    <path d="M198 40v90" stroke="${P.ink}" stroke-width="4"/><circle cx="198" cy="36" r="5" fill="${P.accent}"/>`,
  strasse: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="120" width="400" height="60" fill="${near}"/>
    <path d="M60 120L20 180M340 120l40 60" stroke="${P.muted}" stroke-width="2"/>
    <rect x="40" y="55" width="70" height="65" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="290" y="40" width="80" height="80" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="55" y="70" width="14" height="14" fill="${P.gold}"/><rect x="80" y="70" width="14" height="14" fill="${P.gold}"/>
    <rect x="55" y="95" width="14" height="25" fill="${P.accent}"/><rect x="80" y="95" width="14" height="25" fill="${P.accent}"/>
    <rect x="308" y="55" width="14" height="14" fill="${P.sky}" opacity="0.6"/><rect x="335" y="55" width="14" height="14" fill="${P.sky}" opacity="0.6"/>
    <path d="M150 180v-50h100v50" fill="${P.teal}" opacity="0.9"/>
    <path d="M170 130v50M200 130v50M230 130v50" stroke="${sky}" stroke-width="3"/>
    <path d="M0 178h400" stroke="${P.ink}" stroke-width="3"/>`,
  wohnung: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="140" width="400" height="40" fill="${near}"/>
    <rect x="20" y="40" width="120" height="80" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="40" y="58" width="34" height="30" fill="${P.sky}" opacity="0.5" stroke="${P.ink}" stroke-width="2"/>
    <rect x="90" y="58" width="34" height="30" fill="${P.sky}" opacity="0.5" stroke="${P.ink}" stroke-width="2"/>
    <rect x="60" y="96" width="34" height="24" fill="${P.accent}"/>
    <rect x="180" y="90" width="140" height="50" rx="6" fill="${P.teal}"/>
    <rect x="190" y="98" width="120" height="16" rx="4" fill="${P.gold}"/>
    <path d="M330 140V60h50v80" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <circle cx="372" cy="105" r="3.5" fill="${P.gold}"/>`,
  laden: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="130" width="400" height="50" fill="${near}"/>
    <rect x="60" y="30" width="280" height="110" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="60" y="30" width="280" height="26" fill="${P.accent}"/>
    <path d="M60 56h280" stroke="${P.ink}" stroke-width="2"/>
    <rect x="90" y="70" width="90" height="60" fill="${P.sky}" opacity="0.45" stroke="${P.ink}" stroke-width="2"/>
    <rect x="220" y="70" width="90" height="60" fill="${P.sky}" opacity="0.45" stroke="${P.ink}" stroke-width="2"/>
    <rect x="110" y="96" width="50" height="34" fill="${P.teal}"/>
    <rect x="240" y="96" width="50" height="34" fill="${P.gold}"/>
    <path d="M155 96v34M265 96v34" stroke="${P.ink}" stroke-width="2"/>`,
  markt: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="132" width="400" height="48" fill="${near}"/>
    <path d="M30 44h120l-10 20H40l-10-20z" fill="${P.accent}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M250 44h120l-10 20H260l-10-20z" fill="${P.accent}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M36 64v66M144 64v66M256 64v66M364 64v66" stroke="${P.ink}" stroke-width="3"/>
    <rect x="48" y="96" width="84" height="26" rx="4" fill="${P.teal}"/>
    <circle cx="66" cy="94" r="7" fill="${P.gold}"/><circle cx="88" cy="92" r="7" fill="${P.accent}"/><circle cx="110" cy="94" r="7" fill="${P.teal}"/>
    <rect x="268" y="96" width="84" height="26" rx="4" fill="${P.gold}"/>
    <circle cx="286" cy="94" r="7" fill="${P.teal}"/><circle cx="308" cy="92" r="7" fill="${P.sky}"/><circle cx="330" cy="94" r="7" fill="${P.accent}"/>`,
  cafe: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="128" width="400" height="52" fill="${near}"/>
    <rect x="30" y="30" width="150" height="100" rx="4" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M45 45h50v40h-50zM115 45h50v40h-50z" fill="${P.sky}" opacity="0.4" stroke="${P.ink}" stroke-width="2"/>
    <rect x="200" y="86" width="170" height="16" rx="3" fill="${P.accent}"/>
    <path d="M215 102v34M355 102v34" stroke="${P.ink}" stroke-width="4"/>
    <path d="M250 86V72h28v14" fill="none" stroke="${P.ink}" stroke-width="3"/>
    <path d="M262 72c-6-10 2-16 2-16M278 72c-6-10 2-16 2-16" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="310" cy="80" r="8" fill="${P.gold}" stroke="${P.ink}" stroke-width="2"/>`,
  klinik: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="132" width="400" height="48" fill="${near}"/>
    <rect x="90" y="26" width="220" height="110" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="170" y="48" width="60" height="60" rx="6" fill="#fff" stroke="${P.ink}" stroke-width="2.5"/>
    <path d="M200 58v40M180 78h40" stroke="${P.accent}" stroke-width="9" stroke-linecap="round"/>
    <rect x="112" y="90" width="40" height="46" fill="${P.teal}"/>
    <rect x="248" y="90" width="40" height="46" fill="${P.sky}" opacity="0.5"/>`,
  buero: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="134" width="400" height="46" fill="${near}"/>
    <rect x="40" y="40" width="320" height="96" rx="4" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="90" y="86" width="220" height="14" rx="3" fill="${P.teal}"/>
    <path d="M110 100v34M290 100v34" stroke="${P.ink}" stroke-width="4"/>
    <rect x="130" y="52" width="60" height="26" rx="2" fill="#fff" stroke="${P.ink}" stroke-width="2"/>
    <path d="M136 68l10-8 8 5 12-9" stroke="${P.accent}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="210" y="52" width="60" height="26" rx="2" fill="#fff" stroke="${P.ink}" stroke-width="2"/>
    <path d="M216 68l10-8 8 5 12-9" stroke="${P.teal}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="316" cy="64" r="8" fill="${P.gold}" stroke="${P.ink}" stroke-width="2"/>`,
  werkstatt: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="128" width="400" height="52" fill="${near}"/>
    <rect x="50" y="34" width="300" height="94" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="70" y="54" width="110" height="74" fill="${P.sky}" opacity="0.35" stroke="${P.ink}" stroke-width="2.5"/>
    <circle cx="230" cy="106" r="18" fill="none" stroke="${P.ink}" stroke-width="3"/>
    <circle cx="282" cy="106" r="18" fill="none" stroke="${P.ink}" stroke-width="3"/>
    <path d="M230 106l16-20h18l16 20" fill="none" stroke="${P.accent}" stroke-width="3"/>
    <rect x="120" y="30" width="14" height="10" fill="${P.accent}"/>`,
  treppenhaus: `
    <rect width="400" height="180" fill="${sky}"/>
    <path d="M20 170h90v-30h90v-30h90V80h90" fill="none" stroke="${P.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M110 170v-30M200 140v-30M290 110V80" stroke="${P.muted}" stroke-width="2"/>
    <rect x="330" y="30" width="50" height="50" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <circle cx="368" cy="56" r="3.5" fill="${P.gold}"/>
    <circle cx="70" cy="60" r="12" fill="${P.gold}" opacity="0.7"/>
    <path d="M58 52l24 16M82 52L58 68" stroke="${P.gold}" stroke-width="2"/>`,
  fest: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="136" width="400" height="44" fill="${P.teal}" opacity="0.35"/>
    <path d="M20 30c30 22 60 22 90 0 30-22 60-22 90 0 30 22 60 22 90 0 30-22 60-22 90 0" fill="none" stroke="${P.accent}" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 30l-8 26M110 36l8 24M200 30l-8 26M290 36l8 24M350 30l-8 26" stroke="${P.gold}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="80" cy="120" r="10" fill="${P.gold}"/><circle cx="200" cy="124" r="10" fill="${P.accent}"/><circle cx="320" cy="120" r="10" fill="${P.teal}"/>
    <path d="M0 170h400" stroke="${P.ink}" stroke-width="3"/>
    <path d="M30 140l14 22M64 142l-12 20M170 144l14 20M230 144l-14 20" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/>`,
  park: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="130" width="400" height="50" fill="${P.teal}" opacity="0.35"/>
    <circle cx="90" cy="80" r="34" fill="${P.teal}" opacity="0.5"/>
    <rect x="86" y="100" width="8" height="30" fill="${P.ink}"/>
    <circle cx="210" cy="66" r="26" fill="${P.accent}" opacity="0.65"/>
    <rect x="207" y="82" width="6" height="48" fill="${P.ink}"/>
    <circle cx="320" cy="86" r="24" fill="${P.gold}" opacity="0.8"/>
    <rect x="317" y="98" width="6" height="32" fill="${P.ink}"/>
    <circle cx="60" cy="36" r="14" fill="${P.gold}"/>
    <path d="M0 172h400" stroke="${P.ink}" stroke-width="3"/>`,
  buehne: `
    <rect width="400" height="180" fill="#2A2D3A"/>
    <path d="M60 130l40-60 40 60z" fill="${P.accent}" opacity="0.85"/>
    <path d="M180 130l50-80 50 80z" fill="${P.gold}" opacity="0.9"/>
    <path d="M290 130l35-50 35 50z" fill="${P.teal}" opacity="0.9"/>
    <rect y="130" width="400" height="50" fill="#1E2130"/>
    <circle cx="120" cy="140" r="8" fill="#3A3F52"/><circle cx="200" cy="144" r="8" fill="#3A3F52"/><circle cx="280" cy="140" r="8" fill="#3A3F52"/>
    <path d="M40 40q160 34 320 0" fill="none" stroke="${P.gold}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>`,
  amt: `
    <rect width="400" height="180" fill="${sky}"/>
    <rect y="132" width="400" height="48" fill="${near}"/>
    <rect x="60" y="26" width="280" height="108" fill="${far}" stroke="${P.ink}" stroke-width="3"/>
    <rect x="80" y="44" width="70" height="40" fill="${P.sky}" opacity="0.45" stroke="${P.ink}" stroke-width="2"/>
    <rect x="250" y="44" width="70" height="40" fill="${P.sky}" opacity="0.45" stroke="${P.ink}" stroke-width="2"/>
    <path d="M155 134V96h90v38" fill="${P.teal}"/>
    <circle cx="200" cy="76" r="12" fill="none" stroke="${P.gold}" stroke-width="3"/>
    <path d="M182 76h36" stroke="${P.gold}" stroke-width="3"/>`,
}

export function background(name: string | undefined): string {
  if (!name || !BACKGROUNDS[name]) return ''
  return `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${BACKGROUNDS[name]}</svg>`
}
