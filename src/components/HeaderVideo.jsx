import { site } from '../data/site.js'

const HeaderVideo = () => {
  const videoId = new URL(site.hero.video).searchParams.get('v');

  return (
    <header className="hero">
      <iframe
        className="hero-video"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&playsinline=1`}
        title="Hero videó"
        allow="autoplay; encrypted-media"
        tabIndex="-1"
      />
    </header>
  );
};

export default HeaderVideo;