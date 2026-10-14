import {
  BoltIcon,
  ClipboardIcon,
  HandsIcon,
  JointIcon,
  LaserIcon,
  MotionIcon,
  PawIcon,
  RehabIcon,
  ShieldIcon,
  ThermoIcon,
} from './Icons';
import { Reveal } from './Reveal';

type Block = string | { label?: string; items: string[] } | { note: string };

const SERVICES: { icon: typeof PawIcon; title: string; body: Block[] }[] = [
  {
    icon: ClipboardIcon,
    title: 'Állapotfelmérés',
    body: [
      'Minden új páciens kezelése részletes állapotfelméréssel kezdődik. A rehabilitáció minden esetben az állatorvosi diagnózis és a rendelkezésre álló leletek figyelembevételével történik.',
      'Az állapotfelmérés eredményei alapján személyre szabott terápiás tervet állítok össze, amely a kutya egyéni szükségleteihez és a kitűzött célokhoz igazodik.',
    ],
  },
  {
    icon: RehabIcon,
    title: 'Fizioterápia',
    body: [
      'A mozgásszervi problémák megelőzésével, kezelésével és rehabilitációjával foglalkozik.',
      'A fizioterápia célja a fájdalom enyhítése, az ízületi mozgékonyság javítása, az izomerő fejlesztése és a biztonságosabb mozgás elősegítése.',
      {
        label: 'Kiknek ajánlott?',
        items: [
          'Műtét vagy sérülés után lábadozó kutyáknak',
          'Ortopédiai és neurológiai problémákkal küzdő kutyáknak',
          'Idős, mozgásukban korlátozott kutyáknak',
          'Egészséges, sportos kutyáknak megelőzés és kondíciófejlesztés céljából',
        ],
      },
      { note: 'A kezelési terv minden esetben egyéni állapotfelmérésre és az állatorvosi diagnózis figyelembevételére épül!' },
    ],
  },
  {
    icon: JointIcon,
    title: 'Passzív kimozgatás',
    body: [
      'A passzív kimozgatás során az ízületeket óvatos, kontrollált mozdulatokkal, a kutya aktív izommunkája nélkül mozgatom át a természetes mozgástartományukon belül.',
      'A kezelés célja az ízületi mozgékonyság megőrzése vagy javítása, a mozgásbeszűkülés megelőzése, valamint a rehabilitáció támogatása. Különösen fontos szerepet kaphat műtétek után, sérülések esetén, illetve akkor, ha a kutya mozgása valamilyen okból korlátozott.',
    ],
  },
  {
    icon: HandsIcon,
    title: 'Masszázs',
    body: [
      'A masszázs a fizioterápiás kezelések fontos része. Segíti az izmok regenerációját, serkenti a vérkeringést, csökkenti a fájdalmat és javítja a mozgásminőséget.',
    ],
  },
  {
    icon: ThermoIcon,
    title: 'Termoterápia – hideg- és melegterápia',
    body: [
      'A hideg- vagy melegkezelés megfelelő alkalmazása az adott állapotnak és terápiás célnak megfelelően. Segítheti a fájdalom és a kellemetlen tünetek enyhítését, illetve az izmok ellazítását.',
    ],
  },
  {
    icon: BoltIcon,
    title: 'Elektroterápia – TENS-kezelés',
    body: [
      'A TENS (transzkután elektromos idegstimuláció) elsősorban a fájdalom csillapítását támogató fizikoterápiás eljárás. Alkalmazása az állat állapotának, a javallatoknak és az ellenjavallatoknak a figyelembevételével történik.',
      {
        label: 'Milyen esetekben alkalmazható?',
        items: [
          'Bénulással járó, neurológiai eredetű mozgásproblémák rehabilitációjának kiegészítéseként',
          'Csökkent izomaktivitás és izomgyengeség esetén',
          'Ortopédiai problémák',
          'Krónikus fájdalom enyhítésére',
          'A rehabilitáció során az izomműködés támogatására',
        ],
      },
      { note: 'A kezelés típusát és beállításait minden esetben a kutya állapotához és a terápiás célhoz kell igazítani.' },
    ],
  },
  {
    icon: PawIcon,
    title: 'Puppy fitness',
    body: [
      'A kölyök-fitness célja a mozgásrendszer és az idegrendszer egészséges fejlődésének támogatása. A játékos, életkorhoz igazított gyakorlatok segítik a testtudat fejlesztését, valamint az egyensúly és a koordináció javítását, hozzájárulva a kölyökkutyák harmonikus mozgásfejlődéséhez.',
    ],
  },
  {
    icon: LaserIcon,
    title: 'Lézerterápia',
    body: [
      'A lézerterápia finoman, mégis hatékonyan támogatja a gyógyulási folyamatokat:',
      {
        items: [
          'csökkenti a fájdalmat és a gyulladást',
          'gyorsítja a seb- és heggyógyulást',
          'segíti az izmok, ínak, szalagok regenerációját',
          'csökkenti az ödémák felszívódási idejét',
          'támogatja az idegek és szövetek helyreállását',
        ],
      },
      'A sejtek energikusabban dolgoznak, a keringés javul, a regeneráció felgyorsul.',
      {
        label: 'Legyen szó:',
        items: ['műtéti heg kezeléséről', 'ízületi vagy izomfájdalomról', 'gyulladásos állapotról', 'sérülés utáni felépülésről'],
      },
    ],
  },
  {
    icon: ShieldIcon,
    title: 'Prevenció',
    body: [
      'Mozgásszervi problémák megelőzése. Az ízületek és izmok karbantartása, a helyes mozgásminták kialakítása és megőrzése.',
    ],
  },
  {
    icon: MotionIcon,
    title: 'Kutya-fitness',
    body: [
      'Kutya-fitness egészséges kutyák számára.',
      'A változatos, rendszeres gyakorlatok segítenek abban, hogy a kutya magabiztosabban és tudatosabban használja a végtagjait, miközben fejlődik a törzsizomzata, az egyensúlya és a koordinációja is. A megfelelően felépített edzés hozzájárul a jobb fizikai teljesítményhez, valamint az izmok és az ízületek védelméhez.',
      'A kutya-fitness sportkutyák számára is kiváló kiegészítő mozgásforma, amely változatosabbá teszi az edzéseket, és támogatja az általános kondíció fenntartását.',
    ],
  },
];

function renderBlock(block: Block, i: number) {
  if (typeof block === 'string') return <p key={i}>{block}</p>;
  if ('note' in block) {
    return (
      <p key={i} className="card-note">
        {block.note}
      </p>
    );
  }
  return (
    <div key={i} className="card-list">
      {block.label && <p className="card-label">{block.label}</p>}
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  return (
    <section id="rolam" className="section" aria-labelledby="about-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Rólam</p>
          <h2 id="about-title" className="section-title">
            Mozgás, ami hosszú távon is számít
          </h2>
          <p className="section-lead">
            Hogy újra öröm legyen minden lépés. Személyre szabott kutyafizioterápia, kedvenced otthonában. Segítek
            támogatni a felépülést, csökkenteni a fájdalmat és megőrizni a mozgás örömét.
          </p>
        </Reveal>

        <h3 className="cards-title">Szolgáltatásaim</h3>
        <div className="cards">
          {SERVICES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 100}>
              <article className="card">
                <span className="card-icon">
                  <Icon />
                </span>
                <div className="card-body">
                  <h3>{title}</h3>
                  {body.map(renderBlock)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
