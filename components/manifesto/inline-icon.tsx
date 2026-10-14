"use client";

import { ClayImage, hasImage } from "./clay-image";
import type { FloatingIcon } from "@/content/manifesto-decor";
import { cn } from "@/lib/utils";

// Clay icons drifting loosely around a paragraph: not part of the text, just
// company for it. Each pops in (3 hard frames) once the paragraph is in view,
// then bobs slowly on its own rhythm.
export function FloatingIcons({ icons }: { icons: FloatingIcon[] }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {icons.map((icon, i) => {
        if (!hasImage(icon.image)) return null;
        const size = icon.size ?? 52;
        return (
          <span
            key={icon.image}
            className="clay clay-float"
            style={
              {
                "--x": icon.x,
                "--y": icon.y,
                "--mx": icon.mx,
                "--my": icon.my,
                "--size": `${size}px`,
                "--i": i,
                "--seed": ((i * 5) % 7) / 7,
                "--tilt": `${icon.tilt ?? 0}deg`,
              } as React.CSSProperties
            }
          >
            <span className="clay-float-pop">
              <span className="clay-float-bob">
                <ClayImage name={icon.image} className={cn("block h-full w-full", icon.spin && "clay-icon-spin")} />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
