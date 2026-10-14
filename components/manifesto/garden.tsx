"use client";

import { useEffect, useRef, useState } from "react";
import { ClayImage, hasImage, imageSize } from "./clay-image";
import { useInView } from "./use-in-view";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

type Critter = { image: string; width: number };
type Pose = { x: number; y: number; flip: boolean };

const TICK = 120; // ms between stop-motion position updates

// Loose looping flight paths around the garden, as fractions of its box.
// Each is a slightly squashed figure-eight so the critters cross directions.
function path(kind: number, t: number): { x: number; y: number } {
  if (kind === 0) {
    return { x: 0.5 + 0.38 * Math.sin(t), y: 0.22 + 0.16 * Math.sin(2 * t + 0.6) };
  }
  return { x: 0.5 + 0.34 * Math.cos(t * 0.8), y: 0.3 + 0.2 * Math.sin(1.6 * t * 0.8 + 2) };
}

function restingPose(kind: number): Pose {
  return kind === 0 ? { x: 0.04, y: 0.42, flip: false } : { x: 0.86, y: 0.08, flip: true };
}

export function Garden({ image, width, critters }: { image: string; width: number; critters: Critter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { margin: "10% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [poses, setPoses] = useState<Pose[]>(() => critters.map((_, i) => restingPose(i)));

  useEffect(() => {
    if (!onScreen || reduced) return;
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      setPoses((prev) =>
        critters.map((_, i) => {
          const t = tick * 0.11 + i * 2.3;
          const now = path(i, t);
          const next = path(i, t + 0.11);
          const dir = next.x - now.x;
          const flip = Math.abs(dir) < 0.004 ? prev[i]?.flip ?? false : dir < 0;
          return { x: now.x, y: now.y, flip };
        })
      );
    }, TICK);
    return () => window.clearInterval(id);
  }, [onScreen, reduced, critters]);

  if (!hasImage(image)) return null;
  const size = imageSize(image)!;
  const gardenW = width;
  const gardenH = Math.round((size.height / size.width) * gardenW);

  return (
    <div
      ref={ref}
      className={cn("clay clay-garden relative mx-auto mt-14 w-full", onScreen && "is-on")}
      data-in={seen || undefined}
      style={{ maxWidth: gardenW, aspectRatio: `${gardenW} / ${gardenH}`, "--seed": 0.6, "--rot": "0deg" } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="clay-enter clay-enter-pop">
        <div className="clay-boil clay-shadow">
          <ClayImage name={image} className="h-auto w-full" />
        </div>
      </div>

      {critters.map((c, i) => {
        if (!hasImage(c.image)) return null;
        const pose = reduced ? restingPose(i) : poses[i];
        return (
          <div
            key={c.image}
            className="clay clay-critter absolute"
            style={{
              left: `${pose.x * 100}%`,
              top: `${pose.y * 100}%`,
              width: `${(c.width / gardenW) * 100}%`,
              transform: `translate(-50%, -50%) scaleX(${pose.flip ? -1 : 1})`,
            }}
          >
            <ClayImage name={c.image} className="h-auto w-full" />
          </div>
        );
      })}
    </div>
  );
}
