/* ============================================================================
   CIVILIS — résultats du mode enfant (5–12 ans)
   ----------------------------------------------------------------------------
   Lecture simple et nuancée du parcours enfant :
   - les « grandes idées » (courants réels de currents.js) racontées avec des
     mots accessibles et un exemple du quotidien (KIDS_CURRENTS) ;
   - aucun rattachement à un parti ou à une personnalité politique ;
   - si les réponses sont trop incertaines, aucune grande idée n'est affichée ;
   - rappel explicite : les idées changent, il n'y a pas de réponse parfaite.
   ========================================================================== */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KIDS_CURRENTS } from '../lib/kids';

/* Niveau qualitatif honnête plutôt qu'un pourcentage : un chiffre précis
   donnerait à un enfant une fausse impression de certitude scientifique.
   Les seuils sont définis ici, vérifiables, et dérivés de la proximité
   calculée par le moteur. */
function kidsLevel(proximity) {
  if (proximity >= 75) return 'très proche de tes réponses';
  if (proximity >= 60) return 'proche de tes réponses';
  if (proximity >= 45) return 'un peu proche de tes réponses';
  return 'assez différente de tes réponses';
}

export default function KidsResults({ result }) {
  const navigate = useNavigate();
  const answered = result.meta.answeredCount;
  const top = (result.proximities || [])
    .slice(0, 3)
    .filter((p) => p.proximity != null && KIDS_CURRENTS[p.current.key]);
  const tooUncertain = result.meta.insufficient || top.length === 0;

  const restart = () => {
    if (window.confirm('Effacer tes réponses et refaire le test ?')) {
      localStorage.removeItem('civilis.answers');
      navigate('/test');
    }
  };

  const tryClassic = () => {
    try { localStorage.setItem('civilis.kids-mode', '0'); } catch { /* stockage indisponible */ }
    navigate('/test');
  };

  return (
    <div className="kids-results container-narrow">
      <p className="kicker">Ton parcours des idées</p>
      <h1 className="kids-results-title">
        Voici les grandes idées qui ressemblent le plus à tes réponses
      </h1>
      <p className="kids-results-lead">
        Tu as répondu à {answered} question{answered > 1 ? 's' : ''}. On a comparé
        tes réponses avec de grandes façons de penser le monde. Voici celles qui
        s\'en rapprochent le plus.
      </p>

      {tooUncertain ? (
        <div className="kids-results-empty">
          <p>
            Pour l\'instant, il n\'y a pas encore assez de réponses pour découvrir
            tes idées.
          </p>
          <p>Réponds à quelques questions de plus, puis reviens ici !</p>
          <p className="kids-results-cta">
            <Link className="btn-ink" to="/test">Continuer le test</Link>
          </p>
        </div>
      ) : (
        <>
          <ol className="kids-ideas">
            {top.map(({ current, proximity }, i) => {
              const k = KIDS_CURRENTS[current.key];
              return (
                <li key={current.key} className="kids-idea">
                  <span className="kids-idea-rank" aria-hidden="true">{i + 1}</span>
                  <h2 className="kids-idea-title">{k.title}</h2>
                  <p className="kids-idea-simple">{k.simple}</p>
                  <p className="kids-idea-example">
                    <span>Un exemple :</span> {k.example}
                  </p>
                  <p className="kids-idea-match">
                    Cette grande idée semble {kidsLevel(proximity)}.
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="kids-results-notes">
            <p>
              Ces grandes idées ne sont pas des partis politiques, et elles ne
              disent pas ce que tu es pour toujours : elles ressemblent juste à
              tes réponses d\'aujourd\'hui.
            </p>
            <p>
              Tes idées peuvent changer en grandissant, en apprenant et en
              discutant. Il n\'y a pas de réponse parfaite.
            </p>
          </div>
        </>
      )}

      <div className="kids-results-actions">
        <Link className="btn-ghost" to="/test">Revoir mes réponses</Link>
        <button type="button" className="btn-outline" onClick={tryClassic}>
          Découvrir le test classique
        </button>
        <button type="button" className="btn-ghost" onClick={restart}>
          Recommencer
        </button>
      </div>
    </div>
  );
}