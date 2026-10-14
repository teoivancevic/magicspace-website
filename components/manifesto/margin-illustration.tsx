"use client";

import { useEffect, useRef } from "react";
import { ClayImage, hasImage } from "./clay-image";
import { useInView } from "./use-in-view";
import { useReducedMotion } from "@/components/use-reduced-motion";
import type { Illustration } from "@/content/manifesto-decor";
import { cn } from "@/lib/utils";

const GAP = 40; // px between the text column and a margin illustration
const EDGE = 48; // px kept clear at the viewport edge

/** width that fits the margin: the configured size (×0.85 under 1440px) or whatever room is left */
export function marginWidth(px: number) {
  return `min(calc(${px}px * var(--clay-scale, 1)), calc((100vw - 620px) / 2 - ${GAP + EDGE}px))`;
}

// Desktop placement: absolutely positioned in the left or right margin of the
// paragraph it belongs to. Pops in when scrolled into view, boils gently while
// on screen, and drifts a little slower than the text.
export function MarginIllustration({ item, index }: { item: Illustration; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const onScreen = useInView(ref, { margin: "20% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !onScreen || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (r.top + r.height / 2) / vh; // -1 bottom edge … +1 top edge
      el.style.setProperty("--py", `${(-progress * vh * 0.08).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onScreen, reduced]);

  if (!hasImage(item.image)) return null;

  return (
    <div
      ref={ref}
      className={cn("clay clay-margin hidden lg:block", onScreen && "is-on")}
      data-in={seen || undefined}
      style={
        {
          top: item.top ?? 0,
          width: marginWidth(item.width),
          ...(item.side === "left" ? { right: `calc(100% + ${GAP}px)` } : { left: `calc(100% + ${GAP}px)` }),
          "--seed": ((index * 3) % 7) / 7,
          "--rot": `${item.rotate ?? 0}deg`,
        } as unknown as React.CSSProperties
      }
    >
      <div className={cn("clay-enter", item.entrance === "drop" ? "clay-enter-drop" : "clay-enter-pop")}>
        <div className={cn("clay-boil", item.shadow && "clay-shadow")}>
          <ClayImage name={item.image} className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

// Mobile placement: centered between paragraphs at ~55% of the screen width.
export function MobileIllustration({ image, index, shadow }: { image: string; index: number; shadow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const onScreen = useInView(ref, { margin: "20% 0px" });
  if (!hasImage(image)) return null;
  return (
    <div
      ref={ref}
      className={cn("clay clay-mobile mx-auto mt-10 w-[55vw] max-w-[300px] lg:hidden", onScreen && "is-on")}
      data-in={seen || undefined}
      style={{ "--seed": ((index * 3) % 7) / 7, "--rot": "0deg" } as React.CSSProperties}
    >
      <div className="clay-enter clay-enter-pop">
        <div className={cn("clay-boil", shadow && "clay-shadow")}>
          <ClayImage name={image} className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
