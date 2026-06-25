import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import './Measurements.css'

// ---------------------------------------------------------------------------
// ⚙️  Config
// ---------------------------------------------------------------------------
// Apps Script Web App URL (must end in /exec)
const MEASUREMENTS_API_URL = 'https://script.google.com/macros/s/AKfycbwKHAzFLyO2aDle1-5CGdXenYhwi5lgI655qoVMVfsq8s1SD6yrXyIfzzJJQC9Lepd4vw/exec'

// Formspree endpoint (notification only — doesn't block success)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzlnjea'

const MAX_FILE_MB = 1
const MAX_FILES = 2

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result) // full data URI: data:image/jpeg;base64,...
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const FIELD_DEFS = [
  { id: 'chest', label: 'Chest' },
  { id: 'waist', label: 'Waist' },
  { id: 'hips', label: 'Seat' },
  { id: 'height', label: 'Height' },
  { id: 'inseam', label: 'Inseam Length' },
  { id: 'shoulder', label: 'Shoulder Width' },
  { id: 'sleeve', label: 'Sleeve Length' },
  { id: 'neck', label: 'Neck Circumference' },
  { id: 'thigh', label: 'Thigh' },
]

export default function Measurements() {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    chest: '', waist: '', hips: '', height: '', inseam: '',
    shoulder: '', sleeve: '', neck: '', thigh: '',
    instructions: '',
  })
  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ active: false, label: '', pct: 0 })
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const fileInputRef = useRef(null)
  const dragAreaRef = useRef(null)

  function update(id, value) {
    setForm((f) => ({ ...f, [id]: value }))
  }

  const showToast = useCallback((msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 4000)
  }, [])

  function handleFiles(fileList) {
    const all = [...fileList]
    const valid = all.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024).slice(0, MAX_FILES)
    if (all.some((f) => f.size > MAX_FILE_MB * 1024 * 1024)) {
      showToast(`Images must be under ${MAX_FILE_MB}MB each.`)
    } else if (all.length > MAX_FILES) {
      showToast(`Max ${MAX_FILES} images allowed.`)
    }
    setFiles(valid)
    setPreviews(valid.map((f) => URL.createObjectURL(f)))
  }

  function onInputChange(e) {
    handleFiles(e.target.files)
  }

  function onDrop(e) {
    e.preventDefault()
    dragAreaRef.current?.classList.remove('drag-over')
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e) {
    e.preventDefault()
    dragAreaRef.current?.classList.add('drag-over')
  }

  function onDragLeave() {
    dragAreaRef.current?.classList.remove('drag-over')
  }

  const validate = useCallback(() => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.phone.trim() || !/^\+?[\d\s-]{7,15}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number.'
    }
    if (form.email.trim() && !isValidEmail(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    try {
      // Step 1 — convert images to base64 data URIs locally
      // These are stored directly in the sheet cell (no Drive/hosting needed)
      const encoded = [] // ['data:image/jpeg;base64,...', ...]
      if (files.length > 0) {
        setProgress({ active: true, label: `Processing ${files.length} image(s)…`, pct: 10 })
        for (let i = 0; i < files.length; i++) {
          const dataUri = await fileToBase64(files[i])
          encoded.push(dataUri)
          setProgress({ active: true, label: `Processing image ${i + 1} of ${files.length}…`, pct: Math.round(10 + ((i + 1) / files.length) * 50) })
        }
      }

      // Step 2 — submit form data + base64 images to Apps Script → Google Sheets
      // No Content-Type header — avoids CORS preflight that Apps Script cannot handle
      setProgress((p) => ({ ...p, label: 'Saving to sheet…', pct: 70 }))

      const res = await fetch(MEASUREMENTS_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submitMeasurement',
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || '',
          measurements: Object.fromEntries(FIELD_DEFS.map((f) => [f.id, form[f.id] || ''])),
          instructions: form.instructions.trim() || '',
          images: encoded, // array of data URI strings — stored as-is in sheet
        }),
      })

      const text = await res.text()
      let data
      try { data = JSON.parse(text) }
      catch { throw new Error('Unexpected server response: ' + text.slice(0, 120)) }
      if (!data.success) throw new Error(data.error || 'Sheet save failed')

      setProgress({ active: true, label: 'Done ✓', pct: 100 })

      // Step 3 — Formspree email notification
      // Fires after sheet save succeeds. Uses await so errors are caught properly.
      const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'Full Name': form.fullName.trim(),
          Phone: form.phone.trim(),
          Email: form.email.trim() || '(not provided)',
          ...Object.fromEntries(FIELD_DEFS.map((f) => [f.label, form[f.id] || '—'])),
          'Special Instructions': form.instructions.trim() || '(none)',
          'Images Attached': encoded.length > 0 ? `${encoded.length} image(s) submitted` : '(none)',
        }),
      })
      if (!formspreeRes.ok) {
        // Log but don't throw — sheet already saved, that's the source of truth
        console.warn('Formspree notification failed with status:', formspreeRes.status)
      }

      // Step 4 — success state + reset
      setSubmitting(false)
      setProgress({ active: false, label: '', pct: 0 })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 6000)
      setForm({
        fullName: '', phone: '', email: '',
        chest: '', waist: '', hips: '', height: '', inseam: '',
        shoulder: '', sleeve: '', neck: '', thigh: '',
        instructions: '',
      })
      setFiles([])
      setPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (err) {
      console.error('Submission error:', err)
      setSubmitting(false)
      setProgress({ active: false, label: '', pct: 0 })
      showToast('Submission failed: ' + err.message)
    }
  }, [form, files, validate, showToast])

  return (
    <section id="measurements" className="measurements" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="measurements-bg" />
      <div className="measurements-container">
        <motion.div
          className="meas-intro"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">Bespoke Service</span>
          <h2>Your Exact<br /><em>Fit. Your Terms.</em></h2>
          <p>
            Submit your measurements and we engineer a garment built precisely
            to your frame. No approximations. No compromises. Just structure
            that moves with you.
          </p>
        </motion.div>

        <motion.form
          className="measurement-form"
          noValidate
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="form-section-title">Personal Information</div>
          <div className="form-row">
            <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
              <input
                type="text" placeholder=" " required
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
              <label>Full Name *</label>
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>
            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <input
                type="tel" placeholder=" " required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
              <label>Phone Number *</label>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group full ${errors.email ? 'has-error' : ''}`}>
              <input
                type="email" placeholder=" "
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
              <label>Email Address</label>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-divider" />
          <div className="form-section-title">
            Body Measurements <span className="unit-hint">(in centimetres)</span>
          </div>

          {[FIELD_DEFS.slice(0, 3), FIELD_DEFS.slice(3, 6), FIELD_DEFS.slice(6, 9)].map((group, gi) => (
            <div className="form-row meas-row" key={gi}>
              {group.map((f) => (
                <div className="form-group" key={f.id}>
                  <input
                    type="number" placeholder=" " min="1"
                    value={form[f.id]}
                    onChange={(e) => update(f.id, e.target.value)}
                  />
                  <label>{f.label}</label>
                </div>
              ))}
            </div>
          ))}

          <div className="form-divider" />
          <div className="form-section-title">Additional Details</div>
          <div className="form-group full">
            <textarea
              placeholder=" " rows={4}
              value={form.instructions}
              onChange={(e) => update('instructions', e.target.value)}
            />
            <label>Special Instructions / Design Notes</label>
          </div>

          {/* Image Upload */}
          <div
            className="file-upload-area"
            ref={dragAreaRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file" accept="image/*" multiple
              onChange={onInputChange}
            />
            <div className="upload-inner">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Upload reference images or fabric swatches</p>
              <span>PNG, JPG, WEBP · max {MAX_FILE_MB}MB · up to {MAX_FILES} images</span>
            </div>
            {previews.length > 0 && (
              <div className="upload-preview">
                {previews.map((src, i) => (
                  <img key={i} className="preview-thumb" src={src} alt="" />
                ))}
              </div>
            )}
          </div>

          {progress.active && (
            <div className="upload-progress">
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progress.pct}%` }} />
              </div>
              <span className="progress-label">{progress.label}</span>
            </div>
          )}

          <button type="submit" className="meas-submit-btn" disabled={submitting}>
            <span>{submitting ? 'Submitting…' : 'Submit My Measurements'}</span>
            {!submitting && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
            {submitting && (
              <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
              </svg>
            )}
          </button>

          {success && (
            <div className="form-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Measurements received. We'll be in touch shortly.</span>
            </div>
          )}
        </motion.form>
      </div>

      <div className={`meas-toast ${toast.visible ? 'visible' : ''}`}>{toast.msg}</div>
    </section>
  )
}