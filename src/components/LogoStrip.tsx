import Image from "next/image";
import { partners } from "@/lib/site";

function LogoCard({ partner }: { partner: (typeof partners)[number] }) {
  const isLarge = partner.size === "lg";

  return (
    <div
      className={`flex h-28 items-center justify-center rounded-2xl bg-paper-foreground/[0.03] ${
        isLarge ? "p-4" : "p-6"
      }`}
    >
      <div
        className={`logo-hover relative w-4/5 opacity-75 transition-transform duration-300 ${
          isLarge ? "h-16" : "h-11"
        }`}
      >
        <Image
          src={`/partners/${partner.file}`}
          alt={partner.name}
          fill
          sizes="(min-width: 768px) 220px, 45vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function LogoStrip() {
  return (
    <div>
      {/* Mobile & tablet: wrapping flex layout rather than a grid, so an
          odd-numbered trailing logo (9 partners doesn't divide evenly into
          2 or 3 columns) centers on its own row instead of left-aligning
          with dead space next to it. */}
      <ul className="flex flex-wrap justify-center gap-4 md:hidden">
        {partners.map((partner) => (
          <li
            key={partner.name}
            className="w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)]"
          >
            <LogoCard partner={partner} />
          </li>
        ))}
      </ul>

      {/* Desktop: staggered brick grid, narrowing into a reverse pyramid —
          row 1 has 4 logos, row 2 has 3 (each centered in the gap between
          the pair above it), row 3 has 2 more (centered again beneath
          that trio), each new row indented one more column on each side. */}
      <ul className="hidden md:grid md:grid-cols-8 md:gap-x-6 md:gap-y-8">
        <li className="col-span-2 col-start-1">
          <LogoCard partner={partners[0]} />
        </li>
        <li className="col-span-2 col-start-3">
          <LogoCard partner={partners[1]} />
        </li>
        <li className="col-span-2 col-start-5">
          <LogoCard partner={partners[2]} />
        </li>
        <li className="col-span-2 col-start-7">
          <LogoCard partner={partners[3]} />
        </li>
        <li className="col-span-2 col-start-2">
          <LogoCard partner={partners[4]} />
        </li>
        <li className="col-span-2 col-start-4">
          <LogoCard partner={partners[5]} />
        </li>
        <li className="col-span-2 col-start-6">
          <LogoCard partner={partners[6]} />
        </li>
        <li className="col-span-2 col-start-3">
          <LogoCard partner={partners[7]} />
        </li>
        <li className="col-span-2 col-start-5">
          <LogoCard partner={partners[8]} />
        </li>
      </ul>
    </div>
  );
}
