import { FAQ } from '../lib/faq';
import { Reveal } from './Reveal';

export function Faq() {
  return (
    <section id="gyik" className="section" aria-labelledby="faq-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Gyakori kérdések</p>
          <h2 id="faq-title" className="section-title">
            Amit a kutyafizioterápiáról gyakran kérdeznek
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="faq-list">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
