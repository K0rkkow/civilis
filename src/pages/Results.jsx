/* ============================================================================
   CIVILIS — page de résultats
   ----------------------------------------------------------------------------
   Hiérarchie de lecture : l'essentiel d'abord, puis l'analyse s'approfondit au
   fil du défilement. Tout ce qui est affiché vient du moteur (analysis.js) et
   des données vérifiées (politicians.js, parties.js, currents.js) : aucune
   valeur n'est inventée pour « remplir » un graphique.
   ========================================================================== */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { computeResults, COVERAGE_MIN } from '../lib/analysis';
import { parties } from '../lib/parties';
import { personalities, personalityFamilies } from '../lib/politicians';
import { dimensions, DIMENSION_IDS } from '../lib/dimensions';
import {
  rankPersonalities, rankParties, explainProximity, divergences, convergences,
  nearTies, coverageReport, profileStats, arbitrages,
} from '../lib/comparison';
import {
  RadarChart, DimensionBars, ComparisonChart, DivergenceChart, CoverageChart, ArbitrageChart,
} from '../components/Charts';
import KidsResults from '../components/KidsResults';
import '../styles/results.css';

const ANSWERS_KEY = 'civilis.answers';
const PROFILE_KEY = 'civilis.profile';

const pct = (v) => (v == null ? '—' : `${Math.round(v * 100)} %`);
const label = (dim) => dimensions[dim].label;

/* ---------- photographie : réelle, crédité, avec repli propre ---------- */
function Portrait({ person, size = 'md' }) {
  if (!person.photo) return null;
  return (
    <figure className={`portrait portrait-${size}`}>
      <div className="portrait-frame">
        <img
          src={person.photo.src}
          alt={person.photo.alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.closest('.portrait')?.classList.add('img-failed'); }}
        />
      </div>
      <figcaption className="portrait-credit">
        Photo · {person.photo.author} · Wikimedia Commons · {person.photo.license}
      </figcaption>
    </figure>
  );
}

/* ---------- A. EN-TÊTE : le résultat principal, immédiatement visible ----- */
function SectionHeadline({ result, stats, people, partyRows }) {
  return (
    <header className="res-head">
      <p className="kicker">Ton portrait CIVILIS</p>
      <h1 className="res-title">{result.profileTitle}</h1>
      <div className="golden-rule"><span /></div>
      <p className="res-narrative">{result.narrative}</p>
      <p className="res-meta">
        {result.meta.answeredCount} question{result.meta.answeredCount > 1 ? 's' : ''} sur{' '}
        {result.meta.totalQuestions} · {stats.solidCount} dimension{stats.solidCount > 1 ? 's' : ''} sur 10
        suffisamment documentée{stats.solidCount > 1 ? 's' : ''}
        {result.neutralCount > 0 && ` · ${result.neutralCount} réponse${result.neutralCount > 1 ? 's' : ''} « je ne sais pas » exclue${result.neutralCount > 1 ? 's' : ''} du calcul`}
      </p>

      {people.length > 0 && (
        <div className="res-head-people">
          <h2 className="res-subtitle">Les personnalités les plus proches de tes réponses</h2>
          <p className="res-note">
            Proximité estimée entre positions documentées, calculée sur les dimensions que tu as
            réellement renseignées. Elle ne signifie ni vote, ni adhésion à l’ensemble de leurs idées.
          </p>
          <div className="people-cards">
            {people.slice(0, 3).map(({ person, proximity }) => (
              <article className="people-card" key={person.id}>
                <Portrait person={person} size="sm" />
                <div className="people-card-body">
                  <h3>{person.name}</h3>
                  <p className="people-role">{person.role}</p>
                  <p className="people-affil">
                    {person.party} · {person.family}
                  </p>
                  <p className="people-prox" aria-label={`Proximité estimée : ${proximity} pour cent`}>
                    {proximity}<small> %</small>
                  </p>
                  <p className="people-prox-label">proximité estimée</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {partyRows.length > 0 && (
        <div className="res-head-parties">
          <h2 className="res-subtitle">Les partis et courants les plus proches</h2>
          <ol className="res-head-list">
            {partyRows.slice(0, 3).map(({ party, proximity }, i) => (
              <li key={party.id}>
                <span className="rank">{i + 1}</span>
                <span className="dot" style={{ background: party.color }} aria-hidden="true" />
                <span className="name">{party.name}</span>
                <span className="fam">{party.family}</span>
                <span className="pct">{proximity} %</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <dl className="res-stats">
        <div><dt>Questions renseignées</dt><dd>{result.meta.answeredCount} / {result.meta.totalQuestions}</dd></div>
        <div><dt>Couverture globale</dt><dd>{pct(stats.overallCoverage)}</dd></div>
        <div><dt>Dimensions fiables</dt><dd>{stats.solidCount} / 10</dd></div>
        <div><dt>Réponses « je ne sais pas »</dt><dd>{result.neutralCount}</dd></div>
      </dl>

      <p className="res-cta">
        <a className="btn-ink" href="#analyse">Explorer l’analyse détaillée ↓</a>
      </p>
    </header>
  );
}

/* ---------- B. CE QUI DÉFINIT VOTRE PROFIL ---------------------------- */
function SectionProfileReading({ result, stats, topPerson }) {
  const reliable = DIMENSION_IDS.filter((d) => (result.coverage[d] ?? 0) >= COVERAGE_MIN && result.scores[d] != null);
  const affirmed = reliable
    .map((d) => ({ dim: d, value: result.scores[d], distance: Math.abs(result.scores[d] - 0.5) }))
    .sort((a, b) => b.distance - a.distance);
  const strongest = affirmed.slice(0, 3);
  const nuanced = [...affirmed].sort((a, b) => a.distance - b.distance).slice(0, 2);
  const mainGap = topPerson ? divergences(topPerson.gaps, 1)[0] : null;

  return (
    <section className="res-section" id="profil">
      <h2 className="res-h2">Ce qui définit ton profil</h2>
      <p className="res-lead">
        Ces lectures viennent de règles explicites du moteur : on regarde les positions les plus
        affirmées, les plus proches du centre, et les écarts avec la personnalité la plus proche.
      </p>

      <div className="reading-grid">
        <article className="reading-card">
          <h3>Les dimensions où tu es le plus affirmé</h3>
          <ul>
            {strongest.length ? strongest.map(({ dim, value }) => (
              <li key={dim}>
                <strong>{label(dim)}</strong> — {Math.round(value * 100)} / 100, vers le pôle
                {value > 0.5 ? ` « ${dimensions[dim].pole100} »` : ` « ${dimensions[dim].pole0} »`}.
              </li>
            )) : <li>Pas encore assez de réponses pour identifier une position affirmée.</li>}
          </ul>
        </article>

        <article className="reading-card">
          <h3>Les dimensions où tu es le plus nuancé</h3>
          <ul>
            {nuanced.length ? nuanced.map(({ dim, value }) => (
              <li key={dim}>
                <strong>{label(dim)}</strong> — {Math.round(value * 100)} / 100 : une position
                proche du milieu de l’échelle.
              </li>
            )) : <li>Aucune dimension documentée pour l’instant.</li>}
          </ul>
          <p className="res-fine">
            Seuil de fiabilité : {Math.round(COVERAGE_MIN * 100)} % de couverture. En dessous,
            le score n’est pas présenté comme une position.
          </p>
        </article>

        {mainGap && (
          <article className="reading-card">
            <h3>Ce qui te distingue de {topPerson.person.name}</h3>
            <p>
              L’écart le plus net porte sur <strong>{label(mainGap.dim)}</strong> :
              {mainGap.signed >= 0
                ? ` tu te situes ${Math.round(mainGap.signed * 100)} points vers « ${dimensions[mainGap.dim].pole100} » là où ${topPerson.person.name} se situe plus près de « ${dimensions[mainGap.dim].pole0} ».`
                : ` tu te situes ${Math.round(Math.abs(mainGap.signed) * 100)} points vers « ${dimensions[mainGap.dim].pole0} » là où ${topPerson.person.name} se situe plus près de « ${dimensions[mainGap.dim].pole100} ».`}
            </p>
            <p className="res-fine">
              Un écart n’est ni un défaut ni une incohérence : c’est le sujet sur lequel vous ne
              vous rejoignez pas.
            </p>
          </article>
        )}

        <article className="reading-card">
          <h3>Forces et tensions</h3>
          {result.tensions.length === 0 ? (
            <p>Les réponses sont relativement homogènes sur les dimensions analysées : pas de
              grande tension repérée entre deux pôles.</p>
          ) : (
            <ul>
              {result.tensions.map((t, i) => (
                <li key={i}>
                  <strong>{label(t.pair[0])} vs {label(t.pair[1])}</strong> — écart de{' '}
                  {Math.round(t.gap * 100)} points : {t.description}.
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      {!stats.reliable && (
        <p className="res-warn">
          Ton profil est encore incomplet : {stats.solidCount} dimension{stats.solidCount > 1 ? 's' : ''}
          {' '}seulement dépassent le seuil de fiabilité.{' '}
          <Link to="/test">Compléter le questionnaire</Link> rendrait l’analyse plus solide.
        </p>
      )}
    </section>
  );
}

/* ---------- C. GRAPHIQUES ------------------------------------------------ */
function SectionCharts({ result, people, partyRows, selectedId, onSelect, topPerson }) {
  const selected = people.find((p) => p.person.id === selectedId) || people[0] || null;
  const [gapRow, setGapRow] = useState(topPerson ? topPerson.person.id : '');
  const activeGap = people.find((p) => p.person.id === gapRow) || topPerson;
  const arb = arbitrages(result.scores, result.coverage, COVERAGE_MIN);

  return (
    <section className="res-section" id="analyse">
      <h2 className="res-h2">Les graphiques</h2>
      <p className="res-lead">
        Six lectures, six questions différentes. Chacune affiche ses données et signale ce qui
        manque : aucune valeur n’est comblée par défaut.
      </p>

      <div className="chart-block">
        <h3 className="res-h3">1 · La carte de tes positions</h3>
        <p className="res-lead">Où se situent tes réponses sur les dix dimensions mesurées ?</p>
        <RadarChart scores={result.scores} coverage={result.coverage} />
      </div>

      <div className="chart-block">
        <h3 className="res-h3">2 · Ton profil dimension par dimension</h3>
        <p className="res-lead">Chaque dimension, son score, son échelle et sa couverture.</p>
        <DimensionBars scores={result.scores} coverage={result.coverage} />
      </div>

      {people.length > 0 && (
        <div className="chart-block">
          <h3 className="res-h3">3 · Comparaison avec une personnalité</h3>
          <p className="res-lead">
            Choisis une personnalité pour comparer vos positions sur les dimensions documentées
            des deux côtés.
          </p>
          <div className="picker" role="group" aria-label="Choisir une personnalité à comparer">
            {people.map(({ person, proximity }) => (
              <button
                key={person.id}
                type="button"
                className={`picker-btn${selected?.person.id === person.id ? ' active' : ''}`}
                onClick={() => onSelect(person.id)}
                aria-pressed={selected?.person.id === person.id}
              >
                {person.name} <span>{proximity} %</span>
              </button>
            ))}
          </div>
          {selected && <ComparisonChart scores={result.scores} coverage={result.coverage} person={selected.person} result={result} />}
        </div>
      )}

      <div className="chart-block">
        <h3 className="res-h3">4 · Les proximités, tous supports confondus</h3>
        <p className="res-lead">
          Personnalités et partis sont deux types de références : rien ne les mélange dans un même
          score.
        </p>
        <div className="dual-ranking">
          <div>
            <h4>Personnalités</h4>
            <ol className="rank-list">
              {people.map(({ person, proximity }) => (
                <li key={person.id}>
                  <span className="bar" style={{ width: `${proximity}%` }} aria-hidden="true" />
                  <span className="lbl">{person.name}</span>
                  <span className="val">{proximity} %</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4>Partis</h4>
            <ol className="rank-list">
              {partyRows.map(({ party, proximity }) => (
                <li key={party.id}>
                  <span className="bar" style={{ width: `${proximity}%`, background: party.color }} aria-hidden="true" />
                  <span className="lbl">{party.name}</span>
                  <span className="val">{proximity} %</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {activeGap && (
        <div className="chart-block">
          <h3 className="res-h3">5 · Où tu es le plus différent</h3>
          <p className="res-lead">
            Les écarts les plus marquants entre ton profil et {activeGap.person.name}.
          </p>
          <div className="picker" role="group" aria-label="Choisir la référence">
            {people.slice(0, 6).map(({ person, proximity }) => (
              <button
                key={person.id}
                type="button"
                className={`picker-btn${activeGap.person.id === person.id ? ' active' : ''}`}
                onClick={() => setGapRow(person.id)}
                aria-pressed={activeGap.person.id === person.id}
              >
                {person.name} <span>{proximity} %</span>
              </button>
            ))}
          </div>
          <DivergenceChart rows={divergences(activeGap.gaps, 6)} />
        </div>
      )}

      <div className="chart-block">
        <h3 className="res-h3">6 · Tes arbitrages</h3>
        <p className="res-lead">
          Là où deux de tes positions affirmées tirent en sens contraire.
        </p>
        <ArbitrageChart items={arb} />
      </div>

      <div className="chart-block">
        <h3 className="res-h3">7 · La couverture de ton profil</h3>
        <p className="res-lead">Ce que le questionnaire a permis de voir — et ce qui manque encore.</p>
        <CoverageChart scores={result.scores} coverage={result.coverage} coverageMin={COVERAGE_MIN} />
      </div>
    </section>
  );
}

/* ---------- D. POURQUOI CES RÉSULTATS ? ---------------------------------- */
function SectionWhy({ people, partyRows, topPerson }) {
  return (
    <section className="res-section" id="pourquoi">
      <h2 className="res-h2">Pourquoi ces résultats ?</h2>
      <p className="res-lead">
        Chaque ligne ci-dessous est calculée à partir des écarts réels entre tes réponses et des
        positions documentées. Rien n’est réécrit après coup pour justifier un pourcentage.
      </p>

      <h3 className="res-h3">Pourquoi ces personnalités apparaissent</h3>
      {people.length === 0 && <p className="res-warn">Aucune personnalité comparable pour l’instant.</p>}
      <div className="why-list">
        {people.slice(0, 3).map((row) => {
          const { person, proximity } = row;
          return (
            <article className="why-card" key={person.id}>
              <header>
                <h4>{person.name}</h4>
                <span className="why-pct">{proximity} %</span>
              </header>
              <p className="why-role">{person.role} · {person.party}</p>
              <p>{explainProximity(row)}</p>
              <p className="why-source"><strong>Source :</strong> {person.source}</p>
              <p className="why-limits">
                <strong>Limites :</strong> ces positions sont des positions publiques documentées
                (programme, déclarations) ; elles ne décrivent pas les positions individuelles de
                chaque électeur. Une proximité élevée n’est ni un accord, ni une intention de vote.
              </p>
            </article>
          );
        })}
      </div>

      <h3 className="res-h3">Pourquoi ces partis apparaissent</h3>
      <div className="why-list">
        {partyRows.slice(0, 3).map(({ party, proximity, comparedDimensions }) => (
          <article className="why-card" key={party.id}>
            <header>
              <h4>
                <span className="dot" style={{ background: party.color }} aria-hidden="true" />
                {party.name}
              </h4>
              <span className="why-pct">{proximity} %</span>
            </header>
            <p className="why-role">{party.family}</p>
            <p>{party.description}</p>
            <p><strong>Convergences majors :</strong> {party.program}</p>
            <p className="why-source">
              <strong>Comparaison sur :</strong> {comparedDimensions.length} dimension{comparedDimensions.length > 1 ? 's' : ''} documentée{comparedDimensions.length > 1 ? 's' : ''}.
            </p>
          </article>
        ))}
      </div>
      <p className="res-fine">
        {topPerson ? `Référence principale de cette page : ${topPerson.person.name}. ` : ''}
        Si les parts te semblent faibles, ce n’est pas un échec : c’est le signe qu’aucun modèle
        documenté ne colle à tes réponses — ce qui est une information en soi.
      </p>
    </section>
  );
}

/* ---------- D-bis. POURQUOI CES COURANTS RESSORTENT ---------------------- */
function SectionCurrentsWhy({ result }) {
  const rows = result.proximities;
  if (rows.length === 0) return null;
  const { top, tied } = nearTies(rows, 3);
  const top3 = rows.slice(0, 3);

  return (
    <section className="res-section" id="courants-pourquoi">
      <h2 className="res-h2">Pourquoi ces courants ressortent</h2>
      <p className="res-lead">
        Chaque courant est un modèle de référence documenté (fiche complète sur
        la page <Link to="/currents">Les courants</Link>). La comparaison se fait
        uniquement sur les dimensions que tu as réellement renseignées — et
        l'écart, dimension par dimension, est le seul critère.
      </p>

      {tied.length > 0 && (
        <p className="res-note--tie">
          <strong>Quasi à égalité en tête :</strong> {top.current.name} et{' '}
          {tied.map((r) => r.current.name).join(', ')} sont séparés de moins de
          {' '}{top.proximity - tied[tied.length - 1].proximity} points. À ce
          niveau, l'ordre entre eux n'est pas significatif : ils décrivent des
          familles d'idées voisines plutôt qu'un choix tranché.
        </p>
      )}

      <div className="why-list">
        {top3.map((row) => {
          const gaps = Object.fromEntries(
            Object.entries(row.contribution || {}).map(([d, v]) => [d, v.gap])
          );
          const near = convergences(gaps, 3);
          const far = divergences(gaps, 2);
          const nDims = Object.keys(row.contribution || {}).length;
          return (
            <article className="why-card" key={row.current.key}>
              <header>
                <h4>{row.current.name}</h4>
                <span className="why-pct">{row.proximity} %</span>
              </header>
              <p className="why-role">{row.current.family} · {row.current.summary}</p>
              {nDims > 0 && (
                <p>
                  {near.length > 0 && (
                    <>Tes réponses s'approchent surtout de ce modèle sur {' '}
                    <strong>{near.map((n) => label(n.dim)).join(', ')}</strong>.</>
                  )}
                  {far.length > 0 && (
                    <> Tu t'en écartes nettement sur {' '}
                    <strong>{far.map((n) => label(n.dim)).join(' et ')}</strong>.</>
                  )}
                  {' '}Comparaison établie sur {nDims} dimension{nDims > 1 ? 's' : ''} documentée{nDims > 1 ? 's' : ''}.
                </p>
              )}
              {nDims < 4 && (
                <p className="why-limits">
                  <strong>À lire avec prudence :</strong> seules {nDims} dimensions
                  de ton profil étaient suffisamment renseignées pour cette
                  comparaison — complète le questionnaire pour la fiabiliser.
                </p>
              )}
              <p className="why-limits">
                <strong>Limites :</strong> une ressemblance entre tes réponses et
                un modèle de référence n'est ni une adhésion, ni un soutien, ni un
                projet de vote.
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- E. LE SAVIEZ-VOUS ? ------------------------------------------ */
function SectionLore() {
  const entries = [
    {
      title: 'Le clivage gauche / droite est une convention historique',
      body: 'L’opposition gauche / droite s’est stabilisée aux États-Unis dans les années 1840, à partir du spoils system. Elle est devenue un outil de comparaison presque universel, mais elle masque des écarts réels : deux partis peuvent être « de gauche » et être opposés sur l’écologie, l’Europe ou l’immigration. CIVILIS mesure donc dix dimensions plutôt qu’une seule.',
      source: 'Attribution de la codification gauche / droite à Vannevar Bush, « The Facts Behind the Political Myth », Scientific American (1940) — usage pédagogique classique.',
    },
    {
      title: 'Un test politique ne mesure pas une intention de vote',
      body: 'Un questionnaire mesure des positions déclarées sur des sujets choisis. L’intention de vote dépend d’autres choses : la campagne, la mise en avant de certains sujets, la stratégie des partis, le mode de scrutin. Un score de proximité CIVILIS et une intention de vote ne sont pas la même unité et ne doivent pas être comparés.',
      source: 'Repère méthodologique CIVILIS — voir /method pour la construction des dimensions et le seuil de couverture.',
    },
    {
      title: 'Pourquoi certaines questions sont exclues du calcul',
      body: 'Chaque question du questionnaire propose « je ne sais pas / cela dépend ». Cette réponse n’est jamais convertie en position : elle compte comme une absence d’information, pas comme une opinion située au milieu. C’est ce qui permet de distinguer « je n’ai pas tranché » d’un score intermédiaire.',
      source: 'Règle du moteur : src/lib/analysis.js, fonction calculateDimensionScores.',
    },
    {
      title: 'Une couverture faible signifie « peu d’information », pas « opinion faible »',
      body: 'Quand la moitié des questions d’une dimension n’ont pas eu de réponse exploitable, CIVILIS ne remplace pas la valeur manquante par 50 : il affiche un score indicatif et le signale. C’est une limite assumée du questionnaire, pas une erreur de l’utilisateur.',
      source: 'Seuil de couverture : COVERAGE_MIN (analysis.js).',
    },
    {
      title: 'Un courant idéologique survit à ses organisations',
      body: 'Libéralisme, social-démocratie, écologie politique ou souverainisme ont des doctrine qui précèdent largement les partis qui s’en réclament. Un parti peut changer de ligne ; le courant, lui, se déplace plus lentement. C’est pourquoi CIVILIS garde les deux niveaux : les partis (programmes datés) et les courants (familles d’idées).',
      source: 'Manuels de science politique comparée ; les positions de partis utilisées ici sont datées (programmes 2022–2024) et signalées comme telles.',
    },
  ];
  return (
    <section className="res-section" id="saviez-vous">
      <h2 className="res-h2">Le saviez-vous ?</h2>
      <p className="res-lead">
        Repères de méthode et de contexte. Aucune statistique d’intention n’est avancée ici : nous
        n’avons pas de source assez solide pour te la donner, donc nous ne la donnons pas.
      </p>
      <div className="lore-list">
        {entries.map((e) => (
          <article className="lore-card" key={e.title}>
            <h3>{e.title}</h3>
            <p>{e.body}</p>
            {e.source && <p className="lore-source"><strong>Source / référence :</strong> {e.source}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- F. GALERIE DES PERSONNALITÉS --------------------------------- */
function SectionPeople({ people, onSelect }) {
  const [family, setFamily] = useState('Toutes');
  const visible = family === 'Toutes' ? people : people.filter((p) => p.person.family === family);
  return (
    <section className="res-section" id="personnalites">
      <h2 className="res-h2">Explorer les personnalités</h2>
      <p className="res-lead">
        Photographies réelles, rôles et affiliations contextualisés, positions documentées. Le
        classement est celui du moteur — toutes ne te sont pas également proches.
      </p>
      <div className="picker" role="group" aria-label="Filtrer par famille politique">
        {['Toutes', ...personalityFamilies].map((f) => (
          <button
            key={f}
            type="button"
            className={`picker-btn${family === f ? ' active' : ''}`}
            onClick={() => setFamily(f)}
            aria-pressed={family === f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="people-gallery">
        {visible.map(({ person, proximity, comparedDimensions }) => (
          <article className="gallery-card" key={person.id}>
            <Portrait person={person} size="md" />
            <div className="gallery-body">
              <h3>{person.name}</h3>
              <p className="gallery-role">{person.role}</p>
              <p className="gallery-affil">{person.party} · {person.family} · relecture {person.verifiedAt}</p>
              <p className="gallery-bio">{person.bio}</p>
              <p className="gallery-prox">
                <strong>{proximity} %</strong> de proximité estimée · comparaison sur{' '}
                {comparedDimensions.length} dimension{comparedDimensions.length > 1 ? 's' : ''}
              </p>
              <button type="button" className="btn-ghost gallery-btn" onClick={() => onSelect(person.id)}>
                Comparer avec mon profil
              </button>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="res-fine">Aucune personnalité dans cette famille.</p>}
    </section>
  );
}

/* ---------- G. PARTIS ET COURANTS ---------------------------------------- */
function SectionParties({ partyRows, currents }) {
  return (
    <section className="res-section" id="partis">
      <h2 className="res-h2">Explorer les partis et les courants</h2>
      <p className="res-lead">
        Deux échelles : les partis (organisations, programmes datés) et les courants (familles
        d’idées). Les logos officiels ne sont pas reproduits — ces marques sont protégées ; chaque
        parti est identifié par sa couleur et son typographie.
      </p>
      <div className="party-gallery">
        {partyRows.map(({ party, proximity }) => (
          <article className="party-card" key={party.id}>
            <span className="party-stripe" style={{ background: party.color }} aria-hidden="true" />
            <h3>{party.name}</h3>
            <p className="party-fam">{party.family}</p>
            <p className="party-desc">{party.description}</p>
            <p className="party-prox"><strong>{proximity} %</strong> de proximité estimée</p>
            <p className="party-src">Source : {party.program}</p>
          </article>
        ))}
      </div>
      <h3 className="res-h3">Et les courants de pensée ?</h3>
      <div className="current-gallery">
        {currents.slice(0, 6).map(({ current, proximity }) => (
          <article className="current-card-sm" key={current.key}>
            <h4>{current.name}</h4>
            <p className="current-fam">{current.family}</p>
            <p>{current.summary}</p>
            <p className="current-prox">{proximity} % de proximité estimée</p>
          </article>
        ))}
      </div>
      <p className="res-cta"><Link className="btn-ghost" to="/currents">Voir la page complète des courants</Link></p>
    </section>
  );
}

/* ---------- H. ALLER PLUS LOIN ------------------------------------------- */
function SectionNext({ result }) {
  return (
    <section className="res-section res-next" id="aller-plus-loin">
      <h2 className="res-h2">Aller plus loin</h2>
      <div className="next-actions">
        <Link className="btn-ink" to="/test">Revoir mes réponses</Link>
        <Link className="btn-outline" to="/test">Compléter les questions manquantes</Link>
        <Link className="btn-ghost" to="/method">Explorer la méthode et les sources</Link>
        <Link className="btn-ghost" to="/currents">Comparer avec les courants</Link>
        <Link className="btn-ghost" to="/partis">Explorer partis et personnalités</Link>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            if (window.confirm('Effacer toutes tes réponses et recommencer le test ?')) {
              localStorage.removeItem(ANSWERS_KEY);
              localStorage.removeItem(PROFILE_KEY);
              window.location.href = '/test';
            }
          }}
        >
          Recommencer le test
        </button>
      </div>
      <p className="res-disclaimer">
        Tes réponses sont calculées et conservées uniquement dans ton navigateur. Les pourcentages
        affichés sont des <strong>proximités estimées</strong> entre positions déclarées et positions
        documentées : ils ne constituent ni une appartenance politique, ni une intention de vote,
        ni une adhésion aux idées de quiconque. Résultats générés le{' '}
        {new Date(result.meta.generatedAt).toLocaleDateString('fr-FR')}.
      </p>
    </section>
  );
}

/* ---------- PAGE -------------------------------------------------------- */
export default function Results() {
  const navigate = useNavigate();
  const [answers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}'); } catch { return {}; }
  });
  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
  }, []);
  const compareRef = useRef(null);

  const result = useMemo(() => computeResults(answers), [answers]);
  const stats = useMemo(() => profileStats(result, COVERAGE_MIN), [result]);
  const people = useMemo(() => rankPersonalities(result.scores, result.coverage, COVERAGE_MIN), [result]);
  const partyRows = useMemo(() => rankParties(result.scores, result.coverage, COVERAGE_MIN), [result]);
  const coverage = useMemo(() => coverageReport(result.scores, result.coverage, COVERAGE_MIN), [result]);
  const [selectedId, setSelectedId] = useState(null);

  const hasAnswers = Object.keys(answers).length > 0;
  useEffect(() => {
    if (!hasAnswers) navigate('/test', { replace: true });
  }, [hasAnswers, navigate]);

  /* Mode enfant (5–12 ans) : lecture simple, sans partis ni personnalités.
     Le drapeau est un simple choix localStorage, réversible à tout moment. */
  const kidsMode = useMemo(() => {
    try { return localStorage.getItem('civilis.kids-mode') === '1'; } catch { return false; }
  }, []);

  const selectPerson = (id) => {
    setSelectedId(id);
    const el = compareRef.current;
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  /* Page jamais vide et jamais inexpliquée. */
  if (kidsMode) {
    return <KidsResults result={result} />;
  }
  if (!hasAnswers || result.meta.insufficient) {
    return (
      <div className="res-container res-container--narrow">
        <h1>Pas encore de résultat exploitable</h1>
        <p>
          {hasAnswers
            ? `Tu as répondu à ${result.meta.answeredCount} question${result.meta.answeredCount > 1 ? 's' : ''} sur ${result.meta.totalQuestions}, mais aucune dimension n'atteint encore le seuil de couverture (${Math.round(COVERAGE_MIN * 100)} %) nécessaire pour une analyse fiable.`
            : "Aucune réponse n'est enregistrée sur cet appareil : il n'y a donc rien à analyser."}
        </p>
        <p className="res-fine">
          La solution est simple : répondre à davantage de questions. Même une dozen de réponses
          bien réparties suffisent à faire apparaître un profil.
        </p>
        <p className="res-cta">
          <Link className="btn-ink" to="/test">Continuer le questionnaire</Link>
        </p>
      </div>
    );
  }

  const topPerson = people[0] || null;

  return (
    <div className="res-container">
      <SectionHeadline result={result} stats={stats} people={people} partyRows={partyRows} />

      <SectionProfileReading result={result} stats={stats} topPerson={topPerson} />

      <div ref={compareRef} />
      <SectionCharts
        result={result}
        people={people}
        partyRows={partyRows}
        selectedId={selectedId}
        onSelect={setSelectedId}
        topPerson={topPerson}
      />

      <SectionWhy people={people} partyRows={partyRows} topPerson={topPerson} />

      <SectionCurrentsWhy result={result} />

      <SectionLore />

      <SectionPeople people={people} onSelect={selectPerson} />

      <SectionParties partyRows={partyRows} currents={result.proximities} />

      <SectionNext result={result} />

      <SectionMethodNote result={result} stats={stats} />

      <ShareCard result={result} profile={profile} coverage={coverage} />
    </div>
  );
}

/* ---------- H. COMMENT CE RÉSULTAT EST CALCULÉ ? ------------------------ */
function SectionMethodNote({ result, stats }) {
  const solidCount = stats.solidDimensions.length;
  return (
    <section className="res-section" id="methode">
      <details className="method-details">
        <summary>Comment ce résultat est-il calculé ?</summary>
        <div className="method-details-body">
          <p>
            Chacune de tes réponses apporte une valeur entre 0 et 100 sur une ou
            plusieurs des <strong>dix dimensions</strong> mesurées (économie,
            libertés, autorité, société, immigration, écologie, institutions,
            nation et monde, justice, travail). Le score d'une dimension est la{' '}
            <strong>moyenne des valeurs des options choisies</strong> — la
            réponse « je ne sais pas » n'entre jamais dans le calcul, elle est
            comptée comme une absence d'information.
          </p>
          <p>
            Une dimension n'est présentée comme fiable que si tu y as répondu
            au-delà d'un <strong>seuil de couverture de {Math.round(COVERAGE_MIN * 100)} %</strong>.
            Ici, {solidCount} dimension{solidCount > 1 ? 's' : ''} sur 10 franchissent
            ce seuil. En dessous, le score existe mais est signalé fragile — il
            n'est pas utilisé pour les comparaisons.
          </p>
          <p>
            La <strong>proximité avec un courant</strong> (le pourcentage affiché)
            est égale à 100 moins la distance entre ta position et celle du
            modèle de référence, sur les seules dimensions fiables. Elle
            exprime une <strong>ressemblance entre deux jeux de positions</strong> :
            ni une probabilité d'appartenance, ni une intention de vote, ni un
            score de compatibilité scientifique.
          </p>
          <p>
            Les positions des personnalités et des partis proviennent de{' '}
            <strong>positions publiées et datées</strong> (programmes,
            déclarations) — elles peuvent évoluer. Les comparaisons ne sont
            établies que sur les dimensions documentées des deux côtés, et
            jamais sur moins de deux dimensions : un pourcentage sans base
            suffisante n'est pas affiché.
          </p>
          <p>
            <strong>Limites assumées :</strong> CIVILIS est un outil de réflexion,
            pas un instrument scientifique validé. Tes réponses sont traitées
            uniquement dans ton navigateur, et changer une réponse recalcule
            immédiatement les scores concernés — et eux seuls.
          </p>
          <p className="res-fine">
            La méthode complète est détaillée sur{' '}
            <Link to="/method">la page La démarche</Link>.
          </p>
        </div>
      </details>
    </section>
  );
}

/* ---------- fiche exportable ------------------------------------------- */
function ShareCard({ result, profile, coverage }) {
  const top3 = result.proximities.slice(0, 3);
  const includesProfile = Object.values(profile).some((v) => v);
  const summary = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname : '';
  return (
    <section className="res-fiche" id="fiche">
      <h2 className="res-h2">Ta fiche de résultat</h2>
      <p className="res-lead">
        Résumé exportable{includesProfile ? ' — le profil facultatif n’est pas inclus' : ''} · rien n’est envoyé en ligne.
      </p>
      <div className="fiche-block">
        <p className="fiche-label">Portrait</p>
        <p className="fiche-title">{result.profileTitle}</p>
        <p className="fiche-label">Dimensions bien documentées</p>
        <p>{coverage.solid.map(label).join(', ') || 'aucune'}</p>
        <p className="fiche-label">Courants les plus proches</p>
        <ol className="fiche-list">
          {top3.map((p) => <li key={p.current.key}>{p.current.name} — {p.proximity} %</li>)}
        </ol>
        <p className="fiche-label">Lien de la page</p>
        <p><a href={summary}>{summary}</a></p>
        <p className="fiche-note">
          Généré le {new Date().toLocaleDateString('fr-FR')} · CIVILIS — outil de réflexion,
          pas un verdict.
        </p>
      </div>
      <div className="res-actions">
        <button className="btn-outline" onClick={() => window.print()}>Imprimer / PDF</button>
        <button
          className="btn-outline"
          onClick={async () => {
            const text = `CIVILIS — ${result.profileTitle}\nCourants les plus proches :\n${top3.map((p) => `· ${p.current.name} — ${p.proximity} %`).join('\n')}\n\nExplore tes idées : ${summary}`;
            if (navigator.share) { try { await navigator.share({ text }); } catch { /* annulé */ } }
            else { try { await navigator.clipboard.writeText(text); } catch { /* refusé */ } }
          }}
        >
          Copier un résumé
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            if (window.confirm('Effacer définitivement tes réponses de cet appareil ?')) {
              localStorage.removeItem(ANSWERS_KEY);
              localStorage.removeItem(PROFILE_KEY);
              window.location.href = '/test';
            }
          }}
        >
          Recommencer &amp; effacer
        </button>
      </div>
    </section>
  );
}
