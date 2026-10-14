import { Reveal } from './Reveal';

// Keep in sync with areaServed in index.html (structured data).
const DISTRICTS = ['Belváros', 'Adyváros', 'Nádorváros', 'Marcalváros', 'Gyárváros', 'Szabadhegy', 'Ménfőcsanak', 'Gyirmót', 'Győrszentiván', 'Révfalu', 'Újváros', 'Viziváros', 'Kismegyer'];
const VILLAGES = ['Győrújbarát', 'Nyúl', 'Écs', 'Pér', 'Rábapatona', 'Kisbajcs', 'Dunaszeg', 'Bőny', 'Abda', 'Koroncó', 'Öttevény', 'Győrújfalu', 'Győrzámoly', 'Győrladamér', 'Töltéstava', 'Győrság', 'Tényő', 'Ravazd', 'Győrszemere', 'Ikrény', 'Börcs', 'Nagybajcs'];

export function Area() {
  return (
    <section id="terulet" className="section section-soft" aria-labelledby="area-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Hol dolgozom</p>
          <h2 id="area-title" className="section-title">
            Kutya fizioterápia Győrben és környékén
          </h2>
          <p className="section-lead">
            Házhoz megyek: Győr minden városrészébe és a város 15 km-es körzetében lévő településekre. A kutyafizioterápia,
            a kutyamasszázs, a lézerterápia és a kutya rehabilitáció így a megszokott környezetben, nyugodt tempóban
            történik – műtét vagy sérülés után lábadozó, idős, ortopédiai vagy neurológiai problémákkal küzdő, valamint
            egészséges, sportos kutyáknak.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="area-block">
            <h3>Győr városrészei</h3>
            <ul className="chips">
              {DISTRICTS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
          <div className="area-block">
            <h3>Környező települések</h3>
            <ul className="chips">
              {VILLAGES.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
          <p className="area-note">Nem találja a települését? Írjon vagy hívjon, a távolabbi kiszállást egyeztetjük.</p>
        </Reveal>
      </div>
    </section>
  );
}
