"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { COPY, LAYOUT, POCKET, THEMES, TIMING, type Capture } from "./config";
import { Pocket } from "./pocket";
import { CaptureCard, captureBackground } from "./capture-card";
import { ThreadCard } from "./thread-card";

type Phase = "calm" | "hover" | "drop" | "card" | "cardDrop" | "fade";
type State = { theme: number; phase: Phase; capture: number };
type Blob = { key: number; capture: Capture; x: number; y: number; size: number };

const PHASE_SECONDS: Record<Phase, number> = {
  calm: TIMING.calm,
  hover: TIMING.hover,
  drop: TIMING.drop + TIMING.betweenCaptures,
  card: TIMING.cardLinger,
  cardDrop: TIMING.cardDrop,
  fade: TIMING.fade,
};

function next(s: State): State {
  const n = THEMES[s.theme].captures.length;
  switch (s.phase) {
    case "calm":
      return { ...s, phase: "hover", capture: 0 };
    case "hover":
      return { ...s, phase: "drop" };
    case "drop":
      return s.capture + 1 < n ? { ...s, phase: "hover", capture: s.capture + 1 } : { ...s, phase: "card" };
    case "card":
      return { ...s, phase: "cardDrop" };
    case "cardDrop":
      return { ...s, phase: "fade" };
    case "fade":
      return { theme: (s.theme + 1) % THEMES.length, phase: "calm", capture: 0 };
  }
}

// where each capture flies in from, relative to the pocket's top-left (cycles)
const ENTRIES = [
  { x: -320, y: -120, r: -18 },
  { x: 60, y: -420, r: 14 },
  { x: -220, y: -360, r: -10 },
  { x: 160, y: -260, r: 20 },
  { x: -380, y: -260, r: -6 },
  { x: -120, y: -440, r: 10 },
];

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

function useReducedMotion() {
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

export function HeroPocket() {
  const mobile = useMobile();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [state, setState] = useState<State>({ theme: 0, phase: "calm", capture: 0 });
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [tug, setTug] = useState(0);
  const blobKey = useRef(0);

  const size = mobile ? "mobile" : "desktop";
  const pocketW = LAYOUT.pocketWidth[size];
  const pocketH = (pocketW * POCKET.viewBox.h) / POCKET.viewBox.w;
  const card = LAYOUT.card[size];
  const hoverLift = LAYOUT.hoverLift[size];
  const theme = THEMES[state.theme];

  // pause when off screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the loop: each phase lasts its configured time, then advances
  useEffect(() => {
    if (reduced || !visible) return;
    const t = window.setTimeout(() => setState((s) => next(s)), PHASE_SECONDS[state.phase] * 1000);
    return () => window.clearTimeout(t);
  }, [state, visible, reduced]);

  // side effects on phase changes: landings add a blob + tug, fade clears
  useEffect(() => {
    if (reduced) return;
    if (state.phase === "drop") {
      const capture = theme.captures[state.capture];
      const t = window.setTimeout(() => {
        setBlobs((b) => [
          ...b,
          {
            key: blobKey.current++,
            capture,
            x: 0.15 + ((state.capture * 0.37) % 0.6),
            y: 0.25 + ((state.capture * 0.53) % 0.45),
            size: 0.55,
          },
        ]);
        setTug((n) => n + 1);
      }, TIMING.drop * 1000 * 0.75);
      return () => window.clearTimeout(t);
    }
    if (state.phase === "cardDrop") {
      const t = window.setTimeout(() => setTug((n) => n + 1), TIMING.cardDrop * 1000 * 0.8);
      return () => window.clearTimeout(t);
    }
    if (state.phase === "fade") {
      const t = window.setTimeout(() => setBlobs([]), TIMING.fade * 1000);
      return () => window.clearTimeout(t);
    }
  }, [state, theme, reduced]);

  const hoverPos = { x: pocketW / 2 - card.w / 2, y: -hoverLift - card.h, r: mobile ? -5 : -7 };
  const dropPos = { x: pocketW / 2 - card.w / 2, y: pocketH * 0.12, r: 0 };
  const entry = ENTRIES[state.capture % ENTRIES.length];
  const flying = !reduced && (state.phase === "hover" || state.phase === "drop");
  const showCard = reduced || state.phase === "card";
  const cardW = LAYOUT.threadCardWidth[size];
  const cardAbove = LAYOUT.threadCardSide[size] === "above";

  const insidePocket = (
    <>
      {(reduced ? theme.captures.slice(0, 4).map((c, i) => ({ key: i, capture: c, x: 0.15 + ((i * 0.37) % 0.6), y: 0.25 + ((i * 0.53) % 0.45), size: 0.55 })) : blobs).map((b) => (
        <motion.div
          key={b.key}
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: state.phase === "fade" ? 0 : 0.8, scale: 1 }}
          transition={{ duration: state.phase === "fade" ? TIMING.fade : 0.5, ease: "easeOut" }}
          className="absolute rounded-[30%]"
          style={{
            left: `${b.x * 100}%`,
            top: `${b.y * 100}%`,
            width: `${b.size * 100}%`,
            height: `${b.size * 100}%`,
            background: captureBackground(b.capture),
            filter: "blur(6px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" role="img" aria-label={COPY.ariaLabel}>
      {/* anchor at the pocket's top-left; everything is positioned relative to it */}
      <div
        className="absolute"
        style={{
          right: LAYOUT.pocketRight[size],
          bottom: LAYOUT.pocketBottom[size],
          width: pocketW,
          height: pocketH,
        }}
      >
        <Pocket className="absolute inset-0" tugKey={tug}>
          {insidePocket}
        </Pocket>

        {/* floating capture */}
        <AnimatePresence>
          {flying && (
            <motion.div
              key={`${state.theme}-${state.capture}`}
              className="absolute left-0 top-0"
              style={{ zIndex: 2 }}
              initial={{ x: entry.x, y: entry.y, rotate: entry.r, scale: 0.92, opacity: 0 }}
              animate={
                state.phase === "hover"
                  ? { x: hoverPos.x, y: hoverPos.y, rotate: hoverPos.r, scale: 1, opacity: 1 }
                  : { x: dropPos.x, y: dropPos.y, rotate: dropPos.r, scale: 0.42, opacity: [1, 1, 0] }
              }
              transition={
                state.phase === "hover"
                  ? { type: "spring", stiffness: 260, damping: 22, mass: 0.7 }
                  : { duration: TIMING.drop, ease: [0.5, 0, 0.3, 1], opacity: { duration: TIMING.drop, times: [0, 0.72, 1] } }
              }
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <CaptureCard capture={theme.captures[state.capture]} width={card.w} height={card.h} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* thread card */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              key={`card-${state.theme}`}
              className="absolute"
              style={
                cardAbove
                  ? { right: 0, bottom: pocketH + 18, zIndex: 3, transformOrigin: "80% 100%" }
                  : { right: pocketW + 12, bottom: 0, zIndex: 3, transformOrigin: "100% 90%" }
              }
              initial={reduced ? false : { opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                y: cardAbove ? pocketH * 0.9 : -pocketH * 0.3,
                x: cardAbove ? 0 : pocketW * 0.8,
                transition: { duration: TIMING.cardDrop, ease: [0.5, 0, 0.3, 1], opacity: { delay: TIMING.cardDrop * 0.6, duration: TIMING.cardDrop * 0.4 } },
              }}
            >
              <ThreadCard theme={theme} width={cardW} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
