import { Link } from 'react-router-dom'

export default function NotFound({ text = 'Ez az oldal nem található.' }) {
  return (
    <main className="profile">
      <div className="profile-inner notfound">
        <h1>404</h1>
        <p>{text}</p>
        <Link to="/" className="back-link">← Vissza a főoldalra</Link>
      </div>
    </main>
  )
}
