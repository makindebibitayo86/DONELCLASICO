import { motion } from "framer-motion";

const STATS = [
  { num: "12+", label: "Years of Mastery" },
  { num: "3K+", label: "Men Outfitted" },
  { num: "100%", label: "Bespoke Built" },
];

const EASE = [0.16, 1, 0.3, 1];

export default function Philosophy() {
  return (
    <section
      className="border-b px-[clamp(1.5rem,5vw,6rem)] py-[clamp(4rem,8vw,8rem)]"
      style={{ borderColor: "var(--border-light)" }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span
            className="mb-4 block text-[0.65rem] font-medium uppercase tracking-[0.4em]"
            style={{ color: "var(--accent)" }}
          >
            Our Standard
          </span>
          <h2
            className="mb-6 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.2]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for men who
            <br />
            <em className="font-normal italic" style={{ color: "var(--accent-light)" }}>
              define the room
            </em>
          </h2>
          <p
            className="max-w-[420px] text-[0.9rem] font-light leading-[1.8]"
            style={{ color: "var(--text-muted)" }}
          >
            At DON ELCLASICO, every seam is a declaration. We engineer garments
            that carry weight — the kind of construction that commands respect
            before a word is spoken. African craft heritage, executed with
            architectural precision.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="grid grid-cols-1 gap-[2px] min-[481px]:grid-cols-3"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="relative flex flex-col items-center gap-2 border px-6 py-8 text-center"
              style={{ background: "var(--glass)", borderColor: "var(--border-light)" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--accent), transparent)",
                }}
              />
              <span
                className="text-[2.5rem] font-bold leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--accent-light)" }}
              >
                {stat.num}
              </span>
              <span
                className="text-[0.62rem] font-normal uppercase tracking-[0.2em]"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
