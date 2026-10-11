// Vérifie qu'une liste d'URL d'images renvoie bien HTTP 200 avant intégration.
// usage : node tests/check-urls.mjs tests/data/candidates.json
import { readFileSync } from 'node:fs';

const file = process.argv[2];
const raw = JSON.parse(readFileSync(file, 'utf8'));
const entries = Array.isArray(raw) ? raw : Object.entries(raw).map(([k, v]) => ({ id: k, ...v }));

const results = [];
// séquentiel + pause : Wikimedia Commons limite les requêtes parallèles (429)
for (const e of entries) {
  const url = e.url || e.thumb;
  let status = 'ERR'; let type = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'civilis-image-check/1.0 (contact: local dev)' } });
      status = res.status; type = res.headers.get('content-type') || '';
      if (status === 200) break;
    } catch (err) { type = String(err.message); }
    await new Promise((r) => setTimeout(r, 900));
  }
  results.push({ id: e.id || e.name || e.theme, status, type, url });
}

results.sort((a, b) => String(a.id).localeCompare(String(b.id)));
let ok = 0;
for (const r of results) {
  const good = r.status === 200 && /image/.test(r.type || '');
  if (good) ok++;
  console.log(`${good ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${String(r.id).padEnd(28)} ${r.type || ''}`);
}
console.log(`\n${ok}/${results.length} images accessibles en HTTP 200.`);
