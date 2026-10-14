"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";
import { useReducedMotion } from "@/components/use-reduced-motion";

// "12,000" counting up from 0 in choppy steps when it scrolls into view.
export function CountUp({ text, frames, duration }: { text: string; frames: number; duration: number }) {
  const target = Number(text.replace(/[^\d]/g, ""));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || reduced || started.current) return;
    started.current = true;
    let frame = 0;
    const first = window.setTimeout(() => setValue(0), 0);
    const id = window.setInterval(() => {
      frame += 1;
      if (frame >= frames) {
        setValue(target);
        window.clearInterval(id);
        return;
      }
      // uneven steps: each frame lands somewhere between the linear value and a
      // bit behind it, so the count feels hand-animated
      const linear = (target * frame) / frames;
      const jitter = ((frame * 37) % 11) / 11; // deterministic 0..1
      setValue(Math.round((linear - target * 0.06 * jitter) / 100) * 100);
    }, duration / frames);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [inView, reduced, frames, duration, target]);

  const shown = value === null || reduced ? text : value.toLocaleString("en-US");
  return (
    <span ref={ref} className="inline-grid tabular-nums" style={{ gridTemplateAreas: "'n'" }}>
      <span style={{ gridArea: "n" }}>{shown}</span>
      <span style={{ gridArea: "n", visibility: "hidden" }} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
