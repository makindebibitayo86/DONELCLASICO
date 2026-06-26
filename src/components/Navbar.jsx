import { useState, useEffect } from 'react'
import { useCart } from './CartContext'

// ─── SVG: Brand Logo ────────────────────────────────────────────────────────
const LogoSVG = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1080 1080"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M 745.837,613.206 L 745.837,627.847 L 744.976,640.766 L 744.115,650.239 L 743.254,658.852 L 742.392,665.742 L 741.531,672.632 L 740.670,678.660 L 739.809,684.689 L 738.947,689.856 L 737.225,699.330 L 734.641,712.249 L 732.919,720.000 L 729.474,733.780 L 726.890,743.254 L 724.306,751.866 L 718.278,769.952 L 715.694,776.842 L 710.526,789.761 L 707.943,795.789 L 702.775,806.986 L 701.053,810.431 L 698.469,815.598 L 695.024,821.627 L 691.579,827.656 L 688.995,831.962 L 682.105,842.297 L 677.799,848.325 L 671.770,856.077 L 665.742,862.967 L 651.100,877.608 L 645.072,882.775 L 641.627,885.359 L 638.182,887.943 L 630.431,893.110 L 626.124,895.694 L 621.818,898.278 L 618.373,900.000 L 613.206,902.584 L 605.455,906.029 L 598.565,908.612 L 595.981,909.474 L 593.397,910.335 L 584.785,912.919 L 581.340,913.780 L 577.895,914.641 L 573.589,915.502 L 569.282,916.364 L 564.115,917.225 L 558.947,918.086 L 551.196,918.947 L 540.861,919.809 L 528.804,919.809 L 522.775,918.947 L 518.469,918.086 L 515.885,917.225 L 513.301,916.364 L 508.134,913.780 L 505.550,912.057 L 502.967,910.335 L 496.077,903.445 L 494.354,900.861 L 492.632,898.278 L 490.048,893.110 L 487.464,885.359 L 486.603,881.053 L 485.742,874.163 L 485.742,816.459 L 348.804,817.321 L 348.804,873.301 L 347.943,879.330 L 347.081,882.775 L 346.220,886.220 L 345.359,888.804 L 344.498,891.388 L 341.914,896.555 L 340.191,899.139 L 338.469,901.722 L 330.718,909.474 L 328.134,911.196 L 323.828,913.780 L 322.105,914.641 L 317.799,916.364 L 315.215,917.225 L 311.770,918.086 L 308.325,918.947 L 304.019,919.809 L 298.852,920.670 L 291.100,921.531 L 277.321,922.392 L 257.512,922.392 L 255.789,924.115 L 256.651,970.622 L 617.512,970.622 L 627.847,969.761 L 634.737,968.900 L 639.904,968.038 L 644.211,967.177 L 648.517,966.316 L 658.852,963.732 L 667.464,961.148 L 670.048,960.287 L 679.522,956.842 L 685.550,954.258 L 691.579,951.675 L 703.636,945.646 L 713.971,939.617 L 720.861,935.311 L 723.445,932.727 L 726.029,931.866 L 728.612,930.144 L 738.947,922.392 L 743.254,918.947 L 754.450,909.474 L 780.287,883.636 L 786.316,876.746 L 796.651,863.828 L 800.096,859.522 L 806.986,850.048 L 813.014,841.435 L 814.737,838.852 L 822.488,826.794 L 826.794,819.904 L 830.239,813.876 L 833.684,807.847 L 840.574,794.928 L 843.158,789.761 L 850.909,773.397 L 854.354,765.646 L 856.077,761.340 L 857.799,757.033 L 862.105,745.837 L 864.689,738.947 L 870.718,720.861 L 873.301,712.249 L 875.024,706.220 L 876.746,700.191 L 879.330,689.856 L 881.914,678.660 L 882.775,674.354 L 885.359,658.852 L 886.220,652.823 L 887.081,646.794 L 887.943,638.182 L 888.804,629.569 L 888.804,612.344 Z M 254.067,110.239 L 254.067,154.163 L 255.789,155.885 L 278.182,155.885 L 289.378,156.746 L 296.268,157.608 L 301.435,158.469 L 304.880,159.330 L 308.325,160.191 L 310.909,161.053 L 316.938,163.636 L 318.660,164.498 L 322.967,167.081 L 326.411,169.665 L 333.301,176.555 L 336.746,180.861 L 338.469,183.445 L 339.330,185.167 L 341.914,191.196 L 342.775,193.780 L 343.636,196.364 L 344.498,200.670 L 345.359,205.837 L 346.220,219.617 L 346.220,303.158 L 344.498,306.603 L 84.402,306.603 L 82.679,308.325 L 82.679,348.804 L 84.402,350.526 L 95.598,350.526 L 103.349,351.388 L 108.517,352.249 L 112.823,353.110 L 115.407,353.971 L 119.713,355.694 L 123.158,357.416 L 128.325,360.000 L 130.909,361.722 L 139.522,370.335 L 142.105,373.780 L 145.550,380.670 L 148.134,388.421 L 148.995,391.866 L 149.856,396.172 L 150.718,403.062 L 150.718,690.718 L 149.856,696.746 L 148.995,700.191 L 148.134,703.636 L 147.273,706.220 L 145.550,710.526 L 144.689,712.249 L 143.828,713.971 L 142.105,716.555 L 140.383,719.139 L 136.938,723.445 L 135.215,725.167 L 130.909,728.612 L 128.325,730.335 L 125.742,732.057 L 124.019,732.919 L 119.713,734.641 L 117.129,735.502 L 114.545,736.364 L 111.100,737.225 L 105.933,738.086 L 99.904,738.947 L 85.263,738.947 L 83.541,739.809 L 83.541,779.426 L 674.354,779.426 L 676.077,777.703 L 676.938,775.120 L 678.660,770.813 L 681.244,763.062 L 685.550,750.144 L 688.134,740.670 L 688.995,737.225 L 689.856,732.919 L 688.995,730.335 L 486.603,729.474 L 486.603,404.785 L 349.665,404.785 L 348.804,730.335 L 309.187,731.196 L 288.517,731.196 L 279.043,730.335 L 275.598,729.474 L 270.431,726.890 L 266.986,723.445 L 266.124,723.445 L 263.541,720.861 L 260.957,717.416 L 259.234,713.971 L 256.651,708.804 L 255.789,706.220 L 254.928,703.636 L 254.067,699.330 L 253.206,693.301 L 252.344,681.244 L 253.206,565.837 L 309.187,565.837 L 309.187,519.330 L 254.067,519.330 L 252.344,517.608 L 252.344,360.861 L 254.067,359.139 L 686.411,359.139 L 685.550,306.603 L 485.742,305.742 L 485.742,192.919 L 486.603,188.612 L 487.464,184.306 L 490.909,177.416 L 493.493,173.971 L 496.077,171.388 L 499.522,168.804 L 504.689,166.220 L 507.273,165.359 L 510.718,164.498 L 589.091,164.498 L 595.981,165.359 L 601.148,166.220 L 611.483,168.804 L 621.818,172.249 L 626.124,173.971 L 637.321,179.139 L 641.627,181.722 L 650.239,186.890 L 656.268,191.196 L 659.713,193.780 L 664.880,198.086 L 673.493,205.837 L 679.522,211.866 L 679.522,212.727 L 686.411,219.617 L 690.718,224.785 L 698.469,235.120 L 703.636,242.871 L 707.943,249.761 L 710.526,254.067 L 714.833,261.818 L 717.416,266.986 L 721.722,275.598 L 726.029,285.072 L 728.612,291.100 L 730.335,295.407 L 732.057,299.713 L 734.641,306.603 L 738.947,318.660 L 742.392,329.856 L 747.560,347.943 L 748.421,351.388 L 751.005,362.584 L 752.727,370.335 L 753.589,374.641 L 756.172,390.144 L 757.033,396.172 L 757.895,402.201 L 758.756,409.091 L 759.617,416.842 L 760.478,427.177 L 761.340,440.957 L 761.340,484.019 L 760.478,498.660 L 759.617,508.995 L 758.756,515.885 L 757.033,517.608 L 522.775,518.469 L 522.775,521.914 L 523.636,522.775 L 523.636,526.220 L 522.775,543.445 L 523.636,567.560 L 567.560,567.560 L 568.421,568.421 L 702.775,569.282 L 846.603,569.282 L 890.526,570.144 L 896.555,571.005 L 900.000,571.866 L 906.029,573.589 L 910.335,575.311 L 915.502,577.895 L 918.086,579.617 L 920.670,581.340 L 924.976,584.785 L 930.144,589.952 L 932.727,593.397 L 934.450,595.981 L 937.895,602.010 L 939.617,606.316 L 940.478,608.900 L 941.340,611.483 L 942.201,614.928 L 943.062,618.373 L 943.923,623.541 L 944.785,633.876 L 943.923,650.239 L 943.923,663.158 L 996.459,663.158 L 995.598,432.344 L 943.923,433.206 L 943.923,439.234 L 944.785,454.737 L 943.923,465.933 L 943.062,471.100 L 942.201,474.545 L 941.340,477.990 L 940.478,480.574 L 939.617,483.158 L 937.895,486.603 L 935.311,491.770 L 933.589,494.354 L 931.005,497.799 L 923.254,505.550 L 915.502,510.718 L 913.780,511.579 L 912.057,512.440 L 904.306,515.024 L 900.861,515.885 L 896.555,515.024 L 896.555,453.876 L 895.694,440.096 L 894.833,429.761 L 893.971,422.010 L 893.110,414.258 L 892.249,407.368 L 891.388,401.340 L 889.665,390.144 L 887.943,380.670 L 884.498,363.445 L 881.914,352.249 L 881.053,348.804 L 878.469,339.330 L 876.746,333.301 L 870.718,315.215 L 867.273,305.742 L 861.244,291.100 L 856.077,279.904 L 853.493,274.737 L 849.187,266.124 L 844.880,258.373 L 841.435,252.344 L 838.852,248.038 L 834.545,241.148 L 831.100,235.981 L 825.933,228.230 L 821.627,222.201 L 813.876,211.866 L 810.431,207.560 L 806.124,202.392 L 800.957,196.364 L 776.842,172.249 L 770.813,167.081 L 766.507,163.636 L 762.201,160.191 L 751.866,152.440 L 741.531,145.550 L 734.641,141.244 L 728.612,137.799 L 721.722,134.354 L 709.665,128.325 L 701.914,124.880 L 695.024,122.297 L 689.856,120.574 L 682.105,117.990 L 676.077,116.268 L 662.297,112.823 L 652.823,111.100 L 646.794,110.239 L 638.182,109.378 Z"
    />
  </svg>
)

// ─── SVG: Sun Icon ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

// ─── SVG: Moon Icon ─────────────────────────────────────────────────────────
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// ─── SVG: Cart Icon ─────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

// ─── Nav links data ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Catalogue', href: '#catalogue' },
  { label: 'Measurements', href: '#measurements' },
  { label: 'Contact', href: '#contact' },
]

// ─── Navbar ──────────────────────────────────────────────────────────────────
export default function Navbar({ isLight, onThemeToggle }) {
  const { cartCount, setIsOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0].href)

  // Navbar is permanently dark, independent of the site-wide theme toggle.
  // We capture the token values once on first mount (when the app is in its
  // natural/default dark state) and re-declare them directly on the <nav>.
  // Because CSS custom properties cascade, this re-declaration wins over
  // whatever the theme toggle later sets higher up the tree (on <html> or
  // <body>), so every descendant link/icon/badge inside the navbar stays
  // locked to dark forever — the rest of the site keeps toggling normally.
  const [lockedTheme] = useState(() => {
    if (typeof window === 'undefined') return {}
    const tokens = ['--white', '--black', '--accent', '--text-light']
    const computed = getComputedStyle(document.documentElement)
    const locked = {}
    tokens.forEach((token) => {
      const value = computed.getPropertyValue(token).trim()
      if (value) locked[token] = value
    })
    return locked
  })

  // scroll detection + hide navbar once past the hero section
  useEffect(() => {
    const hero = document.querySelector('#home')
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom
        setVisible(heroBottom > 0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: find every nav target in the document, then on scroll work
  // out which one's top edge we've scrolled past most recently — that's
  // the active section. This doesn't depend on each section being a
  // particular height, so it holds up whether #home is the full 500vh
  // Hero wrapper or just a small anchor point near the top.
  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    if (sections.length === 0) return

    const OFFSET = 100 // navbar height + buffer

    const updateActive = () => {
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top - OFFSET <= 0) {
          current = section
        }
      }
      setActiveSection('#' + current.id)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  // close mobile menu when a link is clicked
  const handleMobLinkClick = () => setMenuOpen(false)

  // smooth scroll for hash links
  const handleNavClick = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(href)
    setMenuOpen(false)
  }

  return (
    <nav
      id="navbar"
      style={lockedTheme}
      className={[
        'fixed top-0 left-0 right-0 z-[1000]',
        'px-4 md:px-16',
        'transition-[background,box-shadow,opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'bg-[rgba(8,8,8,0.94)] shadow-[0_1px_0_rgba(184,168,152,0.18)] backdrop-blur-[20px]'
          : 'bg-transparent',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none',
      ].join(' ')}
    >
      {/* ── Inner row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between h-[72px]">

        {/* Logo — real navigation, not a JS scroll: clicking reloads the page */}
        <a
          href="/"
          className="flex items-center gap-[10px] text-[var(--white)] whitespace-nowrap no-underline"
        >
          <LogoSVG className="h-8 w-8 shrink-0 text-[var(--white)] transition-colors duration-[400ms]" />
          <span
            className="font-[var(--font-display)] text-[0.85rem] md:text-[1.1rem] font-bold tracking-[0.25em] md:tracking-[0.35em] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DON ELCLASICO
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex list-none gap-12 items-center">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'nav-link',
                    'text-[0.68rem] font-normal tracking-[0.25em] uppercase',
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-light)]',
                    'relative py-1',
                    'transition-colors duration-300',
                    'hover:text-[var(--white)]',
                    'after:content-[""] after:absolute after:bottom-0 after:left-0',
                    isActive ? 'after:w-full' : 'after:w-0',
                    'after:h-px after:bg-[var(--accent)]',
                    'after:transition-[width] after:duration-[400ms]',
                    'hover:after:w-full',
                  ].join(' ')}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Actions: cart + theme + hamburger */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Cart"
            className="relative text-[var(--white)] transition-colors duration-300 hover:text-[var(--accent)] flex items-center"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[var(--accent)] text-[var(--black)] text-[0.6rem] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            aria-label="Toggle theme"
            className="text-[var(--white)] transition-colors duration-300 hover:text-[var(--accent)] flex items-center justify-center"
          >
            {isLight ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex md:hidden flex-col gap-[5px] p-1 text-[var(--white)]"
          >
            <span
              className={[
                'block w-[22px] h-px bg-current transition-transform duration-[400ms]',
                menuOpen ? 'translate-y-[6px] rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-[22px] h-px bg-current transition-opacity duration-300',
                menuOpen ? 'opacity-0' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-[22px] h-px bg-current transition-transform duration-[400ms]',
                menuOpen ? '-translate-y-[6px] -rotate-45' : '',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className={[
            'flex flex-col gap-6',
            'px-4 md:px-16 pt-6 pb-8',
            'border-t border-[rgba(255,255,255,0.06)]',
            'bg-[rgba(8,8,8,0.98)]',
            'backdrop-blur-[20px]',
          ].join(' ')}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => { handleNavClick(e, href); handleMobLinkClick() }}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'text-[0.72rem] tracking-[0.25em] uppercase transition-colors duration-300',
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--text-light)]',
                  'hover:text-[var(--accent)]',
                ].join(' ')}
              >
                {label}
              </a>
            )
          })}
        </div>
      )}
    </nav>
  )
}
