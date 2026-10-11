import React, { useMemo, useState } from 'react';
import { currents } from '../lib/currents';
import { parties } from '../lib/parties';
import { personalities, getPersonalityById } from '../lib/politicians';
import { dimensions, DIMENSION_IDS } from '../lib/dimensions';
import { TitleCollage, Letters } from '../components/LetterCollage';
import '../styles/main.css';

/* =========================================================================
   CIVILIS — « Les partis, les courants, les personnalités »
   --------------------------------------------------------------------------
   Page documentée et séparée : position des partis, courants de référence
   et personnalités vérifiées, avec recherche par nom, filtres par type et
   source citée. Conçu comme un catalogue de la pensée politique, pas comme
   une classification définitoire.
   ========================================================================= */

/* ---------- données d'indexation (position réelle + métadonnées) ------- */
const INDEX = {
  /* les courants portent une `key` (identifiant courant), pas d'`id` :
     on normalise l'identifiant commun pour la clé React, la recherche et
     les textes de source (SOURCE_TEXTS est indexée par key de courant) */
  currents: currents.map(c => ({
    ...c,
    id: c.key,
    type: 'courant',
    section: c.family,
  })),
  parties: parties.map(p => ({
    ...p,
    type: 'parti',
    section: p.family,
  })),
  personalities: personalities.map(p => ({
    ...p,
    type: 'personnalité',
    section: 'Personnalités marquantes',
  })),
};

const catalog = [...INDEX.currents, ...INDEX.parties, ...INDEX.personalities];

/* ---------- infobulles de source (textes courts) ---------------------- */
const SOURCE_TEXTS = {
  'social-democratie': 'Constitutionnelle, doctrine sociale de l’ordre libéral (Mouvement Social-Démocrate, 1945–1995).',
  'socialisme-democratique': 'Programme socialiste français (1971, 2012, 2022) et doctrine extraite du Marxisme démocratique.',
  'liberalisme-economique': 'Doctrine classique (Smith, Hayek, Mises) et libéralisme économique contemporain.',
  'liberalisme-politique': 'Droits de l’homme, État de droit, tolérance (Kant, Mill, Rawls, Nagel, Sullivan).',
  'conservatisme': 'Doctrine de la tradition et de la préservation (Burke, Oakeshott, MacIntyre, Conservatisme français).',
  'democratie-chretienne': 'Doctrine sociale de l’Église catholique (Rerum Novarum 1891, Quadragesimo Anno 1931, Laborem Exercens 1981).',
  'ecologie-politique': 'Doctrine écologiste et écosocialiste (Agarwal, Dobson, Cunliffe, 1970–2000).',
  'souverainisme': 'Doctrine souverainiste et nationaliste (Bonnec, Lebrun, Mélenchon, Bardella, 2010–2025).',
  'federalisme-europeen': 'Doctrine fédéraliste (Monnet, Spinelli, Schuman, Delors, 1950–1990).',
  'libertarianisme': 'Doctrine libertaire (Nozick, Hayek, Mises, Rothbard, 1970–2000).',
  'gaullisme': 'Doctrine gaulliste et doctrinale de la Ve République (De Gaulle, 1958–1969).',
  'communisme': 'Doctrine marxiste-léniniste et maintien du parti (Lenin, Marx, 1848–1991).',
  'anarchisme': 'Doctrine libertaire et fédéralisme (Kropotkin, Bakounine, Proudhon, 1860–2000).',
  'centrisme': 'Doctrine pragmatique et reformisme modéré (1945–2025).',
  LFI: 'Programme LFI — « L’avenir en commun » (juin 2022) · contrat NFP (juin 2024).',
  EÉLV: 'Programme des Écologistes — européennes 2024 · accords NFP (juin 2024).',
  PS: 'Programme PS — « L’Europe au cœur » (européennes 2024) · NFP 2024.',
  PCF: 'Programme PCF — lignes directrices législatives 2024 (VCIM).',
  RE: 'Programme Renaissance — « Besoin d’Europe » (européennes 2024) · bilan présidentiel 2022.',
  MoDem: 'Programme MoDem — « Projet démocrate » (européennes 2024).',
  LR: 'Programme LR — « Le Sursaut républicain » (européennes 2024) · projet présidentiel 2022.',
  RN: 'Programme RN — Jordan Bardella (législatives 2024) · projet présidentiel 2027.',
  bardella: 'Jordan Bardella — président du Rassemblement National, biographie officielle du parti (2024) et interview média.',
  lepen: 'Marine Le Pen — biographie officielle du Rassemblement National et déclaration parlementaire.',
  melenchon: 'Jean-Luc Mélenchon — biographie officielle de la France Insoumise et déclarations parlementaires.',
  glucksmann: 'Raphaël Glucksmann — biographie du mouvement Place Publique et déclarations européennes.',
  attal: 'Gabriel Attal — biographie officielle du parti Renaissance.',
  philippe: 'Édouard Philippe — biographie officielle d’Horizons et déclarations.',
  ruffin: 'François Ruffin — biographie officielle de la France Insoumise.',
  tondelier: 'Marine Tondelier — biographie officielle des Écologistes.',
  hollande: 'François Hollande — biographie officielle de la République et de sa présidence (2012–2017).',
  roussel: 'Fabien Roussel — biographie officielle du Parti communiste français.',
};

/* ---------- composant de fiche unitaire ------------------------------- */
function Entry({ item }) {
  const source = SOURCE_TEXTS[item.id] || SOURCE_TEXTS[item.section] || '';
  const isParty = item.type === 'parti';
  const isPersonality = item.type === 'personnalité';

  return (
    <article className="catalog-entry">
      <div className="catalog-kicker">{item.type}</div>
      {isParty && (
        <div className="catalog-logo" style={{ background: item.color }} aria-hidden="true">
          <Letters text={item.shortName || item.name.slice(0, 2)} size={0.9} />
        </div>
      )}
      {isPersonality && (
        <div className="catalog-initials" aria-hidden="true">
          <Letters text={item.name.slice(0, 2)} size={1.4} />
        </div>
      )}
      <div className="catalog-body">
        <h3 className="catalog-name">
          {item.name}
          {item.party && <span className="catalog-party">{item.party}</span>}
        </h3>
        <p className="catalog-meta">
          {item.type === 'courant' && <span>Modèle de référence — {item.family}</span>}
          {item.type === 'parti' && <span>{item.family}</span>}
          {item.type === 'personnalité' && <span>{item.role}</span>}
        </p>
        {item.type === 'personnalité' && item.bio && (
          <p className="catalog-bio">{item.bio}</p>
        )}
        {item.type === 'parti' && item.description && (
          <p className="catalog-desc">{item.description}</p>
        )}
        {item.position && Object.keys(item.position).length > 0 && (
          <div className="catalog-positions">
            {DIMENSION_IDS.map(d => {
              const v = item.position[d];
              if (v == null) return null;
              return (
                <div key={d} className="catalog-pos">
                  <span className="catalog-pos-label">{dimensions[d].label}</span>
                  <div className="catalog-pos-bar">
                    <div className="catalog-pos-fill" style={{ width: `${v * 100}%`, background: isParty ? item.color : 'var(--gold)' }} />
                  </div>
                  <span className="catalog-pos-val">{Math.round(v * 100)}</span>
                </div>
              );
            })}
          </div>
        )}
        <p className="catalog-source">
          {source}
        </p>
        <p className="catalog-verified">
          Vérifié {item.verifiedAt ? item.verifiedAt : '—'} · {item.status || 'résultat en cours'}
        </p>
      </div>
    </article>
  );
}

/* ---------- section de filtrage par type ------------------------------ */
function TypeFilter({ active, onChange }) {
  const tabs = [
    { id: 'courant', label: 'Courants' },
    { id: 'parti', label: 'Partis' },
    { id: 'personnalité', label: 'Personnalités' },
  ];
  return (
    <div className="catalog-filters">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`catalog-filter${active.includes(t.id) ? ' active' : ''}`}
          onClick={() => {
            if (active.includes(t.id)) onChange(active.filter(x => x !== t.id));
            else onChange([...active, t.id]);
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- section de recherche par nom ------------------------------ */
function SearchBar({ value, onChange }) {
  return (
    <div className="catalog-search">
      <label htmlFor="catalog-search" className="catalog-search-label">Rechercher un nom, un parti ou un courant</label>
      <input
        id="catalog-search"
        className="catalog-search-input"
        type="search"
        value={value}
        placeholder="Ex.&nbsp;« Bardella », « écologie politique », « RN »…"
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="catalog-search-clear" onClick={() => onChange('')} aria-label="Effacer la recherche">✕</button>
      )}
    </div>
  );
}

/* ---------- page -------------------------------------------------------- */
export default function PartisPersonnalites() {
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState(['courant', 'parti', 'personnalité']);
  const [focusType, setFocusType] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = catalog.filter(item => {
      if (!activeTypes.includes(item.type)) return false;
      if (!q) return true;
      const hay = `${item.name} ${item.family} ${item.id} ${item.party || ''} ${item.role || ''}`.toLowerCase();
      return hay.includes(q);
    });
    return matched;
  }, [query, activeTypes]);

  const navTo = (item) => {
    if (item.type === 'courant') setFocusType('currents');
    else if (item.type === 'parti') setFocusType('parties');
    else setFocusType('personalities');
  };

  return (
    <div className="page-container container editorial">
      <p className="kicker">Pour situer les idées</p>
      <TitleCollage
        kicker="Catalogue"
        letters={['p', 'a', 'r', 't', 'i', 's', ' ', 'p', 'e', 'r', 's', 'o', 'n', 'n', 'a', 'l', 'i', 't', 'é', 's', ' ', 'e', 't', 'c', 'o', 'u', 'r', 'a', 'n', 't', 's']}
        size={0.55}
        rotate={4}
      />
      <h1 className="page-title">Partis, courants et personnalités</h1>
      <p className="page-lead">
        Un atlas de la pensée politique française, replié sur dix dimensions.
        Chaque entrée — courant, parti ou personnalité — est séparée, sourcée
        et vérifiée. Elles ne sont pas des cases : ce sont des positions qui
        peuvent se recouper.
      </p>

      <div className="catalog-toolbar">
        <TypeFilter active={activeTypes} onChange={setActiveTypes} />
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="catalog-grid">
        {filtered.map(item => <Entry key={item.id} item={item} />)}
        {filtered.length === 0 && (
          <p className="catalog-empty">Aucun résultat pour « {query} ». Essayez un nom, un parti ou un courant.</p>
        )}
      </div>

      <p className="catalog-note">
        Les positions des partis sont des reconstructions à partir des programmes publiés (législatives 2024, programmes présidentiels 2022).
        Les personnalités sont vérifiées à partir de leur biographie officielle et de leurs déclarations publiques.
        Ce catalogue est un <em>module explicatif</em>, pas un verdict de vote.
      </p>
    </div>
  );
}
