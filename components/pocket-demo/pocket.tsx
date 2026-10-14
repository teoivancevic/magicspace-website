import { COLORS, POCKET } from "./config";

type PocketProps = {
  /** content rendered inside the pocket, behind the frosted front */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** bump to replay the tag tug animation */
  tugKey?: number;
};

const { w, h } = POCKET.viewBox;
const clip = "url(#pocket-shape)";
const toUnit = `scale(${1 / w} ${1 / h})`;

/**
 * A flat patch pocket of milky frosted glass, sewn onto the fabric.
 * Layers, back to front:
 *   1. fabric shadow + pocket back
 *   2. children (cards inside), clipped to the pocket shape
 *   3. coral tag sewn into the right seam
 *   4. frosted glass front with backdrop blur
 *   5. stitch line, edge highlight and outline
 */
export function Pocket({ children, className, style, tugKey = 0 }: PocketProps) {
  return (
    <div
      className={className ? `pocket-root ${className}` : "pocket-root"}
      style={{ position: "relative", aspectRatio: `${w} / ${h}`, ...style }}
    >
      {/* 1. soft shadow where the patch meets the fabric, plus a faint pocket back */}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          {/* scaled to the box so HTML layers can clip to the pocket at any size */}
          <clipPath id="pocket-shape" clipPathUnits="objectBoundingBox">
            <path d={POCKET.path} transform={toUnit} />
          </clipPath>
        </defs>
        <path
          d={POCKET.path}
          fill="rgba(255,255,255,0.25)"
          style={{ filter: "drop-shadow(0 10px 18px rgba(30,36,51,0.14)) drop-shadow(0 2px 3px rgba(30,36,51,0.10))" }}
        />
      </svg>

      {/* 2. things inside the pocket */}
      <div className="absolute inset-0" style={{ clipPath: clip }}>
        {children}
      </div>

      {/* 3. coral tag, sewn into the right seam; the part under the glass shows through blurred */}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g
          key={tugKey}
          className={tugKey ? "pocket-tag is-tugging" : "pocket-tag"}
          style={{
            transformBox: "fill-box",
            transformOrigin: "0% 50%",
            filter: "drop-shadow(0 1px 1.5px rgba(30,36,51,0.18))",
          }}
        >
          <rect
            x={POCKET.tag.x - 8}
            y={POCKET.tag.y}
            width={POCKET.tag.w + 8}
            height={POCKET.tag.h}
            rx={POCKET.tag.r}
            fill={COLORS.coral}
          />
          <rect
            x={POCKET.tag.x - 8}
            y={POCKET.tag.y}
            width={POCKET.tag.w + 8}
            height={POCKET.tag.h / 2}
            rx={POCKET.tag.r}
            fill="rgba(255,255,255,0.18)"
          />
        </g>
      </svg>

      {/* 4. frosted glass front */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: clip,
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          backdropFilter: "blur(14px) saturate(160%)",
          background:
            "radial-gradient(90% 60% at 30% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.46) 30%, rgba(255,255,255,0.42) 100%)",
        }}
      />

      {/* 5. stitching, top-edge highlight and outline */}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="pocket-top-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.15" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.85" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pocket-side-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* inner shadow along the edges so the glass reads as a slab */}
        <clipPath id="pocket-clip">
          <path d={POCKET.path} />
        </clipPath>
        <filter id="pocket-inner-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <g clipPath="url(#pocket-clip)">
          <path d={POCKET.path} fill="none" stroke="rgba(30,36,51,0.16)" strokeWidth="3" filter="url(#pocket-inner-blur)" />
          <path d={POCKET.path} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" filter="url(#pocket-inner-blur)" transform="translate(0 1.2)" />
        </g>
        {/* soft inner edge so the glass reads as a slab, not a flat shape */}
        <path d={POCKET.path} fill="none" stroke="url(#pocket-side-light)" strokeWidth="1.5" />
        <path d={POCKET.path} fill="none" stroke="rgba(30,36,51,0.07)" strokeWidth="0.75" />
        {/* bright highlight along the opening */}
        <line x1="6" y1="0.75" x2={w - 6} y2="0.75" stroke="url(#pocket-top-highlight)" strokeWidth="1.5" />
        {/* dashed stitch, U shape */}
        <path
          d={POCKET.stitch}
          fill="none"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.4"
          strokeDasharray="3.2 2.6"
          strokeLinecap="round"
        />
        <path
          d={POCKET.stitch}
          fill="none"
          stroke="rgba(30,36,51,0.10)"
          strokeWidth="1.4"
          strokeDasharray="3.2 2.6"
          strokeLinecap="round"
          transform="translate(0 0.7)"
          style={{ mixBlendMode: "multiply" }}
        />
      </svg>
    </div>
  );
}
