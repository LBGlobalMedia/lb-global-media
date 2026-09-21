export function DotList({
  items,
  tone = "dark",
  columns = 3,
  size = "sm",
  font = "sans",
}: {
  items: string[];
  tone?: "dark" | "paper";
  columns?: 1 | 3;
  size?: "sm" | "base";
  font?: "sans" | "mono";
}) {
  const textClass = tone === "dark" ? "text-paper/70" : "text-paper-foreground/70";
  const dotClass = tone === "dark" ? "bg-paper/40" : "bg-paper-foreground/40";
  const gridClass = columns === 3 ? "sm:grid-cols-3" : "";
  const sizeClass = size === "base" ? "text-lg leading-relaxed" : "text-base leading-relaxed";
  const fontClass = font === "mono" ? "font-mono" : "";

  return (
    <ul className={`grid grid-cols-1 gap-x-8 gap-y-4 ${gridClass}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-center gap-2.5 ${sizeClass} ${fontClass} ${textClass}`}
        >
          <span className={`h-1 w-1 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
