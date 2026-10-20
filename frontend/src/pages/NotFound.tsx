import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main" className="legal">
      <div className="container legal-inner">
        <article className="legal-doc">
          <h1>Az oldal nem található</h1>
          <p>A keresett oldal nem létezik, vagy már áthelyeztem.</p>
          <p>
            <Link to="/" className="btn btn-primary">
              Vissza a főoldalra
            </Link>
          </p>
        </article>
      </div>
    </main>
  );
}
