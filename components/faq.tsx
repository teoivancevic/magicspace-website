"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { Plus } from "lucide-react";
import { faq } from "@/content/home";
import { cn } from "@/lib/utils";

// Renders [label](url) as underlined links; everything else as plain text.
function renderAnswer(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const external = /^https?:/.test(m[2]);
    out.push(
      <a
        key={m.index}
        href={m[2]}
        className="underline underline-offset-[3px] decoration-neutral-400 transition-colors hover:text-neutral-900 hover:decoration-neutral-900"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <li className="glass rounded-[24px]">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-left sm:px-6 sm:py-5",
            "text-[17px] font-medium leading-snug text-neutral-900 sm:text-lg",
            "outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/40"
          )}
        >
          <span>{question}</span>
          <Plus
            size={18}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-neutral-600 transition-transform duration-300 ease-out",
              open && "rotate-45"
            )}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { height: "auto", opacity: 1, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[16px] leading-[1.55] text-neutral-700 sm:px-6 sm:pb-6 sm:text-[18px]">
              {renderAnswer(answer)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Faq() {
  return (
    <section id={faq.id} aria-labelledby="faq-heading" className="scroll-mt-24 px-6 pb-40 sm:pb-48">
      <div className="mx-auto max-w-[720px]">
        <h2 id="faq-heading" className="mb-6 text-sm font-medium tracking-wide text-neutral-500">
          {faq.heading}
        </h2>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {faq.items.map((item) => (
            <FaqCard key={item.question} question={item.question} answer={item.answer} />
          ))}
        </ul>
      </div>
    </section>
  );
}
