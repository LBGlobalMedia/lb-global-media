import type { Icon } from "@phosphor-icons/react";

export type NumberedItem = {
  title: string;
  body: string;
  /** Shown instead of the "01" numeral when provided. */
  icon?: Icon;
};

export function NumberedList({
  items,
  tone = "dark",
  columns = 1,
  showNumbers = true,
  titleFont = "display",
}: {
  items: NumberedItem[];
  tone?: "dark" | "paper";
  columns?: 1 | 2 | 3;
  showNumbers?: boolean;
  titleFont?: "display" | "mono";
}) {
  const ruleClass = tone === "dark" ? "rule-on-dark" : "rule-on-paper";
  const numberClass = tone === "dark" ? "text-paper/30" : "text-paper-foreground/30";
  const iconClass = tone === "dark" ? "text-paper/60" : "text-paper-foreground/60";
  const bodyClass = tone === "dark" ? "text-paper/70" : "text-paper-foreground/85";
  const titleFontClass = titleFont === "mono" ? "font-mono" : "font-display";

  const gridClass =
    columns === 3
      ? "sm:grid-cols-3"
      : columns === 2
      ? "sm:grid-cols-2"
      : "";

  return (
    <ol className={`grid grid-cols-1 gap-x-10 gap-y-8 ${gridClass}`}>
      {items.map((item, i) => {
        const ItemIcon = item.icon;
        const hasMarker = Boolean(ItemIcon) || showNumbers;

        return (
          <li key={item.title} className={`border-t pt-6 ${ruleClass}`}>
            {ItemIcon ? (
              <ItemIcon size={28} weight="light" className={iconClass} aria-hidden="true" />
            ) : (
              showNumbers && (
                <span className={`${titleFontClass} block text-3xl font-semibold ${numberClass}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              )
            )}
            <h3 className={`${titleFontClass} font-semibold ${hasMarker ? "mt-3" : ""} text-lg`}>
              {item.title}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{item.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
