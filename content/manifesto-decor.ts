// Where every clay illustration, word icon and marker effect sits in the
// manifesto. Paragraph numbers are 0-based indexes into manifesto.paragraphs in
// ./home.ts. Image names map to public/manifesto/<name>.webp (+ @2x); an image
// that is missing from manifesto-images.json simply renders nothing.

export const LINEN = "#F4F1EC";

export type Side = "left" | "right";

export type FloatingIcon = {
  image: string;
  /** desktop position relative to the paragraph box: x in % of its width, y in % of its height */
  x: number;
  y: number;
  /** mobile position, same units (paragraph is narrower and taller there) */
  mx: number;
  my: number;
  /** rendered size in px on desktop (mobile uses ~80%) */
  size?: number;
  tilt?: number;
  /** stop-motion rotation, 30° every 150ms */
  spin?: boolean;
};

export type Illustration = {
  image: string;
  paragraph: number;
  side: Side;
  /** desktop width in px at ≥1440px; scales down 15% on narrower screens */
  width: number;
  /** vertical offset from the paragraph's top, in px (desktop) */
  top?: number;
  /** also show it on mobile/tablet, centered after the paragraph (or before it with `above`) */
  mobile?: boolean;
  above?: boolean;
  /** mobile: render at roughly a quarter of the screen width instead of ~38% */
  small?: boolean;
  entrance?: "pop" | "drop";
  rotate?: number;
  /** draw the soft CSS ground shadow (off for things that fly) */
  shadow?: boolean;
};

/** clay icons floating loosely around paragraph 1, not tied to the words.
 *  desktop: in the side margins; mobile: a loose strip above the paragraph */
export const floatingIcons: { paragraph: number; icons: FloatingIcon[] } = {
  paragraph: 1,
  icons: [
    { image: "icon-vinyl", x: -15, y: 8, mx: 8, my: 10, size: 56, tilt: -8, spin: true },
    { image: "icon-mic", x: 110, y: 2, mx: 24, my: 18, size: 50, tilt: 10 },
    { image: "icon-painting", x: 112, y: 38, mx: 40, my: 8, size: 52, tilt: -4 },
    { image: "icon-bowl", x: -19, y: 55, mx: 56, my: 17, size: 54, tilt: 6 },
    { image: "icon-jacket", x: 110, y: 72, mx: 72, my: 9, size: 54, tilt: -6 },
    { image: "icon-book", x: -11, y: 100, mx: 88, my: 18, size: 52, tilt: 8 },
    { image: "icon-city", x: 104, y: 112, mx: 92, my: 6, size: 56, tilt: -3 },
  ],
};

export const countUp = { paragraph: 0, text: "12,000", frames: 12, duration: 800 };

export const highlight = { paragraph: 3, word: "seed", color: "#F7E08A", opacity: 0.7 };

export const strikes = { paragraph: 5, phrases: ["ads", "selling it", "training ai on it"], stepMs: 400 };

/** slot for the handwritten replacement; set `svg` to e.g. "/manifesto/handwriting.svg" once drawn */
export const handwriting = { paragraph: 6, phrase: "a little more yourself", svg: null as string | null };

// One illustration per side per screen. Sides alternate down the page so two
// never stack on the same side within a viewport.
export const illustrations: Illustration[] = [
  { image: "graveyard", paragraph: 0, side: "left", width: 230, top: -210, mobile: true, above: true, shadow: true },
  { image: "falling-screens", paragraph: 2, side: "right", width: 190, top: 70 },
  { image: "seeds", paragraph: 3, side: "left", width: 170, top: -10, entrance: "drop", rotate: -8, shadow: true },
  { image: "pocket", paragraph: 4, side: "left", width: 170, top: -30, shadow: true },
  { image: "padlock", paragraph: 5, side: "left", width: 105, top: 10, mobile: true, small: true, shadow: true },
];

/** sticky seed → sprout → flower in the right margin, looping as stop-motion */
export const growth = {
  paragraph: 4,
  frames: ["seed", "sprout", "flower"],
  width: 240,
  side: "right" as Side,
};

/** garden below the last paragraph, with the bee and butterfly flying around it */
export const garden = {
  paragraph: 6,
  image: "garden",
  width: 440,
  critters: [
    { image: "bee", width: 64 },
    { image: "butterfly", width: 64 },
  ],
};
