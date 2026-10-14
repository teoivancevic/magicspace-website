import Link from "next/link";
import { AuroraBackground } from "@/components/aurora-background";
import { LiquidGlassFilter } from "@/components/liquid-glass-filter";
import { GlassWaitlist } from "@/components/glass-waitlist";
import { SiteFooter } from "@/components/site-footer";
import { HeroPocket } from "@/components/pocket-demo";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden font-sans text-neutral-900">
      <AuroraBackground />
      <LiquidGlassFilter />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <HeroPocket />
        <header className="flex justify-center pt-8">
          <Link href="/" aria-label="magicspace">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-512.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-[25%] shadow-[0_8px_24px_-8px_rgba(60,50,40,0.45)] ring-1 ring-white/70"
            />
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <h1
            className="text-balance text-[2.6rem] leading-[1.02] font-bold tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            follow your curiosity,
            <br />
            be more human
          </h1>
          <p className="mt-5 text-lg text-neutral-600 sm:text-xl">your ai pocket for the internet</p>
        </main>

        <div className="flex justify-center px-6 pb-8">
          <GlassWaitlist />
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
