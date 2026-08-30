import Link from "next/link";
import { Car } from "lucide-react";

function FacebookGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.3h-3.1V7.6c0-.95.27-1.6 1.63-1.6h1.74V3.14C15.98 3.1 15.06 3 14 3c-2.5 0-4.2 1.53-4.2 4.34v2.36H7.1V13h2.7v8h3.7z" />
    </svg>
  );
}

function TwitterGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const columns = [
  {
    title: "About",
    links: ["How it works", "Featured", "Partnership"],
  },
  {
    title: "Community",
    links: ["Events", "Blog", "Podcast"],
  },
  {
    title: "Socials",
    links: ["Discord", "Instagram", "Twitter"],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-white">
                <Car size={18} />
              </span>
              BestAuto
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Our vision is to provide convenience and help increase your sales business.
            </p>
            <div className="mt-5 flex gap-3">
              {[FacebookGlyph, TwitterGlyph, InstagramGlyph].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-orange"
                  aria-label="Social link"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row">
          <p>©2026 Best Auto. All rights reserved</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy &amp; Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms &amp; Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
