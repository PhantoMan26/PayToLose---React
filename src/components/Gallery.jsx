import { useEffect, useRef, useState } from 'react'

// A képek az src/assets/gallery mappából töltődnek be.
// Almappák kategóriák lesznek (pl. src/assets/gallery/Nyaralás/kep1.jpg), a közvetlenül
// a gallery mappában lévő képek kategória nélküliek.
const files = import.meta.glob('../assets/gallery/**/*.{jpg,jpeg,png,webp,gif,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const safeDecode = (s) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

const photos = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, 'hu', { numeric: true }))
  .map(([path, src]) => {
    const rel = path.split('/assets/gallery/')[1] || ''
    const parts = rel.split('/')
    return {
      id: path,
      src,
      category: parts.length > 1 ? safeDecode(parts[0]) : '',
    }
  })

const categories = [...new Set(photos.map((p) => p.category).filter(Boolean))]

export default function Gallery() {
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(null)
  const touchX = useRef(null)

  const visible = filter ? photos.filter((p) => p.category === filter) : photos

  const move = (dir) => setOpen((i) => (i + dir + visible.length) % visible.length)

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowLeft') move(-1)
      if (e.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, visible.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const changeFilter = (value) => {
    setFilter(value)
    setOpen(null)
  }

  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1)
  }

  if (photos.length === 0) {
    return (
      <section id="gallery" className="gallery-section">
        <h1>Pay To Lose Galéria</h1>
        <p className="muted center">
          Még nincs kép. Tegyetek képeket az src/assets/gallery mappába.
        </p>
      </section>
    )
  }

  const current = open !== null ? visible[open] : null

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-inner">
        <h1>Pay To Lose Galéria</h1>

        {categories.length > 0 && (
          <div className="gallery-filter">
            <button className={!filter ? 'chip active' : 'chip'} onClick={() => changeFilter('')}>
              Mind
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={filter === c ? 'chip active' : 'chip'}
                onClick={() => changeFilter(filter === c ? '' : c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="gallery-grid">
          {visible.map((p, i) => (
            <button
              key={p.id}
              className="gallery-item"
              onClick={() => setOpen(i)}
              aria-label={`Kép megnyitása (${i + 1}/${visible.length})`}
            >
              <img src={p.src} alt="" loading="lazy" decoding="async" />
              {p.category && <span className="gallery-tag">{p.category}</span>}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          className="lb"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          <button className="lb-close" aria-label="Bezárás" onClick={() => setOpen(null)}>×</button>
          <button aria-label="Előző" onClick={(e) => { e.stopPropagation(); move(-1) }}>‹</button>
          <img src={current.src} alt="" onClick={(e) => e.stopPropagation()} />
          <button aria-label="Következő" onClick={(e) => { e.stopPropagation(); move(1) }}>›</button>
          <div className="lb-cap">
            {open + 1} / {visible.length}
            {current.category ? ` · ${current.category}` : ''}
          </div>
        </div>
      )}
    </section>
  )
}
