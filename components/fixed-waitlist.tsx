"use client";

import { useEffect, useState } from "react";
import { GlassWaitlist } from "@/components/glass-waitlist";

// The waitlist pill, pinned to the bottom of the viewport. It sits exactly
// where the hero reserves space for it, and hides while the closing section's
// own pill is on screen so there are never two visible at once.
export function FixedWaitlist() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-waitlist-inline]"));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setHidden(visible.size > 0);
      },
      { threshold: 0.2 }
    );
    anchors.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-6 pb-8"
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 320ms ease, transform 320ms ease",
      }}
      aria-hidden={hidden}
      inert={hidden}
    >
      <div className="pointer-events-auto">
        <GlassWaitlist />
      </div>
    </div>
  );
}
