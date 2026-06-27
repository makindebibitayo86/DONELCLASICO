import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './CartContext'
import './Catalogue.css'

// ---------------------------------------------------------------------------
// ⚙️  Config
// ---------------------------------------------------------------------------
const CATALOGUE_API_URL = 'https://script.google.com/macros/s/AKfycbwKHAzFLyO2aDle1-5CGdXenYhwi5lgI655qoVMVfsq8s1SD6yrXyIfzzJJQC9Lepd4vw/exec'

const FILTERS = ['All', 'Suits', 'Agbada', 'Casual', 'Native Wear', 'Shoes', 'Accessories']

// How many skeleton cards to show while loading (desktop carousel shows ~3-4 at once)
const SKELETON_COUNT = 4

// ---------------------------------------------------------------------------
// Skeleton card — mirrors .cat-photo-card dimensions so layout doesn't jump
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="cat-photo-card cat-photo-card--skeleton">
      <div className="cat-skeleton-shimmer cat-skeleton-shimmer--img" />
      <div className="cat-photo-card__body">
        <div className="cat-skeleton-shimmer cat-skeleton-line cat-skeleton-line--label" />
        <div className="cat-skeleton-shimmer cat-skeleton-line cat-skeleton-line--name" />
        <div className="cat-skeleton-shimmer cat-skeleton-line cat-skeleton-line--price" />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="cat-carousel cat-carousel--skeleton">
      <div className="cat-carousel__track cat-carousel__track--skeleton">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div className="cat-carousel__item" key={i}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product Detail Modal
// ---------------------------------------------------------------------------
function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  function handleAddToCart() {
    addItem(product)
    onClose()
  }

  return (
    <div
      className="pmodal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <motion.div
        className="pmodal"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Close */}
        <button className="pmodal__close" type="button" onClick={onClose} aria-label="Close">✕</button>

        {/* Image panel */}
        <div
          className="pmodal__img"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Content panel */}
        <div className="pmodal__body">
          <p className="pmodal__category">{product.category}</p>
          <h2 className="pmodal__name">{product.name}</h2>
          <p className="pmodal__price">{product.price}</p>

          {product.description && (
            <p className="pmodal__desc">{product.description}</p>
          )}

          {product.details?.length > 0 && (
            <ul className="pmodal__details">
              {product.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}

          <button className="pmodal__cta" type="button" onClick={handleAddToCart}>
            Add to Cart & Customize
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Carousel — coverflow on desktop, scroll-snap + dots on mobile.
// ---------------------------------------------------------------------------
function Carousel({ children, onCardClick }) {
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  const [activeDot, setActiveDot] = useState(0)

  const items = Array.isArray(children) ? children : [children]
  const dotCount = items.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function updateScales() {
    const el = trackRef.current
    if (!el) return
    const trackRect = el.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2
    el.querySelectorAll('.cat-carousel__item').forEach((item) => {
      const r = item.getBoundingClientRect()
      const itemCenter = r.left + r.width / 2
      const dist = Math.abs(itemCenter - center)
      const norm = Math.min(dist / (trackRect.width / 2 + r.width / 2), 1)
      const scale = 1 - norm * 0.32
      const opacity = 1 - norm * 0.55
      item.style.transform = `scale(${scale})`
      item.style.opacity = opacity
      item.style.zIndex = String(Math.round((1 - norm) * 100))
    })
  }

  function scheduleUpdate() {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      updateScales()
      rafRef.current = null
    })
  }

  useEffect(() => {
    if (isMobile) return
    updateScales()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      el.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [children, isMobile])

  useEffect(() => {
    if (!isMobile) return
    const el = trackRef.current
    if (!el) return
    el.querySelectorAll('.cat-carousel__item').forEach((item) => {
      item.style.transform = ''
      item.style.opacity = ''
      item.style.zIndex = ''
    })
  }, [isMobile])

  function scrollByAmount(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.55, behavior: 'smooth' })
  }

  function onMobileScroll() {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) { setActiveDot(0); return }
    setActiveDot(Math.min(Math.round((el.scrollLeft / max) * (dotCount - 1)), dotCount - 1))
  }

  function scrollByCardMobile(dir) {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.querySelector('.cat-carousel__item--mobile')?.offsetWidth || 300
    el.scrollBy({ left: dir * (cardWidth + 12), behavior: 'smooth' })
  }

  if (isMobile) {
    return (
      <div className="cat-carousel cat-carousel--mobile">
        <div
          className="cat-carousel__track cat-carousel__track--mobile"
          ref={trackRef}
          onScroll={onMobileScroll}
        >
          {items.map((child, i) => (
            <div
              className="cat-carousel__item cat-carousel__item--mobile"
              key={child.key ?? i}
              onClick={() => onCardClick(child.key)}
            >
              {child}
            </div>
          ))}
        </div>

        {dotCount > 1 && (
          <div className="cat-carousel__dots">
            <button
              className="cat-carousel__arrow-btn"
              type="button"
              onClick={() => scrollByCardMobile(-1)}
              disabled={activeDot === 0}
              aria-label="Previous"
            >‹</button>
            <div className="cat-carousel__dot-track">
              {Array.from({ length: dotCount }).map((_, i) => (
                <div key={i} className={`cat-carousel__dot ${activeDot === i ? 'active' : ''}`} />
              ))}
            </div>
            <button
              className="cat-carousel__arrow-btn"
              type="button"
              onClick={() => scrollByCardMobile(1)}
              disabled={activeDot === dotCount - 1}
              aria-label="Next"
            >›</button>
          </div>
        )}

        <div className="cat-carousel__swipe-hint visible">
          <span className="cat-carousel__swipe-arrow">←</span>
          <span>Swipe to explore</span>
          <span className="cat-carousel__swipe-arrow">→</span>
        </div>
      </div>
    )
  }

  return (
    <div className="cat-carousel">
      <button
        className="cat-carousel__arrow cat-carousel__arrow--left"
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Scroll left"
      >‹</button>
      <div className="cat-carousel__track" ref={trackRef}>
        {items.map((child, i) => (
          <div
            className="cat-carousel__item"
            key={child.key ?? i}
            onClick={() => onCardClick(child.key)}
          >
            {child}
          </div>
        ))}
      </div>
      <button
        className="cat-carousel__arrow cat-carousel__arrow--right"
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Scroll right"
      >›</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Catalogue section
// ---------------------------------------------------------------------------
export default function Catalogue() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(CATALOGUE_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        if (data.success) {
          setProducts(data.products || [])
        } else {
          setError(data.error || 'Failed to load catalogue')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const filtered =
    active === 'All'
      ? products
      : products.filter(
          (p) => String(p.category).trim().toLowerCase() === active.trim().toLowerCase()
        )

  const handleCardClick = useCallback((productId) => {
    const product = products.find((p) => String(p.id) === String(productId))
    if (product) setSelectedProduct(product)
  }, [products])

  return (
    <section
      id="catalogue"
      className="catalogue-section"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* ── Section header ── */}
      <motion.div
        className="cat-header"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <p className="cat-label">The Collection</p>
        <h2 className="cat-heading">Our Designs</h2>
        <p className="cat-sub">
          Each piece is an argument for excellence — constructed, not assembled.
        </p>
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        className="cat-filters"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        viewport={{ once: true }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`cat-filter-btn ${active === f ? 'active' : ''} ${loading ? 'disabled' : ''}`}
            onClick={() => !loading && setActive(f)}
            disabled={loading}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* ── Carousel / Loading / Empty / Error ── */}
      {loading ? (
        <SkeletonRow />
      ) : error ? (
        <p className="cat-empty">Couldn't load the collection right now. Please refresh.</p>
      ) : filtered.length > 0 ? (
        <Carousel key={active} onCardClick={handleCardClick}>
          {filtered.map((product) => (
            <div key={product.id} className="cat-photo-card">
              <div
                className="cat-photo-card__img"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              {product.tag && (
                <span className="cat-photo-card__badge">{product.tag}</span>
              )}
              <div className="cat-photo-card__body">
                <div className="cat-photo-card__category">{product.category}</div>
                <div className="cat-photo-card__name">{product.name}</div>
                <div className="cat-photo-card__price">{product.price}</div>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="cat-empty">No pieces in this category yet.</p>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
