import { useEffect, useRef, useState } from 'react'
import { albums } from '../data/tracks.js'

const fmt = (s) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${r}`
}

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
)
const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z'
const PREV = 'M6 6h2v12H6zM9.5 12l8.5 6V6z'
const NEXT = 'M16 6h2v12h-2zM6 18l8.5-6L6 6z'

// Album borító; ha nincs kép, egy színes helyettesítő jelenik meg
function Cover({ album, className }) {
  return album.cover ? (
    <img className={className} src={album.cover} alt={`${album.title} borítója`} loading="lazy" />
  ) : (
    <div className={`${className} cover-ph`} aria-hidden="true">♪</div>
  )
}

export default function Music() {
  const audioRef = useRef(null)
  const wantPlay = useRef(false)
  const lyricsRef = useRef(null)

  const [viewId, setViewId] = useState(albums[0]?.id)
  const [playAlbumId, setPlayAlbumId] = useState(albums[0]?.id)
  const [playIndex, setPlayIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [showLyrics, setShowLyrics] = useState(true)

  const viewAlbum = albums.find((a) => a.id === viewId) || albums[0]
  const playAlbum = albums.find((a) => a.id === playAlbumId) || albums[0]
  const queue = playAlbum?.tracks || []
  const track = queue[playIndex]
  const lyrics = track?.lyrics || null

  // Időzített dalszövegnél az éppen aktív sor indexe
  let activeLine = -1
  if (lyrics?.synced) {
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= time + 0.15) activeLine = i
      else break
    }
  }

  // Új szám betöltése
  useEffect(() => {
    const a = audioRef.current
    if (!a || !track) return
    a.load()
    setTime(0)
    if (wantPlay.current) a.play().catch(() => setPlaying(false))
  }, [track?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Szám váltásakor a dalszöveg az elejére ugrik
  useEffect(() => {
    if (lyricsRef.current) lyricsRef.current.scrollTop = 0
  }, [track?.id])

  // Az aktív sor középre görget (csak a dalszöveg-dobozon belül, az oldalt nem mozgatja)
  useEffect(() => {
    const box = lyricsRef.current
    if (!box || activeLine < 0) return
    const el = box.querySelector('[data-active="true"]')
    if (!el) return
    box.scrollTo({
      top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2,
      behavior: 'smooth',
    })
  }, [activeLine, track?.id, showLyrics])

  if (!albums.length) {
    return (
      <section id="music" className="music-section">
        <h1>Pay To Lose Zenék</h1>
        <p className="muted center">
          Még nincs zene. Tegyetek egy albummappát („Album neve”) az src/assets/music mappába, benne
          „Előadó - Szám címe.mp3” nevű fájlokkal és egy cover.jpg borítóval.
        </p>
      </section>
    )
  }

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    wantPlay.current = true
    if (a.paused) a.play().catch(() => setPlaying(false))
    else a.pause()
  }

  const go = (albumId, index) => {
    wantPlay.current = true
    if (albumId === playAlbumId && index === playIndex) {
      const a = audioRef.current
      a.currentTime = 0
      a.play().catch(() => {})
    } else {
      setPlayAlbumId(albumId)
      setPlayIndex(index)
    }
  }

  const next = () => go(playAlbumId, (playIndex + 1) % queue.length)
  const prev = () => {
    const a = audioRef.current
    if (a && a.currentTime > 3) a.currentTime = 0
    else go(playAlbumId, (playIndex - 1 + queue.length) % queue.length)
  }

  const viewIsPlaying = viewAlbum.id === playAlbumId
  const clickRow = (i) => (viewIsPlaying && i === playIndex ? toggle() : go(viewAlbum.id, i))

  const albumButtonLabel = viewIsPlaying
    ? playing
      ? 'Szünet'
      : time > 0
        ? 'Folytatás'
        : 'Album lejátszása'
    : 'Album lejátszása'

  const progress = duration ? Math.min(1, time / duration) : 0
  const started = playing || time > 0
  const sleeveClass =
    'album-art' + (viewIsPlaying && started ? ' out' : '') + (viewIsPlaying && playing ? ' spinning' : '')

  return (
    <section id="music" className="music-section">
      <h1>Pay To Lose Zenék</h1>

      <div className="music-wrap">
        {albums.length > 1 && (
          <div className="album-strip" role="tablist" aria-label="Albumok">
            {albums.map((al) => (
              <button
                key={al.id}
                role="tab"
                aria-selected={al.id === viewAlbum.id}
                className={al.id === viewAlbum.id ? 'album-chip active' : 'album-chip'}
                onClick={() => setViewId(al.id)}
              >
                <Cover album={al} className="thumb" />
                <span>
                  {al.title}
                  <small> · {al.tracks.length} szám</small>
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="album-view">
          <div className={sleeveClass}>
            <div className="sleeve">
              <div className="vinyl-slide">
                <div className="vinyl" />
              </div>
              <Cover album={viewAlbum} className="album-cover" />
            </div>
          </div>

          <div className="album-meta">
            <p className="album-kicker">Album</p>
            <h2 className="album-title">{viewAlbum.title}</h2>
            <p className="album-sub">
              {viewAlbum.artists.join(', ')} · {viewAlbum.tracks.length} szám
            </p>
            <button
              className="album-play"
              onClick={viewIsPlaying ? toggle : () => go(viewAlbum.id, 0)}
            >
              <Icon d={viewIsPlaying && playing ? PAUSE : PLAY} />
              {albumButtonLabel}
            </button>

            <ol className="track-list">
              {viewAlbum.tracks.map((t, i) => {
                const active = viewIsPlaying && i === playIndex
                return (
                  <li
                    key={t.id}
                    className={active ? 'track-item active' : 'track-item'}
                    onClick={() => clickRow(i)}
                  >
                    <span className="track-num">
                      {active && playing ? (
                        <span className="eq" aria-hidden="true"><span /><span /><span /></span>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="track-name">{t.title}</span>
                    {viewAlbum.artists.length > 1 && <span className="track-artist">{t.artist}</span>}
                    {t.lyrics && <span className="track-lyr" title="Van dalszöveg">Aa</span>}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="player">
          <div className={playing ? 'cassette running' : 'cassette'} style={{ '--p': progress }}>
            <div className="cassette-label">
              <div className="cl-top">
                <span>Side A</span>
                <span>{playIndex + 1} / {queue.length}</span>
              </div>
              <div className="cl-title">{track.title}</div>
              <div className="cl-artist">
                {track.artist}
                <span> · {playAlbum.title}</span>
              </div>
            </div>
            <div className="cassette-window" aria-hidden="true">
              <div className="reel left"><div className="roll"><div className="hub" /></div></div>
              <div className="tape-line" />
              <div className="reel right"><div className="roll"><div className="hub" /></div></div>
            </div>
          </div>

          <div className="seek-row">
            <span>{fmt(time)}</span>
            <input
              className="seek"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={time}
              aria-label="Tekerés"
              onChange={(e) => {
                audioRef.current.currentTime = Number(e.target.value)
                setTime(Number(e.target.value))
              }}
            />
            <span>{fmt(duration)}</span>
          </div>

          <div className="player-controls">
            <button className="ctrl" onClick={prev} aria-label="Előző szám"><Icon d={PREV} /></button>
            <button className="ctrl play" onClick={toggle} aria-label={playing ? 'Szünet' : 'Lejátszás'}>
              <Icon d={playing ? PAUSE : PLAY} />
            </button>
            <button className="ctrl" onClick={next} aria-label="Következő szám"><Icon d={NEXT} /></button>
            <label className="volume">
              <span>Hang</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Hangerő"
              />
            </label>
          </div>

          <div className="lyrics-bar">
            {lyrics ? (
              <button className="chip" onClick={() => setShowLyrics((v) => !v)}>
                {showLyrics ? 'Dalszöveg elrejtése' : 'Dalszöveg megjelenítése'}
              </button>
            ) : (
              <span className="muted lyrics-none">Ehhez a számhoz még nincs dalszöveg.</span>
            )}
            {lyrics?.synced && showLyrics && (
              <span className="muted lyrics-hint">Kattints egy sorra, és odaugrik.</span>
            )}
          </div>

          {lyrics && showLyrics && (
            <div
              ref={lyricsRef}
              className={lyrics.synced ? 'lyrics synced' : 'lyrics'}
              aria-label="Dalszöveg"
            >
              {lyrics.lines.map((line, i) => {
                const isActive = lyrics.synced && i === activeLine
                const empty = !line.text
                return (
                  <p
                    key={i}
                    data-active={isActive}
                    className={
                      'lyric-line' +
                      (isActive ? ' active' : '') +
                      (lyrics.synced && i < activeLine ? ' past' : '') +
                      (lyrics.synced ? ' clickable' : '')
                    }
                    onClick={
                      lyrics.synced
                        ? () => {
                            audioRef.current.currentTime = line.time
                            setTime(line.time)
                          }
                        : undefined
                    }
                  >
                    {empty ? (lyrics.synced ? '♪' : ' ') : line.text}
                  </p>
                )
              })}
            </div>
          )}

          <audio
            ref={audioRef}
            src={track.src}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={next}
          />
        </div>
      </div>
    </section>
  )
}
