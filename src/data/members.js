// A haverok adatai. Itt kell kitölteni a profiloldalak tartalmát.
// - slug: az URL-ben jelenik meg (/member/lo_benya), kisbetűvel, ékezet és szóköz nélkül
// - name: a név, EGYEZNIE KELL a zenefájlok nevében szereplő előadóval
//         (pl. "Lo_Benya - Dalcím.mp3" -> ez a haver zenéje lesz)
// - képek a profilhoz: src/assets/members/<slug>/ mappába tedd őket (pl. src/assets/members/lo_benya/1.jpg)

import Lo_Benya from '../assets/Lo_Benya.jpg'
import Edemadi4060 from '../assets/Edemadi4060.jpg'
import Szuperfofo from '../assets/Szuperfofo.jpg'
import Zikizik from '../assets/Zikizik.jpg'
import TomTaylor from '../assets/TomTaylor.jpg'

export const members = [
  {
    slug: 'lo_benya',
    name: 'Lo_Benya',
    image: Lo_Benya,
    nickname: 'Bence',
    role: 'Szerep a bandában',
    bio: 'Ide írd a bemutatkozást: ki ő, mióta van a bandában, mi a legnagyobb bukása.',
    quotes: ['Ide jöhet egy kedvenc idézet.'],
    links: { youtube: '', instagram: '', discord: '' },
  },
  {
    slug: 'edemadi4060',
    name: 'Edemadi4060',
    image: Edemadi4060,
    nickname: 'Edem',
    role: 'Szerep a bandában',
    bio: 'Ide írd a bemutatkozást: ki ő, mióta van a bandában, mi a legnagyobb bukása.',
    quotes: ['Ide jöhet egy kedvenc idézet.'],
    links: { youtube: '', instagram: '', discord: '' },
  },
  {
    slug: 'szuperfofo',
    name: 'Szuperfofo',
    image: Szuperfofo,
    nickname: 'Feri',
    role: 'Szerep a bandában',
    bio: 'Ide írd a bemutatkozást: ki ő, mióta van a bandában, mi a legnagyobb bukása.',
    quotes: ['Ide jöhet egy kedvenc idézet.'],
    links: { youtube: '', instagram: '', discord: '' },
  },
  {
    slug: 'zikizik',
    name: 'Zikizik',
    image: Zikizik,
    nickname: 'Zoli',
    role: 'Szerep a bandában',
    bio: 'Ide írd a bemutatkozást: ki ő, mióta van a bandában, mi a legnagyobb bukása.',
    quotes: ['Ide jöhet egy kedvenc idézet.'],
    links: { youtube: '', instagram: '', discord: '' },
  },
  {
    slug: 'tomtaylor',
    name: 'TomTaylor',
    image: TomTaylor,
    nickname: 'Tomi',
    role: 'Szerep a bandában',
    bio: 'Ide írd a bemutatkozást: ki ő, mióta van a bandában, mi a legnagyobb bukása.',
    quotes: ['Ide jöhet egy kedvenc idézet.'],
    links: { youtube: '', instagram: '', discord: '' },
  },
]
