"use client";

import { useEffect, useRef } from "react";

// Soft prismatic blobs that drift on their own and lean toward the cursor.
// Keyframes animate `transform`; the cursor parallax uses the separate
// `translate` property so the two compose instead of fighting.
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // normalized cursor offset (-1..1) for parallax, and fraction (0..1) for the glow
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let glowTargetX = 0.5, glowTargetY = 0.5, glowX = 0.5, glowY = 0.5;
    let raf = 0;

    function tick() {
      curX += (targetX - curX) * 0.045;
      curY += (targetY - curY) * 0.045;
      glowX += (glowTargetX - glowX) * 0.07;
      glowY += (glowTargetY - glowY) * 0.07;

      el!.style.setProperty("--mx", curX.toFixed(4));
      el!.style.setProperty("--my", curY.toFixed(4));
      el!.style.setProperty("--cx", `${(glowX * 100).toFixed(2)}%`);
      el!.style.setProperty("--cy", `${(glowY * 100).toFixed(2)}%`);

      const settled =
        Math.abs(targetX - curX) < 0.0005 &&
        Math.abs(targetY - curY) < 0.0005 &&
        Math.abs(glowTargetX - glowX) < 0.0005 &&
        Math.abs(glowTargetY - glowY) < 0.0005;
      raf = settled ? 0 : requestAnimationFrame(tick);
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      glowTargetX = e.clientX / w;
      glowTargetY = e.clientY / h;
      targetX = glowTargetX * 2 - 1;
      targetY = glowTargetY * 2 - 1;
      el!.dataset.active = "true";
      schedule();
    }

    function onLeave() {
      targetX = 0;
      targetY = 0;
      schedule();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-cursor" />
    </div>
  );
}
