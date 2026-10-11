import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Home, { createLetterSpans } from './pages/Home';
import Test from './pages/Test';
/* Chargement différé : l'accueil et le test restent dans le paquet initial
   (chemin critique) ; les pages éditoriales lourdes — notamment les résultats
   et leurs graphiques — ne sont téléchargées qu'à la navigation. */
const Method = React.lazy(() => import('./pages/Method'));
const Currents = React.lazy(() => import('./pages/Currents'));
const About = React.lazy(() => import('./pages/About'));
const Results = React.lazy(() => import('./pages/Results'));
const PartisPersonnalites = React.lazy(() => import('./pages/PartisPersonnalites'));
import AntiqueCursor from './components/AntiqueCursor';
import { TestFocusHeader, TestLeaveGuard } from './components/TestFocus.jsx';
import { subscribeTestGuard, getTestGuard } from './lib/testGuard.js';
import './styles/main.css';
import './styles/collage.css';
import './styles/test.css';
import './styles/results.css';

/* ---- page inconnue : jamais d'écran blanc ------------------------------- */
function NotFound() {
  return (
    <div className="route-error container-narrow">
      <p className="kicker">CIVILIS</p>
      <h1>Cette page n'existe pas</h1>
      <p className="route-error-lead">
        L'adresse demandée ne correspond à aucune page du site. Tes éventuelles
        réponses au test restent conservées dans ton navigateur.
      </p>
      <p className="route-error-actions">
        <Link className="btn-ink" to="/">Revenir à l'accueil</Link>
        <Link className="btn-ghost" to="/test">Aller au test</Link>
      </p>
    </div>
  );
}

/* ---- garde contre les erreurs de rendu : jamais d'écran blanc ----------- */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="route-error container-narrow">
          <p className="kicker">CIVILIS</p>
          <h1>Une page n'a pas pu s'afficher</h1>
          <p className="route-error-lead">
            Une erreur inattendue est survenue pendant l'affichage. Tes réponses
            et ta progression sont conservées dans ton navigateur — rien n'est perdu.
          </p>
          <p className="route-error-actions">
            <a className="btn-ink" href="/">Revenir à l'accueil</a>
            <button type="button" className="btn-ghost" onClick={() => window.location.reload()}>
              Recharger la page
            </button>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo" aria-label="CIVILIS — accueil">
          CIVILIS<span className="logo-dot" aria-hidden="true" />
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
        <nav className={`main-nav${open ? ' open' : ''}`} aria-label="Navigation principale">
          <ul onClick={() => setOpen(false)}>
            <li><NavLink to="/" end>Accueil</NavLink></li>
            <li><NavLink to="/method">La démarche</NavLink></li>
            <li><NavLink to="/currents">Les courants</NavLink></li>
            <li><NavLink to="/about">À propos</NavLink></li>
            <li className="nav-cta"><NavLink to="/test">Commencer le test</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p className="footer-brand">CIVILIS — un parcours de réflexion, pas un verdict.</p>
        <div className="footer-links">
          <Link to="/method">Méthode</Link>
          <Link to="/currents">Courants</Link>
          <Link to="/about">À propos</Link>
          <button
            className="footer-link-btn"
            onClick={() => {
              if (window.confirm('Effacer tes réponses et ta progression enregistrées sur cet appareil ?')) {
                localStorage.removeItem('civilis.answers');
                localStorage.removeItem('civilis.profile');
                window.location.href = '/';
              }
            }}
          >
            Effacer mes données
          </button>
        </div>
        <p className="footer-privacy">Réponses traitées uniquement dans ton navigateur — rien n'est envoyé de serveur.</p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------------
   INTRO — porte d'entrée du site.
   Elle ne se referme JAMAIS toute seule : aucun setTimeout, aucune fin
   d'animation ne déclenche une entrée automatique. Seul le clic explicite sur
   « Entrer dans CIVILIS » (bouton réel, focusé au clavier, utilisable au
   tactile) déclenche la transition de sortie.
   --------------------------------------------------------------------------- */
function Intro({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  /* Le bouton reçoit le focus : un visiteur clavier entre avec Entrée. */
  useEffect(() => {
    const btn = document.getElementById('intro-enter');
    if (btn) btn.focus({ preventScroll: true });
  }, []);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    onEnter();
  };

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    // Sans animation (mouvement réduit), on referme immédiatement.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  };

  return (
    <div
      className={`intro-screen${leaving ? ' leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction de CIVILIS"
      onAnimationEnd={(e) => { if (e.target === e.currentTarget) finish(); }}
    >
      <div className="intro-inner">
        <p className="intro-kicker">
          {createLetterSpans('Philosophie · Citoyenneté · Idées', { variant: 'xs', start: 120, stagger: 22 })}
        </p>
        <h1 className="intro-title">
          {createLetterSpans('CIVILIS', { variant: 'lg', start: 560 })}
        </h1>
        <div className="intro-rule" aria-hidden="true" />
        <p className="intro-sub">
          {createLetterSpans('Explorer les idées qui façonnent notre monde', { variant: 'sm', start: 1080, stagger: 17 })}
        </p>
        <button id="intro-enter" type="button" className="intro-enter" onClick={handleEnter}>
          Entrer dans CIVILIS
        </button>
        <p className="intro-legal">
          Un parcours de réflexion · tes réponses restent sur cet appareil
        </p>
      </div>
    </div>
  );
}

const INTRO_ENTERED_KEY = 'civilis.intro.entered';

export default function App() {
  const [entered, setEntered] = useState(() => {
    if (typeof localStorage === 'undefined') return false;
    try {
      // L'ancienne clé était écrite automatiquement à la sortie de l'intro :
      // elle ne doit surtout pas accorder un droit d'entrée. On la supprime.
      localStorage.removeItem('civilis.intro');
      return localStorage.getItem(INTRO_ENTERED_KEY) === '1';
    } catch { return false; }
  });

  /* La route que le visiteur voulait initialement atteindre avant l'intro */
  const location = useLocation();
  const navigate = useNavigate();
  const intendedRoute = location.pathname === '/' ? '/' : location.pathname;

  const handleEnter = () => {
    try { localStorage.setItem(INTRO_ENTERED_KEY, '1'); } catch { /* stockage indisponible */ }
    setEntered(true);
    navigate(intendedRoute);
  };

  /* Mode test concentré : pendant les phases « questions » et « récapitulatif »,
     l'en-tête de navigation et le pied de page laissent place à un en-tête
     discret, et la confirmation de sortie s'arme (src/lib/testGuard.js). */
  const [testMode, setTestMode] = useState(getTestGuard());
  useEffect(() => subscribeTestGuard(setTestMode), []);

  return (
    <>
      <ScrollToTop />
      {!entered && <Intro onEnter={handleEnter} />}
      <a href="#main" className="skip-link">Aller au contenu</a>
      {testMode.active ? <TestFocusHeader state={testMode} /> : <Header />}
      <main id="main">
        <RouteErrorBoundary>
          <React.Suspense fallback={<div className="route-loading" aria-hidden="true"><span /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/method" element={<Method />} />
              <Route path="/currents" element={<Currents />} />
              <Route path="/about" element={<About />} />
              <Route path="/results" element={<Results />} />
              <Route path="/partis" element={<PartisPersonnalites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </RouteErrorBoundary>
      </main>
      {!testMode.active && <Footer />}
      <AntiqueCursor />
      <TestLeaveGuard state={testMode} />
    </>
  );
}