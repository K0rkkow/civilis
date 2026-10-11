import React, { useEffect } from 'react';

export default function About() {
  useEffect(() => { document.title = 'À propos — CIVILIS'; }, []);
  return (
    <div className="page-container container editorial">
      <p className="kicker">Qui sommes-nous</p>
      <h1>À propos de CIVILIS</h1>

      <section className="about-section">
        <h2>Le nom</h2>
        <p>
          <em>Civilis</em> signifie « citoyen » en latin. C'est dans la cité — l'<em>civitas</em> —
          que les questions qui composent ce test se posent : la liberté, la justice,
          le pouvoir, le bien commun. Le projet s'inspire de la maïeutique socratique :
          faire accoucher des idées, jamais les prescrire.
        </p>
      </section>

      <section className="about-section">
        <h2>La mission</h2>
        <p>
          Aider chacun à mieux comprendre son positionnement politique — ses valeurs,
          ses priorités, ses tensions éventuelles — sans étiquette imposée ni verdict.
          Dans un espace public polarisé, décrire honnêtement la complexité de ses convictions
          est déjà une forme d'engagement rationnel.
        </p>
      </section>

      <section className="about-section">
        <h2>Nos engagements</h2>
        <ul className="about-engagements">
          <li><strong>Neutralité méthodologique</strong> — aucun courant n'est favorisé ; les modèles de référence sont publics.</li>
          <li><strong>Explicabilité</strong> — chaque score et chaque rapprochement peuvent être compris depuis la page méthode.</li>
          <li><strong>Confidentialité</strong> — rien n'est envoyé à un serveur ; tes données restent locales et effaçables.</li>
          <li><strong>Honnêteté des limites</strong> — l'outil affiche ce qu'il ne sait pas plutôt que d'inventer une précision.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Les images</h2>
        <p>
          Les photographies du site proviennent de <strong>Wikimedia Commons</strong>
          (musée du Louvre, Acropole d'Athènes, musées grecs). Chaque légende mentionne
          l'auteur, la provenance et la licence.
        </p>
      </section>
    </div>
  );
}
