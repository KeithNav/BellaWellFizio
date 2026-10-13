import { HandsIcon, MotionIcon, RehabIcon } from './Icons';
import { Reveal } from './Reveal';

const CARDS = [
  {
    icon: RehabIcon,
    title: 'Állapotfelmérés',
    text: 'Minden kezelés a kutya mozgásának, izomzatának és panaszainak alapos felmérésével indul, így a terv valóban rá szabható.',
  },
  {
    icon: HandsIcon,
    title: 'Fizioterápia és masszázs',
    text: 'Kíméletes kézi technikák és kiegészítő terápiák a fájdalom csökkentésére, az izomfeszülés oldására és a regenerációra.',
  },
  {
    icon: MotionIcon,
    title: 'Kutya-fitness',
    text: 'Célzott gyakorlatok az egyensúly, az erő és az állóképesség fejlesztésére – fiatal, idős és sportoló kutyáknak egyaránt.',
  },
];

export function About() {
  return (
    <section id="rolunk" className="section" aria-labelledby="about-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Rólunk</p>
          <h2 id="about-title" className="section-title">
            Mozgás, ami hosszú távon is számít
          </h2>
          <p className="section-lead">
            A BellaWellnél a kutyád testi kényelme áll a középpontban. Műtétek és sérülések utáni rehabilitációban, az
            idősödő társak komfortjának megőrzésében és a mozgásprobléma-megelőzésben segítünk – otthon, a megszokott
            környezetben, nyugodt tempóban. A kezelés kiegészíti, nem helyettesíti az állatorvosi ellátást.
          </p>
        </Reveal>

        <div className="cards">
          {CARDS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <article className="card">
                <span className="card-icon">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
