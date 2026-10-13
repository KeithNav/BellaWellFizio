import { BUSINESS as B } from '../lib/business';
import { LegalLayout } from './LegalLayout';

export default function Impresszum() {
  return (
    <LegalLayout title="Impresszum" updated={B.updated}>
      <h2>Szolgáltató adatai</h2>
      <dl className="legal-data">
        <dt>Márkanév</dt>
        <dd>{B.brand}</dd>
        <dt>Üzemeltető</dt>
        <dd>{B.ownerName}</dd>
        <dt>Cégforma</dt>
        <dd>{B.legalForm}</dd>
        <dt>Székhely</dt>
        <dd>{B.address}</dd>
        <dt>Adószám</dt>
        <dd>{B.taxNumber}</dd>
        <dt>Egyéni vállalkozói nyilvántartási szám</dt>
        <dd>{B.registrationNumber}</dd>
        <dt>Statisztikai számjel</dt>
        <dd>{B.statisticalNumber}</dd>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${B.email}`}>{B.email}</a>
        </dd>
        <dt>Telefon</dt>
        <dd>
          <a href={`tel:${B.phone.replace(/\s/g, '')}`}>{B.phone}</a>
        </dd>
        <dt>Weboldal</dt>
        <dd>{B.url}</dd>
      </dl>

      <h2>Tárhelyszolgáltató</h2>
      <p>{B.hostingProvider}</p>

      <h2>Szerzői jogok</h2>
      <p>
        A weboldal tartalma (szövegek, képek, grafikai elemek, logó) a {B.brand} tulajdona, vagy felhasználásuk a jogosult
        engedélyével történik. A tartalmak az üzemeltető előzetes írásbeli hozzájárulása nélkül nem másolhatók,
        terjeszthetők és nem használhatók fel kereskedelmi célra.
      </p>

      <h2>Felelősség kizárása</h2>
      <p>
        A weboldalon közölt információk tájékoztató jellegűek, és nem helyettesítik az állatorvosi vizsgálatot,
        diagnózist vagy kezelést. A kutya-fizioterápia az állatorvosi ellátást kiegészítő szolgáltatás. Az árak
        tájékoztató jellegűek, változtatásuk jogát az üzemeltető fenntartja.
      </p>

      <h2>Adatvédelem</h2>
      <p>Személyes adatok kezelésére vonatkozó információk az Adatvédelmi tájékoztatóban olvashatók.</p>
    </LegalLayout>
  );
}
