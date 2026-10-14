// ─────────────────────────────────────────────────────────────────────────────
// Hero pocket config: colors, copy, pocket geometry, capture sources, the
// themes that loop, and every timing. The animation code only reads from here.
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  ink: "#1E2433",
  coral: "#FF5A4E",
} as const;

export const COPY = {
  chatButton: "chat with thread",
  saves: (n: number) => `${n} saves`,
  ariaLabel:
    "Screenshots from apps like Instagram, TikTok and WhatsApp float in and drop into a frosted glass pocket, and a thread card groups them by topic.",
} as const;

// Pocket geometry in its own 200 x 170 coordinate space (viewBox).
export const POCKET = {
  viewBox: { w: 200, h: 170 },
  path: "M 12 0 H 188 Q 200 0 200 12 V 128 C 200 148 140 162 100 170 C 60 162 0 148 0 128 V 12 Q 0 0 12 0 Z",
  stitch: "M 9 18 V 126 C 9 142 60 154 100 161 C 140 154 191 142 191 126 V 18",
  tag: { x: 190, y: 22, w: 26, h: 12, r: 3 },
} as const;

// Where things live in the hero (CSS values). Desktop / mobile.
export const LAYOUT = {
  pocketWidth: { desktop: 150, mobile: 92 }, // px
  pocketRight: { desktop: "7%", mobile: "5%" },
  pocketBottom: { desktop: 150, mobile: 172 }, // px above the hero bottom
  hoverLift: { desktop: 150, mobile: 4 }, // px above the pocket where a capture pauses
  card: { desktop: { w: 72, h: 152 }, mobile: { w: 52, h: 110 } },
  threadCardWidth: { desktop: 232, mobile: 176 },
  // on mobile the thread card sits to the left of the pocket instead of above it
  threadCardSide: { desktop: "above", mobile: "left" } as { desktop: "above" | "left"; mobile: "above" | "left" },
} as const;

export type Source = "instagram" | "tiktok" | "whatsapp" | "photos" | "safari" | "youtube";
export type Art = "camera" | "darkroom" | "film" | "street" | "print" | "lens" | "tokyo1" | "tokyo2" | "tokyo3" | "tokyo4" | "bread1" | "bread2" | "bread3" | "bread4";

export type Capture = { source: Source; art: Art; src?: string };
export type Theme = { title: string; captures: Capture[] };

export const THEMES: Theme[] = [
  {
    title: "film photography",
    captures: [
      { source: "instagram", art: "camera" },
      { source: "tiktok", art: "darkroom" },
      { source: "whatsapp", art: "film" },
      { source: "photos", art: "street" },
      { source: "safari", art: "print" },
      { source: "youtube", art: "lens" },
    ],
  },
  {
    title: "tokyo trip",
    captures: [
      { source: "tiktok", art: "tokyo1" },
      { source: "instagram", art: "tokyo2" },
      { source: "safari", art: "tokyo3" },
      { source: "whatsapp", art: "tokyo4" },
    ],
  },
  {
    title: "sourdough",
    captures: [
      { source: "youtube", art: "bread1" },
      { source: "instagram", art: "bread2" },
      { source: "photos", art: "bread3" },
      { source: "tiktok", art: "bread4" },
    ],
  },
];

// Timings in seconds.
export const TIMING = {
  calm: 0.6, // empty pocket before the first capture of a theme
  hover: 0.7, // capture floats above the pocket
  drop: 0.45, // glide into the pocket
  betweenCaptures: 0.1,
  cardLinger: 4.0, // thread card stays up
  cardDrop: 0.8,
  fade: 0.8, // pocket colors fade before the next theme
} as const;

export const TAG_TUG_MS = 520;
