// Visible FAQ content and the matching FAQPage structured data come from the same list.
export const FAQ = [
  {
    q: 'Mikor érdemes kutyafizioterápiát kérni?',
    a: 'Műtét vagy sérülés után lábadozó kutyáknak, ortopédiai és neurológiai problémákkal küzdő kutyáknak, idős, mozgásukban korlátozott kutyáknak, valamint egészséges, sportos kutyáknak is ajánlom megelőzés és kondíciófejlesztés céljából.',
  },
  {
    q: 'Helyettesíti a fizioterápia az állatorvosi ellátást?',
    a: 'Nem. A rehabilitáció minden esetben az állatorvosi diagnózis és a rendelkezésre álló leletek figyelembevételével történik, az állatorvosi ellátást kiegészíti, nem helyettesíti.',
  },
  {
    q: 'Hogyan zajlik az első alkalom?',
    a: 'Minden új páciens kezelése részletes állapotfelméréssel kezdődik. Az eredmények alapján személyre szabott terápiás tervet állítok össze, amely a kutya egyéni szükségleteihez és a kitűzött célokhoz igazodik.',
  },
  {
    q: 'Házhoz jössz? Mekkora körzetben dolgozol?',
    a: 'Igen, házhoz megyek Győrben és 15 km-es körzetében, így a kezelés a kutya megszokott környezetében, nyugodt tempóban történik. Az árak erre a területre vonatkoznak, távolabbi kiszállás esetén a díjat előzetes egyeztetés alapján határozom meg.',
  },
  {
    q: 'Mennyibe kerül a kutyafizioterápia?',
    a: 'Az állapotfelmérés, a fizioterápia, a masszázs és a kutya-fitness külön áron érhető el, a lézerterápia és a TENS-kezelés kiegészítő terápia. Az aktuális árakat a Szolgáltatások és árak szakaszban találod.',
  },
  {
    q: 'Mi a különbség a kutya-fitness és a puppy fitness között?',
    a: 'A kutya-fitness egészséges kutyáknak szól: a rendszeres gyakorlatok fejlesztik a törzsizomzatot, az egyensúlyt és a koordinációt, sportkutyáknak pedig kiváló kiegészítő mozgásforma. A puppy fitness a kölyökkutyák mozgásrendszerének és idegrendszerének egészséges fejlődését támogatja játékos, életkorhoz igazított gyakorlatokkal.',
  },
];

export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});
