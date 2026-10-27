import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Oldalváltáskor felgörget az oldal tetejére, "/#valami" linknél pedig a megfelelő szekcióhoz.
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        clearInterval(timer)
      } else if (++tries > 30) {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [pathname, hash, key])

  return null
}
