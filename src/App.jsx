import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './components/CartContext'
import CartModal from './components/CartModal'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HeroMarquee from './components/HeroMarquee'
import Philosophy from './components/Philosophy'
import Catalogue from './components/Catalogue'
import Measurements from './components/Measurements'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import AdminPage from './AdminPage'

function MainSite({ isLight, setIsLight }) {
  return (
    <>
      <Loader />

      <Navbar
        isLight={isLight}
        onThemeToggle={() => setIsLight((v) => !v)}
      />

      <Hero />

      <HeroMarquee />

      <Philosophy />

      <Catalogue />

      <Measurements />

      <ContactSection />

      <Footer />
    </>
  )
}

function App() {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('de_theme') === 'light'
  })

  useEffect(() => {
    document.body.classList.toggle('light', isLight)
    localStorage.setItem('de_theme', isLight ? 'light' : 'dark')
  }, [isLight])

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainSite
                isLight={isLight}
                setIsLight={setIsLight}
              />
            }
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <CartModal />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
