// Roda no GitHub (de hora em hora) e grava noticias.json junto do app.
// O iPhone não consegue ler os sites de notícia direto (o navegador bloqueia), então o robô busca por ele.
// Uso: node ferramentas/noticias.js <arquivo de saída>
const fs = require('fs');

const FEEDS = [
  { nome: 'g1', url: 'https://g1.globo.com/rss/g1/', secao: 'principais' },
  { nome: 'g1 Norte do PR', url: 'https://g1.globo.com/rss/g1/pr/norte-noroeste/', secao: 'principais' },
  { nome: 'g1 Economia', url: 'https://g1.globo.com/rss/g1/economia/', secao: 'economia' },
  { nome: 'InfoMoney', url: 'https://www.infomoney.com.br/feed/', secao: 'economia' },
  { nome: 'Webrun', url: 'https://www.webrun.com.br/feed/', secao: 'corrida' },
  { nome: 'Contra-Relógio', url: 'https://www.contrarelogio.com.br/feed/', secao: 'corrida' },
  { nome: 'g1 Bem Estar', url: 'https://g1.globo.com/rss/g1/bemestar/', secao: 'corrida' },
];

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decod = (s) => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '')
  .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m)).trim();
const tag = (b, n) => { const m = new RegExp(`<${n}[^>]*>([\\s\\S]*?)</${n}>`, 'i').exec(b); return m ? decod(m[1]) : ''; };
function lerRss(xml, fonte) {
  const itens = [];
  for (const m of xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)) {
    const b = m[0], data = new Date(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated'));
    const img = (/<media:content[^>]+url="([^"]+)"/i.exec(b) || /<enclosure[^>]+url="([^"]+)"/i.exec(b) || /<img[^>]+src="([^"]+)"/i.exec(b.replace(/&lt;/g, '<').replace(/&quot;/g, '"')) || [])[1] || null;
    const titulo = tag(b, 'title'), link = decod(tag(b, 'link') || (/<link[^>]+href="([^"]+)"/i.exec(b) || [])[1] || '');
    // vídeo e "ao vivo" ficam de fora
    if (titulo && link && !/^v[ií]deos?\b|^ao vivo|^assista/i.test(titulo) && !/\/(playlist|videos?)\//.test(link))
      itens.push({ titulo, link, fonte, data: isNaN(data) ? null : data.toISOString(), img: img && img.startsWith('https:') ? img : null });
  }
  return itens;
}

(async () => {
  const secoes = { principais: [], economia: [], corrida: [] };
  for (const f of FEEDS) {
    try {
      const r = await fetch(f.url, { signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0 MeuPainel/1.0' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      secoes[f.secao].push(...lerRss(await r.text(), f.nome).slice(0, 12));
    } catch (e) { console.error(f.nome, e.message); }
  }
  // mais recentes primeiro, no máximo 2 seguidas da mesma fonte
  for (const k of Object.keys(secoes)) {
    const l = secoes[k].sort((a, b) => (b.data || '').localeCompare(a.data || '')), saida = [], vistos = new Set();
    for (const i of l) { if (vistos.has(i.titulo)) continue; vistos.add(i.titulo); saida.push(i); }
    secoes[k] = saida.slice(0, 15);
  }
  fs.writeFileSync(process.argv[2] || 'noticias.json', JSON.stringify({ gerado: new Date().toISOString(), secoes }));
  console.log('ok', Object.entries(secoes).map(([k, v]) => `${k}: ${v.length}`).join(', '));
})();
