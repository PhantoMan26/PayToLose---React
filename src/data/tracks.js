// A zenék automatikusan betöltődnek az src/assets/music mappából.
//
// ALBUMOK: minden almappa egy album, a mappa neve az album címe.
//   src/assets/music/2025 - Pay To Lose Himnuszok/cover.jpg        <- borító (cover.jpg/png/webp,
//   src/assets/music/2025 - Pay To Lose Himnuszok/Lo_benya - P2L Himnusz.mp3     ha nincs ilyen nevű,
//   src/assets/music/2025 - Pay To Lose Himnuszok/Lo_benya - P2L Himnusz.lrc     az első kép lesz)
// Az albumok a mappanév szerint rendeződnek, ezért érdemes az évvel kezdeni a nevet.
// Az almappán kívüli (közvetlenül a music mappában lévő) számok a "Szinglik" albumba kerülnek,
// ennek borítója a music mappába tett cover.jpg.
//
// Fájlnév formátum:  Előadó - Szám címe.mp3   (pl. "Lo_Benya - Éjféli bukás.mp3")
// A sorrendet számmal is megadhatod:  "01 - Lo_Benya - Éjféli bukás.mp3"
// Ha nincs " - " a névben, az előadó "Ismeretlen" lesz.
//
// Dalszöveg: ugyanazzal a névvel, .txt vagy .lrc kiterjesztéssel, a zene mellé.
//   .txt -> sima dalszöveg, .lrc -> időzített dalszöveg ([perc:másodperc.század] sor)
//   Ha mindkettő megvan, az .lrc élvez elsőbbséget.

const audioFiles = import.meta.glob('../assets/music/**/*.{mp3,wav,ogg,m4a,aac,flac}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const imageFiles = import.meta.glob('../assets/music/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const lyricFiles = import.meta.glob('../assets/music/**/*.{txt,lrc}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const SINGLES_ID = '__singles'

const safeDecode = (s) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}
const stripExt = (path) => path.replace(/\.[^.]+$/, '')
const natural = (a, b) => a.localeCompare(b, 'hu', { numeric: true })

// Az album neve = a music alatti első almappa neve ('' ha a számok közvetlenül a music mappában vannak)
function folderOf(path) {
  const rel = path.split('/assets/music/')[1] || ''
  const parts = rel.split('/')
  return parts.length > 1 ? safeDecode(parts[0]) : ''
}

// ---- Dalszövegek ----

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

// ---- Borítók ----
// Mappánként egy borító: a cover/album/folder/front nevű kép, ennek hiányában az első kép.

const coverByFolder = {}
for (const [path, url] of Object.entries(imageFiles).sort(([a], [b]) => natural(a, b))) {
  const folder = folderOf(path)
  const name = stripExt(path.split('/').pop()).toLowerCase()
  const isCover = /^(cover|album|folder|front|borito)$/.test(name)
  const cur = coverByFolder[folder]
  if (isCover && !(cur && cur.strong)) coverByFolder[folder] = { url, strong: true }
  else if (!cur) coverByFolder[folder] = { url, strong: false }
}

// ---- Számok ----

function parseTrack(path, url) {
  const file = safeDecode(path.split('/').pop())
  const base = file
    .replace(/\.[^.]+$/, '')
    // vezető sorszám levágása: "01 - ", "1. ", "02) "
    .replace(/^\d{1,3}\s*(?:-\s*|\.\s+|\)\s+)/, '')
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

const byFolder = new Map()
for (const [path, url] of Object.entries(audioFiles).sort(([a], [b]) => natural(a, b))) {
  const folder = folderOf(path)
  if (!byFolder.has(folder)) byFolder.set(folder, [])
  byFolder.get(folder).push(parseTrack(path, url))
}

// ---- Albumok ----

export const albums = [...byFolder.entries()]
  .map(([folder, list]) => {
    const id = folder || SINGLES_ID
    const title = folder || 'P2L'
    const cover = coverByFolder[folder]?.url || null
    return {
      id,
      title,
      cover,
      artists: [...new Set(list.map((t) => t.artist))],
      tracks: list.map((t) => ({ ...t, albumId: id, album: title, cover })),
    }
  })
  .sort((a, b) => {
    if (a.id === SINGLES_ID) return 1
    if (b.id === SINGLES_ID) return -1
    return natural(a.title, b.title)
  })

export const tracks = albums.flatMap((a) => a.tracks)

export const tracksBy = (name) =>
  tracks.filter((t) => t.artist.toLowerCase() === name.toLowerCase())