import React, { useEffect } from 'react';
import { dimensions, DIMENSION_IDS } from '../lib/dimensions';
import { questions } from '../lib/questions';

export default function Method() {
  useEffect(() => { document.title = 'La démarche — CIVILIS'; }, []);
  return (
    <div className="page-container container editorial">
      <p className="kicker">Comment fonctionne CIVILIS</p>
      <h1>La démarche</h1>

      <section className="method-section">
        <h2>1 · Un questionnaire de {questions.length} questions</h2>
        <p>
          Chaque énoncé porte sur une idée précise, formulée de façon neutre. Aucun n'a de
          « bonne réponse » : les options décrivent des positions réellement défendues.
          Une option « je ne sais pas / cela dépend » est proposée à chaque question —
          elle n'est <strong>jamais</strong> convertie en opinion implicite.
        </p>
      </section>

      <section className="method-section">
        <h2>2 · Dix dimensions politiques</h2>
        <p>
          La politique n'est pas une ligne gauche-droite. Chaque réponse alimente une ou
          plusieurs <em>dimensions</em>, cotée de 0 à 100. Voici leur définition et leurs pôles :
        </p>
        <dl className="dimensions-dl">
          {DIMENSION_IDS.map(d => (
            <div key={d} className="dim-row">
              <dt>{dimensions[d].label}</dt>
              <dd>
                <span className="dim-pole">0 — {dimensions[d].pole0}</span>
                <span className="dim-pole">100 — {dimensions[d].pole100}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="method-section">
        <h2>3 · Un calcul déterministe et explicable</h2>
        <p>
          Ton score de dimension est la <strong>moyenne des valeurs des options choisies</strong>.
          Aucun aléatoire, aucune « intelligence artificielle » invisible : le code du moteur
          est court, commenté et testé automatiquement. Les dimensions où tu as peu répondu
          sont signalées, sans jamais être inventées.
        </p>
        <p>
          La proximité avec un courant se calcule comme une <strong>distance euclidienne
          pondérée</strong> entre ta position et celle du modèle de référence, sur les
          dimensions suffisamment renseignées. Le pourcentage affiché = 100 − distance ;
          il exprime une ressemblance idéologique, pas une probabilité d'appartenance.
        </p>
      </section>

      <section className="method-section">
        <h2>4 · Ce que ce test n'est pas</h2>
        <ul>
          <li>Un diagnostic scientifique ou un sondage représentatif.</li>
          <li>Un conseil de vote : le module partis est séparé du calcul des courants.</li>
          <li>Une vérité intérieure : tes convictions évoluent, le test photographie un instant.</li>
        </ul>
      </section>

      <section className="method-section">
        <h2>5 · Confidentialité</h2>
        <p>
          Ni compte, ni nom, ni e-mail. Le calcul a lieu <strong>entièrement dans ton
          navigateur</strong> ; tes réponses ne quittent jamais ton appareil. Tu peux
          les effacer à tout moment depuis le pied de page ou la fiche de résultat.
        </p>
      </section>
    </div>
  );
}
