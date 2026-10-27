import Video from '../assets/background.mp4';

const HeaderVideo = () => {
  return (
    <header className="hero">
      <video autoPlay muted loop className="hero-video">
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </header>
  );
};

export default HeaderVideo;