"use client";

import { useRef } from "react";
import { useInView } from "./use-in-view";
import { manifesto } from "@/content/home";
import { floatingIcons, garden, growth, illustrations } from "@/content/manifesto-decor";
import { FloatingIcons } from "./inline-icon";
import { decorate } from "./decorate";
import { Garden } from "./garden";
import { Growth } from "./growth";
import { MarginIllustration, MobileIllustration } from "./margin-illustration";
import { cn } from "@/lib/utils";

// A paragraph that flags itself once scrolled into view, so decorations pop in.
function Paragraph({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <p ref={ref} className={className} style={style} data-in={seen || undefined}>
      {children}
    </p>
  );
}

// Same in-view flag for a non-text wrapper (the floating icon cloud).
function Block({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" data-in={seen || undefined}>
      {children}
    </div>
  );
}

function isPullLine(text: string) {
  return text.startsWith("**") && text.endsWith("**");
}

export function ManifestoBody({ children }: { children?: React.ReactNode }) {
  const growthAnchor = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto flex max-w-[620px] flex-col gap-7 sm:gap-8">
      {manifesto.paragraphs.map((raw, i) => {
        const pull = isPullLine(raw);
        const text = pull ? raw.slice(2, -2) : raw;
        const here = illustrations.filter((d) => d.paragraph === i);
        const hasIcons = i === floatingIcons.paragraph;
        return (
          <div
            key={i}
            className={cn("relative", pull && "my-4 sm:my-6", hasIcons && "pt-24 lg:pt-0")}
            ref={i === growth.paragraph ? growthAnchor : undefined}
          >
            {hasIcons && (
              <Block>
                <FloatingIcons icons={floatingIcons.icons} />
              </Block>
            )}
            <Paragraph
              className={cn(
                "relative",
                pull
                  ? "text-balance text-[2.25rem] leading-[1.1] font-bold tracking-tight text-neutral-900 sm:text-[2.9rem]"
                  : "text-[20px] leading-[1.5] text-neutral-900/85 sm:text-[26px]"
              )}
              style={pull ? { fontFamily: "var(--font-lato)" } : undefined}
            >
              {decorate(text, i)}
            </Paragraph>

            {here.map((item, j) => (
              <MarginIllustration key={`${item.image}-${j}`} item={item} index={i * 4 + j} />
            ))}
            {i === growth.paragraph && <Growth frames={growth.frames} width={growth.width} side={growth.side} anchor={growthAnchor} />}

            {/* mobile and tablet: a few illustrations centered after their paragraph */}
            {here
              .filter((item) => item.mobile)
              .map((item, j) => (
                <MobileIllustration key={`m-${item.image}-${j}`} image={item.image} index={i * 4 + j} shadow={item.shadow} />
              ))}
            {i === growth.paragraph && <Growth frames={growth.frames} width={growth.width} side={growth.side} anchor={growthAnchor} mobile />}

            {i === garden.paragraph && <Garden image={garden.image} width={garden.width} critters={garden.critters} />}
          </div>
        );
      })}
      {children}
    </div>
  );
}
