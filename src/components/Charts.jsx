/* ============================================================================
   CIVILIS — graphiques de résultats
   ----------------------------------------------------------------------------
   Règles communes :
   - aucune donnée inventée : une dimension sans position documentée n'est pas
     dessinée (pas de 0, pas de « milieu » par défaut) ;
   - chaque graphique a une alternative textuelle (aria-label + tableau de
     données dans un <details>), l'information existe donc sans l'image ;
   - palette sobre, cohérente avec CIVILIS (or, brun, pierre), jamais de néon ;
   - rien n'est décoratif : chaque graphique répond à une question précise.
   ========================================================================== */

import React from 'react';
import { dimensions, DIMENSION_IDS } from '../lib/dimensions.js';
import { COVERAGE_MIN } from '../lib/analysis.js';

const pct = (v) => Math.round(v * 100);
const nice = (v) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}`;

/* ---------- tableau de données alternative (accessibilité) ------------- */
function DataTable({ caption, columns, rows }) {
  return (
    <details className="chart-data">
      <summary>Voir les données du graphique</summary>
      <div className="chart-data-scroll">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/* ==========================================================================
   1. RADAR — carte des dimensions réellement mesurées
   ========================================================================== */
export function RadarChart({ scores, coverage }) {
  const size = 520;
  const cx = size / 2, cy = size / 2;
  const R = 182;
  const n = DIMENSION_IDS.length;
  const step = (Math.PI * 2) / n;

  const point = (dim, i, value) => {
    const a = i * step - Math.PI / 2;
    return [cx + value * R * Math.cos(a), cy + value * R * Math.sin(a)];
  };

  const known = DIMENSION_IDS.filter((d) => scores[d] != null);
  const reliable = known.filter((d) => (coverage[d] ?? 0) >= COVERAGE_MIN);
  // On ne relie que les dimensions fiables : un point manquant reste un point
  // isolé plutôt qu'un mensonge géométrique.
  const chain = DIMENSION_IDS.filter((d) => (coverage[d] ?? 0) >= COVERAGE_MIN);
  const chainPoints = chain.map((d) => {
    const i = DIMENSION_IDS.indexOf(d);
    return point(d, i, scores[d] ?? 0).map((v) => v.toFixed(1)).join(',');
  });

  return (
    <figure className="chart chart-radar">
      <svg
        className="radar"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Radar des positions sur ${DIMENSION_IDS.length} dimensions. ${reliable.length} dimensions sont suffisamment renseignées pour être tracées de façon fiable.`}
      >
        {DIMENSION_IDS.map((d, i) => {
          const [x, y] = point(d, i, 1);
          return <line key={d} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--stone)" strokeWidth="0.75" opacity="0.45" />;
        })}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <circle key={f} cx={cx} cy={cy} r={R * f} fill="none" stroke="var(--stone)" strokeDasharray="3 5" strokeWidth="1" opacity="0.5" />
        ))}
        {chain.length >= 3 && (
          <polygon points={chainPoints.join(' ')} fill="rgba(177,138,67,0.18)" stroke="var(--gold)" strokeWidth="2" />
        )}
        {known.map((d) => {
          const i = DIMENSION_IDS.indexOf(d);
          const [x, y] = point(d, i, scores[d]);
          const solid = (coverage[d] ?? 0) >= COVERAGE_MIN;
          return (
            <circle
              key={d}
              cx={x} cy={y} r={solid ? 4 : 3}
              fill={solid ? 'var(--gold)' : 'none'}
              stroke="var(--ink)" strokeWidth="1.2"
            />
          );
        })}
        {DIMENSION_IDS.map((d, i) => {
          const a = i * step - Math.PI / 2;
          const lx = cx + (R + 28) * Math.cos(a);
          const ly = cy + (R + 28) * Math.sin(a);
          const cos = Math.cos(a);
          const anchor = Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end';
          const solid = (coverage[d] ?? 0) >= COVERAGE_MIN;
          const has = scores[d] != null;
          return (
            <g key={d} className={`radar-axis${solid ? '' : ' weak'}`}>
              <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" className="radar-label">
                {dimensions[d].label}
              </text>
              {has && (
                <text x={lx} y={ly + 15} textAnchor={anchor} dominantBaseline="middle" className="radar-value">
                  {pct(scores[d])}{solid ? '' : ' *'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="chart-caption">
        Points pleins : dimensions bien renseignées. Points creux marqués d’un astérisque :
        réponses insuffisantes, le score est indicatif. Aucun point n’est dessiné pour une
        dimension sans réponse.
      </figcaption>
      <DataTable
        caption="Positions par dimension"
        columns={['Dimension', 'Score /100', 'Couverture', 'Interprétation']}
        rows={DIMENSION_IDS.map((d) => [
          dimensions[d].label,
          scores[d] == null ? 'non renseignée' : pct(scores[d]),
          `${pct(coverage[d] ?? 0)} %`,
          `0 = ${dimensions[d].pole0} · 100 = ${dimensions[d].pole100}`,
        ])}
      />
    </figure>
  );
}

/* ==========================================================================
   2. BARRES DE DIMENSION — le profil en détail
   ========================================================================== */
export function DimensionBars({ scores, coverage }) {
  return (
    <figure className="chart chart-bars">
      <ol className="dim-bars">
        {DIMENSION_IDS.map((d) => {
          const v = scores[d];
          const cov = coverage[d] ?? 0;
          const solid = cov >= COVERAGE_MIN;
          return (
            <li key={d} className={`dim-bar-row${solid ? '' : ' weak'}`}>
              <div className="dim-bar-head">
                <span className="dim-bar-name">{dimensions[d].label}</span>
                <span className="dim-bar-value">{v == null ? '—' : `${pct(v)}`}</span>
              </div>
              <div className="dim-bar-track" role="img" aria-label={`${dimensions[d].label} : ${v == null ? 'non renseigné' : `${pct(v)} sur 100`}, couverture ${pct(cov)} pour cent`}>
                <span className="dim-bar-mid" aria-hidden="true" />
                {v != null && <span className="dim-bar-fill" style={{ width: `${pct(v)}%` }} aria-hidden="true" />}
              </div>
              <p className="dim-bar-meta">
                <span>0 · {dimensions[d].pole0}</span>
                <span className="dim-bar-cov">
                  couverture {pct(cov)} %{solid ? '' : ' — sous le seuil de fiabilité'}
                </span>
                <span>100 · {dimensions[d].pole100}</span>
              </p>
              {v == null && (
                <p className="dim-bar-note">Aucune réponse exploitable : ni 0, ni 100 — un point où tu n’as pas tranché.</p>
              )}
            </li>
          );
        })}
      </ol>
      <figcaption className="chart-caption">
        La barre mesure la position sur l’échelle de la dimension. La couverture indique la part
        des questions de cette dimension qui ont reçu une réponse exploitable.
      </figcaption>
    </figure>
  );
}

/* ==========================================================================
   3. COMPARAISON — l'utilisateur face à une personnalité
   ========================================================================== */
export function ComparisonChart({ scores, coverage, person, result }) {
  const shared = DIMENSION_IDS.filter((d) =>
    scores[d] != null && (coverage[d] ?? 0) >= COVERAGE_MIN && person.position[d] != null);
  if (shared.length === 0) {
    return <p className="chart-empty">Aucune dimension comparable pour le moment : réponds à davantage de questions.</p>;
  }
  return (
    <figure className="chart chart-compare">
      <ol className="compare-rows">
        {shared.map((d) => {
          const u = scores[d];
          const r = person.position[d];
          const gap = u - r;
          const closer = Math.abs(gap) <= 0.12;
          return (
            <li key={d} className="compare-row" data-closer={closer ? 'oui' : 'non'}>
              <span className="compare-label">{dimensions[d].label}</span>
              <div className="compare-bars">
                <span className="compare-bar you" style={{ width: `${pct(u)}%` }} title={`Vous : ${pct(u)}`}>
                  <em>Vous</em>
                </span>
                <span className="compare-bar ref" style={{ width: `${pct(r)}%` }} title={`${person.name} : ${pct(r)}`}>
                  <em>{person.name.split(' ').slice(-1)[0]}</em>
                </span>
              </div>
              <span className={`compare-gap ${gap >= 0 ? 'pos' : 'neg'}`}>{nice(gap)}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className="chart-caption">
        Traits pleins : votre position. Traits fins : position documentée de {person.name}.
        L’écart est exprimé en points d’échelle. Les dimensions non documentées pour cette
        personnalité ne sont pas représentées.
      </figcaption>
      <DataTable
        caption={`Comparaison avec ${person.name}`}
        columns={['Dimension', 'Vous', person.name, 'Écart']}
        rows={shared.map((d) => [dimensions[d].label, pct(scores[d]), pct(person.position[d]), nice(scores[d] - person.position[d])])}
      />
    </figure>
  );
}

/* ==========================================================================
   4. ÉCARTS — où vous êtes le plus différent
   ========================================================================== */
export function DivergenceChart({ rows }) {
  const max = 1;
  return (
    <figure className="chart chart-gap">
      <ol className="gap-rows">
        {rows.map(({ dim, signed }) => (
          <li key={dim} className="gap-row">
            <span className="gap-label">{dimensions[dim].label}</span>
            <div className="gap-track">
              <span className="gap-axis" aria-hidden="true" />
              <span
                className={`gap-bar ${signed >= 0 ? 'pos' : 'neg'}`}
                style={{ width: `${Math.min(100, (Math.abs(signed) / max) * 50)}%`, [signed >= 0 ? 'left' : 'right']: '50%' }}
                aria-hidden="true"
              />
            </div>
            <span className="gap-value">{nice(signed)}</span>
          </li>
        ))}
      </ol>
      <figcaption className="chart-caption">
        Vers le pôle 100 à droite, vers le pôle 0 à gauche. Un écart n’est pas un défaut :
        il indique simplement sur quel sujet votre position s’éloigne de la référence.
      </figcaption>
    </figure>
  );
}

/* ==========================================================================
   5. COUVERTURE — ce que le questionnaire a permis de voir
   ========================================================================== */
export function CoverageChart({ scores, coverage, coverageMin }) {
  return (
    <figure className="chart chart-coverage">
      <ol className="coverage-rows">
        {DIMENSION_IDS.map((d) => {
          const cov = coverage[d] ?? 0;
          const state = scores[d] == null ? 'missing' : cov >= coverageMin ? 'solid' : 'thin';
          return (
            <li key={d} className={`coverage-row ${state}`}>
              <span className="coverage-label">{dimensions[d].label}</span>
              <div className="coverage-track" role="img" aria-label={`${dimensions[d].label} : couverture ${pct(cov)} pour cent`}>
                <span className="coverage-fill" style={{ width: `${pct(cov)}%` }} aria-hidden="true" />
                <span className="coverage-threshold" style={{ left: `${coverageMin * 100}%` }} aria-hidden="true" />
              </div>
              <span className="coverage-value">
                {state === 'missing' ? 'non renseignée' : state === 'thin' ? 'insuffisante' : `${pct(cov)} %`}
              </span>
            </li>
          );
        })}
      </ol>
      <figcaption className="chart-caption">
        Le trait vertical marque le seuil de fiabilité ({pct(coverageMin)} %). En dessous, le score
        est indicatif ; sans réponse, il n’est pas calculé.
      </figcaption>
    </figure>
  );
}

/* ==========================================================================
   6. ARBITRAGES — deux positions affirmées du même profil
   ========================================================================== */
export function ArbitrageChart({ items }) {
  if (!items.length) {
    return (
      <p className="chart-empty">
        Aucune paire de positions n’est assez affirmée pour parler d’arbitrage sur ton profil.
      </p>
    );
  }
  return (
    <figure className="chart chart-arbitrage">
      <ol className="arbitrage-list">
        {items.map((item) => (
          <li key={item.label}>
            <p className="arbitrage-label">{item.label} — écart {pct(item.gap)} points</p>
            <div className="arbitrage-poles">
              {item.values.map(({ dim, value }) => (
                <span key={dim} className="arbitrage-pole">
                  <span className="arbitrage-pole-name">{dimensions[dim].label}</span>
                  <span className="arbitrage-track">
                    <span className="arbitrage-fill" style={{ width: `${pct(value)}%` }} />
                  </span>
                  <span className="arbitrage-value">{pct(value)}</span>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="chart-caption">
        Un arbitrage suppose deux positions affirmées sur deux dimensions distinctes. Deux
        réponses portant sur des sujets différents ne sont jamais opposées automatiquement.
      </figcaption>
    </figure>
  );
}
