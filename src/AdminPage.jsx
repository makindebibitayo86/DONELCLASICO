import { useState, useEffect, useCallback, useRef } from 'react'
import AdminNavbar from './components/AdminNavbar'
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
function MetricCard({ label, value }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</p>
      <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{value}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
      Loading…
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}>
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
function DashboardSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [records, setRecords] = useState([])

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

  if (loading) return <Spinner />
  if (error) return <ErrorBanner message={error} onRetry={load} />

  const activeCount = products.filter((p) => {
    const v = p.active
    return v === true || v === 1 || String(v).toUpperCase() === 'TRUE'
  }).length

  const categories = new Set(products.map((p) => p.category).filter(Boolean)).size

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Overview</h2>
        <GhostButton onClick={load}><Icon d={ICONS.refresh} size={14} /> Refresh</GhostButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <MetricCard label="Total Products"    value={products.length} />
        <MetricCard label="Active Products"   value={activeCount} />
        <MetricCard label="Categories"        value={categories} />
        <MetricCard label="Measurement Submissions" value={records.length} />
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
          Recent Measurement Submissions
        </p>
        {records.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)' }}>No submissions yet.</p>}
        {records.slice(-5).reverse().map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{r.full_name}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{r.phone_number}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Catalogue ─────────────────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  id: null, name: '', category: '', price: '', badge: '', image_url: '',
  description: '', features: '', sort_order: 0, active: true,
}

function CatalogueSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null) // null = closed, {} = new, obj = edit
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, sort_order, name_asc, price_asc, price_desc
  const itemsPerPage = 10

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

  // Apply sorting based on sortBy value
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Newest first (reverse of ID or insertion order)
        return (b.id || 0) - (a.id || 0)
      case 'oldest':
        return (a.id || 0) - (b.id || 0)
      case 'sort_order':
        return (a.sort_order || 0) - (b.sort_order || 0)
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'price_asc':
        return parseFloat(a.price || 0) - parseFloat(b.price || 0)
      case 'price_desc':
        return parseFloat(b.price || 0) - parseFloat(a.price || 0)
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
    if (!confirm('Delete this product?')) return
    try {
      await callApi('adminDeleteCatalogue', { id })
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIdx = (page - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIdx, endIdx)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Catalogue</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostButton onClick={load}><Icon d={ICONS.refresh} size={14} /> Refresh</GhostButton>
          <PrimaryButton onClick={() => setEditing({ ...EMPTY_PRODUCT })}><Icon d={ICONS.plus} size={14} /> Add Product</PrimaryButton>
        </div>
      </div>

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
          <option value="oldest">Oldest First</option>
          <option value="sort_order">Custom Order</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
        </select>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {loading ? <Spinner /> : (
        <>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Category', 'Price', 'Badge', 'Active', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>No products yet.</td></tr>
                )}
                {paginatedProducts.map((p) => {
                  const isActive = p.active === true || p.active === 1 || String(p.active).toUpperCase() === 'TRUE'
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{p.price}</td>
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
                      <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setEditing({ ...p })} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginRight: 8 }}>
                          <Icon d={ICONS.edit} size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
                          <Icon d={ICONS.trash} size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                Showing {startIdx + 1}–{Math.min(endIdx, sortedProducts.length)} of {sortedProducts.length} products
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
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
            </div>
          )}
        </>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit Product' : 'Add Product'} onClose={() => !saving && setEditing(null)}>
          <ProductForm product={editing} saving={saving} onSave={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  )
}

function ProductForm({ product, saving, onSave, onCancel }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
        <GhostButton type="button" onClick={onCancel} disabled={saving || uploading}>Cancel</GhostButton>
        <PrimaryButton type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save Product'}</PrimaryButton>
      </div>
    </form>
  )
}

// ── Measurements ──────────────────────────────────────────────────────────────
function MeasurementsSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [records, setRecords] = useState([])
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Measurements</h2>
        <GhostButton onClick={load}><Icon d={ICONS.refresh} size={14} /> Refresh</GhostButton>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {loading ? <Spinner /> : (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Phone', 'Email', 'Chest', 'Waist', 'Height', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>No submissions yet.</td></tr>
              )}
              {records.map((r) => (
                <tr key={r.rowIndex} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setViewing(r)}>{r.full_name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{r.phone_number}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <Modal title={viewing.full_name} onClose={() => setViewing(null)}>
          {[
            ['Phone', 'phone_number'], ['Email', 'email'], ['Chest', 'chest'], ['Waist', 'waist'],
            ['Seat', 'seat'], ['Height', 'height'], ['Inseam', 'inseam_length'], ['Shoulder', 'shoulder_width'],
            ['Sleeve', 'sleeve_length'], ['Neck', 'neck_circumference'], ['Thigh', 'thigh'], ['Notes', 'additional_details'],
          ].map(([label, key]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text)', textAlign: 'right', maxWidth: '70%' }}>{viewing[key] || '—'}</span>
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
function SectionContent({ active }) {
  switch (active) {
    case 'dashboard':    return <DashboardSection />
    case 'catalogue':    return <CatalogueSection />
    case 'measurements': return <MeasurementsSection />
    default:             return <DashboardSection />
  }
}

// ── Main AdminPage ────────────────────────────────────────────────────────────
function AdminPage() {
  const [isLight, setIsLight] = useState(() => localStorage.getItem('de_theme') === 'light')
  const [loggedIn, setLoggedIn] = useState(() => isAdminLoggedIn())
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('light', isLight)
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
    <>
      {/* ── CSS tokens ── */}
      <style>{`
        :root {
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
        }
        body.light {
          --bg:          #F4F1EC;
          --sidebar-bg:  #EDEAE4;
          --card-bg:     #FFFFFF;
          --elevated:    #E8E4DD;
          --border:      #D5CFC6;
          --text:        #1A1713;
          --muted:       #8A8480;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .admin-shell { display: flex; height: 100vh; overflow: hidden; }
        .sidebar {
          width: var(--sidebar-w); flex-shrink: 0;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: width 0.2s ease;
          overflow: hidden;
        }
        .sidebar.collapsed { width: var(--sidebar-w-sm); }
        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--accent); display: flex; align-items: center;
          justify-content: center; font-weight: 700; font-size: 14px;
          color: #fff; letter-spacing: -0.04em; flex-shrink: 0;
        }
        .logo-text { font-size: 15px; font-weight: 600; color: var(--text); white-space: nowrap; }
        .nav-list { list-style: none; padding: 12px 8px; flex: 1; }
        .nav-item button {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 9px 12px; border-radius: 8px; border: none; cursor: pointer;
          background: transparent; color: var(--muted);
          font-size: 13.5px; font-weight: 500; transition: all 0.15s ease;
          white-space: nowrap; overflow: hidden;
        }
        .nav-item button:hover { background: var(--elevated); color: var(--text); }
        .nav-item button.active { background: var(--accent-dim); color: var(--accent); }
        .nav-item button .nav-icon { flex-shrink: 0; }
        .sidebar-footer {
          padding: 12px 8px;
          border-top: 1px solid var(--border);
        }
        .sidebar-footer button {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 9px 12px; border-radius: 8px; border: none; cursor: pointer;
          background: transparent; color: var(--muted); font-size: 13.5px;
          font-weight: 500; transition: all 0.15s ease;
        }
        .sidebar-footer button:hover { background: var(--elevated); color: var(--text); }
        .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .topbar {
          height: 56px; flex-shrink: 0;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
          background: var(--sidebar-bg);
        }
        .topbar-left { display: flex; align-items: center; gap: 16px; }
        .topbar-title { font-size: 15px; font-weight: 600; color: var(--text); }
        .breadcrumb { font-size: 12px; color: var(--muted); font-family: var(--font-mono); }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .icon-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border);
          background: transparent; cursor: pointer; color: var(--muted);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease;
        }
        .icon-btn:hover { background: var(--elevated); color: var(--text); border-color: var(--accent); }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--accent-dim); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: var(--accent); cursor: pointer;
          flex-shrink: 0;
        }
        .content-area { flex: 1; overflow-y: auto; padding: 28px 32px; }
        @media (max-width: 768px) {
          .sidebar { width: var(--sidebar-w-sm); }
          .content-area { padding: 20px 16px; }
        }
      `}</style>

      <AdminNavbar isLight={isLight} onThemeToggle={() => setIsLight(v => !v)} onLogout={() => { localStorage.removeItem('de_admin_auth'); setLoggedIn(false) }} />

      <div className="admin-shell">
        {/* Sidebar */}
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="sidebar-logo">
            {!collapsed && <span className="logo-text">Control Panel</span>}
          </div>

          <ul className="nav-list">
            {NAV.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={active === item.id ? 'active' : ''}
                  onClick={() => setActive(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">
                    <Icon d={ICONS[item.icon]} size={18} />
                  </span>
                  {!collapsed && item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="sidebar-footer">
            <button onClick={() => setCollapsed(c => !c)} title="Toggle sidebar">
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
            </div>
          </header>

          <main className="content-area">
            <SectionContent active={active} />
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminPage
