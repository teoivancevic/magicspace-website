import { closing } from "@/content/home";
import { GlassWaitlist } from "@/components/glass-waitlist";

export function Closing() {
  return (
    <section id={closing.id} className="px-6 pb-16 pt-12 text-center sm:pb-20 sm:pt-20">
      <h2
        className="text-balance text-[2.1rem] leading-[1.05] font-bold tracking-tight text-neutral-900 sm:text-[3rem]"
        style={{ fontFamily: "var(--font-lato)" }}
      >
        {closing.line}
      </h2>
      <div className="mt-8 flex justify-center" data-waitlist-inline>
        <GlassWaitlist />
      </div>
    </section>
  );
}
