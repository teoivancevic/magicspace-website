import { existsSync } from "node:fs";
import path from "node:path";
import { manifesto } from "@/content/home";
import { LINEN } from "@/content/manifesto-decor";
import { ManifestoBody } from "@/components/manifesto/manifesto-body";

export function Manifesto() {
  const avatarExists = existsSync(path.join(process.cwd(), "public", manifesto.avatar.replace(/^\//, "")));

  return (
    // the section starts 20vh before the hero ends and fades from transparent to
    // linen over 60vh, so the first line already sits on solid linen
    <section
      id={manifesto.id}
      aria-label="manifesto"
      className="manifesto relative -mt-[20vh] scroll-mt-24 px-6 pb-40 sm:pb-48"
      style={{ "--linen": LINEN, paddingTop: "calc(20vh + 45vh)" } as React.CSSProperties}
    >
      <ManifestoBody>
        <p className="mt-10 flex items-center gap-3 text-base text-neutral-500">
          {avatarExists && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={manifesto.avatar}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-white/70"
            />
          )}
          <span>{manifesto.signoff}</span>
        </p>
      </ManifestoBody>
    </section>
  );
}
