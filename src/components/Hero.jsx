import { useEffect, useRef, useState } from 'react'

// ─── Stage data ────────────────────────────────────────────────────────────
const STAGES = [
  {
    num: '01',
    label: 'FORM',
    eyebrow: 'Where it starts',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291337/shot_1_akv9za.png',
    alt: 'Extreme macro of raw wool fiber strands',
  },
  {
    num: '02',
    label: 'ALLURE',
    eyebrow: 'Nothing is incidental',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291338/shot_2_r7deqy.png',
    alt: 'Close-up of twisted yarn',
  },
  {
    num: '03',
    label: 'CLASS',
    eyebrow: "Felt before it's seen",
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291338/shot_3_koqyq6.png',
    alt: 'Macro overhead of woven fabric threads',
  },
  {
    num: '04',
    label: 'PASSION',
    eyebrow: 'Built to hold its shape',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291338/shot_4_ckz4jq.png',
    alt: 'Tight fabric texture surface',
  },
  {
    num: '05',
    label: 'STEEZE',
    eyebrow: 'The shape of the brand',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291330/shot_5_ialmga.png',
    alt: 'Dark minimal shirt on model',
  },
   {
    num: '06',
    label: 'AURA',
    eyebrow: 'Worn, not just owned',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291330/shot_6_mz7uke.png',
    alt: 'Dark minimal shirt on model',
  },
   {
    num: '07',
    label: 'ICON',
    eyebrow: 'The final word',
    src: 'https://res.cloudinary.com/deutrwf9f/image/upload/v1782291328/shot_8_qsvyn3.png',
    alt: 'Dark minimal shirt on model',
  },
]

// ─── Styles (scoped via class prefix `de-`) ────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');

  /* tokens */
  :root {
    --de-dark-bg:    #080808;
    --de-dark-text:  #e8e0d0;
    --de-dark-muted: #555;
    --de-dark-dim:   #2a2a2a;
    --de-dark-rule:  #111;
    --de-light-bg:   #f5f0e8;
    --de-light-text: #1a1410;
    --de-light-muted:#888;
    --de-light-dim:  #ccc;
    --de-light-rule: #e0d8cc;
  }

  /* Hero is intentionally theme-locked to dark — the source photography
     has a soft alpha fade baked into its edges for a black background,
     so it can't follow the site-wide light/dark toggle without a re-export. */
  .de-hero-outer {
    --bg:    var(--de-dark-bg);
    --fg:    var(--de-dark-text);
    --muted: var(--de-dark-muted);
    --dim:   var(--de-dark-dim);
    --rule:  var(--de-dark-rule);
    --vignette-lr: #080808;
    --vignette-tb: rgba(8,8,8,0.65);
    --line-color:  rgba(255,255,255,0.10);
    --line-dash:   rgba(255,255,255,0.13);
  }

  .de-hero-outer {
    position: relative;
    height: 500vh;
    background: var(--bg);
    transition: background 0.4s ease;
  }

  .de-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 400px 1fr 196px;
    overflow: hidden;
  }

  /* ── Left ── */
  .de-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 0 0 52px;
    z-index: 10;
  }

  .de-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.3em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .de-eyebrow::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--dim);
  }
  .de-eyebrow.de-show { opacity: 1; transform: translateY(0); }

  .de-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 4.2vw, 64px);
    font-weight: 300;
    line-height: 1.08;
    color: var(--fg);
    margin-bottom: 22px;
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 1s ease 0.18s, transform 1s ease 0.18s, color 0.4s ease;
  }
  .de-headline.de-show { opacity: 1; transform: translateY(0); }

  .de-brand-name {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.32em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 32px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.9s ease 0.32s, transform 0.9s ease 0.32s;
  }
  .de-brand-name.de-show { opacity: 1; transform: translateY(0); }

  .de-sub {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.82;
    color: var(--muted);
    max-width: 340px;
    margin-bottom: 48px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.9s ease 0.46s, transform 0.9s ease 0.46s, color 0.4s ease;
  }
  .de-sub.de-show { opacity: 1; transform: translateY(0); }

  .de-cta {
    display: flex;
    align-items: center;
    gap: 14px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
    cursor: default;
    opacity: 0;
    transition: opacity 0.9s ease 0.6s, color 0.4s ease;
  }
  .de-cta.de-show { opacity: 1; }

  .de-cta-ring {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--dim);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    animation: de-pulse 2.8s ease-in-out infinite;
  }
  .de-cta-ring::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--fg);
  }
  @keyframes de-pulse {
    0%,100% { box-shadow: 0 0 0 0 transparent; }
    50%      { box-shadow: 0 0 0 7px rgba(128,120,112,0.08); }
  }

  /* ── Center ── */
  .de-center {
    position: relative;
    overflow: hidden;
  }

  .de-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transform: scale(1.05);
    transition: opacity 0.85s ease, transform 0.85s ease;
    will-change: opacity, transform;
  }
  .de-img.de-active {
    opacity: 1;
    transform: scale(1);
  }

  .de-vignette {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right,  var(--vignette-lr) 0%, transparent 10%, transparent 90%, var(--vignette-lr) 100%),
      linear-gradient(to bottom, var(--vignette-tb) 0%, transparent 10%, transparent 90%, var(--vignette-tb) 100%);
    z-index: 3;
    pointer-events: none;
    transition: background 0.4s ease;
  }

  /* ── Right ── */
  .de-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 48px 0 20px;
    z-index: 10;
    position: relative;
  }

  .de-stage-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
  }

  .de-track {
    position: absolute;
    left: -16px;
    top: 5px;
    bottom: 5px;
    width: 1px;
    background: var(--dim);
    opacity: 0.35;
  }

  .de-track-dot {
    position: absolute;
    left: -20px;
    top: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fg);
    border: 1px solid var(--bg);
    box-shadow: 0 0 0 3px rgba(128,120,112,0.12);
    transition: top 0.12s linear, background 0.4s ease;
  }

  .de-stage-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    opacity: 0.18;
    transition: opacity 0.5s ease;
  }
  .de-stage-item.de-active-stage { opacity: 1; }

  .de-stage-num {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.4s;
  }
  .de-stage-num::before {
    content: '';
    display: block;
    width: 16px;
    height: 1px;
    background: currentColor;
  }

  .de-stage-label {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    letter-spacing: 0.26em;
    color: var(--fg);
    text-transform: uppercase;
    font-weight: 400;
    padding-left: 24px;
    transition: color 0.4s;
  }

  .de-scroll-side {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    letter-spacing: 0.32em;
    color: var(--dim);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.6;
  }
  .de-scroll-side::before {
    content: '';
    display: block;
    width: 1px;
    height: 32px;
    background: currentColor;
  }

  /* ── Mobile ── */
  @media (max-width: 767px) {
    .de-hero-outer {
      height: 100vh;
    }

    /* Sticky becomes a column: left fills, ticker pins to bottom */
    .de-sticky {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      grid-template-columns: unset;
      height: 100vh;
    }

    /* Full-bleed image behind everything */
    .de-center {
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    /* Hide all images except mobile pick (index 3) */
    .de-img {
      opacity: 0 !important;
      transform: none !important;
    }
    .de-img.de-mobile-pick {
      opacity: 1 !important;
      transform: scale(1) !important;
      object-position: center top;
    }

    /* Gradient: dark top + heavy dark bottom */
    .de-vignette {
      background:
        linear-gradient(to bottom,
          rgba(8,8,8,0.55) 0%,
          transparent 22%,
          transparent 50%,
          rgba(8,8,8,0.80) 78%,
          #080808 100%
        );
    }

    /* Left panel: pushes all text to the bottom */
    .de-left {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 24px 72px;
      gap: 0;
    }

    .de-eyebrow {
      margin-bottom: 14px;
      font-size: 10px;
    }

    .de-headline {
      font-size: clamp(36px, 9.5vw, 54px);
      margin-bottom: 10px;
      margin-top: 0;
    }

    .de-brand-name {
      margin-bottom: 14px;
      margin-top: 0;
    }

    .de-sub {
      max-width: 100%;
      font-size: 13px;
      line-height: 1.65;
      margin-bottom: 0;
      margin-top: 0;
    }

    /* Hide scroll CTA and right stage list on mobile */
    .de-cta { display: none; }
    .de-right { display: none; }

    /* Ticker: Craftsmanship centered, others bleed off edges */
    .de-ticker {
      position: relative;
      padding: 14px 0;
      z-index: 10;
      font-size: 9px;
      letter-spacing: 0.22em;
      overflow: hidden;
      white-space: nowrap;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
    }
  }

  /* ── Ticker ── */
  .de-ticker {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 17px 52px;
    display: flex;
    align-items: center;
    gap: 18px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    letter-spacing: 0.34em;
    color: var(--muted);
    text-transform: uppercase;
    z-index: 20;
    transition: color 0.4s;
    opacity: 0.5;
  }
  .de-ticker-sep { opacity: 0.4; }
`

// ─── Component ─────────────────────────────────────────────────────────────
export default function Hero() {
  const outerRef  = useRef(null)
  const dotRef    = useRef(null)
  const [activeStage, setActiveStage] = useState(0)

  // GSAP scroll
  useEffect(() => {
    let cleanup = () => {}

    const loadGSAP = () =>
      new Promise((res) => {
        if (window.gsap && window.ScrollTrigger) return res()
        const s1 = document.createElement('script')
        s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
        s1.onload = () => {
          const s2 = document.createElement('script')
          s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
          s2.onload = res
          document.head.appendChild(s2)
        }
        document.head.appendChild(s1)
      })

    loadGSAP().then(() => {
      // Skip scroll-driven behaviour on mobile — static layout only
      if (window.innerWidth < 768) {
        document.querySelectorAll('.de-eyebrow, .de-headline, .de-brand-name, .de-sub, .de-cta')
          .forEach(el => el.classList.add('de-show'))
        return
      }

      const { gsap, ScrollTrigger } = window
      gsap.registerPlugin(ScrollTrigger)

      // Entrance
      requestAnimationFrame(() => {
        document.querySelectorAll('.de-eyebrow, .de-headline, .de-brand-name, .de-sub, .de-cta')
          .forEach(el => el.classList.add('de-show'))
      })

      const st = ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end:   'bottom bottom',
        scrub: 1.3,
        onUpdate: (self) => {
          const p = self.progress

          // Active stage index
          const idx = Math.min(Math.floor(p * STAGES.length), STAGES.length - 1)
          setActiveStage(idx)

          // Track dot travels along stage list
          if (dotRef.current) {
            const list = dotRef.current.closest('.de-stage-list')
            if (list) {
              const lh = list.offsetHeight - 8
              dotRef.current.style.top = (p * lh) + 'px'
            }
          }
        },
      })

      cleanup = () => { st.kill() }
    })

    return () => cleanup()
  }, [])

  return (
    <div id="home" className="de-hero-outer" ref={outerRef}>
      <style>{css}</style>
      <div className="de-sticky">

        {/* ── Left ── */}
        <div className="de-left">
          <p className="de-eyebrow">Not for everyone. Just you.</p>
          <h1 className="de-headline">
            Style is the silence<br />that speaks first.
          </h1>
          <p className="de-brand-name">Don Elclasico</p>
          <p className="de-sub">
            We deliver.<br />Because we understand the assignment.
          </p>
          <div className="de-cta">
            <div className="de-cta-ring" />
            Scroll to explore
          </div>
        </div>

        {/* ── Center ── */}
        <div className="de-center">
          {STAGES.map((s, i) => (
            <img
              key={i}
              src={s.src}
              alt={s.alt}
              className={`de-img${activeStage === i ? ' de-active' : ''}${i === 3 ? ' de-mobile-pick' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="de-vignette" />
        </div>

        {/* ── Right ── */}
        <div className="de-right">
          <div className="de-stage-list">
            <div className="de-track" />
            <div className="de-track-dot" ref={dotRef} />
            {STAGES.map((s, i) => (
              <div
                key={i}
                className={`de-stage-item${activeStage === i ? ' de-active-stage' : ''}`}
              >
                <div className="de-stage-num">{s.num}</div>
                <div className="de-stage-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="de-scroll-side">Scroll</div>
        </div>

        {/* ── Ticker ── */}
        <div className="de-ticker">
          <span>Quality</span>
          <span className="de-ticker-sep">·</span>
          <span>Craftsmanship</span>
          <span className="de-ticker-sep">·</span>
          <span>Identity</span>
        </div>

      </div>
    </div>
  )
}
