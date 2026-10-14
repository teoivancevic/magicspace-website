import { existsSync } from "node:fs";
import path from "node:path";
import { manifesto } from "@/content/home";
import { cn } from "@/lib/utils";

function isPullLine(text: string) {
  return text.startsWith("**") && text.endsWith("**");
}

export function Manifesto() {
  const avatarExists = existsSync(path.join(process.cwd(), "public", manifesto.avatar.replace(/^\//, "")));

  return (
    <section
      id={manifesto.id}
      aria-label="manifesto"
      className="scroll-mt-24 px-6 pt-20 pb-40 sm:pt-28 sm:pb-48"
    >
      <div className="mx-auto flex max-w-[620px] flex-col gap-7 sm:gap-8">
        {manifesto.paragraphs.map((raw, i) => {
          const pull = isPullLine(raw);
          const text = pull ? raw.slice(2, -2) : raw;
          return (
            <p
              key={i}
              className={cn(
                pull
                  ? "my-4 text-balance text-[2.25rem] leading-[1.1] font-bold tracking-tight text-neutral-900 sm:my-6 sm:text-[2.75rem]"
                  : "text-[19px] leading-[1.5] text-neutral-900/85 sm:text-[23px]"
              )}
              style={pull ? { fontFamily: "var(--font-lato)" } : undefined}
            >
              {text}
            </p>
          );
        })}

        <p className="mt-4 flex items-center gap-3 text-base text-neutral-500">
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
      </div>
    </section>
  );
}
