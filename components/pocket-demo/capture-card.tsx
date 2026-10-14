import { Instagram, Music2, MessageCircle, Image as ImageIcon, Compass, Play } from "lucide-react";
import type { Capture, Source } from "./config";
import { ART } from "./art";

const SOURCE_ICON: Record<Source, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  instagram: Instagram,
  tiktok: Music2,
  whatsapp: MessageCircle,
  photos: ImageIcon,
  safari: Compass,
  youtube: Play,
};

// brand-colored badge backgrounds (plain glyphs, no logos)
const SOURCE_BG: Record<Source, string> = {
  instagram: "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
  tiktok: "#111111",
  whatsapp: "#25D366",
  photos: "conic-gradient(from 0deg, #ff5f5f, #ffb85f, #fff35f, #7fe36b, #5fc9ff, #8f7bff, #ff6fd8, #ff5f5f)",
  safari: "linear-gradient(180deg, #3aa0ff 0%, #0a66d6 100%)",
  youtube: "#FF0000",
};

export function captureBackground(c: Capture) {
  return c.src ? `url(${c.src}) center / cover` : ART[c.art];
}

export function CaptureCard({ capture, width, height }: { capture: Capture; width: number; height: number }) {
  const Icon = SOURCE_ICON[capture.source];
  const badge = Math.round(width * 0.42);
  return (
    <div
      className="relative rounded-[14px] ring-1 ring-white/80"
      style={{
        width,
        height,
        background: captureBackground(capture),
        boxShadow: "0 18px 40px -16px rgba(30,36,51,0.45), 0 2px 6px -2px rgba(30,36,51,0.2)",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[14px]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}
      />
      <div
        className="absolute flex items-center justify-center rounded-full text-white ring-2 ring-white"
        style={{
          right: -badge * 0.18,
          top: -badge * 0.18,
          width: badge,
          height: badge,
          background: SOURCE_BG[capture.source],
          boxShadow: "0 4px 10px -2px rgba(30,36,51,0.35)",
        }}
      >
        <Icon size={Math.round(badge * 0.56)} strokeWidth={2.4} />
      </div>
    </div>
  );
}
