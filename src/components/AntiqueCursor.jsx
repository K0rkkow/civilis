/* ============================================================================
   CIVILIS — curseur antique et traînée dorée
   ----------------------------------------------------------------------------
   Un curseur fin façon plume antique (SVG natif, zéro retard) et une traînée
   courte en or patiné : quelques points fixes qui suivent le pointeur avec un
   léger retard, s'estompant dès que la souris s'arrête.

   Contraintes respectées :
   - desktop uniquement : (hover: hover) and (pointer: fine) ; sur tactile,
     le composant n'active rien et les interactions restent natives ;
   - prefers-reduced-motion : curseur et traînée désactivés proprement,
     y compris si la préférence change en cours de session ;
   - aucun élément ne bloque les clics : pointer-events: none partout ;
   - pas de création de DOM au fil des mouvements : 7 points fixes,
     un seul requestAnimationFrame, position: fixed (aucun débordement).
   ========================================================================== */

import React, { useEffect, useRef } from 'react';

const TRAIL_COUNT = 7;

export default function AntiqueCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let stop = null;

    const enable = () => {
      if (stop) return; // déjà actif
      document.documentElement.classList.add('curseur-antique');
      const dots = ref.current ? Array.from(ref.current.children) : [];
      const pos = dots.map(() => ({ x: -100, y: -100 }));
      const target = { x: -100, y: -100 };
      let lastMove = -1e9;

      const onMove = (e) => {
        target.x = e.clientX;
        target.y = e.clientY;
        lastMove = performance.now();
      };
      window.addEventListener('mousemove', onMove, { passive: true });

      const step = () => {
        const idle = performance.now() - lastMove > 110;
        let px = target.x;
        let py = target.y;
        for (let i = 0; i < dots.length; i++) {
          const k = i === 0 ? 0.42 : 0.3;
          pos[i].x += (px - pos[i].x) * k;
          pos[i].y += (py - pos[i].y) * k;
          px = pos[i].x;
          py = pos[i].y;
          const d = dots[i];
          d.style.transform =
            `translate3d(${pos[i].x}px, ${pos[i].y}px, 0) translate(-50%, -50%)` +
            (idle ? ' scale(.6)' : '');
          d.style.opacity = idle ? '0' : String((0.42 - i * 0.05).toFixed(2));
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);

      stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove);
        document.documentElement.classList.remove('curseur-antique');
      };
    };

    const disable = () => {
      if (stop) { stop(); stop = null; }
    };

    const sync = () => {
      if (fine.matches && !reduced.matches) enable();
      else disable();
    };

    sync();
    fine.addEventListener?.('change', sync);
    reduced.addEventListener?.('change', sync);

    return () => {
      disable();
      fine.removeEventListener?.('change', sync);
      reduced.removeEventListener?.('change', sync);
    };
  }, []);

  return (
    <div className="cursor-trail" aria-hidden="true" ref={ref}>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <span key={i} style={{ width: 7 - i, height: 7 - i }} />
      ))}
    </div>
  );
}