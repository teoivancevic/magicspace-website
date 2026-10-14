import Image from "next/image";
import Link from "next/link";
import { AuroraBackground } from "@/components/aurora-background";
import { LiquidGlassFilter } from "@/components/liquid-glass-filter";
import { GlassWaitlist } from "@/components/glass-waitlist";
import { PillFade } from "@/components/pill-fade";
import { SiteFooter } from "@/components/site-footer";
import { HeroPocket } from "@/components/pocket-demo";
import { Manifesto } from "@/components/manifesto";
import { Faq } from "@/components/faq";
import { Closing } from "@/components/closing";
import { hero, faq } from "@/content/home";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      // strip markdown links down to their label
      text: item.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
    },
  })),
};

export default function Home() {
  return (
    <div className="relative font-sans text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AuroraBackground />
      <LiquidGlassFilter />

      <div className="relative z-10">
        {/* everything above the footer shares one container so the sticky pill
            floats at the viewport bottom until it docks under the closing line */}
        <div>
          <section className="relative z-10 flex min-h-dvh flex-col overflow-hidden">
            <HeroPocket />
            <header className="flex justify-center pt-8">
              <Link href="/" aria-label="magicspace">
                <Image
                  src="/icon-512.png"
                  alt=""
                  width={44}
                  height={44}
                  priority
                  className="h-11 w-11 rounded-[25%] shadow-[0_8px_24px_-8px_rgba(60,50,40,0.45)] ring-1 ring-white/70"
                />
              </Link>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <h1
                className="text-balance text-[2.6rem] leading-[1.02] font-bold tracking-tight sm:text-6xl md:text-7xl"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                {hero.title[0]}
                <br />
                {hero.title[1]}
              </h1>
              <p className="mt-5 text-lg text-neutral-600 sm:text-xl">
                {hero.subline}
              </p>
            </main>

            {/* reserves the space the fixed waitlist pill occupies at the bottom of the hero */}
            <div className="h-[52px] mb-8" aria-hidden="true" />
          </section>

          <Manifesto />
          <Faq />
          <Closing />
          <PillFade />
          <div className="sticky bottom-8 z-20 mt-8 flex justify-center px-6">
            <GlassWaitlist />
          </div>
          <div className="h-16 sm:h-20" aria-hidden="true" />
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}
