import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  computeResults, calculateDimensionScores, weightedMean,
  calculateCurrentProximities, detectTensions, COVERAGE_MIN,
} from '../src/lib/analysis.js';
import { questions } from '../src/lib/questions.js';
import { currents } from '../src/lib/currents.js';
import { dimensions, DIMENSION_IDS } from '../src/lib/dimensions.js';
import { parties } from '../src/lib/parties.js';

/* ---------- helpers de scénarios ---------- */
const S = {
  gaucheProgressiste: {
    eco1: 'redistribution', eco2: 'tre-haut', eco3: 'relance-public', eco4: 'encadrement',
    eco5: 'etatisation', eco6: 'fortement', tra1: 'protection-forte', tra2: 'role-fort',
    jst1: 'resultats', jst2: 'fortement', imm1: 'non', imm4: 'accueil',
    soc1: 'favorable', soc3: 'ouvert', lib1: "d'accord", lib2: 'jamais',
    int1: 'benefique', ecol2: 'severes', sante1: 'solidaire', edu1: 'moyens',
  },
  liberalConservateur: {
    eco1: 'creation-richesse', eco2: 'pas-impot', eco3: 'rigueur', eco4: 'marche',
    eco6: 'non', tra1: 'flexibilite', tra3: 'maintien', jst1: 'chances',
    jst3: 'oppose', imm1: 'nettement', imm3: 'exigeante', soc1: 'defavorable',
    soc5: 'interdiction', aut1: 'severite', aut2: 'elargis', lib2: 'oui',
    int1: 'nuit', inst3: 'oui', ecol2: 'excessives', sante1: 'prive',
  },
  ecologiste: {
    ecol1: 'priorite', ecol2: 'severes', ecol3: 'interdiction', ecol4: 'largement',
    ecol6: 'systematique', eco1: 'redistribution', soc1: 'favorable',
    lib2: 'jamais', tra6: 'oui-fort', edu1: 'moyens', int1: 'benefique',
  },
  souverainiste: {
    imm1: 'nettement', imm2: 'reserve', imm3: 'exigeante', imm4: 'fermete',
    int1: 'nuit', int2: 'oui-souverainiste', int3: 'priorite-nationale',
    int5: 'valorisee', aut1: 'severite', soc1: 'defavorable', inst3: 'oui',
  },
  anarchiste: {
    lib1: "d'accord", lib2: 'jamais', lib4: 'compatible', lib5: 'libre',
    aut5: 'centre', aut6: 'oppose', inst1: 'frequent', inst5: 'presque-jamais',
    inst6: 'fortement', soc1: 'favorable', soc4: 'adaptation', ecol4: ' largement'.trim(),
    eco2: 'pas-impot', tra6: 'oui-fort', jst1: 'resultats',
  },
};

function pickTop(results, n = 1) { return results.proximities.slice(0, n).map(p => p.current.key); }

/* ---------- structure ---------- */
describe('questions', () => {
  test('banque non vide, ids uniques, options bien formées', () => {
    assert.ok(questions.length >= 50, `>= 50 questions, obtenu ${questions.length}`);
    const ids = new Set();
    for (const q of questions) {
      assert.ok(q.id && q.statement && q.theme, `question mal formée : ${q.id}`);
      assert.ok(!ids.has(q.id), `id dupliqué : ${q.id}`); ids.add(q.id);
      assert.ok(q.options.length >= 2, `moins de 2 options : ${q.id}`);
      for (const o of q.options) {
        assert.ok(o.value && o.text && o.scores, `option mal formée : ${q.id}.${o.value}`);
        for (const [d, v] of Object.entries(o.scores)) {
          assert.ok(d in dimensions, `dimension inconnue ${d} dans ${q.id}`);
          assert.ok(v >= 0 && v <= 1, `score hors [0,1] : ${q.id}.${o.value}.${d}=${v}`);
        }
      }
    }
  });
  test('chaque dimension a au moins 2 questions principales', () => {
    for (const d of DIMENSION_IDS) {
      const n = questions.filter(q => q.options.some(o => Object.keys(o.scores)[0] === d)).length;
      assert.ok(n >= 2, `dimension ${d} : seulement ${n} questions principales`);
    }
  });
});

describe('courants et partis', () => {
  test('14 courants, positions complètes dans [0,1]', () => {
    assert.ok(currents.length >= 14);
    const expect = ['social-democratie','liberalisme-economique','conservatisme','ecologie-politique','souverainisme','gaullisme'];
    for (const key of expect) assert.ok(currents.find(c => c.key === key), `courant attendu manquant : ${key}`);
    for (const c of currents) {
      for (const d of DIMENSION_IDS) {
        const v = c.position[d];
        assert.ok(typeof v === 'number' && v >= 0 && v <= 1, `${c.key}.${d} = ${v}`);
      }
      assert.ok(c.summary && c.traits.length && c.limits.length, `${c.key} incomplet`);
    }
  });
  test('8 partis avec programme et date', () => {
    assert.ok(parties.length >= 8);
    for (const p of parties) {
      assert.ok(p.program, `${p.id} sans programme`);
      assert.ok(p.position.ECONOMIE >= 0 && p.position.ECONOMIE <= 1);
    }
  });
});

describe('calcul des dimensions', () => {
  test('pondération basique : weightedMean simple', () => {
    const near = (a, b) => Math.abs(a - b) < 1e-9;
    assert.ok(near(weightedMean([{ value: 0.4, weight: 1 }, { value: 0.6, weight: 1 }]), 0.5));
    assert.ok(near(weightedMean([{ value: 0.2, weight: 3 }, { value: 0.8, weight: 1 }]), 0.35));
    assert.equal(weightedMean([]), null);
  });

  test('aucune réponse → aucun score, insuffisant', () => {
    const r = computeResults({});
    assert.equal(r.meta.insufficient, true);
    assert.equal(r.proximities.length, 0);
    for (const d of DIMENSION_IDS) assert.equal(r.scores[d], null);
  });

  test('réponses incertaines exclues du calcul, comptées séparément', () => {
    const r = computeResults({ eco1: 'redistribution', eco2: 'uncertain' });
    assert.ok(r.scores.ECONOMIE !== null);
    assert.equal(r.neutralCount, 1);
    assert.ok(r.coverage.ECONOMIE < 0.45); // 1 question sur ~6 de poids max
  });

  test('réponse à valeur inconnue ignorée sans erreur', () => {
    const r = computeResults({ eco1: 'valeur_imaginaire_xyz' });
    assert.equal(r.scores.ECONOMIE, null);
  });

  test('déterminisme : mêmes réponses → même sortie', () => {
    const a = computeResults(S.gaucheProgressiste);
    const b = computeResults(S.gaucheProgressiste);
    assert.deepEqual(b.scores, a.scores);
    assert.deepEqual(b.proximities.map(p => p.current.key), a.proximities.map(p => p.current.key));
  });

  test('scores toujours dans [0,1]', () => {
    for (const s of Object.values(S)) {
      const { scores } = calculateDimensionScores(s);
      for (const [d, v] of Object.entries(scores)) {
        if (v !== null) assert.ok(v >= 0 && v <= 1, `score hors bornes ${d}=${v}`);
      }
    }
  });

  test('couverture : au moins 6 dimensions au-dessus du seuil (scénario complet)', () => {
    const { coverage } = calculateDimensionScores(S.gaucheProgressiste);
    const filled = Object.values(coverage).filter(v => v > COVERAGE_MIN).length;
    assert.ok(filled >= 6, `seulement ${filled} dimensions couvertes`);
  });
});

describe('polarité des scénarios', () => {
  test('profil de gauche → un courant de gauche en tête', () => {
    const r = computeResults(S.gaucheProgressiste);
    const top = pickTop(r, 3);
    assert.ok(
      top.includes('social-democratie') || top.includes('socialisme-democratique') || top.includes('ecologie-politique'),
      `courant incohérent : ${top.join(', ')}`,
    );
    assert.ok(r.scores.ECONOMIE > 0.7, `ECONOMIE attendu > 0.7, obtenu ${r.scores.ECONOMIE}`);
    assert.ok(r.scores.TRAVAIL > 0.7);
    assert.ok(r.scores.IMMIGRATION < 0.4);
  });

  test('profil libéral conservateur → droite libérale en tête', () => {
    const r = computeResults(S.liberalConservateur);
    const top = pickTop(r, 3);
    assert.ok(
      top.includes('liberalisme-economique') || top.includes('conservatisme') || top.includes('libertarianisme') || top.includes('gaullisme'),
      `courant incohérent : ${top.join(', ')}`,
    );
    assert.ok(r.scores.ECONOMIE < 0.35, `ECONOMIE attendu < 0.35, obtenu ${r.scores.ECONOMIE}`);
    assert.ok(r.scores.IMMIGRATION > 0.6);
  });

  test('profil écologiste → écologie politique en top 2', () => {
    const r = computeResults(S.ecologiste);
    const top2 = pickTop(r, 2);
    assert.ok(top2.includes('ecologie-politique'),
      `attendu ecologie-politique dans le top 2, obtenu ${top2.join(', ')}`);
    assert.ok(r.scores.ECOLOGIE > 0.7);
  });

  test('profil souverainiste → souverainisme en tête', () => {
    const r = computeResults(S.souverainiste);
    assert.equal(pickTop(r)[0], 'souverainisme',
      `attendu souverainisme, obtenu ${pickTop(r)[0]}`);
    assert.ok(r.scores.IMMIGRATION > 0.7);
    assert.ok(r.scores.INTERNATIONAL > 0.6);
  });

  test('profil libertaire → anarchisme ou libéralisme politique en top 3', () => {
    const r = computeResults(S.anarchiste);
    const top = pickTop(r, 3);
    assert.ok(
      top.includes('anarchisme') || top.includes('liberalisme-politique') || top.includes('libertarianisme'),
      `attendu un courant libertaire, obtenu ${top.join(', ')}`,
    );
    assert.ok(r.scores.LIBERTES > 0.55, `LIBERTES attendu > 0.55, obtenu ${r.scores.LIBERTES}`);
  });
});

describe('proximité et tensions', () => {
  test('proximité dans [0,100] et triée décroissante', () => {
    for (const s of Object.values(S)) {
      const r = computeResults(s);
      let prev = 101;
      for (const p of r.proximities) {
        assert.ok(p.proximity >= 0 && p.proximity <= 100, `proximité hors bornes : ${p.proximity}`);
        assert.ok(p.proximity <= prev, 'tri non décroissant'); prev = p.proximity;
      }
    }
  });
  test('profil parfaitement au centre → centrisme très proche', () => {
    // répond exactement à l'option médiane de chaque question multi-choix
    const answers = {};
    for (const q of questions) {
      const mid = q.options[Math.floor(q.options.length / 2)];
      answers[q.id] = mid.value;
    }
    const r = computeResults(answers);
    const top3 = pickTop(r, 3);
    assert.ok(top3.includes('centrisme') || top3.includes('democratie-chretienne'),
      `profil neutre : attendu centrisme, obtenu ${top3.join(', ')}`);
  });
  test('tensions détectées sur un profil réellement contrasté', () => {
    // Sécurité ferme + vie privée sacrée, écologie exigeante + marché pur : deux
    // tensions classiques entre dimensions distinctes.
    const r = computeResults({
      aut1: 'severite', aut2: 'elargis',
      lib2: 'jamais', lib4: 'risque',
      ecol1: 'priorite', ecol3: 'interdiction',
      eco1: 'creation-richesse', eco2: 'pas-impot',
    });
    assert.ok(r.tensions.length >= 1, `au moins une tension attendue, obtenu ${r.tensions.length}`);
    assert.ok(r.tensions.some(t => t.pair.join() === 'AUTORITE,LIBERTES' || t.pair.join() === 'ECOLOGIE,ECONOMIE'));
  });
});

describe('génération de texte', () => {
  test('titre et narration non vides, adaptés au profil', () => {
    const r = computeResults(S.gaucheProgressiste);
    assert.ok(r.profileTitle.length > 10);
    assert.ok(r.narrative.includes('redistribution') || r.narrative.includes('intervention'));
  });
  test('questions de réflexion : 1 à 5, adaptées', () => {
    for (const s of [S.gaucheProgressiste, S.ecologiste]) {
      const r = computeResults(s);
      assert.ok(r.reflectionQuestions.length >= 1 && r.reflectionQuestions.length <= 5);
    }
  });
});
