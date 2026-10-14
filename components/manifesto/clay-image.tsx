import images from "@/content/manifesto-images.json";
import { cn } from "@/lib/utils";

type Manifest = Record<string, { width: number; height: number }>;
const manifest = images as Manifest;

export function imageSize(name: string) {
  return manifest[name] ?? null;
}

export function hasImage(name: string) {
  return name in manifest;
}

// A decorative clay render, lazy and hidden from assistive tech. The multiply
// blend that hides its white background lives on the outermost wrapper (class
// "clay"), because transforms and animations isolate blending.
export function ClayImage({
  name,
  width,
  className,
  style,
}: {
  name: string;
  /** rendered width in px; height follows the image's aspect ratio */
  width?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const size = imageSize(name);
  if (!size) return null;
  const w = width ?? size.width;
  const h = Math.round((size.height / size.width) * w);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/manifesto/${name}.webp`}
      srcSet={`/manifesto/${name}.webp 1x, /manifesto/${name}@2x.webp 2x`}
      width={w}
      height={h}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("pointer-events-none select-none", className)}
      style={style}
    />
  );
}
