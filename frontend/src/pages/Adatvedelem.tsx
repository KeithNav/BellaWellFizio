import { BUSINESS as B } from '../lib/business';
import { LegalLayout } from './LegalLayout';

export default function Adatvedelem() {
  return (
    <LegalLayout title="Adatvédelmi tájékoztató" updated={B.updated}>
      <p>
        Jelen tájékoztató a {B.url} weboldal ({B.domain}) látogatóinak személyes adatai kezeléséről szól, az Európai
        Unió általános adatvédelmi rendelete (GDPR, 2016/679) és az információs önrendelkezési jogról és az
        információszabadságról szóló 2011. évi CXII. törvény (Infotv.) alapján.
      </p>

      <h2>1. Az adatkezelő</h2>
      <dl className="legal-data">
        <dt>Név</dt>
        <dd>{B.ownerName} ({B.brand})</dd>
        <dt>Székhely</dt>
        <dd>{B.address}</dd>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${B.email}`}>{B.email}</a>
        </dd>
        <dt>Telefon</dt>
        <dd>{B.phone}</dd>
      </dl>

      <h2>2. Kezelt adatok, célok, jogalap</h2>
      <h3>Kapcsolatfelvétel az oldalon keresztül</h3>
      <ul>
        <li>
          <strong>Kezelt adatok:</strong> név, e-mail cím, telefonszám (nem kötelező), az üzenet szövege, a küldés
          időpontja.
        </li>
        <li>
          <strong>Cél:</strong> az érdeklődés megválaszolása, időpont egyeztetése.
        </li>
        <li>
          <strong>Jogalap:</strong> az érintett hozzájárulása (GDPR 6. cikk (1) a) pont), valamint a szerződés
          megkötését megelőző lépések (6. cikk (1) b) pont).
        </li>
        <li>
          <strong>Megőrzési idő:</strong> az ügyintézés lezárásáig, legfeljebb a megkeresést követő 1 évig; szerződés
          létrejötte esetén a vonatkozó jogszabályi megőrzési kötelezettségek szerint.
        </li>
      </ul>

      <h3>Spamvédelem (hCaptcha)</h3>
      <p>
        A kapcsolatfelvételi űrlap automatizált visszaélések elleni védelmére a hCaptcha szolgáltatást használjuk
        (Intuition Machines, Inc.). A szolgáltatás működése során az Ön böngészőjének és eszközének bizonyos adatait (pl.
        IP-cím, böngészőadatok, egérmozgás) kezelheti. Jogalap: jogos érdek (6. cikk (1) f) pont) az oldal védelme
        érdekében. Részletek: <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">hcaptcha.com/privacy</a>.
      </p>

      <h3>Látogatottság-mérés (Simple Analytics)</h3>
      <p>
        Az oldal forgalmának anonim méréséhez a Simple Analytics szolgáltatást használjuk (Simple Analytics B.V.,
        Hollandia). A szolgáltatás nem használ sütiket, nem azonosítja az egyes látogatókat, és személyes adatot nem
        tárol (pl. az IP-címet nem menti el). Jogalap: jogos érdek (6. cikk (1) f) pont) az oldal fejlesztése
        érdekében. Részletek:{' '}
        <a href="https://simpleanalytics.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          simpleanalytics.com/privacy-policy
        </a>
        .
      </p>

      <h3>Technikai naplózás</h3>
      <p>
        A weboldal biztonságos működéséhez a kiszolgáló technikai naplót vezethet (IP-cím, időpont, kért oldal).
        Jogalap: jogos érdek (6. cikk (1) f) pont). A naplók megőrzési ideje legfeljebb 30 nap.
      </p>

      <h2>3. Sütik, nyomkövetés</h2>
      <p>
        A weboldal saját marketing- vagy analitikai sütiket nem használ, a betűtípusokat saját kiszolgálóról töltjük be,
        külső szolgáltató nélkül. A hCaptcha működéséhez technikailag szükséges adatok tárolódhatnak a böngészőben.
      </p>

      <h2>4. Adatfeldolgozók, címzettek</h2>
      <ul>
        <li>Tárhelyszolgáltató: {B.hostingProvider}</li>
        <li>
          E-mail szolgáltató: az üzenetek a {B.email} címre érkeznek (Google Ireland Limited / Gmail), amely a
          szolgáltatás nyújtásához szükséges feldolgozó.
        </li>
        <li>
          Űrlapszolgáltató: az űrlapon megadott adatokat a Web3Forms (Web3Forms Inc.) továbbítja e-mailben a {B.email}
          címre.
        </li>
        <li>hCaptcha (Intuition Machines, Inc.) – spamvédelem, lásd fent.</li>
        <li>Simple Analytics B.V. – anonim látogatottság-mérés, lásd fent.</li>
      </ul>
      <p>
        Adatait harmadik félnek nem értékesítjük és marketing célra nem adjuk át. Harmadik országba (pl. USA) történő
        adattovábbítás a Web3Forms, hCaptcha és Google szolgáltatások esetén az Európai Bizottság megfelelőségi határozatán vagy
        általános szerződési feltételein (SCC) alapulhat.
      </p>

      <h2>5. Közösségi oldalak</h2>
      <p>
        Weboldalunk hivatkozik Facebook- és Instagram-oldalainkra. A hivatkozásra kattintva az adott szolgáltató saját
        adatkezelési szabályai érvényesek.
      </p>

      <h2>6. Az Ön jogai</h2>
      <ul>
        <li>tájékoztatás és hozzáférés a kezelt adatokhoz,</li>
        <li>helyesbítés,</li>
        <li>törlés („elfeledtetéshez való jog”),</li>
        <li>az adatkezelés korlátozása,</li>
        <li>adathordozhatóság,</li>
        <li>tiltakozás a jogos érdeken alapuló adatkezelés ellen,</li>
        <li>a hozzájárulás bármikor visszavonható, ez nem érinti a visszavonás előtti adatkezelés jogszerűségét.</li>
      </ul>
      <p>
        Kérelmét a {B.email} címen terjesztheti elő, amelyre legkésőbb egy hónapon belül válaszolunk.
      </p>

      <h2>7. Jogorvoslat</h2>
      <p>
        Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat: 1055 Budapest, Falk Miksa
        utca 9–11.; postacím: 1363 Budapest, Pf. 9.; e-mail: ugyfelszolgalat@naih.hu; web:{' '}
        <a href="https://naih.hu" target="_blank" rel="noopener noreferrer">naih.hu</a>. Jogainak megsértése esetén
        bírósághoz is fordulhat, amely a perben soron kívül jár el.
      </p>

      <h2>8. Módosítások</h2>
      <p>Az adatkezelő fenntartja a jogot a tájékoztató módosítására. A mindenkori hatályos változat ezen az oldalon érhető el.</p>
    </LegalLayout>
  );
}
