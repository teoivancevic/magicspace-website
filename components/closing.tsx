import { closing } from "@/content/home";

// The waitlist pill that belongs under this line is rendered by the page as a
// sticky element, so it floats at the bottom of the viewport until it docks here.
export function Closing() {
  return (
    <section id={closing.id} className="px-6 pt-12 text-center sm:pt-20">
      <h2
        className="text-balance text-[2.1rem] leading-[1.05] font-bold tracking-tight text-neutral-900 sm:text-[3rem]"
        style={{ fontFamily: "var(--font-lato)" }}
      >
        {closing.line}
      </h2>
    </section>
  );
}
