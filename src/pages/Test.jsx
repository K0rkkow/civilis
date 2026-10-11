import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, getQuestionById } from '../lib/questions';
import { getKidsQuestions, getKidsRewrite, getKidsOptionText } from '../lib/kids';
import { setTestGuard } from '../lib/testGuard.js';
import { getChapters, isChapterBoundary, chapterIndexAt, resumePlan } from '../lib/chapters.js';
import { getIllustration } from '../lib/illustrations';
import '../styles/test.css';

const LS_KEY = 'civilis.answers';
const KIDS_KEY = 'civilis.kids-mode';
/* Position exacte dans le test : permet de reprendre précisément où on
   s'est arrêté après un rechargement, une sortie confirmée ou un retour. */
const POS_KEY = 'civilis.test-position';

function loadAnswers() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}

function loadPosition() {
  try { return JSON.parse(localStorage.getItem(POS_KEY) || 'null'); }
  catch { return null; }
}

/* ---------------- sablier de progression ------------------------------- */
/* Repère d'interface : le questionnaire avance, ce n'est pas un chargement.
   Il est placé à côté du point doré de la barre de progression et le suit
   (bascule à gauche du point en fin de parcours pour ne jamais déborder).
   Décoratif (aria-hidden) : la progression réelle reste donnée par le compteur
   de question, le pourcentage et la barre. */
function Hourglass() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" focusable="false">
      <g className="quiz-hourglass-rotor">
        <path
          d="M7 4 H17 L13 10 V14 L17 20 H7 L11 14 V10 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M11.6 17.4 H12.4 L12 20 Z" fill="currentColor" opacity="0.75" />
      </g>
    </svg>
  );
}

/* ---- simplification à la demande : icônes discrètes --------------------- */
function SimplifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M12 3 L13.6 9.2 L20 10.8 L13.6 12.4 L12 18.6 L10.4 12.4 L4 10.8 L10.4 9.2 Z"
        fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
      <path d="M18.5 16.5 L19.3 19.1 L21.9 19.9 L19.3 20.7 L18.5 23.3 L17.7 20.7 L15.1 19.9 L17.7 19.1 Z"
        fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}

function OriginalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M6 3.5 H15.5 L19 7 V20.5 H6 Z"
        fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
      <path d="M15.5 3.5 V7 H19" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 11 H16 M9 14 H16 M9 17 H13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function QuestionScreen({
  q, index, total, answer, onAnswer, onNext, onPrev, progress, first,
  kids, rewrite, onExitKids,
}) {
  const answered = answer !== undefined && answer !== null;
  const illustration = getIllustration(q.id);
  const statement = kids && rewrite ? rewrite.statement : q.statement;
  const options = kids && rewrite ? rewrite.options : q.options;

  /* Simplification À LA DEMANDE : un clic sur « Simplifier la question »
     remplace visuellement l'énoncé classique par sa formulation enfant
     (superposition propre, fond opaque, texte sélectionnable) ; un clic sur
     « Voir la question originale » rétablit l'énoncé initial. Aucun effet
     au survol : seul le clic (ou le clavier) bascule. Les réponses, la
     progression et le calcul ne sont jamais touchés. Le contrôle n'existe
     que si la question possède une reformulation enfant réelle
     (getKidsRewrite, association vérifiée par tests/kids.test.mjs). */
  const kidsRewrite = kids ? null : getKidsRewrite(q.id);
  const [kidsView, setKidsView] = useState(false);
  /* changement de question → jamais de formulation héritée par erreur */
  useEffect(() => { setKidsView(false); }, [q.id]);

  return (
    <div className="quiz-screen" key={q.id}>
      <div className="quiz-progress-row">
        <span className="quiz-theme-badge">{q.theme}</span>
        <span className="quiz-count">
          Question {index + 1} / {total}
          {kids && (
            <button type="button" className="kids-exit" onClick={onExitKids}>
              Quitter le mode enfant
            </button>
          )}
        </span>
      </div>
      <div className="quiz-progress-bar" aria-hidden="true">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }}>
          <span className={`quiz-progress-hg ${progress >= 88 ? 'hg-in' : 'hg-out'}`}>
            <span className="quiz-hg-wobble"><Hourglass /></span>
          </span>
        </div>
        <span className="quiz-progress-percent">{progress}%</span>
      </div>
      {kids ? (
        rewrite && rewrite.explain && (
          <div className="kids-explain-card">
            <p className="kids-explain-text">{rewrite.explain}</p>
          </div>
        )
      ) : (
        q.context && (
          <div className="quiz-context-card">
            <div
              className="quiz-context-trigger"
              onClick={() => {}}
              aria-expanded="false"
              aria-label="Afficher le contexte qui accompagne cette question"
            >
              <span className="quiz-context-label">Contexte</span>
              <span className="quiz-context-symbol" aria-hidden="true">▲</span>
            </div>
            <p className="quiz-context">
              {q.context}
            </p>
          </div>
        )
      )}
      {/* Illustration de la question : photographie réelle, créditée, choisie
          pour le contenu exact de la question (voir src/lib/illustrations.js) */}
      {illustration && (
        <div className="quiz-illustration" data-count={illustration.images.length}>
          {illustration.images.map((img) => (
            <figure className="quiz-illustration-item" key={img.src}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.closest('.quiz-illustration-item')?.classList.add('img-failed'); }}
              />
              <figcaption>{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {/* Question classique, avec sa formulation enfant par-dessus au clic :
          les deux couches occupent le même flux — la classique quitte le
          rendu quand l'enfant s'affiche (aucun texte en dessous, aucune
          superposition de glyphes), l'enfant est alignée au pixel (mêmes
          classes) sur fond opaque ivoire et reste sélectionnable. Le contrôle
          explicite vit juste sous l'énoncé, lié à cette question. */}
      <div className={`question-dual${kidsView && kidsRewrite ? ' kids-on' : ''}`}>
        <h2 className="quiz-question reveal">{statement}</h2>
        {kidsRewrite && (
          <div className="question-kids">
            <h2 className="quiz-question">{kidsRewrite.statement}</h2>
          </div>
        )}
        {!kids && kidsRewrite && (
          <button
            type="button"
            className={`simplify-btn${kidsView ? ' on' : ''}`}
            aria-pressed={kidsView}
            onClick={() => setKidsView(v => !v)}
          >
            {kidsView ? <OriginalIcon /> : <SimplifyIcon />}
            <span>{kidsView ? 'Voir la question originale' : 'Simplifier la question'}</span>
          </button>
        )}
      </div>
      <p className="quiz-dimension-hint">
        {kids
          ? "Il n'y a pas de bonne ni de mauvaise réponse — choisis ce que tu penses vraiment."
          : 'Chaque réponse nourrit une ou plusieurs des dix dimensions — économie, libertés, autorité, société, immigration, écologie, institutions, nation, justice, travail.'}
      </p>
      <div className="quiz-options" role="radiogroup" aria-label={statement}>
        {options.map((o) => (
          <label key={o.value} className={`quiz-choice${answer === o.value ? ' selected' : ''}`}>
            <input
              type="radio"
              name={`q-${q.id}`}
              value={o.value}
              checked={answer === o.value}
              onChange={() => onAnswer(o.value, index, total)}
            />
            <span className="quiz-choice-mark" aria-hidden="true" />
            <span className="quiz-choice-label">{o.text}</span>
          </label>
        ))}
        <label className={`quiz-choice quiz-choice-uncertain${answer === 'uncertain' ? ' selected' : ''}`}>
          <input
            type="radio"
            name={`q-${q.id}`}
            value="uncertain"
            checked={answer === 'uncertain'}
            onChange={() => onAnswer('uncertain', index, total)}
          />
          <span className="quiz-choice-mark" aria-hidden="true" />
          <span className="quiz-choice-label">{kids ? 'Je ne sais pas' : 'Je ne sais pas / cela dépend'}</span>
        </label>
      </div>
      <div className="quiz-nav">
        <button className="btn-ghost" onClick={onPrev} disabled={first}>← Précédent</button>
        <button
          className="btn-ink"
          onClick={onNext}
          disabled={!answered}
          title={answered ? '' : 'Choisis une réponse pour continuer'}
        >
          {index === total - 1
            ? (kids ? 'Voir mes idées' : 'Voir mes résultats')
            : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}

/* ---------------- transition entre chapitres ---------------------------- */
/* Écran de respiration entre deux chapitres, à la manière d'une pause
   éditoriale. Annonce le chapitre terminé et le thème suivant ; le passage
   n'est JAMAIS automatique — l'utilisateur clique « Continuer ». Le dernier
   chapitre ne produit pas d'écran fantôme : il mène au récapitulatif. */
function ChapterTransition({
  currentTheme, nextTheme, chapterNumber, chapterTotal,
  answeredCount, totalQuestions, onContinue,
}) {
  return (
    <div className="quiz-screen chapter-transition">
      <p className="quiz-step-label">
        {currentTheme} — Chapitre {chapterNumber} / {chapterTotal} terminé
      </p>
      <h2 className="chapter-transition-title">
        Tu viens d'explorer tes idées sur <em>{currentTheme.toLowerCase()}</em>.
      </h2>
      <svg className="chapter-transition-meander" viewBox="0 0 54 10" width="54" height="10" aria-hidden="true" focusable="false">
        <path
          d="M1 9 V1 H13 V7 H7 V4 H19 V1 H31 V7 H25 V4 H37 V1 H49 V7 H43 V4 H53"
          fill="none" stroke="currentColor" strokeWidth="1.6"
        />
      </svg>
      <p className="chapter-transition-next">Passons maintenant au thème suivant :</p>
      <p className="chapter-transition-next-name">{nextTheme}</p>
      <button type="button" className="btn-ink chapter-transition-btn" onClick={onContinue}>
        Continuer →
      </button>
      <p className="chapter-transition-meta">
        {answeredCount} réponse{answeredCount > 1 ? 's' : ''} sur {totalQuestions} · chapitre {chapterNumber} sur {chapterTotal}
      </p>
    </div>
  );
}

function ProfileStep({ profile, setProfile, onNext, onSkip }) {
  return (
    <div className="quiz-screen">
      <p className="quiz-step-label">Avant de commencer</p>
      <h2>Ton profil <em>(facultatif)</em></h2>
      <p className="quiz-context">
        Ces informations ne jouent <strong>aucun role</strong> dans les résultats — elles ne
        servent qu'à des statistiques si tu les partages volontairement. Tu peux passer cette
        étape sans problème.
      </p>
      <fieldset className="profile-fieldset">
        <legend>Tranche d'âge</legend>
        {['Moins de 18 ans','18–24 ans','25–34 ans','35–44 ans','45–54 ans','55–64 ans','65 ans et plus',"Je préfère ne pas répondre"].map(a => (
          <label key={a} className={`choice${profile.age === a ? ' selected' : ''}`}>
            <input type="radio" name="age" checked={profile.age === a} onChange={() => setProfile({ ...profile, age: a })} />
            <span>{a}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="profile-fieldset">
        <legend>Sexe</legend>
        {['Femme','Homme','Autre / je me définis autrement','Je préfère ne pas répondre'].map(s => (
          <label key={s} className={`choice${profile.sexe === s ? ' selected' : ''}`}>
            <input type="radio" name="sexe" checked={profile.sexe === s} onChange={() => setProfile({ ...profile, sexe: s })} />
            <span>{s}</span>
          </label>
        ))}
      </fieldset>
      <div className="quiz-nav">
        <button className="btn-ghost" onClick={onSkip}>Passer cette étape</button>
        <button className="btn-ink" onClick={onNext}>Continuer</button>
      </div>
    </div>
  );
}

function ConsentStep({ onNext, onBack, kids }) {
  return (
    <div className="quiz-screen">
      <p className="quiz-step-label">Une précision avant de commencer</p>
      <h2>Il n'existe pas de réponse parfaite.</h2>
      <p className="quiz-context">
        Choisis celle qui correspond le mieux à ce que tu penses réellement, même si elle
        est imparfaite ou nuancée. {kids
          ? "Une option « Je ne sais pas » est proposée à chaque question : ce n'est jamais grave de la choisir."
          : "Une option « je ne sais pas / cela dépend » est proposée à chaque question : elle n'est jamais convertie en opinion."}
      </p>
      <p className="quiz-note">
        Ce test est un <strong>outil de réflexion</strong>, pas un diagnostic scientifique
        ni un sondage représentatif. Tes réponses restent dans ton navigateur — rien
        n'est envoyé à un serveur.
      </p>
      <div className="quiz-nav">
        <button className="btn-ghost" onClick={onBack}>Retour</button>
        <button className="btn-ink" onClick={onNext}>J'ai compris — commencer</button>
      </div>
    </div>
  );
}

function Recap({ answers, onJump, onSubmit, onRestart, kids, activeList, onExitKids }) {
  const answeredCount = activeList.filter(q => answers[q.id] != null).length;
  const uncertain = activeList.filter(q => answers[q.id] === 'uncertain').length;
  return (
    <div className="quiz-screen">
      <p className="quiz-step-label">Récapitulatif</p>
      <h2>Tes réponses ({answeredCount} question{answeredCount > 1 ? 's' : ''})</h2>
      {uncertain > 0 && (
        <p className="quiz-note">{uncertain} réponse{uncertain > 1 ? 's' : ''} « incertaine » — ces questions n'influencent pas les résultats.</p>
      )}
      <ol className="recap-list">
        {activeList.map((q, i) => {
          const v = answers[q.id];
          const rewrite = kids ? getKidsRewrite(q.id) : null;
          const originalText = q.options.find(o => o.value === v)?.text;
          const label = v && v !== 'uncertain'
            ? (kids ? (getKidsOptionText(q.id, v) ?? originalText) : originalText)
            : (v === 'uncertain' ? 'Je ne sais pas' : 'Sans réponse');
          const isAnswered = v != null && v !== 'uncertain';
          return (
            <li key={q.id}>
              <button className="recap-item" onClick={() => onJump(i)} title="Modifier cette réponse">
                <span className="recap-theme">{q.theme}</span>
                <span className="recap-text">{rewrite ? rewrite.statement : q.statement}</span>
                <span className={`recap-answer${!v ? ' empty' : ''}${v === 'uncertain' ? ' uncertain' : ''}`}>
                  {label}
                  {isAnswered && <span className="recap-status">✔</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="quiz-nav">
        <button className="btn-ghost" onClick={onRestart}>Tout recommencer</button>
        <button className="btn-ink" onClick={onSubmit}>
          {kids ? 'Valider mes réponses et découvrir mes idées' : 'Valider mes réponses et découvrir mon profil'}
        </button>
      </div>
      {kids && (
        <div className="kids-recap-exit">
          <button type="button" className="btn-ghost" onClick={onExitKids}>
            Revenir au test classique
          </button>
        </div>
      )}
    </div>
  );
}

export default function Test() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => loadAnswers());
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('civilis.profile') || '{}'); } catch { return {}; }
  });
  const [kidsMode, setKidsMode] = useState(() => {
    try { return localStorage.getItem(KIDS_KEY) === '1'; } catch { return false; }
  });

  /* La liste active dépend du mode : 39 questions reformulées pour les 5–12 ans,
     la banque complète (62) pour le mode classique. Les identifiants et les
     valeurs de réponse sont identiques dans les deux modes : le moteur de
     calcul ne change pas, et les réponses déjà données sont conservées. */
  const activeList = useMemo(
    () => (kidsMode ? getKidsQuestions() : questions),
    [kidsMode]
  );

  /* Chapitres réels du parcours actif : suites contiguës de questions
     partageant le même thème (source de vérité : la banque et la liste
     enfant — rien n'est codé en dur, voir src/lib/chapters.js). */
  const chapters = useMemo(() => getChapters(activeList), [activeList]);

  /* Étapes : profile → consent → questions → chapter-transition → recap.
     Plan de reprise unique (phase + question), partagé par les deux états :
     reprise exacte après un rechargement, y compris sur un écran de
     transition de chapitre si la position est une vraie frontière répondue. */
  const savedCount = useMemo(
    () => activeList.filter(q => answers[q.id] != null).length,
    [answers, activeList]);
  const [resume] = useState(() => resumePlan(activeList, answers, kidsMode, loadPosition()));
  const [phase, setPhase] = useState(resume.phase);
  const [qIndex, setQIndex] = useState(resume.index);

  const total = activeList.length;
  const progress = Math.round((Math.min(qIndex, total) / total) * 100);

  /* Sauvegarde à chaque changement */
  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(answers)); }, [answers]);
  useEffect(() => { if (Object.keys(profile).length) localStorage.setItem('civilis.profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => {
    try { localStorage.setItem(KIDS_KEY, kidsMode ? '1' : '0'); } catch { /* stockage indisponible */ }
  }, [kidsMode]);

  /* Position exacte : question courante + phase, pour reprendre au même endroit */
  useEffect(() => {
    try { localStorage.setItem(POS_KEY, JSON.stringify({ kids: kidsMode, index: qIndex, phase })); }
    catch { /* stockage indisponible */ }
  }, [qIndex, phase, kidsMode]);

  /* Mode test concentré : publier l'état à la coquille de l'application.
     Actif pendant les questions, les écrans de transition de chapitre et le
     récapitulatif — jamais sur l'écran d'avant-test, et plus du tout une fois
     le test terminé. La confirmation de sortie couvre donc aussi les écrans
     de transition. */
  useEffect(() => {
    setTestGuard({
      active: phase === 'questions' || phase === 'recap' || phase === 'chapter-transition',
      phase,
      label: phase === 'chapter-transition'
        ? `Chapitre ${chapterIndexAt(chapters, qIndex) + 1} / ${chapters.length} terminé`
        : phase === 'recap'
          ? 'Récapitulatif'
          : `Question ${Math.min(qIndex + 1, activeList.length)} / ${activeList.length}`,
      progress: phase === 'chapter-transition'
        ? Math.round(((qIndex + 1) / activeList.length) * 100)
        : progress,
    });
  }, [phase, qIndex, activeList.length, progress, chapters]);

  /* Au démontage (test terminé, sortie confirmée) : désarmer la protection */
  useEffect(() => () => { setTestGuard({ active: false, phase: 'profile' }); }, []);

  const handleAnswer = (value) => {
    const id = activeList[qIndex].id;
    setAnswers(prev => ({ ...prev, [id]: value }));
  };
  const handleNext = () => {
    if (qIndex < total - 1) {
      /* Fin de chapitre : écran de transition avant le thème suivant —
         le passage n'est jamais automatique, « Continuer » décide. */
      if (isChapterBoundary(activeList, qIndex)) setPhase('chapter-transition');
      else setQIndex(i => i + 1);
    } else setPhase('recap');
  };
  const continueToNextChapter = () => {
    setQIndex(i => i + 1);
    setPhase('questions');
  };
  const handlePrev = () => {
    if (qIndex > 0) setQIndex(i => i - 1);
    else {
      setPhase('consent');
    }
  };
  const submit = () => {
    navigate('/results');
  };
  const restart = () => {
    if (window.confirm('Effacer toutes tes réponses et recommencer ?')) {
      setAnswers({});
      localStorage.removeItem(LS_KEY);
      setQIndex(0);
      setPhase('profile');
    }
  };

  /* Mode enfant complet : le parcours reste fonctionnel (drapeau de session,
     bouton de sortie ci-dessous) mais n'est plus proposé au départ — la
     version enfant est désormais accessible question par question via le
     bouton « + ». La sortie conserve toutes les réponses déjà données. */
  const exitKids = () => {
    setKidsMode(false);
    const firstUnanswered = questions.findIndex(q => answers[q.id] == null);
    if (firstUnanswered === -1) {
      setQIndex(questions.length - 1);
      setPhase('recap');
    } else {
      setQIndex(firstUnanswered);
      setPhase('questions');
    }
  };

  /* Clavier : ← et → pour naviguer entre questions */
  useEffect(() => {
    if (phase !== 'questions') return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') {
        const q = activeList[qIndex];
        if (answers[q.id] != null) handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, qIndex, answers, activeList]);

  if (phase === 'profile') {
    return (
      <div className="quiz-container container-narrow">
        <ProfileStep
          profile={profile}
          setProfile={setProfile}
          onNext={() => setPhase('consent')}
          onSkip={() => setProfile({}) || setPhase('consent')}
        />
      </div>
    );
  }
  if (phase === 'consent') {
    return (
      <div className="quiz-container container-narrow">
        <ConsentStep
          onNext={() => setPhase('questions')}
          onBack={() => setPhase('profile')}
          kids={kidsMode}
        />
      </div>
    );
  }
  if (phase === 'chapter-transition') {
    /* isChapterBoundary garantit qu'un chapitre suivant existe réellement :
       jamais de transition — ni de « prochain thème » — après la dernière question. */
    const chapterNumber = chapterIndexAt(chapters, qIndex) + 1;
    return (
      <div className="quiz-container container-narrow">
        <ChapterTransition
          currentTheme={activeList[qIndex].theme}
          nextTheme={activeList[qIndex + 1].theme}
          chapterNumber={chapterNumber}
          chapterTotal={chapters.length}
          answeredCount={savedCount}
          totalQuestions={activeList.length}
          onContinue={continueToNextChapter}
        />
      </div>
    );
  }
  if (phase === 'recap') {
    return (
      <div className="quiz-container container-narrow">
        <Recap
          answers={answers}
          onJump={(i) => { setQIndex(i); setPhase('questions'); }}
          onSubmit={submit}
          onRestart={restart}
          kids={kidsMode}
          activeList={activeList}
          onExitKids={exitKids}
        />
      </div>
    );
  }

  const q = activeList[qIndex];
  const rewrite = kidsMode ? getKidsRewrite(q.id) : null;
  return (
    <div className="quiz-container container-narrow">
      <QuestionScreen
        q={q}
        index={qIndex}
        total={total}
        answer={answers[q.id]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        progress={progress}
        first={qIndex === 0}
        kids={kidsMode}
        rewrite={rewrite}
        onExitKids={exitKids}
      />
    </div>
  );
}