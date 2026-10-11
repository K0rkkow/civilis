/* ============================================================================
   CIVILIS — Les courants politiques
   ----------------------------------------------------------------------------
   Principe de composition : la carte montre l'essentiel (nom, famille, une
   phrase, quelques idées clés, une référence). Tout le reste — divergences,
   signature sur les dimensions, limites, textes de référence — est caché dans
   une fiche détaillée qu'on ouvre à la demande. Rien n'est supprimé : tout est
   déplacé au bon endroit.
   ========================================================================== */

import React, { useEffect } from 'react';
import { currents } from '../lib/currents';
import { dimensions, DIMENSION_IDS } from '../lib/dimensions';
import { createLetterSpans } from './Home';

/* Textes de référence : ouvrages réels, datés, vérifiables. Aucune citation
   n'est reformulée ici — une citation approximative serait une source fausse. */
const REFERENCES = {
  'social-democratie': 'Jaurès, Histoire socialiste (1908) · Blum, Histoire du socialisme (1948).',
  'socialisme-democratique': 'Jaurès, Histoire socialiste (1908) · Attali, Peut-on sauver le modèle français ? (2016).',
  'liberalisme-economique': 'Smith, La Richesse des nations (1776) · Hayek, Le Chemin de la servitude (1944).',
  'liberalisme-politique': 'Constant, Principes de politique applicables à tous les gouvernements représentatifs (1815) · Kant, Doctrine du droit (1797).',
  'conservatisme': 'Burke, Réflexions sur la Révolution en France (1790).',
  'democratie-chretienne': 'Pie XI, Rerum Novarum (1891) · Jean XXIII, Mater et Magistra (1961) · François, Evangelii gaudium (2013).',
  'ecologie-politique': 'Jonas, Le Principe responsabilité (1979) · rapport Brundtland, Notre avenir à tous (1987).',
  'federalisme-europeen': 'Déclaration Schuman (1950) · Aristide Briand, discours à la Société des Nations (1929).',
  'libertarianisme': 'Nozick, State, Anarchy, Liberty (1974) · Hayek, Le Chemin de la servitude (1944).',
  'gaullisme': 'de Gaulle, Discours de Bayonne (1946) · Constitution du 4 octobre 1958, article 5.',
  'communisme': 'Marx, Thèses sur Feuerbach (1845) · Marx & Engels, Manifeste du Parti communiste (1848).',
  'anarchisme': 'Proudhon, Qu’est-ce que la propriété ? (1840).',
  'centrisme': 'Tocqueville, De la démocratie en Amérique (1835).',
};
const FALLBACK_REFERENCE =
  'Références détaillées dans la page « La démarche », qui documente la construction de chaque dimension.';

/* Signature : les 4 dimensions les plus marquantes, en lecture simple */
function SignatureBars({ current }) {
  const marked = DIMENSION_IDS
    .map((d) => ({ d, pos: current.position[d], spread: Math.abs(current.position[d] - 0.5) }))
    .sort((a, b) => b.spread - a.spread)
    .slice(0, 4);
  return (
    <dl className="current-signature">
      {marked.map(({ d, pos }) => (
        <div className="sig-row" key={d}>
          <dt>{dimensions[d].label}</dt>
          <dd>
            <span className="sig-track" aria-hidden="true">
              <span className="sig-center" />
              <span className="sig-dot" style={{ left: `${pos * 100}%` }} />
            </span>
            <span className="sig-value">{Math.round(pos * 100)}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* Titres en collage précalculés au niveau du module : le générateur est
   déterministe (graine FNV-1a par lettre), le rendu est donc strictement
   identique — mais les ~215 fragments de la page ne sont construits qu'UNE
   fois à l'import, pas à chaque rendu (gain réel sur les rendus répétés
   et en StrictMode). */
const CARD_TITLES = new Map(
  currents.map((c) => [c.key, createLetterSpans(c.name, { variant: 'xs', start: 60 })])
);

export default function Currents() {
  useEffect(() => { document.title = 'Les courants politiques — CIVILIS'; }, []);

  return (
    <div className="page-container container editorial currents-page">
      <p className="kicker">Pour situer les idées</p>
      <h1 className="page-title">Les courants politiques</h1>
      <p className="page-lead">
        Ces {currents.length} courants sont des <em>modèles de référence</em> : ils décrivent le
        corps doctrinal d’une famille de pensée, pas l’opinion moyenne de ses électeurs, ni celle
        d’un parti particulier. Plusieurs peuvent se recouper.
      </p>
      <p className="page-lead">
        Chaque fiche donne l’essentiel — une phrase, quelques idées clés, des références — puis
        s’ouvre sur le détail : divergences, position sur les dimensions mesurées, limites du
        modèle.
      </p>

      <div className="currents-grid-page">
        {currents.map((c) => {
          const ref = REFERENCES[c.key];
          return (
            <article className="current-card-page" key={c.key}>
              <header className="current-card-head">
                <h2>{CARD_TITLES.get(c.key)}</h2>
                <p className="current-card-family">{c.family}</p>
              </header>

              <p className="current-card-summary">{c.summary}</p>

              <h3 className="current-card-sub">Idées clés</h3>
              <ul className="current-card-traits">
                {c.traits.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
              </ul>

              <details className="current-more">
                <summary>Lire la fiche détaillée</summary>
                <div className="current-more-body">
                  {c.traits.length > 3 && (
                    <>
                      <h4>Idées clés (suite)</h4>
                      <ul>{c.traits.slice(3).map((t) => <li key={t}>{t}</li>)}</ul>
                    </>
                  )}

                  <h4>Ce qui le distingue</h4>
                  <ul>{c.divergences.map((t) => <li key={t}>{t}</li>)}</ul>

                  <h4>Sa position sur quatre dimensions mesurées</h4>
                  <SignatureBars current={c} />

                  <h4>Limites du modèle</h4>
                  <p className="current-card-limits">{c.limits.join(' ')}</p>

                  <h4>Textes de référence</h4>
                  <p className="current-card-ref">{ref || FALLBACK_REFERENCE}</p>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}
