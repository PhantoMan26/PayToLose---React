import { Link } from 'react-router-dom'

export default function Cards({ slug, name, image, nickname, role }) {
  return (
    <div>
      <Link to={`/member/${slug}`} className="card-link" aria-label={`${name} profilja`}>
        <div className="image">
          <div className="img-text">
            <h3>{name}</h3>
            {nickname && <p className="img-nick">{nickname}</p>}
            {role && <p>{role}</p>}
            <span className="img-hint">Profil megnyitása</span>
          </div>
          <img src={image} alt={name} />
        </div>
      </Link>
    </div>
  )
}