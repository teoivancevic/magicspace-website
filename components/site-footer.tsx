import { Instagram } from "lucide-react";

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const linkClass = "text-xs text-neutral-500 hover:text-neutral-900 transition-colors";
const iconClass = "text-neutral-500 hover:text-neutral-900 transition-colors";

export function SiteFooter() {
  return (
    <footer className="px-6 pb-6 pt-2">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-4 justify-self-start">
          <a
            href="https://instagram.com/teodrafts"
            target="_blank"
            rel="noopener noreferrer"
            className={iconClass}
            aria-label="Instagram"
          >
            <Instagram size={15} />
          </a>
          <a
            href="https://x.com/teodrafts"
            target="_blank"
            rel="noopener noreferrer"
            className={iconClass}
            aria-label="X"
          >
            <XIcon size={14} />
          </a>
        </div>

        <span className="text-sm font-bold tracking-tight text-neutral-900">magicspace</span>

        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 justify-self-end">
          <a href="/old#manifesto" className={linkClass}>manifesto</a>
          <a href="mailto:ti@teoivancevic.com" className={linkClass}>contact</a>
          <a href="https://go.magicspace.app/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>privacy</a>
          <a href="https://go.magicspace.app/terms" target="_blank" rel="noopener noreferrer" className={linkClass}>terms</a>
        </nav>
      </div>
    </footer>
  );
}
