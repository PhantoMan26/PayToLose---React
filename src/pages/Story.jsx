import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { intro, chapters } from '../data/story.js'

// Görgetéskor a lapok beúsznak. Ha nincs IntersectionObserver, minden azonnal látszik.
function useRevealAll(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    items.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [ref])
}

export default function Story() {
  const rootRef = useRef(null)
  useRevealAll(rootRef)

  useEffect(() => {
    const prev = document.title
    document.title = 'A történetünk | Pay To Lose'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <main className="story" ref={rootRef}>
      <header className="story-intro">
        <p className="story-kicker">{intro.kicker}</p>
        <h1 className="story-title">{intro.title}</h1>
        <p className="story-lead">{intro.text}</p>
      </header>

      <ol className="timeline">
        {chapters.map((c, i) => {
          const paragraphs = Array.isArray(c.text) ? c.text : [c.text]
          return (
            <li key={i} className={i % 2 ? 'tl-item right' : 'tl-item left'}>
              <span className="tl-dot" aria-hidden="true" />
              <article className="tl-card" data-reveal>
                <div className="tl-date">{c.date}</div>
                <h2 className="tl-heading">{c.title}</h2>
                {c.image && <img className="tl-img" src={c.image} alt="" loading="lazy" />}
                {paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {c.stamp && <span className="tl-stamp">{c.stamp}</span>}
              </article>
            </li>
          )
        })}
      </ol>

      <div className="story-end">
        <p>Nézd meg, mit hoztunk ki belőle:</p>
        <div className="story-links">
          <Link to="/#videos">Videók</Link>
          <Link to="/#music">Zenék</Link>
          <Link to="/#gallery">Galéria</Link>
        </div>
      </div>
    </main>
  )
}
