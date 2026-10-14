import type { Art } from "./config";

// Simple gradient illustrations for the capture cards. Swap any of these for a
// real screenshot by setting `src` on the capture in config.ts.
export const ART: Record<Art, string> = {
  camera:
    "radial-gradient(60% 40% at 50% 46%, #3b2a1f 0 38%, transparent 40%), radial-gradient(22% 14% at 50% 44%, #9aa3ad 0 60%, transparent 62%), linear-gradient(180deg, #d9b48c 0%, #a9774d 60%, #7a4f2e 100%)",
  darkroom:
    "radial-gradient(70% 45% at 50% 18%, #ff3b2f 0%, rgba(255,59,47,0) 70%), linear-gradient(180deg, #2a0906 0%, #0d0404 100%)",
  film:
    "repeating-linear-gradient(90deg, #111 0 6px, transparent 6px 14px), linear-gradient(180deg, #f3b547 0%, #d98a1f 50%, #1a1208 100%)",
  street:
    "linear-gradient(90deg, #3a3a3a 0 30%, #d8d8d8 30% 32%, #7a7a7a 32% 100%), linear-gradient(180deg, #e8e8e8 0%, #9a9a9a 100%)",
  print:
    "linear-gradient(#fff, #fff) 50% 44% / 62% 40% no-repeat, linear-gradient(#f4c9b8, #c9d8f4) 50% 44% / 50% 28% no-repeat, linear-gradient(180deg, #f7f6f2 0%, #e7e4de 100%)",
  lens:
    "radial-gradient(28% 16% at 36% 36%, rgba(255,255,255,0.9) 0 40%, transparent 42%), radial-gradient(60% 36% at 50% 50%, #0b1b2b 0 55%, #2c3a4a 57% 60%, #0a0f14 62%), linear-gradient(180deg, #141a22 0%, #05080c 100%)",
  tokyo1: "radial-gradient(40% 24% at 70% 30%, #ffd6e7 0 60%, transparent 62%), linear-gradient(180deg, #ff8fb1 0%, #5b3fbf 100%)",
  tokyo2: "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 3px, transparent 3px 16px), linear-gradient(180deg, #1b2a49 0%, #ff6a3d 100%)",
  tokyo3: "radial-gradient(50% 30% at 50% 70%, #fff 0 40%, transparent 42%), linear-gradient(180deg, #9bd3ff 0%, #4d7cff 100%)",
  tokyo4: "linear-gradient(180deg, #ffe8a3 0%, #ff9f68 55%, #6b2d5c 100%)",
  bread1: "radial-gradient(55% 32% at 50% 55%, #c98a4b 0 60%, transparent 62%), linear-gradient(180deg, #f4e9d8 0%, #d9c3a3 100%)",
  bread2: "radial-gradient(60% 30% at 50% 60%, #e6c89c 0 50%, transparent 52%), linear-gradient(180deg, #fbf5ea 0%, #b98a5a 100%)",
  bread3: "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 14px), linear-gradient(180deg, #e4b57a 0%, #8c5a2b 100%)",
  bread4: "linear-gradient(180deg, #fff3df 0%, #f0c48b 50%, #7b4a1e 100%)",
};
