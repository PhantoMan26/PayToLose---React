import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderLogo from '../assets/PayToLoseWhiteRed.png'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  // Navigáláskor a mobil menü becsukódik
  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  // Esc bezárja, és nyitott menünél az oldal háttere nem görgethető
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div>
      <header className={open ? 'header menu-open' : 'header'}>
        <div className="header-logo">
          <Link to="/">
            <img src={HeaderLogo} alt="Pay To Lose Logo" />
          </Link>
        </div>

        <button
          className="burger"
          aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="main-nav" className={open ? 'nav open' : 'nav'}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/story">Story</Link></li>
            <li><Link to="/#members">Members</Link></li>
            <li><Link to="/#videos">Videos</Link></li>
            <li><Link to="/#gallery">Gallery</Link></li>
            <li><Link to="/#music">Music</Link></li>
          </ul>
        </nav>
      </header>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  )
}
