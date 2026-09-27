import type { CSSProperties, ReactNode } from 'react';

/**
 * Hand-drawn doodle icon set — thick dark outline (#141413) + cream fill (#e7e2d4),
 * round caps/joins, slightly irregular shapes. Inspired by the illustration style
 * of anthropic.skilljar.com course cards (original artwork, drawn from scratch).
 */

const INK = '#141413';
const CREAM = '#e7e2d4';

const line = {
  fill: 'none',
  stroke: INK,
  strokeWidth: 20,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const solid = {
  fill: CREAM,
  stroke: INK,
  strokeWidth: 20,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const dot = { fill: INK } as const;

const ICONS: Record<string, ReactNode> = {
  cart: (
    <g>
      <path d="M75 105h52l40 45" {...line} />
      <path d="M127 150h265l-42 170H167z" {...solid} />
      <circle cx="195" cy="395" r="30" {...solid} />
      <circle cx="340" cy="395" r="30" {...solid} />
    </g>
  ),

  mountain: (
    <g>
      <path d="M45 400L215 125l85 140 50-80L495 400z" {...solid} />
      <circle cx="395" cy="95" r="42" {...solid} />
    </g>
  ),

  rocket: (
    <g>
      <path d="M250 55c62 58 92 145 92 240H158c0-95 30-182 92-240z" {...solid} />
      <circle cx="250" cy="195" r="42" {...solid} />
      <path d="M158 250l-65 85 60 20M342 250l65 85-60 20" {...solid} />
      <path d="M215 295c8 40 22 75 35 105 13-30 27-65 35-105z" {...solid} />
    </g>
  ),

  bot: (
    <g>
      <rect x="95" y="140" width="310" height="245" rx="65" {...solid} />
      <path d="M250 140V95" {...line} />
      <circle cx="250" cy="72" r="26" {...solid} />
      <circle cx="190" cy="255" r="26" {...dot} />
      <circle cx="310" cy="255" r="26" {...dot} />
      <path d="M205 330h90" {...line} />
    </g>
  ),

  cup: (
    <g>
      <path d="M145 150h210l-30 245H175z" {...solid} />
      <path d="M128 150h244" {...line} />
      <path d="M318 150l32-95" {...line} />
    </g>
  ),

  palette: (
    <g>
      <path d="M250 55c110 0 195 80 195 180 0 60-55 95-105 95h-45c-30 0-55 25-55 55 0 45-35 60-70 60C110 445 55 355 55 245 55 140 140 55 250 55z" {...solid} />
      <circle cx="160" cy="205" r="26" {...dot} />
      <circle cx="260" cy="150" r="26" {...dot} />
      <circle cx="355" cy="215" r="26" {...dot} />
      <circle cx="140" cy="315" r="26" {...dot} />
    </g>
  ),

  gear: (
    <g>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <rect key={a} x="222" y="28" width="56" height="88" rx="16" transform={`rotate(${a} 250 250)`} {...solid} />
      ))}
      <circle cx="250" cy="250" r="148" {...solid} />
      <circle cx="250" cy="250" r="92" {...solid} />
      <path d="M225 218l-38 32 38 32M275 218l38 32-38 32" {...line} />
    </g>
  ),

  database: (
    <g>
      <ellipse cx="250" cy="118" rx="150" ry="55" {...solid} />
      <path d="M100 118c0 30 67 55 150 55s150-25 150-55v72c0 30-67 55-150 55s-150-25-150-55z" {...solid} />
      <path d="M100 245c0 30 67 55 150 55s150-25 150-55v72c0 30-67 55-150 55s-150-25-150-55z" {...solid} />
    </g>
  ),

  shield: (
    <g>
      <path d="M250 50l175 62v125c0 112-78 178-175 213C153 415 75 349 75 237V112z" {...solid} />
      <path d="M175 255l52 52 108-115" {...line} />
    </g>
  ),

  cloud: (
    <path d="M145 370a80 80 0 0 1-10-159 115 115 0 0 1 213-38 90 90 0 0 1 62 157 78 78 0 0 1-72 40z" {...solid} />
  ),

  briefcase: (
    <g>
      <rect x="65" y="155" width="370" height="235" rx="32" {...solid} />
      <path d="M180 155v-42c0-20 16-36 36-36h68c20 0 36 16 36 36v42" {...solid} />
      <path d="M65 252h370" {...line} />
      <rect x="212" y="230" width="76" height="46" rx="14" {...solid} />
    </g>
  ),

  gradCap: (
    <g>
      <path d="M250 85L55 172l195 87 195-87z" {...solid} />
      <path d="M125 215v105c0 32 57 58 125 58s125-26 125-58V215" {...solid} />
      <path d="M445 172v115" {...line} />
      <circle cx="445" cy="312" r="24" {...solid} />
    </g>
  ),

  laptop: (
    <g>
      <rect x="105" y="105" width="290" height="200" rx="22" {...solid} />
      <path d="M95 305h310l40 85H55z" {...solid} />
      <path d="M205 175l-42 38 42 38M295 175l42 38-42 38" {...line} />
    </g>
  ),

  book: (
    <path d="M250 150c-42-28-100-38-165-33v255c65-5 123 5 165 33 42-28 100-38 165-33V117c-65-5-123 5-165 33z" {...solid} />
  ),

  medal: (
    <g>
      <path d="M175 60l55 155M325 60l-55 155" {...line} />
      <circle cx="250" cy="325" r="118" {...solid} />
      <path d="M250 258l24 49 54 8-39 38 9 54-48-25-48 25 9-54-39-38 54-8z" {...solid} />
    </g>
  ),

  broom: (
    <g>
      <path d="M430 70L262 232" {...line} strokeWidth={30} />
      <path d="M245 240l95 15-55 175-160-30z" {...solid} />
      <path d="M225 300l-15 95M285 320l-5 90" {...line} />
    </g>
  ),

  clock: (
    <g>
      <circle cx="250" cy="280" r="148" {...solid} />
      <path d="M145 160a70 70 0 0 1-70-70M355 160a70 70 0 0 0 70-70" {...line} />
      <path d="M250 195v85l65 45" {...line} />
      <path d="M150 425l-45 45M350 425l45 45" {...line} />
    </g>
  ),

  sparkle: (
    <g>
      <path d="M245 50c13 95 62 156 158 170-96 14-145 75-158 170-13-95-62-156-158-170 96-14 145-75 158-170z" {...solid} />
      <path d="M400 310c7 45 30 74 76 81-46 7-69 36-76 81-7-45-30-74-76-81 46-7 69-36 76-81z" {...solid} />
    </g>
  ),

  chat: (
    <g>
      <path d="M105 100h290a55 55 0 0 1 55 55v145a55 55 0 0 1-55 55H235l-90 68v-68H105a55 55 0 0 1-55-55V155a55 55 0 0 1 55-55z" {...solid} />
      <circle cx="175" cy="228" r="21" {...dot} />
      <circle cx="250" cy="228" r="21" {...dot} />
      <circle cx="325" cy="228" r="21" {...dot} />
    </g>
  ),

  clipboard: (
    <g>
      <rect x="105" y="95" width="290" height="330" rx="32" {...solid} />
      <rect x="180" y="55" width="140" height="75" rx="22" {...solid} />
      <path d="M175 235l45 45 95-95" {...line} />
      <path d="M175 335h145M175 390h95" {...line} />
    </g>
  ),

  chart: (
    <g>
      <path d="M85 405h330" {...line} />
      <rect x="120" y="270" width="75" height="135" rx="14" {...solid} />
      <rect x="215" y="195" width="75" height="210" rx="14" {...solid} />
      <rect x="310" y="120" width="75" height="285" rx="14" {...solid} />
    </g>
  ),

  doc: (
    <g>
      <path d="M135 55h145l95 95v290a35 35 0 0 1-35 35H115a35 35 0 0 1-35-35V90a35 35 0 0 1 35-35z" {...solid} />
      <path d="M280 55v95h95" {...line} />
      <path d="M165 250h170M165 315h170M165 380h110" {...line} />
    </g>
  ),

  mega: (
    <g>
      <path d="M115 175h95l215-110v370l-215-110h-95a60 75 0 0 1 0-150z" {...solid} />
      <path d="M160 325v55a35 35 0 0 0 35 35h35" {...line} />
      <path d="M445 170c28 24 44 52 47 82M450 335c26-26 41-54 44-85" {...line} />
    </g>
  ),

  phone: (
    <g>
      <rect x="145" y="55" width="210" height="390" rx="42" {...solid} />
      <path d="M215 105h70" {...line} />
      <circle cx="250" cy="395" r="24" {...solid} />
    </g>
  ),

  heart: (
    <path d="M250 425c-30-25-190-135-190-240 0-60 48-108 108-108 42 0 70 22 82 48 12-26 40-48 82-48 60 0 108 48 108 108 0 105-160 215-190 240z" {...solid} />
  ),

  puzzle: (
    <path d="M115 115h100a55 55 0 1 1 110 0h100v100a55 55 0 1 1 0 110v100H325a55 55 0 1 0-110 0H115V325a55 55 0 1 0 0-110z" {...solid} />
  ),

  bell: (
    <g>
      <path d="M250 65c-78 0-132 54-132 134v78l-48 72h360l-48-72v-78c0-80-54-134-132-134z" {...solid} />
      <path d="M212 349a38 38 0 0 0 76 0" {...solid} />
      <circle cx="250" cy="45" r="22" {...solid} />
    </g>
  ),

  drop: (
    <g>
      <path d="M250 50S95 235 95 320a155 155 0 0 0 310 0C405 235 250 50 250 50z" {...solid} />
      <path d="M175 330a75 75 0 0 0 42 66" {...line} />
    </g>
  ),

  building: (
    <g>
      <rect x="75" y="195" width="155" height="245" rx="14" {...solid} />
      <rect x="270" y="95" width="155" height="345" rx="14" {...solid} />
      <path d="M115 250h75M115 310h75M115 370h75" {...line} />
      <path d="M310 155h75M310 220h75M310 285h75M310 350h75" {...line} />
    </g>
  ),

  home: (
    <g>
      <path d="M75 250L250 95l175 155" {...line} />
      <path d="M125 228v172a22 22 0 0 0 22 22h206a22 22 0 0 0 22-22V228" {...solid} />
      <rect x="215" y="310" width="70" height="112" rx="10" {...solid} />
    </g>
  ),

  gamepad: (
    <g>
      <path d="M170 165h160c95 0 145 60 145 140 0 70-55 115-115 115-45 0-75-30-90-70h-40c-15 40-45 70-90 70-50 0-95-40-95-115 0-80 50-140 125-140z" {...solid} />
      <path d="M155 285h65M187 253v65" {...line} />
      <circle cx="355" cy="255" r="20" {...dot} />
      <circle cx="400" cy="305" r="20" {...dot} />
    </g>
  ),

  film: (
    <g>
      <rect x="70" y="195" width="360" height="225" rx="24" {...solid} />
      <path d="M70 272h360" {...line} />
      <path d="M110 195l45 77M195 195l45 77M280 195l45 77M365 195l45 77" {...line} />
    </g>
  ),

  globe: (
    <g>
      <circle cx="250" cy="250" r="185" {...solid} />
      <ellipse cx="250" cy="250" rx="85" ry="185" {...line} />
      <path d="M80 185h340M80 315h340" {...line} />
    </g>
  ),

  layers: (
    <g>
      <path d="M250 65L55 162l195 97 195-97z" {...solid} />
      <path d="M55 268l195 97 195-97" {...line} />
      <path d="M55 365l195 97 195-97" {...line} />
    </g>
  ),

  store: (
    <g>
      <path d="M95 200h310v235H95z" {...solid} />
      <path d="M75 200l40-100h270l40 100a44 44 0 0 1-87.5 0 44 44 0 0 1-87.5 0 44 44 0 0 1-87.5 0 44 44 0 0 1-87.5 0z" {...solid} />
      <rect x="205" y="300" width="90" height="135" rx="12" {...solid} />
    </g>
  ),

  bolt: (
    <path d="M300 45L130 285h105L200 455l190-255H280z" {...solid} />
  ),

  signal: (
    <g>
      <circle cx="250" cy="375" r="45" {...solid} />
      <path d="M160 305a130 130 0 0 1 180 0" {...line} />
      <path d="M95 235a225 225 0 0 1 310 0" {...line} />
    </g>
  ),

  mail: (
    <g>
      <rect x="70" y="130" width="360" height="240" rx="30" {...solid} />
      <path d="M88 152L250 285 412 152" {...line} />
    </g>
  ),

  check: (
    <g>
      <circle cx="250" cy="250" r="175" {...solid} />
      <path d="M160 255l65 65 130-140" {...line} />
    </g>
  ),

  terminal: (
    <g>
      <rect x="65" y="105" width="370" height="290" rx="30" {...solid} />
      <path d="M150 200l-55 50 55 50M350 200l55 50-55 50M280 190L225 310" {...line} />
    </g>
  ),
};

const EMOJI_MAP: Record<string, string> = {
  '🛒': 'cart',
  '🛍️': 'store',
  '🛎️': 'bell',
  '🥾': 'mountain',
  '🐐': 'mountain',
  '🚀': 'rocket',
  '🤖': 'bot',
  '🧠': 'bot',
  '🥤': 'cup',
  '🍽️': 'cup',
  '☕': 'cup',
  '🎨': 'palette',
  '⚙️': 'gear',
  '🗄️': 'database',
  '🔒': 'shield',
  '🛡️': 'shield',
  '☁️': 'cloud',
  '💼': 'briefcase',
  '🎓': 'gradCap',
  '💻': 'laptop',
  '🧑‍💻': 'laptop',
  '📚': 'book',
  '📖': 'book',
  '🏅': 'medal',
  '💪': 'bolt',
  '🧹': 'broom',
  '⏱️': 'clock',
  '⏰': 'clock',
  '✨': 'sparkle',
  '💬': 'chat',
  '🤝': 'chat',
  '📋': 'clipboard',
  '📊': 'chart',
  '📄': 'doc',
  '📣': 'mega',
  '📲': 'phone',
  '🩺': 'heart',
  '🧩': 'puzzle',
  '🛎': 'bell',
  '💧': 'drop',
  '🏨': 'building',
  '🏥': 'building',
  '🏗️': 'building',
  '🏡': 'home',
  '🏠': 'home',
  '🎮': 'gamepad',
  '🎬': 'film',
  '🎥': 'film',
  '🌐': 'globe',
  '🌀': 'globe',
  '🗂️': 'layers',
  '⚡': 'bolt',
  '📡': 'signal',
  '📧': 'mail',
  '✅': 'check',
  '🐙': 'terminal',
};

export type DoodleIcon = keyof typeof ICONS;

export const iconFor = (emoji?: string): string =>
  (emoji && EMOJI_MAP[emoji]) || 'sparkle';

interface DoodleProps {
  /** Emoji to look up in the doodle map (ignored when `name` is given). */
  emoji?: string;
  /** Direct icon name, e.g. "rocket". */
  name?: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const Doodle = ({ emoji, name, size, className, style, title }: DoodleProps) => {
  const key = (name && ICONS[name] ? name : iconFor(emoji)) as string;
  const dim = size ?? '100%';
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ display: 'block', width: dim, height: dim, ...style }}
    >
      {title ? <title>{title}</title> : null}
      {ICONS[key] ?? ICONS.sparkle}
    </svg>
  );
};

export default Doodle;
