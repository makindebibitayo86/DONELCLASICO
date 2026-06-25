const MARQUEE_ITEMS = [
  "BESPOKE TAILORING",
  "MENSWEAR ATELIER",
  "LUXURY READY-TO-WEAR",
  "ATELIER LAGOS",
];

// Doubled so the track can loop translateX(0) -> translateX(-50%) seamlessly.
const TRACK_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function HeroMarquee() {
  return (
    <div
      className="overflow-hidden border-t py-4"
      style={{ borderColor: "var(--border-light)", background: "var(--marquee-bg)" }}
    >
      <div className="flex w-max animate-[marquee_35s_linear_infinite] items-center gap-12 whitespace-nowrap">
        {TRACK_ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className="text-[0.62rem] font-normal uppercase tracking-[0.35em]"
              style={{ color: "var(--text-muted)" }}
            >
              {item}
            </span>
            <span className="text-[0.45rem]" style={{ color: "var(--accent)" }}>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
