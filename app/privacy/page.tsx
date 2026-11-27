import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { SiteFooter } from "@/components/site-footer";

// The policy's text lives in content/privacy.md: edit that file (and its `updated` date) to change it.
// The app's own privacy text (MagicSpace/Onboarding/PrivacyCopy.swift in the app repo) must say the same things.

export const metadata: Metadata = {
  title: "privacy policy · magicspace",
  description: "What MagicSpace collects, how we use it, and the choices you have.",
};

async function loadPolicy() {
  const source = await readFile(path.join(process.cwd(), "content/privacy.md"), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = Object.fromEntries(
    (match?.[1] ?? "")
      .split("\n")
      .map((line) => line.split(/:\s*/, 2))
      .filter((pair) => pair.length === 2),
  );
  const body = match ? source.slice(match[0].length) : source;
  return { title: meta.title ?? "Privacy policy", updated: meta.updated ?? "", html: await marked.parse(body) };
}

export default async function PrivacyPage() {
  const { title, updated, html } = await loadPolicy();
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <main className="mx-auto max-w-2xl px-6 pb-16 pt-10 sm:pt-16">
        <Link href="/" className="text-sm text-neutral-500 transition-colors hover:text-neutral-900">
          ← magicspace
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {updated && <p className="mt-2 text-sm text-neutral-500">Last updated: {updated}</p>}
        <article className="policy mt-8" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <SiteFooter />
    </div>
  );
}
