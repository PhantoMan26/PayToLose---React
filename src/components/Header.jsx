import { Link } from 'react-router-dom'
import HeaderLogo from '../assets/PayToLoseWhiteRed.png'

export default function Header() {
  return (
    <div>
      <header className="header">
        <div className="header-logo">
          <Link to="/">
            <img src={HeaderLogo} alt="Pay To Lose Logo" />
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="#members">Members</Link></li>
            <li><Link to="#videos">Videos</Link></li>
            <li><Link to="#music">Music</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  )
}
