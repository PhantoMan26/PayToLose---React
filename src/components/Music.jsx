import { useEffect, useRef, useState } from 'react'
import { tracks } from '../data/tracks.js'

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

export default function Music() {
  const audioRef = useRef(null)
  const wantPlay = useRef(false)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [filter, setFilter] = useState('')
  const [showLyrics, setShowLyrics] = useState(true)
  const lyricsRef = useRef(null)

  const artists = [...new Set(tracks.map((t) => t.artist))]
  const track = tracks[current]
  const lyrics = track?.lyrics || null

  // Időzített dalszövegnél az éppen aktív sor indexe
  let activeLine = -1
  if (lyrics?.synced) {
    for (let i = 0; i < lyrics.lines.length; i++) {
      if (lyrics.lines[i].time <= time + 0.15) activeLine = i
      else break
    }
  }

  // Szám váltásakor a dalszöveg az elejére ugrik
  useEffect(() => {
    if (lyricsRef.current) lyricsRef.current.scrollTop = 0
  }, [current])

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
  }, [activeLine, current, showLyrics])

  useEffect(() => {
    const a = audioRef.current
    if (!a || !track) return
    a.load()
    setTime(0)
    if (wantPlay.current) a.play().catch(() => setPlaying(false))
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  if (tracks.length === 0) {
    return (
      <section id="music" className="music-section">
        <h1>Pay To Lose Zenék</h1>
        <p className="muted center">
          Még nincs zene. Tegyetek „Előadó - Szám címe.mp3” nevű fájlokat az src/assets/music mappába.
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

  const go = (i) => {
    wantPlay.current = true
    if (i === current) {
      const a = audioRef.current
      a.currentTime = 0
      a.play().catch(() => {})
    } else {
      setCurrent(i)
    }
  }

  const next = () => go((current + 1) % tracks.length)
  const prev = () => {
    const a = audioRef.current
    if (a && a.currentTime > 3) a.currentTime = 0
    else go((current - 1 + tracks.length) % tracks.length)
  }

  const clickRow = (i) => (i === current ? toggle() : go(i))

  return (
    <section id="music" className="music-section">
      <h1>Pay To Lose Zenék</h1>

      <div className="music-wrap">
        <div className="player">
          <div className="player-now">
            <div>
              <div className="player-title">{track.title}</div>
              <div className="player-artist">{track.artist}</div>
            </div>
            <span className="muted">{current + 1} / {tracks.length}</span>
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

        {artists.length > 1 && (
          <div className="track-filter">
            <button className={!filter ? 'chip active' : 'chip'} onClick={() => setFilter('')}>
              Mind
            </button>
            {artists.map((a) => (
              <button
                key={a}
                className={filter === a ? 'chip active' : 'chip'}
                onClick={() => setFilter(filter === a ? '' : a)}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        <ul className="track-list">
          {tracks.map((t, i) =>
            filter && t.artist !== filter ? null : (
              <li
                key={t.id}
                className={i === current ? 'track-item active' : 'track-item'}
                onClick={() => clickRow(i)}
              >
                <span className="track-num">
                  {i === current && playing ? (
                    <span className="eq" aria-hidden="true"><span /><span /><span /></span>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="track-name">{t.title}</span>
                <span className="track-artist">{t.artist}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  )
}
