"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "./use-in-view";
import { cn } from "@/lib/utils";

// Hand-drawn yellow marker stroke behind a word, drawing in left to right.
export function Highlight({ children, color, opacity }: { children: ReactNode; color: string; opacity: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className="marker-wrap" data-in={inView || undefined}>
      <svg className="marker-svg marker-highlight" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M2 24 C 18 20, 30 27, 48 23 S 80 19, 98 22"
          fill="none"
          stroke={color}
          strokeOpacity={opacity}
          strokeWidth="19"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          d="M4 18 C 22 23, 40 16, 60 21 S 86 25, 97 17"
          fill="none"
          stroke={color}
          strokeOpacity={opacity * 0.55}
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
      <span className="marker-text">{children}</span>
    </span>
  );
}

// Rough black marker scribble over a phrase; the words stay readable.
export function Strike({ children, delay }: { children: ReactNode; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span
      ref={ref}
      className={cn("marker-wrap")}
      data-in={inView || undefined}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <svg className="marker-svg marker-strike" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M-3 23 C 15 19, 28 25, 45 21 S 70 24, 86 20 L 103 19"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2.6"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          d="M-2 19 C 20 24, 40 18, 62 23 S 90 19, 102 24"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
          pathLength={1}
        />
      </svg>
      <span className="marker-text">{children}</span>
    </span>
  );
}
