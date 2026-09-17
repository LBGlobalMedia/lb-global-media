import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  tone = "dark",
  align = "left",
  titleFont = "display",
}: {
  eyebrow?: string;
  title: string;
  tone?: "dark" | "paper";
  align?: "left" | "center";
  titleFont?: "display" | "mono";
}) {
  const titleFontClass = titleFont === "mono" ? "font-mono" : "font-display";

  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <Eyebrow tone={tone} className={align === "center" ? "text-center" : ""}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={`${titleFontClass} mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl`}
      >
        {title}
      </h2>
    </div>
  );
}
