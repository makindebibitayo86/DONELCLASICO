const MARQUEE_ITEMS = [
  "BESPOKE TAILORING",
  "MENSWEAR ATELIER",
  "LUXURY READY-TO-WEAR",
  "ATELIER LAGOS",
];

// Doubled so the track can loop translateX(0) -> translateX(-50%) seamlessly.
const TRACK_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

// Inverted relative to the site theme, on purpose: white-on-black while the
// site is in dark mode, black-on-white while the site is in light mode.
// These are pure hardcoded values, NOT derived from --marquee-bg/--text-muted
// (which are deliberately muted/low-contrast) — that's why this needs an
// explicit isLight prop instead of a CSS filter trick: a filter can only
// flip whatever contrast was already there, it can't manufacture contrast
// that wasn't in the source tokens to begin with.
export default function HeroMarquee({ isLight = false }) {
  const bg = isLight ? "#000000" : "#ffffff";
  const fg = isLight ? "#ffffff" : "#000000";

  return (
    <div
      className="overflow-hidden border-t py-4"
      style={{ borderColor: `${fg}1f`, background: bg }}
    >
      <div className="flex w-max animate-[marquee_35s_linear_infinite] items-center gap-12 whitespace-nowrap">
        {TRACK_ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className="text-[0.62rem] font-normal uppercase tracking-[0.35em]"
              style={{ color: fg }}
            >
              {item}
            </span>
            <span
              className="text-[0.45rem]"
              style={{ color: fg, opacity: 0.5 }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
