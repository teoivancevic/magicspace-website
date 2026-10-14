"use client";

import { useEffect, useState } from "react";
import { LINEN } from "@/content/manifesto-decor";

// A fixed band at the bottom of the viewport, behind the waitlist pill, so text
// dissolves before it reaches the pill. Over the manifesto it fades to linen;
// elsewhere it blurs whatever gradient is showing. Hidden once the pill docks
// in the closing section.
export function PillFade() {
  const [linen, setLinen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const manifesto = document.getElementById("manifesto");
    const closing = document.getElementById("closing");
    const observers: IntersectionObserver[] = [];
    if (manifesto) {
      // "on linen" once the manifesto covers the bottom band of the viewport
      const io = new IntersectionObserver(
        ([e]) => {
          const r = e.boundingClientRect;
          setLinen(r.top < window.innerHeight - 200 && r.bottom > window.innerHeight);
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
      );
      io.observe(manifesto);
      observers.push(io);
    }
    if (closing) {
      const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.1 });
      io.observe(closing);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pill-fade pointer-events-none fixed inset-x-0 bottom-0 z-[15] h-40"
      style={{
        opacity: hidden ? 0 : 1,
        "--fade-color": linen ? LINEN : "transparent",
      } as React.CSSProperties}
    />
  );
}
