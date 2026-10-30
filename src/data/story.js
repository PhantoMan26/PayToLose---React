// A Pay To Lose története. Ezt a fájlt kell kitölteni, az oldal (/story) ebből épül fel.
//
// Minden bejegyzés egy lap az idővonalon:
//   date   – a dátum vagy időszak szövege (pl. '2025. január', 'Az első nap')
//   title  – rövid cím
//   text   – a történet; több bekezdéshez tömböt is megadhatsz: ['Első.', 'Második.']
//   image  – (opcionális) kép a bejegyzéshez, lásd lent
//   stamp  – (opcionális) a lapra "pecsételt" felirat, pl. 'BUKTA', 'FIZETETT'
//
// Kép hozzáadása: tedd a képet az src/assets/story/ mappába, és importáld ide:
//   import elsoNap from '../assets/story/elso-nap.jpg'
//   ... { date: '...', title: '...', text: '...', image: elsoNap }
//
// A lent lévő szövegek csak helyőrzők, írd át őket a ti történetetekre.

export const intro = {
  kicker: 'Hogyan kezdődött',
  title: 'A történetünk',
  text:
    'Ide jöhet egy rövid bevezető: mi a Pay To Lose, kik vagyunk, és hogyan jött az ötlet. Két-három mondat elég.',
}

export const chapters = [
  {
    date: 'Az ötlet',
    title: 'Egy fogadás, ami elszabadult',
    text: [
      'Írd le, hogyan született az ötlet: ki mondta ki először, milyen helyzetben, és mi volt a tét.',
      'Egy második bekezdés is mehet, ha több mondanivaló van.',
    ],
    stamp: 'FOGADÁS',
  },
  {
    date: 'Az első nap',
    title: 'Az első mérlegelés',
    text: 'Mikor indult el igazán, hányan vágtak bele, mik voltak a szabályok és mennyi volt a büntetés.',
  },
  {
    date: 'Az első videó',
    title: 'Felmegy az első videó',
    text: 'Mi volt az első videó témája, hogyan fogadták, és mikor jött rá a banda, hogy ebből több is lesz.',
  },
  {
    date: 'A legnagyobb bukás',
    title: 'Aki fizetett',
    text: 'Itt jöhet a legemlékezetesebb pillanat: ki bukott és miben, és mi lett a vége.',
    stamp: 'BUKTA',
  },
  {
    date: 'Ma',
    title: 'És még nincs vége',
    text: 'Hol tartotok most, mik a következő tervek, és mit érdemes figyelni a csatornán és az oldalon.',
  },
]
