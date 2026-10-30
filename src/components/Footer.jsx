import { Link } from 'react-router-dom'
import HeaderLogo from '../assets/PayToLoseWhiteRed.png'
import { site } from '../data/site.js'

export default function Footer() {
  const socials = Object.entries(site.socials || {}).filter(([, url]) => url)
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={HeaderLogo} alt={`${site.name} logó`} />
          <p className="footer-tag">{site.tagline}</p>
        </div>

        <nav className="footer-col" aria-label="Oldaltérkép">
          <h4>Oldalak</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/story">Történetünk</Link></li>
            <li><Link to="/#members">Members</Link></li>
            <li><Link to="/#videos">Videos</Link></li>
            <li><Link to="/#gallery">Gallery</Link></li>
            <li><Link to="/#music">Music</Link></li>
          </ul>
        </nav>

        {socials.length > 0 && (
          <div className="footer-col">
            <h4>Kövess minket</h4>
            <ul>
              {socials.map(([label, url]) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noreferrer">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer-bottom">
        <span>© {year} {site.name} · {site.credit}</span>
        <button
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ Fel
        </button>
      </div>
    </footer>
  )
}
