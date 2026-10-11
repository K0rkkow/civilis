/* ============================================================================
   CIVILIS — mode test concentré
   ----------------------------------------------------------------------------
   1. TestFocusHeader : en-tête très discret pendant le test — logo et
      progression, rien d'autre. La navigation principale est masquée pour
      préserver la concentration, mais le logo reste un vrai lien : le quitter
      passe par la confirmation.
   2. TestLeaveGuard : confirmation éditoriale avant de quitter le test.
      Trois mécanismes, un seul objectif — éviter les sorties accidentelles :
        a. clics sur les liens internes (interception en phase de capture,
           avant React Router) ;
        b. boutons Retour / Avant du navigateur (popstate) : la sortie est
           annulée silencieusement (l'URL revient sur /test) puis confirmée ;
        c. rechargement / fermeture d'onglet : confirmation NATIVE du
           navigateur via beforeunload — jamais une fausse fenêtre.
      Le message est honnête : « Continuer le test » ne réinitialise rien —
      question et réponses restent exactement en place. « Quitter le test »
      réinitialise complètement la session abandonnée (réponses, position,
      profil facultatif, mode enfant) : le prochain départ revient à l'écran
      « Avant de commencer », et la garde se désarme avant la navigation.
      Une session terminée (résultats validés) n'est jamais effacée.
   ========================================================================== */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetTestSession } from '../lib/testGuard.js';

/* ---------------- en-tête très discret pendant le test ------------------- */

export function TestFocusHeader({ state }) {
  return (
    <header className="test-header" aria-label="Test CIVILIS en cours">
      <div className="container test-header-content">
        <Link to="/" className="logo" aria-label="CIVILIS — accueil">
          CIVILIS<span className="logo-dot" aria-hidden="true" />
        </Link>
        <span className="test-header-progress" aria-live="polite">
          {state.label || 'Test en cours'}
        </span>
      </div>
      <div className="test-header-line" aria-hidden="true" style={{ width: `${state.progress || 0}%` }} />
    </header>
  );
}

/* ---------------- confirmation avant de quitter -------------------------- */

export function TestLeaveGuard({ state }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [destLabel, setDestLabel] = useState('');
  const pendingRef = useRef(null);   /* { type:'link', href } | { type:'pop', delta } */
  const bypassRef = useRef(false);    /* laisse passer le popstate volontaire (sortie confirmée) */
  const idxRef = useRef(null);        /* index d'historique pendant le test */
  const stayRef = useRef(null);
  const active = state.active;

  /* Mémoriser l'index d'historique courant pour pouvoir annuler un Retour.
     Au réarmement, repartir proprement : un bypass d'une session précédente
     ne doit jamais neutraliser la protection de la session suivante. */
  useEffect(() => {
    if (active) {
      const s = window.history.state;
      idxRef.current = s && typeof s.idx === 'number' ? s.idx : null;
      bypassRef.current = false;
    }
  }, [active]);

  /* a. Liens internes : interception en capture, avant React Router.
        La navigation entre les questions du test n'utilise aucun lien : cette
        confirmation ne peut donc jamais se déclencher pour « Suivant ». */
  useEffect(() => {
    if (!active) return;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      const raw = a.getAttribute('href');
      if (!raw || a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(mailto:|tel:|javascript:)/i.test(raw)) return;
      let url;
      try { url = new URL(a.href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      /* ancre interne à la même page : jamais une sortie */
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      pendingRef.current = { type: 'link', href: url.pathname + url.search + url.hash };
      setDestLabel(url.pathname === '/' ? "l'accueil" : `la page « ${decodeURIComponent(url.pathname)} »`);
      setShow(true);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [active]);

  /* b. Retour / Avant du navigateur : annulation silencieuse puis confirmation.
        popstate ne peut pas être annulé — l'URL a déjà changé quand il arrive.
        On mesure l'écart d'index d'historique, on revient dessus sans que rien
        ne soit perdu, et on demande la confirmation. La fenêtre (fond ivoire
        opaque) couvre l'écran pendant toute l'opération. */
  useEffect(() => {
    if (!active) return;
    const onPop = () => {
      if (bypassRef.current) {
        bypassRef.current = false;
        const s = window.history.state;
        idxRef.current = s && typeof s.idx === 'number' ? s.idx : idxRef.current;
        return;
      }
      const s = window.history.state;
      const newIdx = s && typeof s.idx === 'number' ? s.idx : null;
      const delta = (typeof newIdx === 'number' && typeof idxRef.current === 'number')
        ? newIdx - idxRef.current
        : null;
      /* on est encore sur /test : simple mise à jour de l'index */
      if (window.location.pathname === '/test') {
        idxRef.current = newIdx;
        return;
      }
      /* retour silencieux sur /test : rien n'est perdu */
      if (delta) window.history.go(-delta);
      pendingRef.current = { type: 'pop', delta };
      setDestLabel('la page précédente');
      setShow(true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [active]);

  /* c. Rechargement / fermeture d'onglet : mécanisme natif, un seul écouteur. */
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);

  const stay = () => {
    pendingRef.current = null;
    setShow(false);
  };

  const quit = () => {
    const p = pendingRef.current;
    pendingRef.current = null;
    setShow(false);
    if (!p) return;
    /* Réinitialisation complète de la session abandonnée : réponses, position
       exacte, profil facultatif (âge, sexe) et choix du mode sont effacés, et
       la protection se désarme — AVANT d'effectuer la navigation demandée. */
    resetTestSession();
    if (p.type === 'link') {
      navigate(p.href);
    } else if (p.delta) {
      bypassRef.current = true;
      window.history.go(p.delta);
    } else {
      navigate(-1); /* repli si l'index d'historique est inconnu */
    }
  };

  /* Échap = rester ; Tab reste sur les deux boutons de la fenêtre. */
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      stay();
    } else if (e.key === 'Tab') {
      const btns = e.currentTarget.querySelectorAll('button');
      const first = btns[0];
      const last = btns[btns.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    }
  };

  useEffect(() => {
    if (show) stayRef.current?.focus();
  }, [show]);

  if (!show) return null;
  return (
    <div
      className="leave-guard"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-guard-title"
      onKeyDown={onKeyDown}
    >
      <div className="leave-guard-card">
        <p className="leave-guard-kicker">CIVILIS</p>
        <h2 id="leave-guard-title">Tu es en plein test</h2>
        <p className="leave-guard-msg">
          Tu es sur le point de quitter ton test pour {destLabel}. En quittant
          maintenant, tes réponses, ta progression et ton profil seront
          effacés : le prochain test repartira de zéro. Veux-tu vraiment
          quitter le test ?
        </p>
        <div className="leave-guard-actions">
          <button ref={stayRef} type="button" className="btn-ink" onClick={stay}>
            Continuer le test
          </button>
          <button type="button" className="btn-ghost" onClick={quit}>
            Quitter le test
          </button>
        </div>
      </div>
    </div>
  );
}