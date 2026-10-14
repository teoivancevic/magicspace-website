"use client";

import { useEffect, useRef, useState } from "react";
import { ClayImage, hasImage } from "./clay-image";
import { marginWidth } from "./margin-illustration";
import { useInView } from "./use-in-view";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

// seed → sprout → flower as a stop-motion loop while on screen: hard cuts,
// each frame holding for its own beat, the flower lingering longest.
const HOLD_MS = [1100, 1100, 2600];

function useGrowthFrame(frames: number, active: boolean) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active || frames < 2) return;
    let current = 0;
    let timer = 0;
    const tick = () => {
      current = (current + 1) % frames;
      setFrame(current);
      timer = window.setTimeout(tick, HOLD_MS[Math.min(current, HOLD_MS.length - 1)]);
    };
    timer = window.setTimeout(tick, HOLD_MS[0]);
    return () => window.clearTimeout(timer);
  }, [frames, active]);
  return frame;
}

export function Growth({
  frames,
  width,
  side,
  mobile,
}: {
  frames: string[];
  width: number;
  side: "left" | "right";
  mobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "20% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const available = frames.filter(hasImage);
  const frame = useGrowthFrame(available.length, onScreen && !reduced);
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
        className={cn("clay clay-mobile mx-auto mt-8 w-[38vw] max-w-[200px] lg:hidden", onScreen && "is-on")}
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
