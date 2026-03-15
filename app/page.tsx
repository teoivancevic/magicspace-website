"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Menu, X, Instagram } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Mobile bar */}
        <div className="flex lg:hidden items-center justify-between bg-white/95 backdrop-blur-sm px-6 py-4">
          <span className="text-lg font-bold tracking-tight">magicspace</span>
          <div className="flex items-center gap-5">
            <a href="#waitlist" className="text-sm font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              join waitlist
            </a>
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`flex lg:hidden flex-col bg-white/95 backdrop-blur-sm px-6 gap-4 overflow-hidden transition-all duration-200 ease-out ${
            mobileNavOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
        >
          <a
            href="#manifesto"
            onClick={() => setMobileNavOpen(false)}
            className="text-base text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            manifesto
          </a>
          <a
            href="mailto:ti@teoivancevic.com"
            onClick={() => setMobileNavOpen(false)}
            className="text-base text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            contact
          </a>
        </div>

        {/* Desktop pill */}
        <div className="hidden lg:grid max-w-2xl mx-auto mt-4 grid-cols-3 items-center bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full px-5 py-2.5 shadow-sm">
          <span className="text-lg font-bold tracking-tight">magicspace</span>
          <nav className="flex items-center justify-center gap-6">
            <a href="#manifesto" className="text-base text-neutral-500 hover:text-neutral-900 transition-colors">manifesto</a>
            <a href="mailto:ti@teoivancevic.com" className="text-base text-neutral-500 hover:text-neutral-900 transition-colors">contact</a>
          </nav>
          <div className="flex justify-end">
            <a
              href="#waitlist"
              className="text-sm font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              join waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 pt-40 pb-8 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 w-full">
          {/* Text + CTAs */}
          <div className="flex-1 min-w-0">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none mb-5" style={{ fontFamily: "var(--font-lato)" }}>
              capture curiosity,<br />build taste.
            </h1>
            <p className="text-lg text-neutral-500 mb-10">
              screenshot anything with one tap.<br />actually do it.<br />magicspace connects the dots.
            </p>
            <div className="max-w-sm">
              <WaitlistForm />
            </div>
          </div>

          {/* Screenshots */}
          <div className="flex gap-4 items-end shrink-0">
            <img src="/screenshot-3.png" alt="magicspace app screenshot" className="rounded-xl w-auto" style={{ height: "320px" }} />
            <img src="/screenshot-1.png" alt="magicspace app screenshot" className="rounded-xl w-auto" style={{ height: "320px" }} />
          </div>
        </div>
      </section>

      {/* manifesto */}
      <section id="manifesto" className="px-8 pt-16">
        <div className="max-w-xl mx-auto space-y-0">
          <p className="text-lg leading-relaxed text-neutral-800 font-medium">
            Your camera roll is a graveyard.
          </p>
          <p className="text-base leading-relaxed text-neutral-600 mt-4">
            Thousands of screenshots. Restaurants you never went to. Articles you never read. Things friends recommended that you saved and forgot.
          </p>
          <p className="text-base leading-relaxed text-neutral-600 mt-4">
            You&apos;re not lazy. Saving felt like doing. It wasn&apos;t.
          </p>

          <Separator className="my-10" />

          <p className="text-base leading-relaxed text-neutral-600">
            The problem isn&apos;t follow-through. It&apos;s that nothing catches your curiosity on the other side.
          </p>
          <p className="text-base leading-relaxed text-neutral-600 mt-4">
            You save something because something in you went <em>I want this in my life.</em> That&apos;s not a task. That&apos;s the beginning of an interest. And interests don&apos;t get done — they develop.
          </p>

          <Separator className="my-10" />

          <p className="text-base leading-relaxed text-neutral-600">
            Here&apos;s what happens when curiosity is followed all the way.
          </p>
          <p className="text-base leading-relaxed text-neutral-600 mt-4">
            You save a few things on the same topic. You engage with them. You form opinions — what resonated, what didn&apos;t, what you want to go deeper on. Without really trying, you&apos;ve built taste. Real taste. Knowledge of what you actually like and why.
          </p>
          <p className="text-base font-semibold leading-relaxed text-neutral-900 mt-4">
            Save. Do. Curate. Create.
          </p>
          <p className="text-base leading-relaxed text-neutral-600 mt-4">
            That loop is how curiosity becomes something. A perspective. A skill. A point of view that&apos;s genuinely yours.
          </p>

          <Separator className="my-10" />

          <p className="text-base leading-relaxed text-neutral-600">
            magicspace understands what you save, finds where it came from, and starts building a picture of what you&apos;re drawn to. The full loop is what we&apos;re working toward.
          </p>
          <p className="text-lg font-semibold leading-relaxed text-neutral-900 mt-6">
            Everyone has taste. Most people just never had tools to find it.
          </p>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="px-8 pt-24 pb-24">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-base text-neutral-500 mb-6">
            we&apos;re just getting started.<br />join the waitlist for early access :)
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="text-xs text-neutral-400">magicspace &copy; 2026</span>
          <div className="flex items-center gap-5">
            <a href="#manifesto" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">manifesto</a>
            <a href="mailto:ti@teoivancevic.com" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">contact</a>
            <a href="https://go.magicspace.app/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">privacy</a>
            <a href="https://go.magicspace.app/terms" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">terms</a>
            <a href="https://instagram.com/teodrafts" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-700 transition-colors" aria-label="Instagram">
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
