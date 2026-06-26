import { useState, useEffect, useCallback, useRef } from 'react'
import AdminNavbar from './components/AdminNavbar'
import AdminFooter from './components/AdminFooter'
import LoginGate, { isAdminLoggedIn } from './components/LoginGate'

// ── Backend config ────────────────────────────────────────────────────────────
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwKHAzFLyO2aDle1-5CGdXenYhwi5lgI655qoVMVfsq8s1SD6yrXyIfzzJJQC9Lepd4vw/exec',
  ADMIN_TOKEN: 'DE_ADMIN_2025_X9K',
}

async function callApi(action, body = {}) {
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
    body: JSON.stringify({ action, token: CONFIG.ADMIN_TOKEN, ...body }),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Request failed')
  return data
}

// ── Shared hook ───────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= breakpoint)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

// ── Brand logo (matches AdminNavbar) ─────────────────────────────────────────
const LogoSVG = ({ className = '', style = {} }) => (
  <svg
    className={className}
    style={style}
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

// ── Icons (inline SVG, no external dep) ──────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  dashboard:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  catalogue:    'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  measurements: 'M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M7 3v4 M11 3v2 M15 3v4 M19 3v2',
  plus:         'M12 5v14 M5 12h14',
  edit:         'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:        'M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
  close:        'M18 6L6 18 M6 6l12 12',
  refresh:      'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M20.49 15a9 9 0 0 1-14.85 3.36L1 14',
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: 'dashboard'    },
  { id: 'catalogue',    label: 'Catalogue',    icon: 'catalogue'    },
  { id: 'measurements', label: 'Measurements', icon: 'measurements' },
]

// ── Shared bits ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, barPct, barColor }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
      <p style={{ margin: 0, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</p>
      <p style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      {barPct != null && (
        <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, marginTop: 10 }}>
          <div style={{ height: '100%', width: `${barPct}%`, borderRadius: 1, background: barColor || 'var(--accent)' }} />
        </div>
      )}
      {sub && <p style={{ margin: '5px 0 0', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{sub}</p>}
    </div>
  )
}

const BUBBLE_PALETTE = [
  { bg: 'rgba(201,169,110,0.13)', border: 'rgba(201,169,110,0.35)', text: 'var(--accent)' },
  { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)',  text: 'var(--accent-green)' },
  { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)',  text: 'var(--accent-amber)' },
  { bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.30)', text: '#818CF8' },
]

function CategoriesCard({ products }) {
  const counts = {}
  products.forEach((p) => {
    if (!p.category) return
    counts[p.category] = (counts[p.category] || 0) + 1
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = entries.slice(0, 4)

  return (
    <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px', width: '100%' }}>
      <p style={{ margin: '0 0 14px', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Categories</p>
      <p style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>{entries.length}</p>
      {entries.length === 0 ? (
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>No categories yet</span>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {top.map(([name, count], i) => {
            const pal = BUBBLE_PALETTE[i]
            return (
              <div key={name} style={{
                background: pal.bg, border: `0.5px solid ${pal.border}`, borderRadius: 16,
                padding: '5px 11px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: pal.text, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{count}</span>
                <span style={{ fontSize: 9, color: pal.text, opacity: 0.7, whiteSpace: 'nowrap', marginTop: 1 }}>{name}</span>
              </div>
            )
          })}
          {entries.length > 4 && (
            <div style={{
              background: 'var(--elevated)', border: '0.5px solid var(--border)', borderRadius: 16,
              padding: '5px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>+{entries.length - 4}</span>
              <span style={{ fontSize: 9, color: 'var(--muted)', opacity: 0.7, marginTop: 1 }}>more</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProductStatusCard({ total, active, inactive }) {
  const activePct = total > 0 ? Math.round((active / total) * 100) : 0
  return (
    <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px', width: '100%' }}>
      <p style={{ margin: '0 0 0', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Product status</p>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '8px 0 12px' }}>
        <span style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>{total}</span>
        <span style={{ fontSize: 10, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{activePct}% active</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, overflow: 'hidden', background: 'var(--border)', marginBottom: 8 }}>
        <div style={{ width: `${activePct}%`, height: '100%', background: 'var(--accent-green)' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)', flexShrink: 0 }} />
          {active} active
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
          {inactive} hidden
        </span>
      </div>
    </div>
  )
}

const skeletonShimmer = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
`

function Skel({ w = '100%', h = 16, radius = 6, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--elevated) 25%, var(--border) 50%, var(--elevated) 75%)',
      backgroundSize: '600px 100%',
      animation: 'shimmer 1.4s infinite linear',
      flexShrink: 0,
      ...style,
    }} />
  )
}

function DashboardSkeleton({ isMobile }) {
  return (
    <div>
      <style>{skeletonShimmer}{`
        .dskel-top { display: grid; grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'}; gap: 10px; margin-bottom: 10px; }
      `}</style>

      {/* Top: Products + Categories (side by side on desktop, stacked on mobile) */}
      <div className="dskel-top">
        <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
          <Skel w="40%" h={10} style={{ marginBottom: 10 }} />
          <Skel w="30%" h={22} radius={4} style={{ marginBottom: 10 }} />
          <Skel w="100%" h={3} radius={2} style={{ marginBottom: 6 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Skel w={60} h={10} /><Skel w={60} h={10} />
          </div>
        </div>
        {!isMobile && (
          <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <Skel w="40%" h={10} style={{ marginBottom: 14 }} />
            <Skel w="30%" h={22} radius={4} style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[0,1,2,3].map(j => <Skel key={j} w={52} h={44} radius={16} />)}
            </div>
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 10 }}>
          <Skel w="40%" h={10} style={{ marginBottom: 14 }} />
          <Skel w="30%" h={22} radius={4} style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2,3].map(j => <Skel key={j} w={52} h={44} radius={16} />)}
          </div>
        </div>
      )}

      {/* Feed — always shown */}
      <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
        <Skel w="40%" h={10} style={{ marginBottom: 14 }} />
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 4 ? '0.5px solid var(--border)' : 'none' }}>
            <Skel w={28} h={28} radius="50%" />
            <div style={{ flex: 1 }}>
              <Skel w="35%" h={12} style={{ marginBottom: 4 }} />
              <Skel w="55%" h={10} />
            </div>
            <Skel w={60} h={10} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CatalogueSkeleton({ isMobile }) {
  return (
    <div>
      <style>{skeletonShimmer}</style>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {isMobile ? (
          <>
            <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              {['40%', '30%', '20%'].map((w, i) => <Skel key={i} w={w} h={11} />)}
            </div>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <Skel w="40%" h={13} />
                <Skel w="30%" h={13} />
                <Skel w="20%" h={13} />
              </div>
            ))}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              {['30%', '18%', '14%', '14%', '12%'].map((w, i) => <Skel key={i} w={w} h={11} />)}
            </div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <Skel w="30%" h={13} />
                <Skel w="18%" h={13} />
                <Skel w="14%" h={13} />
                <Skel w="14%" h={13} />
                <Skel w={52} h={22} radius={6} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <Skel w={16} h={16} radius={4} />
                  <Skel w={16} h={16} radius={4} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function MeasurementsSkeleton({ isMobile }) {
  return (
    <div>
      <style>{skeletonShimmer}</style>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {isMobile ? (
          <>
            <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <Skel w="50%" h={11} />
              <Skel w="35%" h={11} />
            </div>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <Skel w="50%" h={13} />
                <Skel w="35%" h={13} />
              </div>
            ))}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              {['20%','16%','22%','10%','10%','10%'].map((w,i) => <Skel key={i} w={w} h={11} />)}
            </div>
            {[0,1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <Skel w="20%" h={13} />
                <Skel w="16%" h={13} />
                <Skel w="22%" h={13} />
                <Skel w="10%" h={13} />
                <Skel w="10%" h={13} />
                <Skel w="10%" h={13} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <Skel w={16} h={16} radius={4} />
                  <Skel w={16} h={16} radius={4} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      background: 'rgba(248,113,113,0.08)', border: '1px solid var(--accent-red)', borderRadius: 10,
      padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
    }}>
      <span style={{ fontSize: 13, color: 'var(--accent-red)' }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          Retry
        </button>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--card-bg)', 
          border: '2px solid var(--accent)', 
          borderRadius: 16,
          width: '100%', 
          maxWidth: 1000, 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          position: 'relative', 
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: title ? 'space-between' : 'flex-end', alignItems: 'center', gap: 12, marginBottom: title ? 28 : 8 }}>
          {title && (
            typeof title === 'string'
              ? <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)', minWidth: 0 }}>{title}</h3>
              : <div style={{ minWidth: 0, overflow: 'hidden' }}>{title}</div>
          )}
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
            <Icon d={ICONS.close} size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--elevated)', color: 'var(--text)', fontSize: 13.5, fontFamily: 'inherit',
}

function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} style={{
      background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
      padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8, ...(props.style || {}),
    }}>
      {children}
    </button>
  )
}

function GhostButton({ children, ...props }) {
  return (
    <button {...props} style={{
      background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8,
      padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      ...(props.style || {}),
    }}>
      {children}
    </button>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardSection({ setTopbarActions, setActive }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [records, setRecords] = useState([])
  const isMobile = useIsMobile()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, m] = await Promise.all([
        callApi('adminListCatalogue'),
        callApi('adminListMeasurements'),
      ])
      setProducts(c.products || [])
      setRecords(m.records || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    setTopbarActions(
      <button className="icon-btn" onClick={load} title="Refresh" aria-label="Refresh">
        <Icon d={ICONS.refresh} size={15} />
      </button>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeCount = products.filter((p) => {
    const v = p.active
    return v === true || v === 1 || String(v).toUpperCase() === 'TRUE'
  }).length

  const activePct = products.length > 0 ? Math.round((activeCount / products.length) * 100) : 0

  if (loading) return <DashboardSkeleton isMobile={isMobile} />

  return (
    <div>
      <style>{`
        .dash-top {
          display: grid;
          grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'};
          align-items: stretch;
          gap: 10px;
          margin-bottom: 10px;
        }
        .dash-top > div { display: flex; }
      `}</style>
      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Products card always shown; Categories card sits beside it on desktop, below it on mobile */}
      <div className="dash-top">
        <div onClick={() => setActive('catalogue')} style={{ cursor: 'pointer', display: 'flex' }}>
          <ProductStatusCard total={products.length} active={activeCount} inactive={products.length - activeCount} />
        </div>
        {!isMobile && (
          <div onClick={() => setActive('catalogue')} style={{ cursor: 'pointer', display: 'flex' }}>
            <CategoriesCard products={products} />
          </div>
        )}
      </div>
      {isMobile && (
        <div onClick={() => setActive('catalogue')} style={{ marginBottom: 10, cursor: 'pointer' }}>
          <CategoriesCard products={products} />
        </div>
      )}

      {/* Recent submissions feed */}
      <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
        <p style={{ margin: '0 0 0', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Recent submissions</p>
        {records.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>No submissions yet.</p>}
        {records.slice(-5).reverse().map((r, i, arr) => {
          const initials = (r.full_name || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
          const pal = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length]
          const measurements = [
            r.chest && `Chest ${r.chest}`,
            r.waist && `Waist ${r.waist}`,
            r.height && `Height ${r.height}`,
          ].filter(Boolean).join(' · ')
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: pal.bg, border: `0.5px solid ${pal.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 500, color: pal.text,
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{r.full_name}</div>
                {measurements && <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{measurements}</div>}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{r.phone_number}</div>
            </div>
          )
        })}
        {records.length > 0 && (
          <button
            onClick={() => setActive('measurements')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginTop: 10, background: 'transparent', border: 'none',
              color: 'var(--accent)', cursor: 'pointer',
              fontSize: 11, fontFamily: 'var(--font-mono)', padding: 0,
            }}
          >
            See all {records.length} submissions
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ── Catalogue ─────────────────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  id: null, name: '', category: '', price: '', badge: '', image_url: '',
  description: '', features: '', sort_order: 0, active: true,
}

// Strips currency symbols/commas (e.g. "₦75,000") so price sorting works reliably
function parsePrice(value) {
  if (value == null) return 0
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}

function CatalogueSection({ setTopbarActions }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null) // null = closed, {} = new, obj = edit
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest') // newest (by sort_order desc), name_asc, price_desc
  const isMobile = useIsMobile()
  const itemsPerPage = isMobile ? 5 : 10

  // Reset to page 1 if the page size changes (mobile <-> desktop) and current page is now out of range
  useEffect(() => { setPage(1) }, [itemsPerPage])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPage(1)
    try {
      const res = await callApi('adminListCatalogue')
      setProducts(res.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    setTopbarActions(
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="icon-btn" onClick={load} title="Refresh" aria-label="Refresh">
          <Icon d={ICONS.refresh} size={15} />
        </button>
        <button className="icon-btn" onClick={() => setEditing({ ...EMPTY_PRODUCT })} title="Add Product" aria-label="Add Product" style={{ boxShadow: 'inset 0 0 0 1px var(--accent)', color: 'var(--accent)' }}>
          <Icon d={ICONS.plus} size={15} />
        </button>
      </div>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply sorting based on sortBy value
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Higher sort_order = more recently added
        return (b.sort_order || 0) - (a.sort_order || 0)
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'price_desc':
        return parsePrice(b.price) - parsePrice(a.price)
      default:
        return 0
    }
  })

  async function handleSave(product) {
    setSaving(true)
    try {
      if (product.id) {
        await callApi('adminUpdateCatalogue', { product })
      } else {
        await callApi('adminAddCatalogue', { product })
      }
      setEditing(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return false
    try {
      await callApi('adminDeleteCatalogue', { id })
      await load()
      return true
    } catch (err) {
      alert(err.message)
      return false
    }
  }

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIdx = (page - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIdx, endIdx)

  return (
    <div>
      {/* Sort Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.05em' }}>Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
          style={{
            padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'var(--card-bg)', color: 'var(--text)', fontSize: 13,
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          <option value="newest">Latest First</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="price_desc">Price (High to Low)</option>
        </select>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {loading ? <CatalogueSkeleton isMobile={isMobile} /> : (
        <>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {(isMobile ? ['Name', 'Category', 'Price'] : ['Name', 'Category', 'Price', 'Badge', 'Active', '']).map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.length === 0 && (
                  <tr><td colSpan={isMobile ? 3 : 6} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>No products yet.</td></tr>
                )}
                {paginatedProducts.map((p) => {
                  const isActive = p.active === true || p.active === 1 || String(p.active).toUpperCase() === 'TRUE'
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setEditing({ ...p })}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{p.price}</td>
                      {!isMobile && (
                        <>
                          <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.badge}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6,
                              background: isActive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                              color: isActive ? 'var(--accent-green)' : 'var(--accent-red)',
                            }}>
                              {isActive ? 'ACTIVE' : 'HIDDEN'}
                            </span>
                          </td>
                          <td className="row-actions" style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button onClick={(e) => { e.stopPropagation(); setEditing({ ...p }) }} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginRight: 8 }}>
                              <Icon d={ICONS.edit} size={15} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
                              <Icon d={ICONS.trash} size={15} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16, padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
              {isMobile ? (
                <>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
                      background: page === 1 ? 'transparent' : 'var(--elevated)', color: 'var(--muted)',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon d="M15 18l-6-6 6-6" size={18} />
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                    Page {page} of {totalPages} <span style={{ whiteSpace: 'nowrap' }}>{sortedProducts.length} products</span>
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
                      background: page === totalPages ? 'transparent' : 'var(--elevated)', color: 'var(--muted)',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon d="M9 18l6-6-6-6" size={18} />
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    Showing {startIdx + 1}–{Math.min(endIdx, sortedProducts.length)} of {sortedProducts.length} products
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
                        background: page === 1 ? 'transparent' : 'var(--elevated)', color: 'var(--muted)',
                        cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600,
                        opacity: page === 1 ? 0.5 : 1,
                      }}
                    >
                      ← Prev
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          style={{
                            width: 32, height: 32, borderRadius: 6,
                            border: page === p ? '1px solid var(--accent)' : '1px solid var(--border)',
                            background: page === p ? 'var(--accent-dim)' : 'transparent',
                            color: page === p ? 'var(--accent)' : 'var(--muted)',
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{
                        padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
                        background: page === totalPages ? 'transparent' : 'var(--elevated)', color: 'var(--muted)',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600,
                        opacity: page === totalPages ? 0.5 : 1,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit Product' : 'Add Product'} onClose={() => !saving && setEditing(null)}>
          <ProductForm
            product={editing}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            onDelete={editing.id ? async () => { const ok = await handleDelete(editing.id); if (ok) setEditing(null) } : null}
          />
        </Modal>
      )}
    </div>
  )
}

function ProductForm({ product, saving, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(product)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Create image element to get dimensions
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width, maintain aspect ratio)
        const maxWidth = 800
        const scale = maxWidth / img.width
        const newWidth = maxWidth
        const newHeight = Math.round(img.height * scale)
        
        // Create canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        
        // Convert to base64 with reduced quality
        const base64 = canvas.toDataURL('image/jpeg', 0.75) // 75% quality
        setForm((f) => ({ ...f, image_url: base64 }))
        URL.revokeObjectURL(url)
        setUploading(false)
        // Reset file input so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
      
      img.onerror = () => {
        alert('Failed to load image')
        URL.revokeObjectURL(url)
        setUploading(false)
      }
      
      img.src = url
    } catch (err) {
      alert('Error processing image: ' + err.message)
      setUploading(false)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = { target: { files: [file] } }
      handleImageUpload(syntheticEvent)
    }
  }

  const hasImage = form.image_url && form.image_url.length > 0
  const isNewImage = form.image_url && form.image_url.startsWith('data:')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
      {/* Two-Column Grid for Basic Fields */}
      <div className="pf-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Field label="Name"><input style={inputStyle} value={form.name || ''} onChange={set('name')} required /></Field>
        <Field label="Category"><input style={inputStyle} value={form.category || ''} onChange={set('category')} /></Field>
        <Field label="Price"><input style={inputStyle} value={form.price || ''} onChange={set('price')} /></Field>
        <Field label="Badge"><input style={inputStyle} value={form.badge || ''} onChange={set('badge')} /></Field>
      </div>

      {/* Full Width Description */}
      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.description || ''} onChange={set('description')} />
      </Field>

      {/* Full Width Features */}
      <Field label="Features">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Add a feature..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const value = e.currentTarget.value.trim()
                  if (value) {
                    const features = form.features ? form.features.split('|').map(f => f.trim()) : []
                    if (!features.includes(value)) {
                      features.push(value)
                      setForm((f) => ({ ...f, features: features.join('|') }))
                    }
                    e.currentTarget.value = ''
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                const input = e.currentTarget.parentElement?.querySelector('input')
                if (input) {
                  const value = input.value.trim()
                  if (value) {
                    const features = form.features ? form.features.split('|').map(f => f.trim()) : []
                    if (!features.includes(value)) {
                      features.push(value)
                      setForm((f) => ({ ...f, features: features.join('|') }))
                    }
                    input.value = ''
                  }
                }
              }}
              style={{
                padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Add
            </button>
          </div>
          
          {form.features && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {form.features.split('|').map((feature, idx) => {
                const trimmed = feature.trim()
                return trimmed ? (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px', borderRadius: 6,
                      background: 'var(--accent-dim)', border: '1px solid var(--accent)',
                      color: 'var(--accent)', fontSize: 13, fontWeight: 500,
                    }}
                  >
                    {trimmed}
                    <button
                      type="button"
                      onClick={() => {
                        const features = form.features.split('|').map(f => f.trim()).filter((f, i) => i !== idx)
                        setForm((f) => ({ ...f, features: features.join('|') }))
                      }}
                      style={{
                        background: 'transparent', border: 'none', color: 'var(--accent)',
                        cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      </Field>

      {/* Settings in Two Columns */}
      <div className="pf-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Field label="Sort Order"><input type="number" style={inputStyle} value={form.sort_order ?? 0} onChange={set('sort_order')} /></Field>
        <Field label="Active">
          <select style={inputStyle} value={String(form.active)} onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'true' }))}>
            <option value="true">Active (visible on storefront)</option>
            <option value="false">Hidden</option>
          </select>
        </Field>
      </div>

      {/* Image Upload Section - Full Width */}
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Product Image
          </label>
          {hasImage && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
              style={{
                fontSize: 12, color: 'var(--accent-red)', background: 'transparent', border: 'none',
                cursor: 'pointer', fontWeight: 500, textDecoration: 'underline',
              }}
            >
              Clear Image
            </button>
          )}
        </div>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={(e) => {
            e.preventDefault()
            fileInputRef.current?.click()
          }}
          style={{
            border: '2px dashed var(--border)',
            borderRadius: 12,
            padding: '48px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: hasImage ? 'transparent' : 'var(--elevated)',
            borderColor: hasImage ? 'var(--accent)' : 'var(--border)',
            pointerEvents: uploading ? 'none' : 'auto',
          }}
          onMouseEnter={(e) => {
            if (!hasImage && !uploading) {
              e.currentTarget.style.background = 'var(--accent-dim)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!hasImage && !uploading) {
              e.currentTarget.style.background = 'var(--elevated)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }
          }}
        >
          {hasImage ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: '100%', maxWidth: 320, height: 220, borderRadius: 8, overflow: 'hidden',
                border: '1px solid var(--accent)', background: 'var(--elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={form.image_url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>✓ Image ready</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>{isNewImage ? 'Newly uploaded' : 'Current image'} • Click or drag to replace</p>
              </div>
            </div>
          ) : uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '3px solid var(--accent-dim)',
                borderTopColor: 'var(--accent)',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>Processing image…</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--muted)' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Upload product image</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--muted)' }}>Drag and drop or click to select</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .pf-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: onDelete ? 'space-between' : 'flex-end', alignItems: 'center', gap: 12, marginTop: 32 }}>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={saving || uploading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)',
              borderRadius: 8, padding: '9px 14px', fontSize: 13, fontWeight: 600,
              cursor: saving || uploading ? 'not-allowed' : 'pointer', opacity: saving || uploading ? 0.5 : 1,
            }}
          >
            <Icon d={ICONS.trash} size={14} />
            Delete
          </button>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <GhostButton type="button" onClick={onCancel} disabled={saving || uploading}>Cancel</GhostButton>
          <PrimaryButton type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save Product'}</PrimaryButton>
        </div>
      </div>
    </form>
  )
}

// ── Measurements ──────────────────────────────────────────────────────────────
function MeasurementsSection({ setTopbarActions }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [records, setRecords] = useState([])
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const isMobile = useIsMobile()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await callApi('adminListMeasurements')
      setRecords(res.records || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    setTopbarActions(
      <button className="icon-btn" onClick={load} title="Refresh" aria-label="Refresh">
        <Icon d={ICONS.refresh} size={15} />
      </button>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(record) {
    setSaving(true)
    try {
      await callApi('adminUpdateMeasurement', { rowIndex: record.rowIndex, record })
      setEditing(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(rowIndex) {
    if (!confirm('Delete this submission?')) return
    try {
      await callApi('adminDeleteMeasurement', { rowIndex })
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onRetry={load} />}
      {loading ? <MeasurementsSkeleton isMobile={isMobile} /> : (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {(isMobile ? ['Name', 'Phone'] : ['Name', 'Phone', 'Email', 'Chest', 'Waist', 'Height', '']).map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={isMobile ? 2 : 7} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>No submissions yet.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.rowIndex} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setViewing(r)}>{r.full_name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{r.phone_number ? `0${r.phone_number}` : '—'}</td>
                  {!isMobile && (
                    <>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{r.email}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{r.chest}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{r.waist}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{r.height}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setEditing({ ...r })} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginRight: 8 }}>
                          <Icon d={ICONS.edit} size={15} />
                        </button>
                        <button onClick={() => handleDelete(r.rowIndex)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
                          <Icon d={ICONS.trash} size={15} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <LogoSVG style={{ height: 40, width: 40, flexShrink: 0, color: 'var(--white)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, minWidth: 0 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700,
                  letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--white)',
                }}>DON</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700,
                  letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--white)',
                }}>ELCLASICO</span>
              </div>
            </div>
          }
          onClose={() => setViewing(null)}
        >
          {/* Name row first */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Name</span>
            <span style={{ fontSize: 13, color: 'var(--text)', textAlign: 'right', maxWidth: '70%', fontWeight: 600 }}>{viewing.full_name || '—'}</span>
          </div>
          {[
            ['Phone', 'phone_number'], ['Email', 'email'], ['Chest', 'chest'], ['Waist', 'waist'],
            ['Seat', 'seat'], ['Height', 'height'], ['Inseam', 'inseam_length'], ['Shoulder', 'shoulder_width'],
            ['Sleeve', 'sleeve_length'], ['Neck', 'neck_circumference'], ['Thigh', 'thigh'], ['Notes', 'additional_details'],
          ].map(([label, key]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text)', textAlign: 'right', maxWidth: '70%' }}>{key === 'phone_number' ? (viewing[key] ? `0${viewing[key]}` : '—') : (viewing[key] || '—')}</span>
            </div>
          ))}
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Measurement" onClose={() => !saving && setEditing(null)}>
          <MeasurementForm record={editing} saving={saving} onSave={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  )
}

const MEASUREMENT_FIELDS = [
  ['full_name', 'Full Name'], ['phone_number', 'Phone'], ['email', 'Email'],
  ['chest', 'Chest'], ['waist', 'Waist'], ['seat', 'Seat'], ['height', 'Height'],
  ['inseam_length', 'Inseam'], ['shoulder_width', 'Shoulder'], ['sleeve_length', 'Sleeve'],
  ['neck_circumference', 'Neck'], ['thigh', 'Thigh'], ['additional_details', 'Notes'],
]

function MeasurementForm({ record, saving, onSave, onCancel }) {
  const [form, setForm] = useState(record)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
      {MEASUREMENT_FIELDS.map(([key, label]) => (
        <Field key={key} label={label}>
          {key === 'additional_details'
            ? <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form[key] || ''} onChange={set(key)} />
            : <input style={inputStyle} value={form[key] || ''} onChange={set(key)} />}
        </Field>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        <GhostButton type="button" onClick={onCancel} disabled={saving}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</PrimaryButton>
      </div>
    </form>
  )
}

// ── Section router ────────────────────────────────────────────────────────────
function SectionContent({ active, setActive, setTopbarActions }) {
  switch (active) {
    case 'dashboard':    return <DashboardSection    setTopbarActions={setTopbarActions} setActive={setActive} />
    case 'catalogue':    return <CatalogueSection    setTopbarActions={setTopbarActions} />
    case 'measurements': return <MeasurementsSection setTopbarActions={setTopbarActions} />
    default:             return <DashboardSection    setTopbarActions={setTopbarActions} setActive={setActive} />
  }
}

// ── Main AdminPage ────────────────────────────────────────────────────────────
function AdminPage() {
  const [isLight, setIsLight] = useState(() => localStorage.getItem('de_theme') === 'light')
  const [loggedIn, setLoggedIn] = useState(() => isAdminLoggedIn())
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [topbarActions, setTopbarActions] = useState(null)

  useEffect(() => {
    localStorage.setItem('de_theme', isLight ? 'light' : 'dark')
  }, [isLight])

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ADMIN - DON ELCLASICO WEARS';
    
    return () => {
      document.title = originalTitle;
    };
  }, []);

  if (!loggedIn) {
    return (
      <LoginGate
        isLight={isLight}
        onThemeToggle={() => setIsLight(v => !v)}
        onSuccess={() => setLoggedIn(true)}
      />
    )
  }

  return (
    <div className={`admin-root${isLight ? ' light' : ''}`}>
      {/* ── CSS tokens ── */}
      <style>{`
        .admin-root {
          --bg:           #080808;
          --sidebar-bg:   #0D0D0D;
          --card-bg:      #111111;
          --elevated:     #1A1A1A;
          --border:       #2A2A2A;
          --text:         #F0EDE8;
          --muted:        #6B6B6B;
          --accent:       #C9A96E;
          --accent-dim:   rgba(201,169,110,0.12);
          --accent-glow:  rgba(201,169,110,0.18);
          --accent-green: #4ADE80;
          --accent-red:   #F87171;
          --accent-amber: #FBBF24;
          --font-mono:    'JetBrains Mono', 'Fira Mono', monospace;
          --sidebar-w:    220px;
          --sidebar-w-sm: 64px;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
        }
        .admin-root.light {
          --bg:          #F4F1EC;
          --sidebar-bg:  #EDEAE4;
          --card-bg:     #FFFFFF;
          --elevated:    #E8E4DD;
          --border:      #D5CFC6;
          --text:        #1A1713;
          --muted:       #8A8480;
        }
        .admin-root *, .admin-root *::before, .admin-root *::after { box-sizing: border-box; }
        .admin-root .admin-shell { display: flex; height: calc(100vh - 56px); overflow: hidden; }
        .admin-root .sidebar {
          width: var(--sidebar-w); flex-shrink: 0;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: width 0.2s ease;
          overflow: hidden;
        }
        .admin-root .sidebar.collapsed { width: var(--sidebar-w-sm); }
        .admin-root .sidebar-logo {
          height: 56px;
          display: flex; align-items: center; gap: 10px;
          padding: 0 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .admin-root .logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--elevated); border: 0.5px solid var(--border);
          display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .admin-root .logo-text { font-size: 15px; font-weight: 600; color: var(--text); white-space: nowrap; }
        .admin-root .nav-list { list-style: none; padding: 12px 8px; flex: 1; }
        .admin-root .nav-item button {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 9px 12px; border-radius: 8px; border: none; cursor: pointer;
          background: transparent; color: var(--muted);
          font-size: 13.5px; font-weight: 500; transition: all 0.15s ease;
          white-space: nowrap; overflow: hidden;
        }
        .admin-root .nav-item button:hover { background: var(--elevated); color: var(--text); }
        .admin-root .nav-item button.active { background: var(--accent-dim); color: var(--accent); }
        .admin-root .nav-item button .nav-icon { flex-shrink: 0; }
        /* Icon-only mode: triggered by the manual desktop toggle (.collapsed)
           or forced unconditionally by the mobile breakpoint below */
        .admin-root .sidebar.collapsed .logo-text,
        .admin-root .sidebar.collapsed .nav-item .label-text {
          display: none;
        }
        .admin-root .sidebar.collapsed .sidebar-logo,
        .admin-root .sidebar.collapsed .nav-item button {
          justify-content: center;
        }
        .admin-root .sidebar-footer {
          height: 51px;
          padding: 0 8px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
        }
        .admin-root .sidebar-footer button {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 0 12px; border-radius: 8px; border: none; cursor: pointer;
          background: transparent; color: var(--muted); font-size: 13.5px;
          font-weight: 500; transition: all 0.15s ease;
        }
        .admin-root .sidebar-footer button:hover { background: var(--elevated); color: var(--text); }
        .admin-root .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .admin-root .topbar {
          height: 56px; flex-shrink: 0;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
          background: var(--sidebar-bg);
        }
        .admin-root .topbar-left { display: flex; align-items: center; gap: 16px; }
        .admin-root .topbar-title { font-size: 15px; font-weight: 600; color: var(--text); }
        .admin-root .breadcrumb { font-size: 12px; color: var(--muted); font-family: var(--font-mono); }
        .admin-root .topbar-right { display: flex; align-items: center; gap: 12px; }
        .admin-root .icon-btn {
          width: 51px; height: 51px; border-radius: 8px;
          box-shadow: inset 0 0 0 1px var(--border);
          background: transparent; cursor: pointer; color: var(--muted);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .admin-root .icon-btn:hover { background: var(--elevated); color: var(--text); box-shadow: inset 0 0 0 1px var(--accent); }
        .admin-root .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--accent-dim); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: var(--accent); cursor: pointer;
          flex-shrink: 0;
        }
        .admin-root .content-area { flex: 1; overflow-y: auto; padding: 28px 32px; }
        @media (max-width: 768px) {
          .admin-root .sidebar { width: var(--sidebar-w-sm); }
          .admin-root .sidebar .logo-text,
          .admin-root .sidebar .nav-item .label-text {
            display: none;
          }
          .admin-root .sidebar .sidebar-logo,
          .admin-root .sidebar .nav-item button {
            justify-content: center;
          }
          .admin-root .sidebar-footer { display: none; }
          .admin-root .content-area { padding: 20px 16px; }
        }
      `}</style>

      <AdminNavbar isLight={isLight} onThemeToggle={() => setIsLight(v => !v)} onLogout={() => { localStorage.removeItem('de_admin_auth'); setLoggedIn(false) }} />

      <div className="admin-shell">
        {/* Sidebar */}
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="sidebar-logo" aria-label="Don Elclasico Admin">
            <span className="logo-mark">
              {/* CPU icon — distinct from the brand logo used in the navbar */}
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'var(--text)', flexShrink: 0 }}
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9"  y1="1"  x2="9"  y2="4"  />
                <line x1="15" y1="1"  x2="15" y2="4"  />
                <line x1="9"  y1="20" x2="9"  y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9"  x2="23" y2="9"  />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1"  y1="9"  x2="4"  y2="9"  />
                <line x1="1"  y1="14" x2="4"  y2="14" />
              </svg>
            </span>
            <span className="logo-text">Control Panel</span>
          </div>

          <ul className="nav-list">
            {NAV.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={active === item.id ? 'active' : ''}
                  onClick={() => { setActive(item.id); setTopbarActions(null) }}
                  title={item.label}
                  aria-label={item.label}
                >
                  <span className="nav-icon">
                    <Icon d={ICONS[item.icon]} size={18} />
                  </span>
                  <span className="label-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="sidebar-footer">
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon d={collapsed ? 'M13 17l5-5-5-5 M6 17l5-5-5-5' : 'M11 17l-5-5 5-5 M18 17l-5-5 5-5'} size={18} />
              {!collapsed && 'Collapse'}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <span className="topbar-title">{NAV.find(n => n.id === active)?.label}</span>
            </div>
            <div className="topbar-right">
              {topbarActions}
            </div>
          </header>

          <main className="content-area">
            <SectionContent active={active} setActive={setActive} setTopbarActions={setTopbarActions} />
          </main>

          <AdminFooter />
        </div>
      </div>
    </div>
  )
}

export default AdminPage
