import { useState, useEffect } from 'react'
import './Loader.css'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  useEffect(() => {
    // Match the vanilla site: bar animation is 2s, then fade out
    const hideTimer = setTimeout(() => setHidden(true), 2200)
    // Remove from DOM after fade completes (0.8s transition)
    const unmountTimer = setTimeout(() => setUnmounted(true), 3000)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (unmounted) return null

  return (
    <div id="loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-inner">
        <span className="loader-brand">DON ELCLASICO</span>
        <div className="loader-bar">
          <div className="loader-fill" />
        </div>
        <span className="loader-sub">Atelier for Men</span>
      </div>
    </div>
  )
}
