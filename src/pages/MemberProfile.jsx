import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { members } from '../data/members.js'
import { tracksBy } from '../data/tracks.js'
import NotFound from './NotFound.jsx'

// A haver saját képei: src/assets/members/<slug>/*.jpg
const photoFiles = import.meta.glob('../assets/members/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const photosOf = (slug) =>
  Object.entries(photoFiles)
    .filter(([path]) => path.split('/').slice(-2, -1)[0].toLowerCase() === slug)
    .map(([, url]) => url)

export default function MemberProfile() {
  const { slug } = useParams()
  const index = members.findIndex((m) => m.slug === slug)
  const member = members[index]
  const [open, setOpen] = useState(null)

  const photos = member ? photosOf(member.slug) : []
  const tracks = member ? tracksBy(member.name) : []

  useEffect(() => {
    if (!member) return
    const prev = document.title
    document.title = `${member.name} | Pay To Lose`
    return () => {
      document.title = prev
    }
  }, [member])

  useEffect(() => {
    setOpen(null)
  }, [slug])

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, photos.length])

  if (!member) return <NotFound text="Nincs ilyen haver a bandában." />

  const prevMember = members[(index - 1 + members.length) % members.length]
  const nextMember = members[(index + 1) % members.length]
  const links = Object.entries(member.links || {}).filter(([, url]) => url)

  const move = (dir) => setOpen((i) => (i + dir + photos.length) % photos.length)

  return (
    <main className="profile">
      <div className="profile-inner">
        <Link to="/#members" className="back-link">← Vissza a haverokhoz</Link>

        <section className="profile-top">
          <img className="profile-photo" src={member.image} alt={member.name} />

          <div className="profile-info">
            {member.nickname && <p className="profile-nick">{member.nickname}</p>}
            <h1 className="profile-name">{member.name}</h1>

            <div className="stat-row">
              {member.role && (
                <div className="stat-pill">
                  <span>Szerep</span>
                  <strong>{member.role}</strong>
                </div>
              )}
              {member.stat && (
                <div className="stat-pill">
                  <span>Stat</span>
                  <strong>{member.stat}</strong>
                </div>
              )}
              <div className="stat-pill">
                <span>Zenék</span>
                <strong>{tracks.length}</strong>
              </div>
            </div>

            {member.bio && <p className="profile-bio">{member.bio}</p>}

            {links.length > 0 && (
              <div className="profile-links">
                {links.map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {member.quotes?.length > 0 && (
          <section className="profile-section">
            <h2>Kedvenc idézetek</h2>
            {member.quotes.map((q, i) => (
              <blockquote key={i} className="profile-quote">“{q}”</blockquote>
            ))}
          </section>
        )}

        <section className="profile-section">
          <h2>Zenék</h2>
          {tracks.length === 0 ? (
            <p className="muted">
              Még nincs feltöltött zene. Tegyél egy „{member.name} - Szám címe.mp3” nevű fájlt az
              src/assets/music mappába.
            </p>
          ) : (
            <ul className="profile-tracks">
              {tracks.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <audio controls preload="none" src={t.src} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="profile-section">
          <h2>Képek</h2>
          {photos.length === 0 ? (
            <p className="muted">
              Még nincs kép. Tegyél képeket az src/assets/members/{member.slug}/ mappába.
            </p>
          ) : (
            <div className="profile-gallery">
              {photos.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${member.name} – kép ${i + 1}`}
                  loading="lazy"
                  onClick={() => setOpen(i)}
                />
              ))}
            </div>
          )}
        </section>

        <nav className="profile-nav">
          <Link to={`/member/${prevMember.slug}`}>← {prevMember.name}</Link>
          <Link to={`/member/${nextMember.slug}`}>{nextMember.name} →</Link>
        </nav>
      </div>

      {open !== null && (
        <div className="lb" onClick={() => setOpen(null)}>
          <button aria-label="Előző" onClick={(e) => { e.stopPropagation(); move(-1) }}>‹</button>
          <img src={photos[open]} alt="" onClick={(e) => e.stopPropagation()} />
          <button aria-label="Következő" onClick={(e) => { e.stopPropagation(); move(1) }}>›</button>
        </div>
      )}
    </main>
  )
}
