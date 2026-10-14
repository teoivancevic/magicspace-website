"use client";

import { useEffect, useRef, useState } from "react";
import { ClayImage, hasImage } from "./clay-image";
import { marginWidth } from "./margin-illustration";
import { useInView } from "./use-in-view";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

// seed → sprout → flower, swapping frames (hard cuts) as the anchor paragraph
// scrolls past: 0–33% seed, 33–66% sprout, 66–100% flower.
function useGrowthFrame(anchor: React.RefObject<HTMLElement | null>, frames: number, active: boolean) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const el = anchor.current;
    if (!el || !active) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top enters low in the viewport, 1 when its bottom nears the top
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.55);
      setFrame(Math.min(frames - 1, Math.max(0, Math.floor(p * frames))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [anchor, frames, active]);
  return frame;
}

export function Growth({
  frames,
  width,
  side,
  anchor,
  mobile,
}: {
  frames: string[];
  width: number;
  side: "left" | "right";
  anchor: React.RefObject<HTMLElement | null>;
  mobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "20% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const available = frames.filter(hasImage);
  const frame = useGrowthFrame(anchor, available.length, onScreen && !reduced);
  if (available.length === 0) return null;
  const shown = reduced ? available.length - 1 : frame;

  const stack = (
    <div className="clay-enter clay-enter-pop">
      <div className="clay-boil clay-shadow relative">
        {available.map((name, i) => (
          <ClayImage
            key={name}
            name={name}
            className={cn("h-auto w-full", i === shown ? "visible" : "invisible", i > 0 && "absolute inset-0")}
          />
        ))}
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div
        ref={ref}
        className={cn("clay clay-mobile mx-auto mt-10 w-[55vw] max-w-[300px] lg:hidden", onScreen && "is-on")}
        data-in={seen || undefined}
        style={{ "--seed": 0.4, "--rot": "0deg" } as React.CSSProperties}
      >
        {stack}
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-y-0 hidden lg:block"
      style={{
        width: marginWidth(width),
        ...(side === "right" ? { left: "calc(100% + 40px)" } : { right: "calc(100% + 40px)" }),
      }}
    >
      <div
        ref={ref}
        className={cn("clay clay-margin sticky top-[30vh] w-full", onScreen && "is-on")}
        data-in={seen || undefined}
        style={{ "--seed": 0.4, "--rot": "0deg", position: "sticky" } as React.CSSProperties}
      >
        {stack}
      </div>
    </div>
  );
}
