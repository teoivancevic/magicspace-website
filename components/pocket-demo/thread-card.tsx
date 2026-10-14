import { COPY, type Theme } from "./config";
import { captureBackground } from "./capture-card";

export function ThreadCard({ theme, width }: { theme: Theme; width: number }) {
  const thumb = Math.max(14, Math.round(width * 0.085));
  return (
    <div className="glass text-neutral-900" style={{ width, borderRadius: 22, padding: Math.round(width * 0.07) }}>
      <p className="font-bold leading-tight tracking-tight" style={{ fontFamily: "var(--font-lato)", fontSize: width * 0.1 }}>
        {theme.title}
      </p>
      <p className="mt-0.5 text-neutral-600" style={{ fontSize: width * 0.058 }}>
        {COPY.saves(theme.captures.length)}
      </p>
      <div className="mt-2.5 flex gap-1.5">
        {theme.captures.map((c, i) => (
          <div
            key={i}
            className="rounded-[4px] ring-1 ring-white/80"
            style={{ width: thumb, height: thumb * 1.9, background: captureBackground(c) }}
          />
        ))}
      </div>
      <div
        className="glass-button mt-3 flex items-center justify-center rounded-full font-semibold"
        style={{ height: Math.round(width * 0.14), fontSize: width * 0.058 }}
      >
        {COPY.chatButton}
      </div>
    </div>
  );
}
