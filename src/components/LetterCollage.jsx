/* ============================================================================
   CIVILIS — signature typographique « découpage dans le journal »
   ----------------------------------------------------------------------------
   Système réutilisable de caractères individuels, comme un vrai collage
   physique d'alphabets différents. Chaque fragment est un SVG brut (pas
   d'aplatissement, transparence réelle, couleur du papier par fragment).

   Conventions :
   - zéro, un, cinq, six, neuf : classiques
   - les morts A, B, C, E, F, G, H, I, J, L, N, O, P, R, S, T, U, V, Y, Z
   - L1/L2 : L avec/ sans serif
   - c1/c2 : c avec/ sans cernes
   - E1/E2/A1/A2 : variantes
   - «É» «È» «Ê» «Ë» «Ç» «Œ» «Æ» : combinaisons de base + diacritiques

   Toute lettre inconnue se dégrade gracieusement en son homologue de base
   (on supprime les accents) — le collage garde son effet, jamais une croix.
   ========================================================================== */

/* ---------------- utilitaires de construction de formes ---------------- */
const path = (d) => <path d={d} fill="currentColor" />;
const stroke = (d, sw = 2, op = 0.3) => (
  <path d={d} fill="none" stroke="currentColor" strokeWidth={sw} opacity={op} />
);

/* formes de base (légers chemins, style ink) */
const ELLIPSE = 'M50 14 C35 14 26 32 26 52 C26 72 35 90 50 90 C65 90 74 72 74 52 C74 32 65 14 50 14 Z';
const ROUND = 'M50 14 C38 14 32 28 32 48 C32 68 38 82 50 82 C62 82 68 68 68 48 C68 28 62 14 50 14 Z';
const SQUARE = 'M36 14 L36 92 L26 92 Z';
const ROUNDL = 'M36 14 L36 92 L26 92 Z M26 92 L100 92 L100 30 L64 30 Z';
const OVAL = 'M50 14 C35 14 26 32 26 52 C26 72 35 90 50 90 C65 90 74 72 74 52 C74 32 65 14 50 14 Z';
const TAIL = 'M50 50 L50 76 M47 84 L50 88 L53 84';

/* ---------------- définition des fragments (formes natives SVG) -------- */
const FRAGMENTS = {
  /* ----- alphabet de base (lettres courantes) ----- */
  A1: { id: 'A1', viewBox: '0 0 100 100', width: 100, height: 92,
    paths: (<><path d="M50 22 L68 58 L50 69 L32 58 Z"/><path d="M50 22 L63 50 L50 63 L37 50 Z" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35"/></>) },
  A2: { id: 'A2', viewBox: '0 0 100 100', width: 100, height: 92,
    paths: (<><path d="M50 18 L66 54 L50 68 L34 54 Z"/><path d="M50 18 L60 46 L50 60 L40 46 Z" fill="#fff" stroke="currentColor" strokeWidth="2" opacity="0.25"/></>) },
  B1: { id: 'B1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C40 14 36 30 36 50 C36 70 40 86 50 86 C60 86 64 70 64 50 C64 30 60 14 50 14 Z"/><path d="M50 14 L62 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M38 50 L38 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/></>) },
  C1: { id: 'C1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ELLIPSE.replace('50 14', '50 16').replace('26 32', '26 30').replace('26 72', '26 70').replace('35 90', '35 88').replace('74 72', '74 70').replace('65 14', '65 16')}/><path d="M50 16 L50 88" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  D1: { id: 'D1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ELLIPSE.replace('26 32', '26 30').replace('26 72', '26 70').replace('74 72', '74 70').replace('65 14', '65 16').replace('65 86', '65 84')}/><path d="M50 16 L50 84" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  E1: { id: 'E1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  E2: { id: 'E2', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  Eacute: { id: 'É', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M46 18 L50 28 L54 18" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/></>) },
  Egrave: { id: 'È', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M46 84 L50 94 L54 84" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/></>) },
  Ecircumflex: { id: 'Ê', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M48 34 L64 34 C52 20 60 14 64 14" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55"/></>) },
  Edieresis: { id: 'Ë', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M45 34 L63 34" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5"/><path d="M47 28 L61 28" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.35"/></>) },
  F1: { id: 'F1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  G1: { id: 'G1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M36 58 L66 58" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.25"/></>) },
  H1: { id: 'H1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 50 M64 14 L64 50"/><path d="M36 74 L36 92 L26 92 Z"/><path d="M64 74 L64 92 L74 92 Z"/></>) },
  I1: { id: 'I1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 22 L64 22 L64 30 Z"/><path d="M36 52 L64 52 L64 60 Z"/><path d="M36 82 L64 82 L64 92 Z"/></>) },
  J1: { id: 'J1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 40 C36 60 36 86 36 92 L46 92 Z"/><path d="M46 84 C46 68 46 52 64 52 C68 52 70 54 70 60 C70 70 66 86 66 86 C66 86 14 86 14 86"/><path d="M50 50 L50 76 M47 84 L50 88 L53 84"/></>) },
  K1: { id: 'K1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 92 L36 30 Z"/><path d="M50 92 L50 30 Z"/><path d="M64 46 L64 46 L64 46 Z"/><path d="M36 92 L64 92 M36 92 L36 92"/></>) },
  L1: { id: 'L1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 L26 92 Z"/><path d="M26 92 L100 92 L100 30 L64 30 Z" fill="currentColor" opacity="0.9"/></>) },
  L2: { id: 'L2', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 L20 92 Z"/><path d="M20 92 L100 92 L100 30 L76 30 Z" fill="currentColor" opacity="0.92"/></>) },
  M1: { id: 'M1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 Z"/><path d="M64 14 L64 92 Z"/><path d="M36 14 L64 14 M36 44 L64 44 M36 74 L64 74"/></>) },
  N1: { id: 'N1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 Z"/><path d="M64 14 L64 92 Z"/><path d="M36 14 L64 14 M36 46 L64 46 M36 78 L64 78"/></>) },
  O1: { id: 'O1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={OVAL.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  P1: { id: 'P1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 50 L50 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  Q1: { id: 'Q1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={OVAL.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M42 84 L66 84 L66 92 Z"/></>) },
  R1: { id: 'R1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 50 L50 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M36 50 L46 44" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/></>) },
  S1: { id: 'S1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C38 14 32 28 32 48 C32 68 38 82 50 82 C62 82 68 68 68 48 C68 28 62 14 50 14 Z"/></>) },
  T1: { id: 'T1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L50 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/><path d="M47 84 L50 88 L53 84" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/></>) },
  U1: { id: 'U1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ELLIPSE.replace('50 14', '50 16').replace('26 32', '26 30').replace('26 72', '26 70').replace('35 90', '35 88').replace('74 72', '74 70').replace('65 14', '65 16')}/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  V1: { id: 'V1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 C36 34 44 46 50 46 C56 46 64 34 64 14"/><path d="M50 50 L50 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/><path d="M50 50 L56 44" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/></>) },
  W1: { id: 'W1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 Z"/><path d="M64 14 L64 92 Z"/><path d="M36 14 L64 14 M36 46 L64 46 M36 78 L64 78"/></>) },
  X1: { id: 'X1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L64 86"/><path d="M64 14 L36 86"/></>) },
  Y1: { id: 'Y1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 C36 34 44 46 50 46 C56 46 64 34 64 14"/><path d="M50 50 L50 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/><path d="M50 50 L56 44" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/></>) },
  Z1: { id: 'Z1', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 L86 50 L50 86 L14 50 Z"/><path d="M14 50 L50 86 L86 50 L50 14 Z" fill="#fff" stroke="currentColor" strokeWidth="2" opacity="0.15"/></>) },
  /* ----- chiffres ----- */
  zéro: { id: 'zéro', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C40 14 36 30 36 50 C36 70 40 86 50 86 C60 86 64 70 64 50 C64 30 60 14 50 14 Z"/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  un: { id: 'un', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 14 L36 92 L26 92 Z" fill="currentColor"/><path d="M26 92 L100 92 L100 30 L64 30 Z" fill="currentColor" opacity="0.9"/></>) },
  cinq: { id: 'cinq', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 L66 14 L66 30 L50 30 Z"/><path d="M34 50 L34 14 L50 14 L50 30 Z"/><path d="M34 50 L22 50 L22 86 L34 86 Z"/><path d="M50 50 L66 50 L66 86 L50 86 Z"/></>) },
  six: { id: 'six', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C40 14 36 30 36 50 C36 70 40 86 50 86 C60 86 64 70 64 50 C64 30 60 14 50 14 Z"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/></>) },
  neuf: { id: 'neuf', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C40 14 36 30 36 50 C36 70 40 86 50 86 C60 86 64 70 64 50 C64 30 60 14 50 14 Z"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M36 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/></>) },
  /* ----- accents et combinaisons (diacritiques) ----- */
  Ç: { id: 'Ç', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M34 30 L50 30 C44 18 46 12 50 12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.55"/></>) },
  Œ: { id: 'Œ', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 24 C30 24 26 28 26 36 C26 46 30 52 36 52 C42 52 48 46 48 36 C48 28 44 24 36 24 Z"/><path d="M36 64 C30 64 26 68 26 76 C26 86 30 90 36 90 C42 90 48 86 48 76 C48 68 44 64 36 64 Z"/></>) },
  Æ: { id: 'Æ', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M36 20 L64 20 L62 50 L38 50 Z"/><path d="M38 80 L62 80 L60 50 L40 50 Z"/></>) },
  /* ----- lettres françaises accentuées : combinaison de base + diacritique ----- */
  É: { id: 'É', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M46 18 L50 28 L54 18" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/></>) },
  È: { id: 'È', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M46 84 L50 94 L54 84" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/></>) },
  Ê: { id: 'Ê', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M48 34 L64 34 C52 20 60 14 64 14" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55"/></>) },
  Ë: { id: 'Ë', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M45 34 L63 34" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5"/><path d="M47 28 L61 28" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.35"/></>) },
  Ï: { id: 'Ï', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C38 14 32 28 32 48 C32 68 38 82 50 82 C62 82 68 68 68 48 C68 28 62 14 50 14 Z"/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M45 36 L63 36" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5"/><path d="M47 30 L61 30" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.35"/></>) },
  Î: { id: 'Î', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C38 14 32 28 32 48 C32 68 38 82 50 82 C62 82 68 68 68 48 C68 28 62 14 50 14 Z"/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M46 30 L56 30" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6"/></>) },
  Ô: { id: 'Ô', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={OVAL.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M60 30 L84 30 C72 18 66 12 66 12" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55"/></>) },
  Û: { id: 'Û', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M48 30 L60 30 C54 18 58 12 60 12" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55"/></>) },
  Ÿ: { id: 'Ÿ', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d="M50 14 C38 14 32 28 32 48 C32 68 38 82 50 82 C62 82 68 68 68 48 C68 28 62 14 50 14 Z"/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M45 30 L63 30" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5"/><path d="M47 24 L61 24" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.35"/></>) },
  Ü: { id: 'Ü', viewBox: '0 0 100 100', width: 100, height: 100,
    paths: (<><path d={ROUND.replace('68 48', '64 48').replace('68 30', '64 30').replace('62 14', '58 14').replace('62 86', '58 86').replace('64 46', '60 46').replace('64 54', '60 54')}/><path d="M50 14 L66 14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"/><path d="M36 50 L36 86" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M45 34 L63 34" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5"/><path d="M47 28 L61 28" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.35"/></>) },
};

/* ---------------- Recherche d'une lettre dans la table ---------------- */
function resolve(char) {
  const key = char.toUpperCase();
  if (FRAGMENTS[key]) return FRAGMENTS[key];
  // fallback : supprimer les accents pour tolérer une table incomplète
  const latin = char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return FRAGMENTS[latin.toUpperCase()] || null;
}

/* ---------------- Fragment d'une lettre --------------------- */
export function Letter({ char, paper = 'ivory', rotate = 0, offset = 0, size = 1, weight = 1, hue = 0 }) {
  const frag = resolve(char);
  if (!frag) return null;
  return (
    <span
      className="col-letter"
      style={{
        '--i': frag.id,
        '--paper': paper,
        '--phase': hue,
        '--r': rotate,
        '--o': offset,
        '--s': size,
        '--w': weight,
      }}
    >
      <svg
        className="col-svg"
        viewBox={frag.viewBox}
        width={frag.width * size}
        height={frag.height * size}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {frag.paths}
      </svg>
    </span>
  );
}

/* ---------------- Titre composé de fragments de lettres -------------- */
export function TitleCollage({ letters, children, kicker, offset = 4, rotate = 2, size = 1, paper = 'ivory', extra = [] }) {
  return (
    <div className="col-title">
      {kicker && <p className="col-kicker">{kicker}</p>}
      <div className="col-letter-block">
        {letters.map((l, i) => (
          <Letter key={i} char={l} paper={paper} rotate={rotate} offset={offset + i * 0.4} size={size} />
        ))}
      </div>
      {children && <div className="col-sub">{children}</div>}
      {extra.length > 0 && <div className="col-extra">{extra}</div>}
    </div>
  );
}

/* ---------------- Un mot complet (liste de fragments) ---------------- */
export function Word({ word, ...rest }) {
  return <>{word.split('').map((l, i) => <Letter key={i} char={l} {...rest} />)}</>;
}

/* ---------------- Phrases ou listes de mots ---------------- */
export function Letters({ text, ...rest }) {
  return (
    <span className="col-letters">
      {text.split('').map((l, i) => <Letter key={i} char={l} {...rest} />)}
    </span>
  );
}
