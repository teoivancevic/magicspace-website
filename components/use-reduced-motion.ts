"use client";

import { useEffect, useState } from "react";

// Tracks prefers-reduced-motion on the client. Starts false so server and
// client markup match; the CSS override in globals.css keeps revealed content
// visible before hydration.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}
