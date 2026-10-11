import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* Images réelles, vérifiées (URL HTTP 200 le 2026-10) — Wikimedia Commons. */
const IMAGES = {
  socrate: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Socrates_Louvre.jpg/1920px-Socrates_Louvre.jpg',
    alt: "Buste en marbre du philosophe Socrate, copie romaine d'après un original grec",
    caption: 'Socrate, marbre — Musée du Louvre, Paris. Domaine public.',
  },
  agora: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/The_reconstructed_Stoa_of_Attalus_II_%28159-138_B.C.%29_in_Athens.jpg/1920px-The_reconstructed_Stoa_of_Attalus_II_%28159-138_B.C.%29_in_Athens.jpg',
    alt: 'La Stoa d’Attale reconstruite dans l’ancienne Agora d’Athènes',
    caption: 'Stoa d’Attale, Agora d’Athènes — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
  },
  temple: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Temple_of_Hephaestus_from_ancient_agora_Athens.jpg/1920px-Temple_of_Hephaestus_from_ancient_agora_Athens.jpg',
    alt: 'Temple d’Héphaïstos vu depuis l’Agora antique d’Athènes',
    caption: 'Temple d’Héphaïstos, Athènes — © Jebulon, CC0 (Wikimedia Commons)',
  },
  stele: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Ancient_Greece_Marble_Stele_of_Daisios%2C_Euthias_and_Euthykritos%2C_from_Brauron%2C_mid-4th_Cent._BC.jpg/1920px-Ancient_Greece_Marble_Stele_of_Daisios%2C_Euthias_and_Euthykritos%2C_from_Brauron%2C_mid-4th_Cent._BC.jpg',
    alt: 'Stèle funéraire grecque en marbre avec inscriptions, IVᵉ siècle av. J.-C.',
    caption: 'Stèle de marbre, Brauron, IVᵉ s. av. J.-C. — © Gary Todd, CC0 (Wikimedia Commons)',
  },
  parthenon: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Doric_column_inside_the_Propylaea_Acropolis_Athens_Greece.jpg/1920px-Doric_column_inside_the_Propylaea_Acropolis_Athens_Greece.jpg',
    alt: 'Colonne dorique du Propylée, sur l’Acropole d’Athènes',
    caption: 'Colonne dorique, Propylée de l’Acropole — © Jebulon, CC0 (Wikimedia Commons)',
  },
  caryatides: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg/1920px-The_Caryatids_of_the_Erechtheion_on_the_Acropolis_of_Athens.jpg',
    alt: 'Les Caryatides de l’Érechthéion, Acropole d’Athènes',
    caption: 'Caryatides de l’Érechthéion — © George E. Koronaios, CC BY-SA 4.0 (Wikimedia Commons)',
  },
};

function Figure({ img, className = '', priority = false }) {
  return (
    <figure className={`figure ${className}`}>
      <div className="figure-frame">
        <img
          src={img.src}
          alt={img.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.closest('.figure')?.classList.add('img-failed'); }}
        />
      </div>
      <figcaption className="figure-caption">{img.caption}</figcaption>
    </figure>
  );
}

/* Reveal-on-scroll : n'ajoute la classe que si IntersectionObserver existe ;
   sans JS, tout reste visible (content-first). */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) return; // visible par défaut
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ==========================================================================
   COLLAGE DE LETTRES DÉCOUPÉES — helper « createLetterSpans()
   ----------------------------------------------------------------------------
   Chaque caractère est un fragment de papier découpé séparément dans un
   journal ou un magazine : alphabet, graisse, teinte de papier, tranches de
   découpe, marges, rotation, décalage vertical et texture varient légèrement.

   Les variations ne sont PAS tirées de Math.random() : elles viennent d'une
   graine déterministe (texte + index de lettre). Le rendu est donc stable
   d'un re-render à l'autre, tout en restant irrégulier et crédible.

   `variant` pilote l'amplitude :
     'lg' — le nom CIVILIS (fortes découpes, rotations franches)
     'md' — mots d'accroche
     'sm' — phrases courtes (rotations discrères, lisibilité préservée)

   `start` / `stagger` orchestrent l'apparition progressive des fragments.
   ========================================================================== */

const CUT_FACES = [
  { c: 'cf-garamond', w: [500, 600, 700] },
  { c: 'cf-playfair', w: [700, 900] },
  { c: 'cf-spectral', w: [400, 600] },
  { c: 'cf-georgia', w: [400, 700] },
  { c: 'cf-times', w: [400, 700] },
  { c: 'cf-palatino', w: [400, 700] },
  { c: 'cf-sans', w: [400, 600, 700] },
  { c: 'cf-oswald', w: [500, 600, 700] },
  { c: 'cf-black', w: [900] },
  { c: 'cf-impact', w: [700] },
  { c: 'cf-type', w: [400, 700] },
  { c: 'cf-ital', w: [500, 600] },
];

const CUT_PAPERS = ['pp-ivory', 'pp-cream', 'pp-linen', 'pp-beige', 'pp-news', 'pp-news', 'pp-grey', 'pp-aged', 'pp-white'];
const CUT_DARK_PAPERS = ['pp-ink', 'pp-brown'];
const CUT_EDGES = ['eg-1', 'eg-2', 'eg-3', 'eg-4', 'eg-5', 'eg-6', 'eg-7', 'eg-8', 'eg-9', 'eg-9'];
const CUT_INKS = ['ik-black', 'ik-black', 'ik-brown', 'ik-grey', 'ik-fade'];
const CUT_PADS = ['pd-0', 'pd-1', 'pd-2', 'pd-3', 'pd-4'];
const CUT_TEXTURES = ['tx-0', 'tx-0', 'tx-lines', 'tx-fiber', 'tx-halftone', 'tx-gloss', 'tx-crease', 'tx-speck'];
const CUT_TONES = ['fx-flat', 'fx-flat', 'fx-flat', 'fx-print', 'fx-aged'];
const CUT_SCRAPS = ['scrap-grey', 'scrap-aged', ''];

const CUT_VARIANTS = {
  lg: { rot: 8, dy: 0.2, dx: 0.08, fs: [0.88, 1.2], sc: [0.92, 1.08], mg: [-0.07, 0.07], stagger: 72, dark: 0.25, ghost: 0.3, scrap: 0.35, pads: CUT_PADS },
  md: { rot: 6, dy: 0.15, dx: 0.06, fs: [0.92, 1.15], sc: [0.96, 1.06], mg: [-0.02, 0.06], stagger: 40, dark: 0.2, ghost: 0.25, scrap: 0.25, pads: CUT_PADS },
  sm: { rot: 3, dy: 0.08, dx: 0.03, fs: [0.95, 1.08], sc: [0.98, 1.04], mg: [0.01, 0.05], stagger: 18, dark: 0.1, ghost: 0.15, scrap: 0, pads: ['pd-0', 'pd-1', 'pd-2'] },
  xs: { rot: 2, dy: 0.05, dx: 0.02, fs: [0.97, 1.03], sc: [0.98, 1.02], mg: [0.02, 0.08], stagger: 12, dark: 0.05, ghost: 0, scrap: 0, pads: ['pd-0', 'pd-2'] },
};

/* ponctuation gardée telle quelle : elle n'est presque jamais découpée */
const CUT_LEAD = /^[«"'“‘(\[]+/;
const CUT_TAIL = /[.,;:!?…»"'”’)\]]+$/;

/* graine déterministe (FNV-1a) → générateur mulberry32 */
function cutRng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cutPick = (rng, list) => list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
const cutBetween = (rng, min, max) => min + rng() * (max - min);
const cutFixed = (n, digits = 3) => Number(n.toFixed(digits));

function splitToken(token) {
  const lead = (token.match(CUT_LEAD) || [''])[0];
  const rest = token.slice(lead.length);
  const tail = (rest.match(CUT_TAIL) || [''])[0];
  return { lead, core: rest.slice(0, rest.length - tail.length), tail };
}

export function createLetterSpans(text, options = {}) {
  const label = String(text);
  const V = CUT_VARIANTS[options.variant] || CUT_VARIANTS.md;
  const start = options.start || 0;
  const stagger = options.stagger || V.stagger;
  const tokens = label.split(' ');
  let order = 0;

  const children = [];
  tokens.forEach((token, ti) => {
    if (ti > 0) children.push(' ');

    const { lead, core, tail } = splitToken(token);
    if (!core) {
      children.push(
        <span className="cut-punct" key={`p${ti}`}>{lead + tail}</span>
      );
      return;
    }

    const letters = Array.from(core).map((ch, li) => {
      const rng = cutRng(`${label}|${ti}|${li}`);
      const face = cutPick(rng, CUT_FACES);
      const weight = cutPick(rng, face.w);
      const isDark = rng() < V.dark;
      const paper = isDark ? cutPick(rng, CUT_DARK_PAPERS) : cutPick(rng, CUT_PAPERS);
      const ink = isDark ? null : cutPick(rng, CUT_INKS);
      const delay = Math.min(Math.round(start + order * stagger + rng() * 45), 1650);
      order += 1;

      const tone = cutPick(rng, CUT_TONES);
      const classes = ['cut', tone].filter(Boolean).join(' ');
      const paperClasses = [face.c, paper, cutPick(rng, CUT_EDGES), cutPick(rng, V.pads), cutPick(rng, CUT_TEXTURES), ink]
        .filter(Boolean)
        .join(' ');

      /* la lettre a été découpée à l'intérieur d'un mot : on laisse parfois
         dépasser un fragment du voisin (comme un vrai collage de journal) */
      let ghost = '';
      let ghostX = '';
      if (core.length > 1 && rng() < V.ghost) {
        const onLeft = rng() < 0.5;
        const neighbour = onLeft ? core[li - 1] : core[li + 1];
        if (neighbour) {
          ghost = neighbour;
          ghostX = onLeft ? '-0.45em' : 'calc(100% - 0.08em)';
        }
      }

      /* certains fragments sont collés sur un bout de papier vierge */
      const scrap = V.scrap > 0 && rng() < V.scrap;
      const scrapStyle = scrap ? {
        '--sr': `${cutFixed((rng() * 2 - 1) * 9, 2)}deg`,
        '--sx': `${cutFixed((rng() * 2 - 1) * 0.12, 3)}em`,
        '--sy': `${cutFixed((rng() * 2 - 1) * 0.1, 3)}em`,
        '--ss': cutFixed(cutBetween(rng, 0.96, 1.06)),
      } : null;
      const scrapTone = scrap ? cutPick(rng, CUT_SCRAPS) : null;

      return (
        <span
          key={`l${li}`}
          className={classes}
          aria-hidden="true"
          style={{
            '--rot': `${cutFixed((rng() * 2 - 1) * V.rot, 2)}deg`,
            '--dx': `${cutFixed((rng() * 2 - 1) * V.dx, 3)}em`,
            '--dy': `${cutFixed((rng() * 2 - 1) * V.dy, 3)}em`,
            '--sc': cutFixed(cutBetween(rng, V.sc[0], V.sc[1])),
            '--fs': cutFixed(cutBetween(rng, V.fs[0], V.fs[1])),
            '--mg': `${cutFixed(cutBetween(rng, V.mg[0], V.mg[1]), 3)}em`,
            '--d': `${delay}ms`,
            '--ghost': ghost ? `"${ghost}"` : undefined,
            '--ghost-x': ghostX || undefined,
            fontWeight: weight,
          }}
        >
          {scrap && <span className={`cut-scrap ${scrapTone}`} style={scrapStyle} aria-hidden="true" />}
          <span className={`cut-paper ${paperClasses}`}>
            <span className="cut-glyph">{ch}</span>
          </span>
        </span>
      );
    });

    children.push(
      <span className="cut-word" key={`w${ti}`}>
        {lead && <span className="cut-punct">{lead}</span>}
        <span className="cut-group" role="img" aria-label={core}>{letters}</span>
        {tail && <span className="cut-punct">{tail}</span>}
      </span>
    );
  });

  return <>{children}</>;
}

export default function Home() {
  useReveal();
  const heroImg = useRef(null);

  /* léger effet parallaxe (désactivé si prefers-reduced-motion) */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !heroImg.current) return;
    const onScroll = () => {
      if (heroImg.current) heroImg.current.style.transform = `translateY(${window.scrollY * 0.04}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="kicker reveal">Philosophie · Citoyenneté · Idées</p>
            <h1 className="hero-title reveal">
              Connais tes idées.<br />
              <em>Comprends</em> le monde.
            </h1>
            <div className="golden-rule reveal" aria-hidden="true"><span /></div>
            <p className="hero-lead reveal">
              {'Tes convictions ne se résument pas à une étiquette. Elles naissent de tes valeurs, de tes expériences et de ta manière de concevoir la '}
              {createLetterSpans('liberté,', { variant: 'md' })}
              {' la '}
              {createLetterSpans('justice', { variant: 'md' })}
              {' et la société. '}
              {createLetterSpans('CIVILIS', { variant: 'md', start: 240 })}
              {" t'invite à les explorer."}
            </p>
            <p className="hero-note reveal">Un parcours de réflexion, pas un verdict.</p>
            <div className="hero-actions reveal">
              <Link to="/test" className="btn-main">Commencer le test</Link>
            </div>
          </div>
          <figure className="hero-figure reveal" ref={heroImg}>
            <div className="figure-frame">
              <img
                src={IMAGES.socrate.src}
                alt={IMAGES.socrate.alt}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.closest('.hero-figure')?.classList.add('img-failed'); }}
              />
            </div>
            <figcaption className="figure-caption">{IMAGES.socrate.caption}</figcaption>
          </figure>
        </div>
        <div className="scroll-hint" aria-hidden="true"><span /></div>
      </section>

      {/* ============ CHAPITRE I ============ */}
      <section className="chapter" id="chapitre-1">
        <div className="container chapter-grid">
          <Figure img={IMAGES.caryatides} className="chapter-figure" />
          <div className="chapter-text reveal">
            <p className="chapter-number">Chapitre I</p>
            <h2>Tout commence par une question.</h2>
            <p>
              Socrate ne cherchait pas seulement à transmettre des réponses. Il interrogeait
              les certitudes, examinait les arguments et invitait chacun à penser par
              lui-même. Cette démarche — la maïeutique — inspire CIVILIS : te faire
              accoucher de tes propres idées, pas t'imposer les nôtres.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE II ============ */}
      <section className="chapter chapter-alt" id="chapitre-2">
        <div className="container chapter-grid">
          <Figure img={IMAGES.agora} className="chapter-figure" />
          <div className="chapter-text reveal">
            <p className="chapter-number">Chapitre II</p>
            <h2>Vivre ensemble, mais comment&nbsp;?</h2>
            <p>
              Quelle place donner à la liberté&nbsp;? Comment répartir les richesses&nbsp;?
              Jusqu'où l'État doit-il intervenir&nbsp;? Que doit-on à la communauté&nbsp;?
              Les réponses à ces questions dessinent des visions différentes de la société —
              aucune n'est évidente, chacune mérite d'être examinée.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE III ============ */}
      <section className="chapter" id="chapitre-3">
        <div className="container chapter-grid">
          <Figure img={IMAGES.temple} className="chapter-figure" />
          <div className="chapter-text reveal">
            <p className="chapter-number">Chapitre III</p>
            <h2>À toi de confronter tes idées.</h2>
            <p>
              Le questionnaire explore dix dimensions de la pensée politique — de
              l'économie à l'écologie, des institutions aux libertés individuelles.
              Certaines réponses confirmeront tes intuitions. D'autres pourraient les
              remettre en question.
            </p>
            <Link to="/test" className="btn-ink">Entrer dans l'Agora</Link>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE IV ============ */}
      <section className="chapter chapter-final" id="chapitre-4">
        <div className="container chapter-final-grid">
          <Figure img={IMAGES.stele} className="chapter-figure" />
          <div className="chapter-text reveal">
            <p className="chapter-number">Chapitre IV</p>
            <h2>Pas une étiquette. Une lecture de tes idées.</h2>
            <p>
              Découvre les courants qui se rapprochent de tes réponses, les principes qui
              structurent ta vision et les questions qui méritent encore réflexion.
              Rien n'est arbitraire : chaque score est expliqué, chaque rapprochement
              calculé à partir de modèles référencés.
            </p>
            <p className="chapter-final-note">
              Une composition éditoriale, comme un portrait intellectuel : ton profil,
              tes tensions, tes arbitrages — sous forme d'essai, pas de graphique anonyme.
            </p>
          </div>
          <div className="chapter-final-cta reveal">
            <div className="golden-rule"><span /></div>
            <Link to="/test" className="btn-ink">Découvrir mon portrait</Link>
          </div>
        </div>
      </section>

      {/* ============ BANDE IMAGES ============ */}
      <section className="image-band" aria-hidden="true">
        <div className="container image-band-inner">
          <img src={IMAGES.parthenon.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
               onError={(e)=>{e.target.closest('.image-band-inner')?.classList.add('img-failed');}} />
          <img src={IMAGES.agora.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
               onError={(e)=>{e.target.closest('.image-band-inner')?.classList.add('img-failed');}} />
        </div>
      </section>
    </div>
  );
}