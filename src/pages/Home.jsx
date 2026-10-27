import HeaderVideo from '../components/HeaderVideo.jsx'
import Quote from '../components/Quote.jsx'
import Cards from '../components/Cards.jsx'
import Videos from '../components/Videos.jsx'
import Gallery from '../components/Gallery.jsx'
import Music from '../components/Music.jsx'
import { members } from '../data/members.js'

export default function Home() {
  return (
    <>
      <HeaderVideo />
      <Quote />
      <div className="container" id="members">
        <div className="image-container">
          {members.map((m) => (
            <Cards key={m.slug} {...m} />
          ))}
        </div>
      </div>
      <div id="videos">
        <Videos />
      </div>
      <Gallery />
      <Music />
    </>
  )
}
