import type { ReactNode } from "react";

// The small uppercase label used above headings site-wide — hero taglines
// ("International Film Production & Distribution"), SectionHeading's eyebrow
// ("What Drives Us", "Who We Work With"), and the handful of standalone
// section-intro labels that don't pair with a heading tag ("Browse Our
// Titles", "Event Partners"). One place to keep every instance in sync.
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "paper";
  className?: string;
}) {
  const toneClass = tone === "dark" ? "text-paper/80" : "text-paper-foreground/90";

  return (
    <p className={`font-mono text-sm font-semibold uppercase tracking-widest ${toneClass} ${className}`}>
      {children}
    </p>
  );
}
