import type { ReactNode } from "react";
import { countUp, handwriting, highlight, strikes } from "@/content/manifesto-decor";
import { CountUp } from "./count-up";
import { Highlight, Strike } from "./marker";

type Op = { start: number; end: number; render: (text: string) => ReactNode };

function find(text: string, needle: string): [number, number] | null {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, "u");
  const m = re.exec(text);
  if (!m) return null;
  const start = m.index + m[1].length;
  return [start, start + m[2].length];
}

/** Turns a manifesto paragraph into text plus count-up and marker effects. */
export function decorate(text: string, paragraph: number): ReactNode[] {
  const ops: Op[] = [];

  if (paragraph === countUp.paragraph) {
    const hit = find(text, countUp.text);
    if (hit) ops.push({ start: hit[0], end: hit[1], render: (t) => <CountUp text={t} frames={countUp.frames} duration={countUp.duration} /> });
  }

  if (paragraph === highlight.paragraph) {
    const hit = find(text, highlight.word);
    if (hit)
      ops.push({
        start: hit[0],
        end: hit[1],
        render: (t) => (
          <Highlight color={highlight.color} opacity={highlight.opacity}>
            {t}
          </Highlight>
        ),
      });
  }

  if (paragraph === strikes.paragraph) {
    strikes.phrases.forEach((phrase, i) => {
      const hit = find(text, phrase);
      if (hit) ops.push({ start: hit[0], end: hit[1], render: (t) => <Strike delay={i * strikes.stepMs}>{t}</Strike> });
    });
  }

  if (paragraph === handwriting.paragraph) {
    const hit = find(text, handwriting.phrase);
    if (hit)
      ops.push({
        start: hit[0],
        end: hit[1],
        render: (t) =>
          handwriting.svg ? (
            <span className="inline-block align-baseline" data-handwriting>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={handwriting.svg} alt={t} className="inline h-[1.3em] w-auto align-[-0.25em]" />
            </span>
          ) : (
            <span data-handwriting>{t}</span>
          ),
      });
  }

  ops.sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let cursor = 0;
  ops.forEach((op, i) => {
    if (op.start < cursor) return; // overlapping op, skip
    if (op.start > cursor) out.push(text.slice(cursor, op.start));
    out.push(<span key={i}>{op.render(text.slice(op.start, op.end))}</span>);
    cursor = op.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
