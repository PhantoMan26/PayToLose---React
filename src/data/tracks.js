// A zenék automatikusan betöltődnek az src/assets/music mappából.
// Fájlnév formátum:  Előadó - Szám címe.mp3   (pl. "Lo_Benya - Éjféli bukás.mp3")
// Ha nincs " - " a névben, az előadó "Ismeretlen" lesz.
//
// Dalszöveg: ugyanazzal a névvel, .txt vagy .lrc kiterjesztéssel, ugyanabba a mappába.
//   "Lo_Benya - Éjféli bukás.txt"  -> sima dalszöveg
//   "Lo_Benya - Éjféli bukás.lrc"  -> időzített dalszöveg ([perc:másodperc.század] sor)
// Ha mindkettő megvan, az .lrc élvez elsőbbséget.

const files = import.meta.glob('../assets/music/*.{mp3,wav,ogg,m4a,aac,flac}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const lyricFiles = import.meta.glob('../assets/music/*.{txt,lrc}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const stripExt = (path) => path.replace(/\.[^.]+$/, '')

// Időzített (LRC) dalszöveg: [01:23.45] szöveg
function parseLrc(text) {
  const lines = []
  for (const raw of text.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)]
    if (!stamps.length) continue
    const content = raw.replace(/\[[^\]]*\]/g, '').trim()
    for (const m of stamps) {
      lines.push({ time: Number(m[1]) * 60 + Number(m[2]), text: content })
    }
  }
  return lines.sort((a, b) => a.time - b.time)
}

// Sima dalszöveg: minden sor egy sor, a végi üres sorokat levágjuk
function parsePlain(text) {
  const lines = text.split(/\r?\n/).map((t) => ({ time: null, text: t.trimEnd() }))
  while (lines.length && !lines[lines.length - 1].text) lines.pop()
  return lines
}

// base név -> { synced, lines }
const lyricsByBase = {}
for (const [path, raw] of Object.entries(lyricFiles)) {
  const base = stripExt(path)
  const text = String(raw).replace(/^﻿/, '')
  const isLrc = path.toLowerCase().endsWith('.lrc')
  const lines = isLrc ? parseLrc(text) : parsePlain(text)
  if (!lines.length) continue
  if (isLrc || !lyricsByBase[base]) {
    lyricsByBase[base] = { synced: isLrc, lines }
  }
}

function parseTrack(path, url) {
  const file = decodeURIComponent(path.split('/').pop())
  const base = file.replace(/\.[^.]+$/, '')
  const parts = base.split(' - ')
  const hasArtist = parts.length > 1
  return {
    id: path,
    src: url,
    artist: hasArtist ? parts[0].trim() : 'Ismeretlen',
    title: (hasArtist ? parts.slice(1).join(' - ') : base).trim(),
    lyrics: lyricsByBase[stripExt(path)] || null,
  }
}

export const tracks = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, 'hu', { numeric: true }))
  .map(([path, url]) => parseTrack(path, url))

export const tracksBy = (name) =>
  tracks.filter((t) => t.artist.toLowerCase() === name.toLowerCase())
