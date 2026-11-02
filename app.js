// Meu Painel — telas
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reais = (v) => (+v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = (v, d = 1) => (+v || 0).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const km1 = (v) => num(v, v % 1 ? 1 : 0);
const dataBR = (d) => (d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '');
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const diaLongo = (d) => { const x = new Date(d + 'T12:00:00'); return `${DIAS[x.getDay()]}, ${x.getDate()} de ${MESES[x.getMonth()]}`; };
const diaCurto = (d) => (d === hoje() ? 'hoje' : d === somaDias(hoje(), 1) ? 'amanhã' : d === somaDias(hoje(), -1) ? 'ontem' : `${DIAS[new Date(d + 'T12:00:00').getDay()].slice(0, 3)} ${dataBR(d)}`);
const saudacao = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };
const vibrar = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };

// ---------- ícones (SVG de linha) ----------
const ICO = {
  casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  tenis: '<path d="M3 16.5c0-1.5.6-3 1.5-4l2-2.5 2.5 1.5 2-2 1.5 2.5c1 1.5 3 2.5 5 2.8 2 .3 3.5 1.2 3.5 2.7v1.5H3z"/><path d="M3 18.5h18M9 13.5l1.5 1M12 12.5l1.5 1"/>',
  haltere: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  carteira: '<path d="M20 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5"/><path d="M14 9.5h7v5h-7a2.5 2.5 0 0 1 0-5z"/>',
  agenda: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  grade: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  recibo: '<path d="M5 2.5h14v19l-2.5-1.5-2.5 1.5-2-1.5-2 1.5-2.5-1.5L5 21.5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  livro: '<path d="M2.5 5.5c3-1.3 6.3-1.3 9.5.8v14c-3.2-2.1-6.5-2.1-9.5-.8z"/><path d="M21.5 5.5c-3-1.3-6.3-1.3-9.5.8v14c3.2-2.1 6.5-2.1 9.5-.8z"/>',
  jornal: '<path d="M4 4h13v15a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v11a2 2 0 0 1-4 0"/><path d="M7.5 8h6M7.5 12h6M7.5 16h4"/>',
  ajustes: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  corpo: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M8 21l4-7 4 7M6 10l6-1 6 1"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>', pausa: '<path d="M8 5v14M16 5v14"/>', parar: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  mais: '<path d="M12 5v14M5 12h14"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', lixo: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  lapis: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>', fechar: '<path d="M6 6l12 12M18 6 6 18"/>', voltar: '<path d="M15 5l-7 7 7 7"/>',
  sino: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>', fogo: '<path d="M12 22c4 0 7-2.8 7-7 0-4.5-4-6.5-4.5-11-2.5 1.5-4.5 4.5-4.3 7.3C9 10.5 8.2 9.6 8 8c-1.8 1.6-3 4.1-3 7 0 4.2 3 7 7 7z"/>',
  trofeu: '<path d="M8 3.5h8v5.5a4 4 0 0 1-8 0z"/><path d="M8 5.5H4.5a3.5 3.5 0 0 0 3.7 4.4M16 5.5h3.5a3.5 3.5 0 0 1-3.7 4.4M12 13v4M8 21h8"/>',
  mapa: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  baixar: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>', cartao: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
  calmais: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 12.5v5M9.5 15h5"/>', alerta: '<path d="M12 3.5 2.5 20.5h19z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  capelo: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5M21.5 9v5"/>',
  whats: '<path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 20.5 11.8z"/><path d="M9 8.5c0 3.5 2.5 6.5 6 6.5l1-1.5-2-1-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1-2z"/>',
  revisar: '<path d="M4 12a8 8 0 0 1 14-5.3L20 8.5M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15.5M4 20v-4.5h4.5"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n] || ''}</svg>`;
$$('[data-ic]').forEach((el) => (el.innerHTML = ic(el.dataset.ic)));

// ---------- avisos, modal, calendário do iPhone ----------
function avisar(msg, erro) {
  const t = $('#aviso'); t.textContent = msg; t.className = 'toast ver' + (erro ? ' erro' : '');
  clearTimeout(avisar.t); avisar.t = setTimeout(() => (t.className = 'toast'), 2800);
}
const tentar = (fn) => async (...a) => { try { await fn(...a); } catch (e) { avisar(e.message, true); } };
function modal(html, aoSalvar, { textoOk = 'Salvar', semBotoes = false } = {}) {
  const d = $('#modal'), f = $('#modalForm');
  f.innerHTML = html + (semBotoes ? '' : `<div class="dupla"><button value="cancelar" formnovalidate>Cancelar</button><button class="primario" value="ok">${textoOk}</button></div>`);
  f.onsubmit = async (ev) => {
    if (ev.submitter && ev.submitter.value !== 'ok') return;
    ev.preventDefault();
    try { await aoSalvar(Object.fromEntries(new FormData(f)), f); d.close(); render(); } catch (e) { avisar(e.message, true); }
  };
  d.showModal();
  return f;
}
// .ics: o iPhone abre "Adicionar ao Calendário" e o Calendário avisa na hora (o app instalado não consegue avisar sozinho)
function paraCalendario({ titulo, data, hora, minutosAntes = 30, repetirMeses = 0, notas = '' }) {
  const d = data.replace(/-/g, ''), uid = id() + '@meu-painel', carimbo = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const linhas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Meu Painel//PT-BR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${carimbo}`,
    hora ? `DTSTART:${d}T${hora.replace(':', '')}00` : `DTSTART;VALUE=DATE:${d}`, hora ? `DURATION:PT1H` : `DTEND;VALUE=DATE:${somaDias(data, 1).replace(/-/g, '')}`,
    `SUMMARY:${titulo.replace(/[,;\\]/g, (c) => '\\' + c)}`, notas ? `DESCRIPTION:${notas.replace(/\n/g, '\\n')}` : '', repetirMeses > 1 ? `RRULE:FREQ=MONTHLY;COUNT=${repetirMeses}` : '',
    // dia todo: avisa às 9h do dia; com hora: X minutos antes
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${titulo}`, hora ? `TRIGGER:-PT${minutosAntes}M` : 'TRIGGER:PT9H', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean);
  const a = document.createElement('a');
  a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(linhas.join('\r\n'));
  a.download = titulo.replace(/[^\wÀ-ú ]+/g, '').slice(0, 40) + '.ics';
  document.body.append(a); a.click(); a.remove();
}

// ---------- gráficos ----------
function anel(p, { tam = 92, cor = 'url(#gradAnel)', texto, sub, claro = false } = {}) {
  const r = tam / 2 - 8, C = 2 * Math.PI * r, f = Math.max(0, Math.min(1, p));
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}" role="img" aria-label="${Math.round(f * 100)}%">
    <defs><linearGradient id="gradAnel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5a5f"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient></defs>
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${claro ? 'rgba(255,255,255,.3)' : 'var(--fundo-2)'}" stroke-width="10"/>
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${cor}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C * f} ${C}" transform="rotate(-90 ${tam / 2} ${tam / 2})"/>
    <text x="50%" y="${sub ? '47%' : '52%'}" text-anchor="middle" dominant-baseline="middle" font-size="${tam / 4.6}" font-weight="800" fill="${claro ? '#fff' : 'var(--texto)'}" font-family="Plus Jakarta Sans, sans-serif">${texto ?? Math.round(f * 100) + '%'}</text>
    ${sub ? `<text x="50%" y="66%" text-anchor="middle" font-size="10" fill="${claro ? 'rgba(255,255,255,.85)' : 'var(--suave)'}">${sub}</text>` : ''}</svg>`;
}
function grafBarras(itens, { formato = (v) => v, meta } = {}) {
  if (!itens.length || !itens.some((i) => i.v)) return '<p class="vazio">Sem dados ainda.</p>';
  const L = 640, A = 170, m = { b: 22, t: 18 }, max = Math.max(...itens.map((i) => i.v), meta || 0) || 1, w = L / itens.length;
  const Y = (v) => A - m.b - (v / max) * (A - m.b - m.t);
  return `<div class="grafico"><svg viewBox="0 0 ${L} ${A}" role="img">
    ${meta ? `<line x1="0" x2="${L}" y1="${Y(meta)}" y2="${Y(meta)}" stroke="var(--verde)" stroke-dasharray="5 4"/>` : ''}
    ${itens.map((it, i) => `<rect x="${i * w + w * 0.18}" y="${Y(it.v)}" width="${w * 0.64}" height="${Math.max(0, A - m.b - Y(it.v))}" rx="5" fill="${it.cor || 'var(--acento)'}"/>
      <text x="${i * w + w / 2}" y="${A - 6}" text-anchor="middle">${esc(it.r)}</text>
      ${it.v ? `<text x="${i * w + w / 2}" y="${Y(it.v) - 5}" text-anchor="middle">${formato(it.v)}</text>` : ''}`).join('')}
  </svg></div>`;
}
function grafLinha(pontos, { meta, unidade = '' } = {}) {
  if (pontos.length < 2) return '<p class="vazio">Registre mais vezes para ver a evolução.</p>';
  const L = 640, A = 190, m = { e: 40, d: 14, t: 14, b: 24 };
  const ys = pontos.map((p) => p.y).concat(meta ? [meta] : []);
  let min = Math.min(...ys), max = Math.max(...ys); if (max - min < 1) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12; min -= pad; max += pad;
  const t0 = new Date(pontos[0].x).getTime(), t1 = new Date(pontos[pontos.length - 1].x).getTime();
  const X = (x) => m.e + ((new Date(x).getTime() - t0) / (t1 - t0 || 1)) * (L - m.e - m.d), Y = (y) => m.t + (1 - (y - min) / (max - min)) * (A - m.t - m.b);
  const cam = pontos.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  return `<div class="grafico"><svg viewBox="0 0 ${L} ${A}" role="img">
    ${[0, 0.5, 1].map((f) => { const v = min + (max - min) * f; return `<line x1="${m.e}" x2="${L - m.d}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--linha)"/><text x="${m.e - 6}" y="${Y(v) + 4}" text-anchor="end">${num(v, v < 20 ? 1 : 0)}</text>`; }).join('')}
    ${meta ? `<line x1="${m.e}" x2="${L - m.d}" y1="${Y(meta)}" y2="${Y(meta)}" stroke="var(--verde)" stroke-dasharray="5 4"/>` : ''}
    <path d="${cam}" fill="none" stroke="var(--acento)" stroke-width="3" stroke-linejoin="round"/>
    ${pontos.map((p) => `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" fill="var(--acento)"><title>${dataBR(p.x)}: ${num(p.y)} ${unidade}</title></circle>`).join('')}
    <text x="${m.e}" y="${A - 6}">${dataBR(pontos[0].x)}</text><text x="${L - m.d}" y="${A - 6}" text-anchor="end">${dataBR(pontos[pontos.length - 1].x)}</text>
  </svg></div>`;
}
// trajeto da corrida em SVG (sem mapa de fundo: funciona sem internet)
function desenharRota(pts, alto = 200) {
  if (!pts || pts.length < 2) return '';
  const la = pts.map((p) => p[0]), lo = pts.map((p) => p[1]), lat0 = (Math.min(...la) + Math.max(...la)) / 2, k = Math.cos((lat0 * Math.PI) / 180);
  const xs = lo.map((v) => v * k), minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...la), maxY = Math.max(...la);
  const W = 400, H = alto, s = Math.min((W - 30) / (maxX - minX || 1e-6), (H - 30) / (maxY - minY || 1e-6));
  const P = (i) => [15 + (xs[i] - minX) * s + ((W - 30) - (maxX - minX) * s) / 2, H - 15 - (la[i] - minY) * s - ((H - 30) - (maxY - minY) * s) / 2];
  const d = pts.map((_, i) => (i ? 'L' : 'M') + P(i).map((v) => v.toFixed(1)).join(',')).join('');
  const [x0, y0] = P(0), [x1, y1] = P(pts.length - 1);
  return `<div class="rota"><svg viewBox="0 0 ${W} ${H}"><path d="${d}" fill="none" stroke="url(#gradRota)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <defs><linearGradient id="gradRota"><stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ff5a5f"/></linearGradient></defs>
    <circle cx="${x0}" cy="${y0}" r="7" fill="var(--verde)" stroke="#fff" stroke-width="2"/><circle cx="${x1}" cy="${y1}" r="7" fill="var(--acento)" stroke="#fff" stroke-width="2"/></svg></div>`;
}

// ---------- navegação ----------
const ABAS = { inicio: telaInicio, treino: telaTreino, estudos: telaEstudos, dinheiro: telaDinheiro, agenda: telaAgenda, mais: telaMais, leitura: telaLeitura, noticias: telaNoticias, ajustes: telaAjustes };
let aba = 'inicio', sub = {};
function ir(destino) {
  const [a, s] = String(destino || 'inicio').split('/');
  aba = ABAS[a] ? a : 'inicio'; if (s) sub[aba] = s;
  if (location.hash.slice(1) !== destino) history.replaceState(null, '', '#' + aba + (sub[aba] ? '/' + sub[aba] : ''));
  const menu = ['leitura', 'noticias', 'ajustes'].includes(aba) ? 'mais' : aba;
  $$('#abas a').forEach((x) => x.classList.toggle('ativo', x.dataset.aba === menu));
  render(); window.scrollTo(0, 0);
}
$('#abas').onclick = (e) => { const a = e.target.closest('a'); if (a) ir(a.dataset.aba); };
async function render() { try { await ABAS[aba](); } catch (e) { console.error(e); $('#conteudo').innerHTML = `<div class="cartao">${ic('alerta')} ${esc(e.message)}</div>`; } }
const segmento = (atual, opcoes) => `<div class="segmento">${opcoes.map(([k, t]) => `<button type="button" data-sub="${k}" class="${atual === k ? 'ativo' : ''}">${t}</button>`).join('')}</div>`;
const ligarSegmento = () => $$('[data-sub]').forEach((b) => (b.onclick = () => { sub[aba] = b.dataset.sub; history.replaceState(null, '', '#' + aba + '/' + b.dataset.sub); render(); }));

// ---------- primeira vez ----------
function boasVindas() {
  modal(`<h2>Bem-vinda ao Meu Painel! ✨</h2>
    <p class="suave" style="margin:0">Corrida, academia, agenda, gastos, contas, leitura e notícias. Tudo fica guardado só neste celular.</p>
    <label>Como você quer ser chamada?<input name="nome" required autocomplete="given-name" placeholder="Seu nome"></label>
    <div class="dupla"><label>Meta de km por semana<input name="km" type="number" inputmode="decimal" value="15" min="1"></label><label>Treinos de academia por semana<input name="treinos" type="number" value="3" min="1" max="7"></label></div>
    <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="fichas" checked> Começar com 3 fichas de academia prontas (A, B e C), que você muda depois</label>`,
  (v) => {
    E.perfil.nome = v.nome.trim(); E.config.meta_km_semana = +v.km || 15; E.config.meta_treinos_semana = +v.treinos || 3;
    if (v.fichas && !E.fichas.length) E.fichas = FICHAS_MODELO.map((f) => novaFicha(f.nome, f.exercicios));
    salvar(); avisar(`Prontinho, ${E.perfil.nome}!`);
  }, { textoOk: 'Começar' });
  $('#modalForm button[value=cancelar]').remove();
}

// ==================== INÍCIO ====================
async function telaInicio() {
  if (!E.perfil.nome) setTimeout(boasVindas, 200);
  const C = corridaResumo(), A = academiaResumo(), P = planoHoje(), G = gastosDoMes(), L = leitura();
  const ate = somaDias(hoje(), 7), contas = aPagar().filter((g) => g.vencimento <= ate), fats = faturas().filter((f) => f.venc <= ate);
  const agendaHoje = E.compromissos.filter((c) => c.data === hoje()).sort((a, b) => (a.hora || '99').localeCompare(b.hora || '99'));
  const proximos = E.compromissos.filter((c) => c.data > hoje() && c.data <= ate).sort((a, b) => (a.data + (a.hora || '')).localeCompare(b.data + (b.hora || ''))).slice(0, 4);
  const treinouHoje = E.treinos.some((t) => t.data === hoje()), correuHoje = E.corridas.some((c) => c.data === hoje());
  $('#conteudo').innerHTML = `
  <div class="topo"><div><small>${diaLongo(hoje())}</small><h1>${saudacao()}${E.perfil.nome ? ', ' + esc(E.perfil.nome) : ''}!</h1></div></div>
  <div class="grade">
    <section class="cartao destaque">
      <header><h2>${ic('fogo')} Sua semana</h2><small>${A.sequencia > 1 ? `${A.sequencia} semanas seguidas na meta` : 'vamos com tudo'}</small></header>
      <div class="kpis">
        <div class="kpi"><small>Corrida</small><b>${km1(C.semanaKm)}<em style="font-size:12px"> km</em></b><small>meta ${C.meta} km</small></div>
        <div class="kpi"><small>Academia</small><b>${A.semanaQtd}/${A.meta}</b><small>treinos</small></div>
        <div class="kpi"><small>Leitura hoje</small><b>${L.lidosHoje}</b><small>páginas</small></div>
      </div>
    </section>
    <section class="cartao c6"><header><h2>${ic('alvo')} Treino de hoje</h2></header>
      ${treinouHoje || correuHoje ? `<p style="margin:0 0 10px"><span class="etiqueta verde">${ic('check')} ${treinouHoje && correuHoje ? 'treinou e correu' : treinouHoje ? 'academia feita' : 'corrida feita'} hoje</span></p>` : ''}
      ${A.proxima ? `<div class="linha"><div class="tit"><span>${esc(A.proxima.nome)}</span><small>${A.proxima.exercicios.length} exercícios${A.diasSem != null ? ` · último treino ${A.diasSem === 0 ? 'hoje' : A.diasSem === 1 ? 'ontem' : `há ${A.diasSem} dias`}` : ''}</small></div><button class="primario mini" data-treinar>${ic('haltere')} Treinar</button></div>` : ''}
      ${P && P.proximo ? `<div class="linha"><div class="tit"><span>Plano ${esc(P.nome)} · sem. ${P.semana}</span><small>${esc(P.proximo)}</small></div><button class="mini" data-correr>${ic('tenis')} Correr</button></div>`
        : `<div class="linha"><div class="tit"><span>Corrida</span><small>${C.ultimas[0] ? `última: ${km1(C.ultimas[0].km)} km ${diaCurto(C.ultimas[0].data)}` : 'nenhuma ainda'}</small></div><button class="mini" data-correr>${ic('tenis')} Correr</button></div>`}
    </section>
    <section class="cartao c6"><header><h2>${ic('agenda')} Agenda</h2><button class="mini" data-ir="agenda">ver</button></header>
      ${agendaHoje.length ? agendaHoje.map((c) => `<div class="linha"><b style="width:46px">${c.hora || '—'}</b><div class="tit"><span>${esc(c.titulo)}</span>${c.local ? `<small>${esc(c.local)}</small>` : ''}</div></div>`).join('') : '<p class="vazio" style="padding:4px">Nada marcado para hoje.</p>'}
      ${proximos.length ? `<small style="display:block;margin-top:8px;font-weight:700">Próximos dias</small>${proximos.map((c) => `<div class="linha" style="padding:6px 0"><small style="width:70px">${diaCurto(c.data)}</small><div class="tit"><span style="font-weight:500">${c.hora ? c.hora + ' ' : ''}${esc(c.titulo)}</span></div></div>`).join('')}` : ''}
    </section>
    <section class="cartao c6"><header><h2>${ic('recibo')} Contas da semana</h2><button class="mini" data-ir="dinheiro/contas">ver</button></header>
      ${contas.length || fats.length ? [...contas.map((g) => ({ v: g.vencimento, t: g.descricao || g.categoria, valor: g.valor })), ...fats.map((f) => ({ v: f.venc, t: 'Fatura ' + f.cartao, valor: f.total }))].sort((a, b) => a.v.localeCompare(b.v))
        .map((x) => `<div class="linha"><div class="tit"><span>${esc(x.t)}</span><small>${x.v < hoje() ? '<span class="etiqueta vermelha">vencida</span> ' : ''}${diaCurto(x.v)}</small></div><span class="val">${reais(x.valor)}</span></div>`).join('') : '<p class="vazio" style="padding:4px">Nenhuma conta nos próximos 7 dias. 🎉</p>'}
    </section>
    <section class="cartao c6"><header><h2>${ic('carteira')} Gastos de ${MESES[+hoje().slice(5, 7) - 1]}</h2><button class="mini primario" data-gasto>${ic('mais')} Gasto</button></header>
      <div class="grande">${reais(G.total)}</div><small>hoje: ${reais(G.hoje)} · ${G.lista.length} lançamento${G.lista.length === 1 ? '' : 's'}</small>
    </section>
    ${E.materias.length ? (() => { const R = estudosResumo(); return `<section class="cartao c6"><header><h2>${ic('capelo')} Estudos</h2><button class="mini" data-ir="estudos">ver</button></header>
      <div class="linha"><div class="tit"><span>${horasTxt(R.semanaH)} de ${R.meta} h na semana</span><div class="barra" style="margin-top:6px"><div style="width:${Math.min(100, (R.semanaH / (R.meta || 1)) * 100)}%"></div></div></div></div>
      ${R.revisoesHoje.length ? `<div class="linha"><div class="tit"><span>${ic('revisar')} ${R.revisoesHoje.length} revis${R.revisoesHoje.length > 1 ? 'ões' : 'ão'} para hoje</span></div></div>` : ''}
      ${R.proximas[0] ? `<div class="linha"><div class="tit"><span>${esc(R.proximas[0].titulo)}</span><small>${esc(materia(R.proximas[0].materiaId).nome)}</small></div><span class="etiqueta ${diasEntre(hoje(), R.proximas[0].data) <= 3 ? 'vermelha' : ''}">${contagem(R.proximas[0].data)}</span></div>` : ''}</section>`; })() : ''}
    ${L.atual ? `<section class="cartao c6"><header><h2>${ic('livro')} Lendo</h2><button class="mini" data-ir="leitura">ver</button></header>
      <b>${esc(L.atual.titulo)}</b><div class="barra" style="margin:8px 0 4px"><div style="width:${L.atual.pct || 0}%"></div></div><small>página ${L.atual.pagina}${L.atual.paginas ? ` de ${L.atual.paginas}` : ''}${L.sequencia > 1 ? ` · ${L.sequencia} dias seguidos` : ''}</small></section>` : ''}
    <section class="cartao" id="manchetes"><header><h2>${ic('jornal')} Notícias</h2><button class="mini" data-ir="noticias">ver</button></header><p class="vazio">Carregando…</p></section>
  </div>`;
  ligarComuns();
  manchetesInicio();
}
function ligarComuns() {
  $$('[data-ir]').forEach((b) => (b.onclick = () => ir(b.dataset.ir)));
  $$('[data-treinar]').forEach((b) => (b.onclick = () => escolherFicha()));
  $$('[data-correr]').forEach((b) => (b.onclick = () => correrAgora()));
  $$('[data-gasto]').forEach((b) => (b.onclick = () => formGasto()));
}

// ==================== TREINO ====================
async function telaTreino() {
  const s = sub.treino || 'corrida';
  $('#conteudo').innerHTML = `<div class="topo"><h1>Treino</h1></div>${segmento(s, [['corrida', 'Corrida'], ['academia', 'Academia'], ['corpo', 'Corpo']])}<div id="treinoConteudo"></div>`;
  ligarSegmento();
  ({ corrida: treinoCorrida, academia: treinoAcademia, corpo: treinoCorpo })[s]();
  ligarComuns();
}
function treinoCorrida() {
  const C = corridaResumo(), P = planoHoje();
  const semanas = C.semanas.map((w, i) => ({ r: dataBR(w.ini), v: w.km, cor: i === C.semanas.length - 1 ? 'var(--acento)' : 'var(--acento-claro)' }));
  $('#treinoConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><div class="anel">${anel(C.semanaKm / (C.meta || 1), { tam: 104, cor: '#fff', texto: km1(C.semanaKm), sub: 'km na semana', claro: true })}
      <div><small>Meta da semana</small><div class="grande">${C.meta} km</div><small>${C.semanaKm >= C.meta ? 'Meta batida! 🎉' : `faltam ${km1(Math.max(0, C.meta - C.semanaKm))} km`} · ${C.semanaQtd} corrida${C.semanaQtd === 1 ? '' : 's'}</small></div></div>
      <div class="dupla" style="margin-top:14px"><button class="largo" style="background:#fff;color:var(--acento);border:0" data-correr>${ic('play')} Correr agora</button><button class="largo" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="novaCorrida">${ic('mais')} Registrar</button></div>
    </section>
    <section class="cartao c6"><header><h2>${ic('alvo')} Plano</h2>${P ? '<button class="mini" id="sairPlano">trocar</button>' : ''}</header>
      ${P ? `<b>${esc(P.nome)}</b><div class="barra" style="margin:8px 0 4px"><div style="width:${(P.feitos / P.total) * 100}%"></div></div><small>${P.feitos} de ${P.total} treinos</small>
        ${P.proximo ? `<p style="margin:10px 0 6px">Semana ${P.semana}, treino ${P.treino}: <b>${esc(P.proximo)}</b></p><div class="acoes"><button class="primario mini" data-correr>${ic('play')} Fazer agora</button><button class="mini" id="planoFeito">${ic('check')} Já fiz</button></div>` : '<p>🏆 Plano concluído! Escolha o próximo.</p>'}`
        : `<p class="suave" style="margin-top:0">Escolha um plano de 8 semanas (3 corridas por semana). O app mostra o treino do dia.</p>
        <div class="acoes"><button class="mini primario" data-plano="5k">5 km do zero</button><button class="mini" data-plano="10k">10 km (já corro 5)</button></div>`}
    </section>
    <section class="cartao c6"><header><h2>${ic('trofeu')} Recordes</h2></header>
      <div class="kpis"><div class="kpi"><small>Maior</small><b>${C.recordes.maior ? km1(C.recordes.maior.km) : '—'}</b><small>km</small></div>
        <div class="kpi"><small>Ritmo 5 km</small><b style="font-size:16px">${C.recordes.r5 ? fmtPace(pace(C.recordes.r5.seg, C.recordes.r5.km)) : '—'}</b></div>
        <div class="kpi"><small>Ritmo 10 km</small><b style="font-size:16px">${C.recordes.r10 ? fmtPace(pace(C.recordes.r10.seg, C.recordes.r10.km)) : '—'}</b></div></div>
      <small style="display:block;margin-top:8px">Este mês: <b>${km1(C.mesKm)} km</b> em ${C.mesQtd} corrida${C.mesQtd === 1 ? '' : 's'} · total: ${km1(C.totalKm)} km</small>
    </section>
    <section class="cartao"><header><h2>Km por semana</h2></header>${grafBarras(semanas, { meta: C.meta, formato: (v) => km1(v) })}</section>
    <section class="cartao"><header><h2>${ic('tenis')} Corridas</h2></header>
      ${C.ultimas.length ? C.ultimas.slice(0, 30).map((c) => `<div class="linha clicavel" data-corrida="${c.id}"><div class="tit"><span>${km1(c.km)} km · ${fmtTempo(c.seg)}</span><small>${diaCurto(c.data)} · ${fmtPace(pace(c.seg, c.km))}${c.tipo ? ' · ' + esc(c.tipo) : ''}${c.trajeto ? ' · GPS' : ''}</small></div>${c.sensacao ? `<span>${['😫', '😕', '🙂', '😄', '🔥'][c.sensacao - 1]}</span>` : ''}</div>`).join('')
        : '<p class="vazio">Nenhuma corrida ainda. Toque em <b>Correr agora</b> (GPS) ou <b>Registrar</b> (do relógio/Strava).</p>'}
    </section></div>`;
  $('#novaCorrida').onclick = () => formCorrida();
  $$('[data-plano]').forEach((b) => (b.onclick = () => { E.plano = { tipo: b.dataset.plano, inicio: hoje(), feitos: [] }; salvar(); avisar('Plano escolhido. Bora!'); render(); }));
  if ($('#sairPlano')) $('#sairPlano').onclick = () => { if (confirm('Trocar de plano? O progresso deste plano será perdido.')) { E.plano = null; salvar(); render(); } };
  if ($('#planoFeito')) $('#planoFeito').onclick = () => { E.plano.feitos.push(hoje()); salvar(); avisar('Treino do plano marcado ✓'); render(); };
  $$('[data-corrida]').forEach((r) => (r.onclick = () => verCorrida(E.corridas.find((c) => c.id === r.dataset.corrida))));
}
const TIPOS_CORRIDA = ['leve', 'longão', 'intervalado', 'ritmo', 'prova', 'esteira'];
function formCorrida(c = {}) {
  const f = modal(`<h2>${c.id ? 'Editar corrida' : 'Registrar corrida'}</h2>
    <div class="dupla"><label>Distância (km)<input name="km" required inputmode="decimal" value="${c.km ? String(c.km).replace('.', ',') : ''}" placeholder="5,0"></label><label>Tempo<input name="tempo" required inputmode="numeric" placeholder="32:15" value="${c.seg ? fmtTempo(c.seg) : ''}"></label></div>
    <div class="dupla"><label>Data<input type="date" name="data" value="${c.data || hoje()}"></label><label>Tipo<select name="tipo">${TIPOS_CORRIDA.map((t) => `<option ${c.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
    <label>Como foi?<select name="sensacao">${['😫 pesada', '😕 cansativa', '🙂 normal', '😄 boa', '🔥 voando'].map((t, i) => `<option value="${i + 1}" ${(c.sensacao || 3) === i + 1 ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    <label>Observação<input name="obs" value="${esc(c.obs)}" placeholder="percurso, tênis, clima…"></label>
    ${!c.id && planoHoje() && planoHoje().proximo ? `<label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="plano" checked> Conta como treino do plano (${esc(planoHoje().proximo)})</label>` : ''}
    <p class="suave" style="margin:0;font-size:13px" id="paceVer"></p>
    ${c.id ? `<button type="button" class="mini" id="apagarCorrida" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar corrida</button>` : ''}`,
  (v) => {
    const km = valorDe(v.km), seg = lerTempo(v.tempo);
    if (!(km > 0 && km < 400)) throw new Error('Distância inválida.');
    if (!(seg > 0)) throw new Error('Tempo inválido (ex.: 32:15 ou 1:05:30).');
    if (c.id) Object.assign(c, { km, seg, data: v.data, tipo: v.tipo, sensacao: +v.sensacao, obs: v.obs });
    else { E.corridas.push({ id: id(), km, seg, data: v.data || hoje(), tipo: v.tipo, sensacao: +v.sensacao, obs: v.obs }); if (v.plano) E.plano.feitos.push(hoje()); }
    salvar(); avisar(`${km1(km)} km a ${fmtPace(pace(seg, km))} 💪`);
  });
  const mostra = () => { const km = valorDe(f.km.value), s = lerTempo(f.tempo.value); $('#paceVer').textContent = km > 0 && s > 0 ? 'Ritmo: ' + fmtPace(pace(s, km)) : ''; };
  f.km.oninput = mostra; f.tempo.oninput = mostra; mostra();
  if ($('#apagarCorrida')) $('#apagarCorrida').onclick = () => { if (confirm('Apagar esta corrida?')) { E.corridas = E.corridas.filter((x) => x.id !== c.id); salvar(); $('#modal').close(); render(); } };
}
function verCorrida(c) {
  modal(`<h2>${km1(c.km)} km · ${diaCurto(c.data)}</h2>
    <div class="kpis"><div class="kpi"><small>Tempo</small><b>${fmtTempo(c.seg)}</b></div><div class="kpi"><small>Ritmo</small><b style="font-size:16px">${fmtPace(pace(c.seg, c.km))}</b></div><div class="kpi"><small>Tipo</small><b style="font-size:15px">${esc(c.tipo || '—')}</b></div></div>
    ${desenharRota(c.trajeto)}
    ${c.splits && c.splits.length ? `<div><small style="font-weight:700">Parciais por km</small>${c.splits.map((s, i) => `<div class="cat"><span>km ${i + 1}</span><div class="barra"><div style="width:${(Math.min(...c.splits) / s) * 100}%"></div></div><span>${fmtTempo(s)}</span></div>`).join('')}</div>` : ''}
    ${c.obs ? `<p style="margin:0">${esc(c.obs)}</p>` : ''}
    <div class="dupla"><button type="button" id="editarC">${ic('lapis')} Editar</button><button value="cancelar" class="primario">Fechar</button></div>`, () => {}, { semBotoes: true });
  $('#editarC').onclick = () => { $('#modal').close(); setTimeout(() => formCorrida(c), 50); };
}

// ---------- correr agora (GPS com a tela ligada) ----------
const distM = (a, b) => { const R = 6371000, r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
function correrAgora() {
  if (!('geolocation' in navigator)) return avisar('Este aparelho não tem GPS disponível.', true);
  const R = { estado: 'pronto', m: 0, pts: [], ult: null, ini: 0, acumulado: 0, splits: [], ultSplitSeg: 0, rel: null, watch: null, wake: null, prec: null, recente: [] };
  const tc = $('#tela-cheia'); tc.hidden = false; document.body.style.overflow = 'hidden';
  const seg = () => R.acumulado + (R.estado === 'correndo' ? (Date.now() - R.ini) / 1000 : 0);
  // a estrutura (botões) só é redesenhada quando muda o estado; os números, a cada segundo
  const desenhar = () => {
    tc.innerHTML = `<div class="tc-topo"><button class="icone" id="cvFechar">${ic('fechar')}</button><b>${R.estado === 'pronto' ? 'Pronta para correr?' : R.estado === 'pausado' ? 'Pausado' : 'Correndo'}</b><span class="cv-gps" id="cvGps"></span></div>
      <div class="corrida-viva">
        <div><div class="cv-dist" id="cvDist">0,00</div><small>quilômetros</small></div>
        <div class="cv-num"><div><b id="cvTempo">0:00</b><small>tempo</small></div><div><b id="cvAtual">—</b><small>ritmo agora</small></div><div><b id="cvMedio">—</b><small>ritmo médio</small></div></div>
        ${planoHoje() && planoHoje().proximo ? `<div class="cartao" style="text-align:left"><small>Treino do plano</small><br><b>${esc(planoHoje().proximo)}</b></div>` : ''}
        <div id="cvRota"></div>
        <div class="cv-botoes">${R.estado === 'pronto' ? `<button class="primario" id="cvIniciar" aria-label="Iniciar">${ic('play')}</button>`
          : R.estado === 'correndo' ? `<button id="cvPausar" aria-label="Pausar">${ic('pausa')}</button>`
          : `<button class="primario" id="cvRetomar" aria-label="Continuar">${ic('play')}</button><button style="background:var(--texto);color:#fff;border:0" id="cvFim" aria-label="Terminar">${ic('parar')}</button>`}</div>
        <small id="cvRodape">${R.estado === 'pronto' ? 'Deixe a tela ligada durante a corrida: o iPhone só marca o GPS com o app aberto.' : ''}</small>
      </div>`;
    $('#cvFechar').onclick = () => { if (R.estado === 'pronto' || confirm('Sair sem salvar esta corrida?')) fechar(); };
    if ($('#cvIniciar')) $('#cvIniciar').onclick = iniciar;
    if ($('#cvPausar')) $('#cvPausar').onclick = () => { R.acumulado = seg(); R.estado = 'pausado'; R.ult = null; vibrar(80); desenhar(); };
    if ($('#cvRetomar')) $('#cvRetomar').onclick = () => { R.ini = Date.now(); R.estado = 'correndo'; vibrar(80); desenhar(); };
    if ($('#cvFim')) $('#cvFim').onclick = terminar;
    numeros();
  };
  let pontosDesenhados = 0;
  const numeros = () => {
    if (!$('#cvDist')) return;
    const s = seg(), km = R.m / 1000;
    // ritmo atual: últimos ~300 m
    let atual = 0; const rc = R.recente; if (rc.length > 1) { const dm = rc[rc.length - 1].m - rc[0].m, dt = (rc[rc.length - 1].t - rc[0].t) / 1000; if (dm > 30) atual = dt / (dm / 1000); }
    $('#cvDist').textContent = num(km, 2); $('#cvTempo').textContent = fmtTempo(s);
    $('#cvAtual').textContent = atual ? fmtTempo(atual) : '—'; $('#cvMedio').textContent = km > 0.05 ? fmtTempo(s / km) : '—';
    $('#cvGps').innerHTML = `<i class="ponto ${R.prec == null ? '' : R.prec <= 15 ? 'bom' : R.prec <= 35 ? 'medio' : 'ruim'}"></i>GPS${R.prec != null ? ' ±' + Math.round(R.prec) + ' m' : '…'}`;
    if (R.pts.length !== pontosDesenhados) { pontosDesenhados = R.pts.length; $('#cvRota').innerHTML = desenharRota(R.pts, 160); }
    if (R.splits.length) $('#cvRodape').textContent = 'Parciais: ' + R.splits.map((x, i) => `km ${i + 1} ${fmtTempo(x)}`).join(' · ');
  };
  const posicao = (p) => {
    R.prec = p.coords.accuracy;
    if (R.estado !== 'correndo' || p.coords.accuracy > 40) return; // ponto ruim: ignora
    const pt = [+p.coords.latitude.toFixed(6), +p.coords.longitude.toFixed(6)];
    if (R.ult) {
      const d = distM(R.ult.pt, pt), dt = (p.timestamp - R.ult.t) / 1000;
      if (d < 3 || (dt > 0 && d / dt > 9)) return; // parado (ruído) ou pulo impossível
      R.m += d;
      // parcial a cada km
      if (Math.floor(R.m / 1000) > R.splits.length) { const s = seg(); R.splits.push(Math.round(s - R.ultSplitSeg)); R.ultSplitSeg = s; vibrar([120, 80, 120]); }
    }
    R.ult = { pt, t: p.timestamp }; R.pts.push(pt);
    R.recente.push({ m: R.m, t: p.timestamp }); while (R.recente.length > 2 && R.m - R.recente[0].m > 300) R.recente.shift();
  };
  const iniciar = async () => {
    R.estado = 'correndo'; R.ini = Date.now(); vibrar(150);
    try { if ('wakeLock' in navigator) R.wake = await navigator.wakeLock.request('screen'); } catch {}
    desenhar();
  };
  const terminar = () => {
    const s = Math.round(seg()), km = Math.round(R.m / 10) / 100;
    if (km < 0.05) { if (confirm('Quase nada de distância marcada. Sair sem salvar?')) fechar(); return; }
    // trajeto mais leve para guardar (no máx. ~1500 pontos)
    const passo = Math.max(1, Math.ceil(R.pts.length / 1500)), trajeto = R.pts.filter((_, i) => i % passo === 0 || i === R.pts.length - 1);
    const c = { id: id(), data: hoje(), km, seg: s, tipo: 'leve', sensacao: 3, trajeto, splits: R.splits };
    E.corridas.push(c);
    const P = planoHoje(); if (P && P.proximo) E.plano.feitos.push(hoje());
    salvar(); fechar(); ir('treino/corrida'); avisar(`${km1(km)} km em ${fmtTempo(s)}! 🎉`);
    setTimeout(() => formCorrida(c), 300);
  };
  const fechar = () => { if (R.watch != null) navigator.geolocation.clearWatch(R.watch); clearInterval(R.rel); try { R.wake && R.wake.release(); } catch {} tc.hidden = true; tc.innerHTML = ''; document.body.style.overflow = ''; };
  R.watch = navigator.geolocation.watchPosition(posicao, (e) => { if (e.code === 1) { avisar('Libere a localização para o Meu Painel nos Ajustes do iPhone.', true); } }, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
  R.rel = setInterval(() => { if (!tc.hidden) numeros(); }, 1000);
  // a tela volta a ficar ligada quando o app volta do fundo
  document.addEventListener('visibilitychange', async () => { if (!document.hidden && R.estado === 'correndo' && 'wakeLock' in navigator) try { R.wake = await navigator.wakeLock.request('screen'); } catch {} });
  desenhar();
}

// ---------- academia ----------
function treinoAcademia() {
  const A = academiaResumo();
  // calendário das últimas 5 semanas
  const ini = somaDias(inicioSemana(), -28), dias = Array.from({ length: 35 }, (_, i) => somaDias(ini, i));
  const exs = [...new Set(E.treinos.flatMap((t) => t.exercicios.map((e) => e.nome)))].sort();
  const exSel = sub.ex && exs.includes(sub.ex) ? sub.ex : exs[0];
  $('#treinoConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><div class="anel">${anel(A.semanaQtd / (A.meta || 1), { tam: 104, cor: '#fff', texto: `${A.semanaQtd}/${A.meta}`, sub: 'na semana', claro: true })}
      <div><small>Próximo treino</small><div class="grande" style="font-size:22px">${A.proxima ? esc(A.proxima.nome) : 'crie uma ficha'}</div><small>${A.sequencia > 1 ? `🔥 ${A.sequencia} semanas seguidas na meta · ` : ''}${A.mesQtd} treino${A.mesQtd === 1 ? '' : 's'} no mês</small></div></div>
      <div class="dupla" style="margin-top:14px"><button class="largo" style="background:#fff;color:var(--acento);border:0" data-treinar>${ic('haltere')} Treinar agora</button><button class="largo" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="treinoManual">${ic('mais')} Registrar</button></div>
    </section>
    <section class="cartao c6"><header><h2>${ic('agenda')} Frequência</h2><small>5 semanas</small></header>
      <div class="calendario">${['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d) => `<span class="dsem">${d}</span>`).join('')}${dias.map((d) => `<span class="${A.diasMarcados.has(d) ? 'feito' : ''} ${d === hoje() ? 'hoje' : ''}">${+d.slice(8)}</span>`).join('')}</div>
    </section>
    <section class="cartao c6"><header><h2>${ic('lapis')} Fichas</h2><button class="mini" id="novaFicha">${ic('mais')} Ficha</button></header>
      ${E.fichas.length ? E.fichas.map((f) => `<div class="linha clicavel" data-ficha="${f.id}"><div class="tit"><span>${esc(f.nome)}</span><small>${f.exercicios.map((e) => esc(e.nome)).slice(0, 4).join(', ')}${f.exercicios.length > 4 ? '…' : ''}</small></div>${ic('lapis')}</div>`).join('')
        : `<p class="vazio">Nenhuma ficha. <button class="mini" id="fichasModelo">Usar as fichas prontas A, B e C</button></p>`}
    </section>
    <section class="cartao"><header><h2>${ic('fogo')} Evolução de carga</h2>${exs.length ? `<select id="exSel" style="max-width:60%">${exs.map((e) => `<option ${e === exSel ? 'selected' : ''}>${esc(e)}</option>`).join('')}</select>` : ''}</header>
      ${exSel ? grafLinha(evolucao(exSel), { unidade: 'kg' }) : '<p class="vazio">Depois dos primeiros treinos, a evolução de cada exercício aparece aqui.</p>'}
    </section>
    <section class="cartao"><header><h2>${ic('relogio')} Histórico</h2></header>
      ${A.historico.length ? A.historico.slice(0, 25).map((t) => `<div class="linha clicavel" data-sessao="${t.id}"><div class="tit"><span>${esc(t.fichaNome)}</span><small>${diaCurto(t.data)} · ${Math.round(t.duracaoSeg / 60)} min · ${t.exercicios.reduce((s, e) => s + e.series.filter((x) => x.feito).length, 0)} séries</small></div><span class="val">${Math.round(t.exercicios.reduce((s, e) => s + e.series.filter((x) => x.feito).reduce((a, x) => a + (+x.carga || 0) * (parseInt(x.reps) || 0), 0), 0)).toLocaleString('pt-BR')} kg</span></div>`).join('')
        : '<p class="vazio">Nenhum treino ainda. Bora começar? 💪</p>'}
      ${A.historico.length ? '<small>O número à direita é o volume do treino (carga × repetições).</small>' : ''}
    </section></div>`;
  $('#novaFicha').onclick = () => formFicha();
  $('#treinoManual').onclick = () => formTreinoManual();
  if ($('#fichasModelo')) $('#fichasModelo').onclick = () => { E.fichas = FICHAS_MODELO.map((f) => novaFicha(f.nome, f.exercicios)); salvar(); render(); };
  $$('[data-ficha]').forEach((r) => (r.onclick = () => formFicha(E.fichas.find((f) => f.id === r.dataset.ficha))));
  if ($('#exSel')) $('#exSel').onchange = (e) => { sub.ex = e.target.value; render(); };
  $$('[data-sessao]').forEach((r) => (r.onclick = () => verSessao(E.treinos.find((t) => t.id === r.dataset.sessao))));
}
function formFicha(f) {
  const nova = !f; f = f ? JSON.parse(JSON.stringify(f)) : { id: id(), nome: '', exercicios: [] };
  const linhas = () => f.exercicios.map((e, i) => `<div class="exercicio" style="padding:10px" data-i="${i}">
      <div style="display:flex;gap:8px"><input name="n_${i}" value="${esc(e.nome)}" placeholder="Exercício" required style="flex:1"><button type="button" class="icone" data-tirar="${i}" aria-label="Tirar">${ic('lixo')}</button></div>
      <div class="tripla" style="margin-top:6px"><label>Séries<input name="s_${i}" type="number" min="1" value="${e.series}"></label><label>Repetições<input name="r_${i}" value="${esc(e.reps)}"></label><label>Carga (kg)<input name="c_${i}" inputmode="decimal" value="${String(e.carga).replace('.', ',')}"></label></div>
      <label style="margin-top:6px">Descanso (s)<input name="d_${i}" type="number" min="0" step="5" value="${e.descanso ?? 60}"></label></div>`).join('');
  const ler = (form) => f.exercicios.forEach((e, i) => { e.nome = form['n_' + i].value; e.series = +form['s_' + i].value || 3; e.reps = form['r_' + i].value; e.carga = valorDe(form['c_' + i].value) || 0; e.descanso = +form['d_' + i].value || 0; });
  const form = modal(`<h2>${nova ? 'Nova ficha' : 'Editar ficha'}</h2><label>Nome<input name="nome" required value="${esc(f.nome)}" placeholder="Ex.: A — Pernas"></label>
    <div id="exs" class="form">${linhas()}</div><button type="button" id="addEx">${ic('mais')} Exercício</button>
    ${nova ? '' : `<button type="button" class="mini" id="apagarFicha" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar ficha</button>`}`,
  (v, fm) => {
    ler(fm); f.nome = v.nome.trim();
    if (!f.exercicios.length) throw new Error('Coloque pelo menos um exercício.');
    if (nova) E.fichas.push(f); else E.fichas[E.fichas.findIndex((x) => x.id === f.id)] = f;
    salvar(); avisar('Ficha salva');
  });
  const religar = () => {
    $('#exs').innerHTML = linhas();
    $$('[data-tirar]').forEach((b) => (b.onclick = () => { ler(form); f.exercicios.splice(+b.dataset.tirar, 1); religar(); }));
  };
  $('#addEx').onclick = () => { ler(form); f.exercicios.push({ id: id(), nome: '', series: 3, reps: '12', carga: 0, descanso: 60 }); religar(); $(`[name=n_${f.exercicios.length - 1}]`).focus(); };
  religar();
  if ($('#apagarFicha')) $('#apagarFicha').onclick = () => { if (confirm('Apagar esta ficha? O histórico dos treinos continua.')) { E.fichas = E.fichas.filter((x) => x.id !== f.id); salvar(); $('#modal').close(); render(); } };
}
function escolherFicha() {
  if (!E.fichas.length) { ir('treino/academia'); return avisar('Crie uma ficha primeiro', true); }
  const A = academiaResumo();
  modal(`<h2>Qual treino hoje?</h2>${E.fichas.map((f) => `<button type="button" class="largo ${A.proxima && A.proxima.id === f.id ? 'primario' : ''}" data-escolher="${f.id}" style="justify-content:space-between"><span>${esc(f.nome)}</span><small style="color:inherit">${f.exercicios.length} exerc.</small></button>`).join('')}
    <button value="cancelar">Cancelar</button>`, () => {}, { semBotoes: true });
  $$('[data-escolher]').forEach((b) => (b.onclick = () => { $('#modal').close(); treinarAgora(E.fichas.find((f) => f.id === b.dataset.escolher)); }));
}
function treinarAgora(ficha) {
  const S = { ini: Date.now(), descansoFim: 0, rel: null, wake: null,
    exs: ficha.exercicios.map((e) => ({ nome: e.nome, descanso: e.descanso ?? 60, reps: e.reps, sug: sugerirCarga(e.nome, e.carga), series: Array.from({ length: e.series }, () => ({ reps: parseInt(e.reps) || '', carga: e.carga, feito: false })) })) };
  const tc = $('#tela-cheia'); tc.hidden = false; document.body.style.overflow = 'hidden';
  try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').then((w) => (S.wake = w)).catch(() => {}); } catch {}
  const tempo = () => fmtTempo((Date.now() - S.ini) / 1000);
  const feitas = () => S.exs.reduce((s, e) => s + e.series.filter((x) => x.feito).length, 0), total = S.exs.reduce((s, e) => s + e.series.length, 0);
  const desenhar = () => {
    tc.innerHTML = `<div class="tc-topo"><button class="icone" id="trFechar">${ic('fechar')}</button><div style="text-align:center"><b>${esc(ficha.nome)}</b><br><small id="trTempo">${tempo()}</small></div><button class="primario mini" id="trFim">Concluir</button></div>
      <div class="barra" style="margin-bottom:14px"><div style="width:${(feitas() / total) * 100}%"></div></div>
      <div class="form">${S.exs.map((e, i) => `<div class="exercicio"><h3><span>${esc(e.nome)}</span><small>${e.series.length} × ${esc(e.reps)}</small></h3>
        ${e.sug ? `<div class="dica-carga">↑ Você completou tudo nas últimas vezes: tente ${num(e.sug, e.sug % 1 ? 1 : 0)} kg</div>` : ''}
        ${e.series.map((s, j) => `<div class="serie ${s.feito ? 'feita' : ''}"><span class="n">${j + 1}</span>
          <input inputmode="decimal" data-carga="${i}-${j}" value="${String(s.carga).replace('.', ',')}" aria-label="Carga em kg" placeholder="kg">
          <input inputmode="numeric" data-reps="${i}-${j}" value="${s.reps}" aria-label="Repetições" placeholder="reps">
          <button type="button" data-feito="${i}-${j}" aria-label="Série feita">${ic('check')}</button></div>`).join('')}
        <div class="serie" style="grid-template-columns:26px 1fr 1fr 48px"><span></span><small style="text-align:center">kg</small><small style="text-align:center">reps</small><span></span></div>
      </div>`).join('')}</div>
      <div class="descanso" id="trDescanso" hidden><span>Descanso</span><b id="trSeg"></b><button class="mini" id="trPular" style="background:#fff">Pular</button></div>`;
    $('#trFechar').onclick = () => { if (!feitas() || confirm('Sair sem salvar este treino?')) fechar(); };
    $('#trFim').onclick = concluir;
    $$('[data-carga]').forEach((inp) => (inp.onchange = () => { const [i, j] = inp.dataset.carga.split('-').map(Number); const v = valorDe(inp.value) || 0; S.exs[i].series[j].carga = v; S.exs[i].series.forEach((s, k) => { if (k > j && !s.feito) s.carga = v; }); desenhar(); }));
    $$('[data-reps]').forEach((inp) => (inp.onchange = () => { const [i, j] = inp.dataset.reps.split('-').map(Number); S.exs[i].series[j].reps = inp.value; }));
    $$('[data-feito]').forEach((b) => (b.onclick = () => {
      const [i, j] = b.dataset.feito.split('-').map(Number), s = S.exs[i].series[j];
      s.feito = !s.feito; vibrar(40);
      if (s.feito && S.exs[i].descanso) S.descansoFim = Date.now() + S.exs[i].descanso * 1000;
      desenhar();
    }));
    $('#trPular').onclick = () => { S.descansoFim = 0; atualizar(); };
    atualizar();
  };
  const atualizar = () => {
    if (!$('#trTempo')) return;
    $('#trTempo').textContent = tempo();
    const falta = Math.ceil((S.descansoFim - Date.now()) / 1000), box = $('#trDescanso');
    if (falta > 0) { box.hidden = false; $('#trSeg').textContent = fmtTempo(falta); }
    else { if (!box.hidden && S.descansoFim) { vibrar([200, 100, 200]); S.descansoFim = 0; } box.hidden = true; }
  };
  const concluir = () => {
    if (!feitas()) return avisar('Marque as séries que você fez ✓', true);
    const t = { id: id(), data: hoje(), fichaId: ficha.id, fichaNome: ficha.nome, duracaoSeg: Math.round((Date.now() - S.ini) / 1000),
      exercicios: S.exs.map((e) => ({ nome: e.nome, series: e.series.map((s) => ({ reps: s.reps, carga: s.carga, feito: s.feito })) })) };
    E.treinos.push(t);
    // a ficha guarda a carga usada (a próxima vez já começa nela)
    S.exs.forEach((e, i) => { const usadas = e.series.filter((s) => s.feito).map((s) => +s.carga || 0); if (usadas.length && ficha.exercicios[i]) ficha.exercicios[i].carga = Math.max(...usadas); });
    salvar(); fechar(); ir('treino/academia');
    const A = academiaResumo();
    avisar(A.semanaQtd >= A.meta ? `Treino ${A.semanaQtd} da semana: meta batida! 🏆` : `Treino concluído! ${A.semanaQtd}/${A.meta} na semana 💪`);
  };
  const fechar = () => { clearInterval(S.rel); try { S.wake && S.wake.release(); } catch {} tc.hidden = true; tc.innerHTML = ''; document.body.style.overflow = ''; };
  S.rel = setInterval(atualizar, 1000);
  desenhar();
}
function verSessao(t) {
  modal(`<h2>${esc(t.fichaNome)} · ${diaCurto(t.data)}</h2><small>${Math.round(t.duracaoSeg / 60)} minutos${t.manual ? ' · lançado à mão' : ''}</small>
    ${t.exercicios.map((e) => `<div><b>${esc(e.nome)}</b><br><small>${e.series.map((s) => (s.feito ? '' : '<s>') + `${num(s.carga, s.carga % 1 ? 1 : 0)} kg × ${esc(s.reps)}` + (s.feito ? '' : '</s>')).join(' · ')}</small></div>`).join('')}
    <div class="tripla"><button type="button" id="apagarS" style="color:var(--vermelho)">${ic('lixo')}</button><button type="button" id="editarS">${ic('lapis')} Editar</button><button value="cancelar" class="primario">Fechar</button></div>`, () => {}, { semBotoes: true });
  $('#apagarS').onclick = () => { if (confirm('Apagar este treino do histórico?')) { E.treinos = E.treinos.filter((x) => x.id !== t.id); salvar(); $('#modal').close(); render(); } };
  $('#editarS').onclick = () => { $('#modal').close(); setTimeout(() => formTreinoManual(t), 50); };
}
// treino lançado à mão (ou corrigido depois): escolhe a ficha (ou treino livre) e põe as séries que fez
function formTreinoManual(t) {
  const novo = !t;
  const S = t ? { data: t.data, fichaId: t.fichaId || '', nome: t.fichaNome, min: Math.round(t.duracaoSeg / 60) || '', exs: t.exercicios.map((e) => ({ nome: e.nome, series: e.series.filter((s) => s.feito).map((s) => ({ carga: s.carga, reps: s.reps })) })) }
    : { data: hoje(), fichaId: '', nome: '', min: 60, exs: [{ nome: '', series: [{ carga: '', reps: '' }] }] };
  const daFicha = (f) => f.exercicios.map((e) => ({ nome: e.nome, series: Array.from({ length: e.series }, () => ({ carga: e.carga || '', reps: parseInt(e.reps) || '' })) }));
  const blocos = () => S.exs.map((e, i) => `<div class="exercicio" style="padding:10px">
      <div style="display:flex;gap:8px"><input data-ex-nome="${i}" value="${esc(e.nome)}" placeholder="Exercício (ex.: agachamento)" style="flex:1"><button type="button" class="icone" data-tirar-ex="${i}" aria-label="Tirar exercício">${ic('lixo')}</button></div>
      ${e.series.map((s, j) => `<div class="serie" style="grid-template-columns:26px 1fr 1fr 40px"><span class="n">${j + 1}</span><input data-kg="${i}-${j}" inputmode="decimal" value="${String(s.carga ?? '').replace('.', ',')}" placeholder="kg" aria-label="Carga"><input data-rp="${i}-${j}" inputmode="numeric" value="${esc(s.reps ?? '')}" placeholder="reps" aria-label="Repetições"><button type="button" class="icone" data-tirar-serie="${i}-${j}" aria-label="Tirar série">${ic('fechar')}</button></div>`).join('')}
      <button type="button" class="mini" data-add-serie="${i}" style="margin-top:8px">${ic('mais')} Série</button></div>`).join('');
  const ler = () => {
    S.data = f.data.value; S.min = f.min.value; S.nome = f.nome.value; S.fichaId = f.ficha.value;
    $$('[data-ex-nome]', f).forEach((x) => (S.exs[+x.dataset.exNome].nome = x.value));
    $$('[data-kg]', f).forEach((x) => { const [i, j] = x.dataset.kg.split('-').map(Number); S.exs[i].series[j].carga = x.value; });
    $$('[data-rp]', f).forEach((x) => { const [i, j] = x.dataset.rp.split('-').map(Number); S.exs[i].series[j].reps = x.value; });
  };
  const f = modal(`<h2>${novo ? 'Registrar treino' : 'Editar treino'}</h2>
    <div class="dupla"><label>Dia<input type="date" name="data" value="${S.data}" max="${hoje()}"></label><label>Duração (min)<input name="min" type="number" min="1" value="${S.min}"></label></div>
    <label>Treino<select name="ficha"><option value="">Treino livre</option>${E.fichas.map((x) => `<option value="${x.id}" ${x.id === S.fichaId ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></label>
    <label id="nomeLivre">Nome do treino<input name="nome" value="${esc(S.fichaId ? '' : S.nome)}" placeholder="Ex.: Funcional, aula de glúteo"></label>
    <div id="exsManual" class="form"></div><button type="button" id="addExManual">${ic('mais')} Exercício</button>
    <small>Coloque só as séries que você fez. Série sem carga (peso do corpo) pode ficar com o kg vazio.</small>`,
  () => {
    ler();
    const exercicios = S.exs.map((e) => ({ nome: e.nome.trim(), series: e.series.filter((s) => String(s.reps).trim() || String(s.carga).trim()).map((s) => ({ reps: String(s.reps).trim(), carga: valorDe(s.carga) || 0, feito: true })) })).filter((e) => e.nome && e.series.length);
    if (!exercicios.length) throw new Error('Coloque pelo menos um exercício com uma série.');
    const ficha = E.fichas.find((x) => x.id === S.fichaId);
    const dados = { data: S.data || hoje(), fichaId: ficha ? ficha.id : null, fichaNome: ficha ? ficha.nome : S.nome.trim() || 'Treino livre', duracaoSeg: (+S.min || 0) * 60, exercicios, manual: true };
    if (novo) E.treinos.push({ id: id(), ...dados }); else Object.assign(t, dados);
    // treino da ficha: guarda a maior carga de cada exercício para o próximo
    if (ficha) for (const e of exercicios) { const fe = ficha.exercicios.find((x) => sem(x.nome) === sem(e.nome)); if (fe) fe.carga = Math.max(...e.series.map((s) => s.carga)); }
    salvar(); const A = academiaResumo(); avisar(novo ? `Treino registrado! ${A.semanaQtd}/${A.meta} na semana 💪` : 'Treino atualizado');
  });
  const religar = () => {
    $('#exsManual').innerHTML = blocos();
    $('#nomeLivre').style.display = f.ficha.value ? 'none' : '';
    $$('[data-add-serie]', f).forEach((b) => (b.onclick = () => { ler(); const e = S.exs[+b.dataset.addSerie], ult = e.series[e.series.length - 1] || {}; e.series.push({ carga: ult.carga ?? '', reps: ult.reps ?? '' }); religar(); }));
    $$('[data-tirar-serie]', f).forEach((b) => (b.onclick = () => { ler(); const [i, j] = b.dataset.tirarSerie.split('-').map(Number); S.exs[i].series.splice(j, 1); if (!S.exs[i].series.length) S.exs[i].series.push({ carga: '', reps: '' }); religar(); }));
    $$('[data-tirar-ex]', f).forEach((b) => (b.onclick = () => { ler(); S.exs.splice(+b.dataset.tirarEx, 1); if (!S.exs.length) S.exs.push({ nome: '', series: [{ carga: '', reps: '' }] }); religar(); }));
  };
  // escolheu uma ficha: já vem com os exercícios e as cargas dela (dá para mudar)
  f.ficha.onchange = () => { ler(); const fi = E.fichas.find((x) => x.id === f.ficha.value); if (fi && (novo || confirm('Trocar os exercícios pelos da ficha?'))) S.exs = daFicha(fi); religar(); };
  $('#addExManual').onclick = () => { ler(); S.exs.push({ nome: '', series: [{ carga: '', reps: '' }] }); religar(); $(`[data-ex-nome="${S.exs.length - 1}"]`).focus(); };
  religar();
}

// ---------- corpo ----------
const MEDIDAS = [['peso', 'Peso', 'kg'], ['cintura', 'Cintura', 'cm'], ['quadril', 'Quadril', 'cm'], ['abdomen', 'Abdômen', 'cm'], ['braco', 'Braço', 'cm'], ['coxa', 'Coxa', 'cm'], ['gordura', '% gordura', '%']];
function treinoCorpo() {
  const regs = [...E.corpo].sort((a, b) => a.data.localeCompare(b.data)), prim = regs[0], ult = regs[regs.length - 1];
  const tem = (k) => regs.some((r) => r[k] != null);
  $('#treinoConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><header><h2>${ic('corpo')} Corpo</h2><button class="mini" style="background:#fff;color:var(--acento);border:0" id="novaMedida">${ic('mais')} Registrar</button></header>
      ${ult ? `<div class="kpis">${MEDIDAS.filter(([k]) => ult[k] != null).slice(0, 3).map(([k, n, u]) => { const d = prim && prim !== ult && prim[k] != null ? ult[k] - prim[k] : null; return `<div class="kpi"><small>${n}</small><b>${num(ult[k], ult[k] % 1 ? 1 : 0)}<em style="font-size:11px">${u}</em></b><small>${d != null ? (d > 0 ? '+' : '') + num(d, 1) + ' desde o início' : diaCurto(ult.data)}</small></div>`; }).join('')}</div>`
        : '<p style="margin:0">Registre peso e medidas a cada 2–4 semanas para ver a evolução (de manhã, em jejum, é o mais confiável).</p>'}
    </section>
    ${tem('peso') ? `<section class="cartao c6"><header><h2>Peso</h2></header>${grafLinha(regs.filter((r) => r.peso != null).map((r) => ({ x: r.data, y: r.peso })), { unidade: 'kg' })}</section>` : ''}
    ${tem('cintura') ? `<section class="cartao c6"><header><h2>Cintura</h2></header>${grafLinha(regs.filter((r) => r.cintura != null).map((r) => ({ x: r.data, y: r.cintura })), { unidade: 'cm' })}</section>` : ''}
    ${regs.length ? `<section class="cartao"><header><h2>Medidas</h2></header><div class="rolar"><table><tr><th>Data</th>${MEDIDAS.filter(([k]) => tem(k)).map(([, n]) => `<th class="num">${n}</th>`).join('')}<th></th></tr>
      ${[...regs].reverse().map((r) => `<tr><td>${dataBR(r.data)}/${r.data.slice(2, 4)}</td>${MEDIDAS.filter(([k]) => tem(k)).map(([k]) => `<td class="num">${r[k] != null ? num(r[k], r[k] % 1 ? 1 : 0) : ''}</td>`).join('')}<td><button class="icone" data-apagar-medida="${r.data}">${ic('lixo')}</button></td></tr>`).join('')}</table></div></section>` : ''}
  </div>`;
  $('#novaMedida').onclick = () => modal(`<h2>Registrar medidas</h2><label>Data<input type="date" name="data" value="${hoje()}"></label>
    <div class="dupla">${MEDIDAS.map(([k, n, u]) => `<label>${n} (${u})<input name="${k}" inputmode="decimal" placeholder="${ult && ult[k] != null ? String(ult[k]).replace('.', ',') : ''}"></label>`).join('')}</div><small>Preencha só o que mediu.</small>`,
  (v) => {
    const r = { data: v.data || hoje() };
    for (const [k] of MEDIDAS) { const x = valorDe(v[k]); if (x > 0) r[k] = x; }
    if (Object.keys(r).length < 2) throw new Error('Preencha pelo menos uma medida.');
    E.corpo = E.corpo.filter((x) => x.data !== r.data).concat(r); salvar(); avisar('Medidas salvas');
  });
  $$('[data-apagar-medida]').forEach((b) => (b.onclick = () => { if (confirm('Apagar as medidas deste dia?')) { E.corpo = E.corpo.filter((x) => x.data !== b.dataset.apagarMedida); salvar(); render(); } }));
}

// ---------- caixinha "Avisar no WhatsApp" (aparece quando os avisos estão ligados em Ajustes) ----------
const caixaWhats = (marcado = true, legenda = 'Avisar no WhatsApp') => !NUVEM.url ? ''
  : avisosLigados() ? `<label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="whats" ${marcado ? 'checked' : ''}> ${ic('whats')} ${legenda}</label>`
  : '<small>Quer aviso no WhatsApp? Ligue em Mais › Ajustes › Avisos no WhatsApp.</small>';
const avisoMarca = (itemId) => (temAviso(itemId) ? `<span class="etiqueta verde" title="Vai avisar no WhatsApp">${ic('whats')}</span>` : '');

// ==================== ESTUDOS ====================
async function telaEstudos() {
  const s = sub.estudos || 'hoje';
  $('#conteudo').innerHTML = `<div class="topo"><h1>Estudos</h1></div>${segmento(s, [['hoje', 'Hoje'], ['materias', 'Matérias'], ['provas', 'Provas']])}<div id="estConteudo"></div>`;
  ligarSegmento();
  ({ hoje: estudosHoje, materias: estudosMaterias, provas: estudosProvas })[s]();
  ligarComuns();
}
const horasTxt = (h) => (h < 1 ? Math.round(h * 60) + ' min' : num(h, h % 1 ? 1 : 0) + ' h');
const contagem = (d) => { const n = diasEntre(hoje(), d); return n === 0 ? 'hoje' : n === 1 ? 'amanhã' : `em ${n} dias`; };
function estudosHoje() {
  const R = estudosResumo();
  $('#estConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><div class="anel">${anel(R.semanaH / (R.meta || 1), { tam: 104, cor: '#fff', texto: horasTxt(R.semanaH), sub: 'na semana', claro: true })}
      <div><small>Meta da semana</small><div class="grande">${R.meta} h</div><small>hoje: ${horasTxt(R.hojeMin / 60)}${R.sequencia > 1 ? ` · 🔥 ${R.sequencia} dias seguidos` : ''}</small></div></div>
      <div class="dupla" style="margin-top:14px"><button class="largo" style="background:#fff;color:var(--acento);border:0" id="estudarAgora">${ic('play')} Estudar agora</button><button class="largo" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="lancarEstudo">${ic('mais')} Lançar</button></div>
    </section>
    <section class="cartao c6"><header><h2>${ic('revisar')} Revisões de hoje</h2></header>
      ${R.revisoesHoje.length ? R.revisoesHoje.map((r) => `<div class="linha"><input type="checkbox" data-revisao="${r.id}" aria-label="Revisada"><div class="tit"><span>${esc(r.assunto)}</span><small><span style="color:${materia(r.materiaId).cor}">●</span> ${esc(materia(r.materiaId).nome)} · ${r.dias === 1 ? '1 dia' : r.dias + ' dias'} depois${r.data < hoje() ? ` · <b style="color:var(--vermelho)">atrasada</b>` : ''}</small></div>${avisoMarca(r.id)}</div>`).join('')
        : '<p class="vazio">Nada para revisar hoje. ✨</p>'}
      <small>Quando você lança um estudo com assunto, o app marca revisões em 1, 7 e 30 dias.</small>
    </section>
    <section class="cartao c6"><header><h2>${ic('agenda')} Próximas provas e trabalhos</h2><button class="mini" data-ir="estudos/provas">ver</button></header>
      ${R.proximas.length ? R.proximas.slice(0, 5).map((p) => `<div class="linha"><div class="tit"><span>${esc(p.titulo)}</span><small><span style="color:${materia(p.materiaId).cor}">●</span> ${esc(materia(p.materiaId).nome)} · ${diaCurto(p.data)}${p.hora ? ' ' + p.hora : ''}</small></div><span class="etiqueta ${diasEntre(hoje(), p.data) <= 3 ? 'vermelha' : ''}">${contagem(p.data)}</span></div>`).join('')
        : '<p class="vazio">Nenhuma prova marcada.</p>'}
    </section>
    <section class="cartao"><header><h2>Horas por semana</h2></header>${grafBarras(R.semanas.map((w, i) => ({ r: dataBR(w.ini), v: w.h, cor: i === R.semanas.length - 1 ? 'var(--acento)' : 'var(--acento-claro)' })), { meta: R.meta, formato: (v) => num(v, v % 1 ? 1 : 0) })}</section>
    <section class="cartao"><header><h2>${ic('relogio')} Últimos estudos</h2></header>
      ${R.sessoes.length ? R.sessoes.slice(0, 15).map((x) => `<div class="linha clicavel" data-sessao-est="${x.id}"><div class="tit"><span>${esc(x.assunto || materia(x.materiaId).nome)}</span><small><span style="color:${materia(x.materiaId).cor}">●</span> ${esc(materia(x.materiaId).nome)} · ${diaCurto(x.data)}</small></div><span class="val">${horasTxt(x.min / 60)}</span></div>`).join('')
        : '<p class="vazio">Nenhum estudo lançado ainda.</p>'}
    </section></div>`;
  $('#estudarAgora').onclick = () => estudarAgora();
  $('#lancarEstudo').onclick = () => formEstudo();
  $$('[data-revisao]').forEach((c) => (c.onchange = () => { const r = E.revisoes.find((x) => x.id === c.dataset.revisao); r.feita = true; r.feitaEm = hoje(); cancelarAvisos(r.id); salvar(); avisar('Revisão feita ✓'); render(); }));
  $$('[data-sessao-est]').forEach((r) => (r.onclick = () => { const x = E.sessoes.find((s) => s.id === r.dataset.sessaoEst);
    if (confirm(`Apagar este estudo (${horasTxt(x.min / 60)} de ${materia(x.materiaId).nome})? As revisões dele também saem.`)) {
      E.revisoes.filter((v) => v.sessao === x.id && !v.feita).forEach((v) => cancelarAvisos(v.id));
      E.revisoes = E.revisoes.filter((v) => v.sessao !== x.id || v.feita); E.sessoes = E.sessoes.filter((s) => s.id !== x.id); salvar(); render();
    } }));
}
const opcoesMateria = (sel) => E.materias.map((m) => `<option value="${m.id}" ${m.id === sel ? 'selected' : ''}>${esc(m.nome)}</option>`).join('');
const precisaMateria = () => { if (E.materias.length) return false; avisar('Cadastre uma matéria primeiro', true); sub.estudos = 'materias'; render(); setTimeout(() => formMateria(), 200); return true; };
// lança o estudo e marca as revisões (com aviso no WhatsApp às 9h, se ela quiser)
function salvarEstudo(v, min) {
  const r = registrarEstudo({ materiaId: v.materia, min, assunto: v.assunto, data: v.data || hoje(), revisar: !!v.revisar });
  if (v.whats) for (const rv of r.revisoes) agendarAvisos(rv.id, [{ quando: instante(rv.data, '09:00'), texto: `🔁 Revisão de *${materia(rv.materiaId).nome}*: ${rv.assunto} (estudou há ${rv.dias} dia${rv.dias > 1 ? 's' : ''})` }]);
  return r;
}
function formEstudo() {
  if (precisaMateria()) return;
  modal(`<h2>Lançar estudo</h2><div class="dupla"><label>Matéria<select name="materia">${opcoesMateria()}</select></label><label>Tempo<input name="tempo" required inputmode="numeric" placeholder="1:30 ou 45"></label></div>
    <label>Assunto<input name="assunto" placeholder="Ex.: sistema nervoso, cap. 4"></label><label>Data<input type="date" name="data" value="${hoje()}"></label>
    <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="revisar" checked> Marcar revisões em 1, 7 e 30 dias</label>${caixaWhats(true, 'Avisar as revisões no WhatsApp')}`,
  (v) => {
    const t = String(v.tempo).trim(), min = t.includes(':') ? lerTempo(t + ':00') / 60 : +t.replace(',', '.');
    if (!(min > 0 && min < 1440)) throw new Error('Tempo inválido (ex.: 45 para minutos ou 1:30).');
    const r = salvarEstudo(v, min); avisar(`${horasTxt(min / 60)} de estudo${r.revisoes.length ? ' · revisões marcadas' : ''} 📚`);
  });
}
// cronômetro: livre ou pomodoro (25 min estudando + 5 de pausa)
function estudarAgora() {
  if (precisaMateria()) return;
  const f = modal(`<h2>Estudar agora</h2><label>Matéria<select name="materia">${opcoesMateria()}</select></label><label>Assunto<input name="assunto" placeholder="o que vai estudar"></label>
    <label>Modo<select name="modo"><option value="pomodoro">Pomodoro (25 min + 5 de pausa)</option><option value="livre">Livre (cronômetro)</option></select></label>`,
  (v) => { setTimeout(() => cronometroEstudo(v), 80); }, { textoOk: 'Começar' });
  f.querySelector('button.primario').textContent = 'Começar';
}
function cronometroEstudo(v) {
  const T = { estudo: 0, pausa: false, faseIni: Date.now(), rodando: true, acumFase: 0, ciclos: 0, rel: null, wake: null };
  const tc = $('#tela-cheia'); tc.hidden = false; document.body.style.overflow = 'hidden';
  try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').then((w) => (T.wake = w)).catch(() => {}); } catch {}
  const pomodoro = v.modo === 'pomodoro', FASE = () => (T.pausa ? 5 : 25) * 60;
  const fase = () => T.acumFase + (T.rodando ? (Date.now() - T.faseIni) / 1000 : 0);
  const estudoTotal = () => T.estudo + (!T.pausa ? fase() : 0);
  const desenhar = () => {
    tc.innerHTML = `<div class="tc-topo"><button class="icone" id="ceFechar">${ic('fechar')}</button><div style="text-align:center"><b>${esc(materia(v.materia).nome)}</b><br><small>${esc(v.assunto || '')}</small></div><button class="primario mini" id="ceFim">Terminar</button></div>
      <div class="corrida-viva" style="margin-top:30px"><small id="ceFase">${pomodoro ? (T.pausa ? '☕ Pausa' : '📚 Foco') : 'Estudando'}</small><div class="cv-dist" id="ceTempo">0:00</div>
        <small id="ceTotal"></small>
        <div class="cv-botoes"><button class="${T.rodando ? '' : 'primario'}" id="ceBotao" aria-label="${T.rodando ? 'Pausar' : 'Continuar'}">${ic(T.rodando ? 'pausa' : 'play')}</button></div>
        <small>${pomodoro ? 'A cada 25 minutos o celular vibra para uma pausa de 5.' : 'Deixe o app aberto enquanto estuda.'}</small></div>`;
    $('#ceFechar').onclick = () => { if (estudoTotal() < 60 || confirm('Sair sem lançar este estudo?')) fechar(); };
    $('#ceBotao').onclick = () => { if (T.rodando) { T.acumFase = fase(); T.rodando = false; } else { T.faseIni = Date.now(); T.rodando = true; } desenhar(); };
    $('#ceFim').onclick = terminar;
    numeros();
  };
  const numeros = () => {
    if (!$('#ceTempo')) return;
    if (pomodoro && fase() >= FASE()) {
      if (!T.pausa) { T.estudo += FASE(); T.ciclos++; } T.pausa = !T.pausa; T.acumFase = 0; T.faseIni = Date.now(); vibrar([300, 150, 300]);
      $('#ceFase').textContent = T.pausa ? '☕ Pausa' : '📚 Foco';
    }
    $('#ceTempo').textContent = fmtTempo(pomodoro ? Math.max(0, FASE() - fase()) : fase());
    $('#ceTotal').textContent = `estudado: ${fmtTempo(estudoTotal())}${pomodoro ? ` · ${T.ciclos} pomodoro${T.ciclos === 1 ? '' : 's'}` : ''}`;
  };
  const terminar = () => {
    const min = Math.round(estudoTotal() / 60);
    if (min < 1) { if (confirm('Menos de 1 minuto. Sair sem lançar?')) fechar(); return; }
    fechar();
    modal(`<h2>${horasTxt(min / 60)} de ${esc(materia(v.materia).nome)} 🎉</h2><label>Assunto<input name="assunto" value="${esc(v.assunto || '')}" placeholder="o que estudou"></label>
      <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="revisar" checked> Marcar revisões em 1, 7 e 30 dias</label>${caixaWhats(true, 'Avisar as revisões no WhatsApp')}`,
    (x) => { salvarEstudo({ ...x, materia: v.materia }, min); avisar('Estudo lançado 📚'); sub.estudos = 'hoje'; ir('estudos/hoje'); }, { textoOk: 'Lançar' });
  };
  const fechar = () => { clearInterval(T.rel); try { T.wake && T.wake.release(); } catch {} tc.hidden = true; tc.innerHTML = ''; document.body.style.overflow = ''; };
  T.rel = setInterval(numeros, 1000);
  desenhar();
}
function estudosMaterias() {
  const R = estudosResumo();
  $('#estConteudo').innerHTML = `<div class="grade">
    <section class="cartao"><header><h2>${ic('capelo')} Matérias</h2><button class="mini primario" id="novaMateria">${ic('mais')} Matéria</button></header>
      ${R.porMateria.length ? R.porMateria.map((m) => `<div class="linha clicavel" data-materia="${m.id}"><span style="width:12px;height:12px;border-radius:50%;background:${m.cor};flex-shrink:0"></span><div class="tit"><span>${esc(m.nome)}</span><small>semana ${horasTxt(m.semana)} · mês ${horasTxt(m.mes)} · total ${horasTxt(m.total)}</small></div>${m.media != null ? `<span class="etiqueta ${m.media >= 7 ? 'verde' : m.media >= 5 ? '' : 'vermelha'}">média ${num(m.media, 1)}</span>` : ''}</div>`).join('')
        : '<p class="vazio">Cadastre as matérias (ou disciplinas, cursos, concursos) que você estuda.</p>'}
    </section>
    ${R.porMateria.some((m) => m.mes) ? `<section class="cartao"><header><h2>Horas no mês</h2></header>${R.porMateria.filter((m) => m.mes).sort((a, b) => b.mes - a.mes).map((m, i, l) => `<div class="cat"><span>${esc(m.nome)}</span><div class="barra"><div style="width:${(m.mes / l[0].mes) * 100}%;background:${m.cor}"></div></div><b>${horasTxt(m.mes)}</b></div>`).join('')}</section>` : ''}
  </div>`;
  $('#novaMateria').onclick = () => formMateria();
  $$('[data-materia]').forEach((r) => (r.onclick = () => formMateria(E.materias.find((m) => m.id === r.dataset.materia))));
}
function formMateria(m) {
  const nova = !m, cor = m ? m.cor : CORES_MATERIA[E.materias.length % CORES_MATERIA.length];
  modal(`<h2>${nova ? 'Nova matéria' : 'Matéria'}</h2><label>Nome<input name="nome" required value="${esc(m && m.nome)}" placeholder="Ex.: Anatomia, Inglês, Concurso TJ"></label>
    <label>Cor<div class="acoes">${CORES_MATERIA.map((c) => `<label style="display:inline-flex"><input type="radio" name="cor" value="${c}" ${c === cor ? 'checked' : ''} style="accent-color:${c}"><span style="width:22px;height:22px;border-radius:50%;background:${c};display:inline-block"></span></label>`).join('')}</div></label>
    ${nova ? '' : `<button type="button" class="mini" id="apagarMateria" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar matéria</button>`}`,
  (v) => { if (nova) E.materias.push({ id: id(), nome: v.nome.trim(), cor: v.cor || cor }); else Object.assign(m, { nome: v.nome.trim(), cor: v.cor || cor }); salvar(); avisar('Salvo'); });
  if ($('#apagarMateria')) $('#apagarMateria').onclick = () => {
    if (E.sessoes.some((s) => s.materiaId === m.id) || E.provas.some((p) => p.materiaId === m.id)) return avisar('Esta matéria tem estudos ou provas lançados.', true);
    if (confirm('Apagar esta matéria?')) { E.materias = E.materias.filter((x) => x.id !== m.id); salvar(); $('#modal').close(); render(); }
  };
}
function estudosProvas() {
  const fut = E.provas.filter((p) => p.data >= hoje() && (p.nota == null || p.nota === '')).sort((a, b) => a.data.localeCompare(b.data));
  const pass = E.provas.filter((p) => !fut.includes(p)).sort((a, b) => b.data.localeCompare(a.data));
  const linha = (p) => `<div class="linha clicavel" data-prova="${p.id}"><div class="tit"><span>${p.tipo === 'trabalho' ? '📝' : '📖'} ${esc(p.titulo)}</span><small><span style="color:${materia(p.materiaId).cor}">●</span> ${esc(materia(p.materiaId).nome)} · ${diaCurto(p.data)}${p.hora ? ' ' + p.hora : ''}</small></div>
    ${p.nota != null && p.nota !== '' ? `<span class="etiqueta ${(p.nota / (p.notaMax || 10)) * 10 >= 7 ? 'verde' : ''}">${num(p.nota, p.nota % 1 ? 1 : 0)}/${p.notaMax || 10}</span>` : `${avisoMarca(p.id)}<span class="etiqueta ${diasEntre(hoje(), p.data) <= 3 ? 'vermelha' : ''}">${p.data < hoje() ? 'sem nota' : contagem(p.data)}</span>`}</div>`;
  $('#estConteudo').innerHTML = `<div class="grade">
    <section class="cartao"><header><h2>${ic('agenda')} Próximas</h2><button class="mini primario" id="novaProva">${ic('mais')} Prova / trabalho</button></header>${fut.length ? fut.map(linha).join('') : '<p class="vazio">Nada marcado.</p>'}</section>
    <section class="cartao"><header><h2>${ic('trofeu')} Notas e passadas</h2></header>${pass.length ? pass.map(linha).join('') : '<p class="vazio">As provas que já passaram aparecem aqui, com a nota.</p>'}</section>
  </div>`;
  $('#novaProva').onclick = () => formProva();
  $$('[data-prova]').forEach((r) => (r.onclick = () => formProva(E.provas.find((p) => p.id === r.dataset.prova))));
}
// aviso de prova: na véspera às 19h e no dia às 7h (ou 2 h antes, se a prova for cedo)
function avisarProva(p) {
  const qual = `${p.tipo === 'trabalho' ? 'entrega do trabalho' : 'prova'} de *${materia(p.materiaId).nome}*: ${p.titulo}`;
  const noDia = p.hora && p.hora < '09:00' ? new Date(new Date(`${p.data}T${p.hora}:00`) - 2 * 3600e3).toISOString() : instante(p.data, '07:00');
  agendarAvisos(p.id, [{ quando: instante(somaDias(p.data, -1), '19:00'), texto: `📚 Amanhã tem ${qual}${p.hora ? ' às ' + p.hora : ''}. Bora revisar!` }, { quando: noDia, texto: `💪 Hoje: ${qual}${p.hora ? ' às ' + p.hora : ''}. Boa sorte!` }]);
}
function formProva(p) {
  if (!p && precisaMateria()) return;
  const nova = !p; p = p || { tipo: 'prova', data: somaDias(hoje(), 7), notaMax: 10, peso: 1 };
  const passou = p.data && p.data < hoje();
  modal(`<h2>${nova ? 'Nova prova ou trabalho' : esc(p.titulo)}</h2>
    <div class="dupla"><label>Tipo<select name="tipo"><option value="prova" ${p.tipo === 'prova' ? 'selected' : ''}>Prova</option><option value="trabalho" ${p.tipo === 'trabalho' ? 'selected' : ''}>Trabalho / entrega</option></select></label><label>Matéria<select name="materia">${opcoesMateria(p.materiaId)}</select></label></div>
    <label>Descrição<input name="titulo" required value="${esc(p.titulo)}" placeholder="Ex.: P1 — capítulos 1 a 4"></label>
    <div class="dupla"><label>Dia<input type="date" name="data" required value="${p.data}"></label><label>Hora<input type="time" name="hora" value="${p.hora || ''}"></label></div>
    <div class="tripla"><label>Nota<input name="nota" inputmode="decimal" value="${p.nota != null ? String(p.nota).replace('.', ',') : ''}" placeholder="—"></label><label>Vale<input name="notaMax" inputmode="decimal" value="${p.notaMax || 10}"></label><label>Peso<input name="peso" inputmode="decimal" value="${p.peso || 1}"></label></div>
    ${passou ? '' : caixaWhats(nova || temAviso(p.id), 'Avisar no WhatsApp (véspera às 19h e no dia)')}
    ${nova ? '' : `<button type="button" class="mini" id="apagarProva" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar</button>`}`,
  (v) => {
    const nota = v.nota === '' ? null : valorDe(v.nota);
    Object.assign(p, { tipo: v.tipo, materiaId: v.materia, titulo: v.titulo.trim(), data: v.data, hora: v.hora || null, nota, notaMax: valorDe(v.notaMax) || 10, peso: valorDe(v.peso) || 1 });
    if (nova) { p.id = id(); E.provas.push(p); }
    // com nota (já fez) ou sem a caixinha marcada: sem aviso
    if (v.whats && nota == null) avisarProva(p); else cancelarAvisos(p.id);
    salvar(); avisar(nota != null ? 'Nota salva' : 'Salvo');
  });
  if ($('#apagarProva')) $('#apagarProva').onclick = () => { if (confirm('Apagar?')) { cancelarAvisos(p.id); E.provas = E.provas.filter((x) => x.id !== p.id); salvar(); $('#modal').close(); render(); } };
}

// ==================== DINHEIRO ====================
let mesGastos = hoje().slice(0, 7), contasTodas = false;
const FORMAS = () => [...E.config.cartoes.map((c) => 'Cartão ' + c.nome), 'pix', 'débito', 'dinheiro', 'boleto', 'crédito'];
async function telaDinheiro() {
  const s = sub.dinheiro || 'gastos';
  $('#conteudo').innerHTML = `<div class="topo"><h1>Dinheiro</h1></div>${segmento(s, [['gastos', 'Gastos'], ['contas', 'Contas']])}<div id="dinConteudo"></div>`;
  ligarSegmento();
  (s === 'contas' ? dinContas : dinGastos)();
}
function dinGastos() {
  const G = gastosDoMes(mesGastos), [a, m] = mesGastos.split('-').map(Number), cats = Object.entries(G.porCategoria).sort((x, y) => y[1] - x[1]);
  $('#dinConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><header><button class="mini" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="mAnt">‹</button><b>${MESES[m - 1]} ${a}</b><button class="mini" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="mProx">›</button></header>
      <div class="grande">${reais(G.total)}</div><small>${G.lista.length} lançamento${G.lista.length === 1 ? '' : 's'}${mesGastos === hoje().slice(0, 7) ? ' · hoje ' + reais(G.hoje) : ''}</small>
      <button class="largo" style="margin-top:14px;background:#fff;color:var(--acento);border:0" data-gasto>${ic('mais')} Novo gasto</button></section>
    <section class="cartao c6"><header><h2>Por categoria</h2></header>${cats.length ? cats.map(([c, v]) => `<div class="cat"><span>${esc(c)}</span><div class="barra"><div style="width:${(v / cats[0][1]) * 100}%"></div></div><b>${reais(v)}</b></div>`).join('') : '<p class="vazio">Nenhum gasto neste mês.</p>'}</section>
    <section class="cartao c6"><header><h2>Últimos meses</h2></header>${grafBarras(G.meses.map((x) => ({ r: MESES[+x.mes.slice(5) - 1].slice(0, 3), v: x.total, cor: x.mes === mesGastos ? 'var(--acento)' : 'var(--acento-claro)' })), { formato: (v) => (v >= 1000 ? num(v / 1000, 1) + 'k' : Math.round(v)) })}</section>
    <section class="cartao"><header><h2>Lançamentos</h2></header>${G.lista.length ? G.lista.map((g) => `<div class="linha clicavel" data-g="${g.id}"><div class="tit"><span>${esc(g.descricao || g.categoria)}</span><small>${diaCurto(g.data)} · ${esc(g.categoria)}${g.forma ? ' · ' + esc(g.forma) : ''}</small></div><span class="val">${reais(g.valor)}</span></div>`).join('') : '<p class="vazio">Nada por aqui.</p>'}</section>
  </div>`;
  const mover = (k) => { mesGastos = somaMeses(mesGastos + '-15', k).slice(0, 7); render(); };
  $('#mAnt').onclick = () => mover(-1); $('#mProx').onclick = () => mover(1);
  $$('[data-g]').forEach((r) => (r.onclick = () => formEditarGasto(E.gastos.find((g) => g.id === r.dataset.g))));
  ligarComuns();
}
function formGasto() {
  const f = modal(`<h2>Novo gasto</h2>
    <div class="dupla"><label>Valor (R$)<input name="valor" required inputmode="decimal" placeholder="0,00"></label><label>Data<input type="date" name="data" value="${hoje()}"></label></div>
    <label>Descrição<input name="descricao" id="gDesc" placeholder="mercado, farmácia, academia…"></label>
    <div class="dupla"><label>Categoria<select name="categoria" id="gCat">${E.config.categorias.map((c) => `<option>${esc(c)}</option>`).join('')}</select></label>
    <label>Pagamento<select name="forma">${FORMAS().map((x) => `<option>${esc(x)}</option>`).join('')}</select></label></div>
    <label>Parcelas<select name="parcelas">${Array.from({ length: 24 }, (_, i) => `<option value="${i + 1}">${i ? i + 1 + 'x' : 'à vista'}</option>`).join('')}</select></label>
    ${E.config.cartoes.length ? '' : '<small>Cadastre seus cartões em Mais › Ajustes para as compras caírem na fatura certa.</small>'}`,
  (v) => { const gs = gastar(v); avisar(gs.length > 1 ? `${reais(valorDe(v.valor))} em ${gs.length}x` : `${reais(gs[0].valor)} em ${gs[0].categoria}`); });
  let mexeu = false; $('#gCat', f).onchange = () => (mexeu = true);
  $('#gDesc', f).oninput = (e) => { if (!mexeu) $('#gCat', f).value = categoriaDe(e.target.value); };
  f.valor.focus();
}
function formEditarGasto(g) {
  const conta = !g.pago;
  modal(`<h2>${conta ? 'Conta a pagar' : 'Gasto'}</h2>
    <div class="dupla"><label>Valor (R$)<input name="valor" required inputmode="decimal" value="${String(g.valor).replace('.', ',')}"></label><label>${conta ? 'Vencimento' : 'Data'}<input type="date" name="data" value="${conta ? g.vencimento : g.data}"></label></div>
    <label>Descrição<input name="descricao" value="${esc(g.descricao)}"></label>
    <label>Categoria<select name="categoria">${E.config.categorias.map((c) => `<option ${c === g.categoria ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
    ${conta ? caixaWhats(temAviso(g.id), 'Avisar no WhatsApp no dia (9h)') : ''}
    <div class="dupla"><button type="button" id="apagarG" style="color:var(--vermelho)">${ic('lixo')} Apagar</button>${conta ? `<button type="button" id="calG">${ic('calmais')} Calendário</button>` : '<span></span>'}</div>`,
  (v) => {
    const val = valorDe(v.valor); if (!(val > 0)) throw new Error('Valor inválido.');
    Object.assign(g, { valor: Math.round(val * 100) / 100, descricao: v.descricao, categoria: v.categoria });
    if (conta) { g.vencimento = v.data; g.data = v.data; if (v.whats) avisarConta(g); else cancelarAvisos(g.id); } else g.data = v.data;
    salvar(); avisar('Salvo');
  });
  $('#apagarG').onclick = () => { if (confirm('Apagar este lançamento?')) { cancelarAvisos(g.id); E.gastos = E.gastos.filter((x) => x.id !== g.id); salvar(); $('#modal').close(); render(); } };
  if ($('#calG')) $('#calG').onclick = () => paraCalendario({ titulo: `Pagar ${g.descricao || g.categoria} — ${reais(g.valor)}`, data: g.vencimento });
}
function dinContas() {
  const itens = [...aPagar().map((g) => ({ tipo: 'conta', venc: g.vencimento, valor: g.valor, g })), ...faturas().map((f) => ({ tipo: 'fatura', venc: f.venc, valor: f.total, f }))].sort((a, b) => a.venc.localeCompare(b.venc));
  const porMes = {}; for (const i of itens) (porMes[i.venc.slice(0, 7)] ||= []).push(i);
  const meses = Object.keys(porMes).sort(), soma = (l) => l.reduce((s, i) => s + i.valor, 0), vencidas = itens.filter((i) => i.venc < hoje());
  const ps = parcelados(), abertos = ps.filter((p) => !p.quitado);
  const linha = (i) => i.tipo === 'conta'
    ? `<div class="linha"><div class="tit clicavel" data-g="${i.g.id}"><span>${esc(i.g.descricao || i.g.categoria)}</span><small>${i.venc < hoje() ? '<span class="etiqueta vermelha">vencida</span> ' : ''}vence ${diaCurto(i.venc)}</small></div>${avisoMarca(i.g.id)}<span class="val">${reais(i.valor)}</span><button class="mini verde" data-pagar="${i.g.id}">${ic('check')}</button></div>`
    : `<div class="linha"><div class="tit"><span>${ic('cartao')} Fatura ${esc(i.f.cartao)}</span><small>vence ${diaCurto(i.venc)} · ${i.f.itens.length} compra${i.f.itens.length > 1 ? 's' : ''}</small></div><span class="val">${reais(i.valor)}</span><button class="mini verde" data-fatura="${esc(i.f.cartao)}|${i.venc}">${ic('check')}</button></div>`;
  $('#dinConteudo').innerHTML = `<div class="grade">
    <section class="cartao destaque"><small>Em aberto</small><div class="grande">${reais(soma(itens))}</div>
      <small>${itens.length} conta${itens.length === 1 ? '' : 's'}${vencidas.length ? ` · ⚠️ ${vencidas.length} vencida${vencidas.length > 1 ? 's' : ''}` : ''}</small>
      <div class="dupla" style="margin-top:14px"><button style="background:#fff;color:var(--acento);border:0" id="novaConta">${ic('mais')} Conta</button><button style="background:rgba(255,255,255,.2);color:#fff;border:0" id="parcelada">${ic('recibo')} Parcelada</button></div></section>
    <section class="cartao"><header><h2>${ic('recibo')} Contas parceladas</h2><button class="mini" id="importar">${ic('upload')} Planilha</button></header>
      ${abertos.length ? abertos.map((p) => `<div class="linha"><div class="tit"><span>${esc(p.descricao)}</span><small>${p.proxima ? `${p.proxima.parcela}/${p.total} · vence ${diaCurto(p.proxima.vencimento)}` : '<span class="etiqueta vermelha">sem vencimento</span>'} · faltam <b>${p.faltam}</b> (${reais(p.restante)})</small>
          <div class="barra" style="margin-top:5px"><div style="width:${(p.pagas / p.total) * 100}%"></div></div></div>
          <button class="icone" data-venc="${p.id}" title="Vencimento">${ic('agenda')}</button><button class="icone" data-cal="${p.id}" title="Pôr no calendário">${ic('calmais')}</button></div>`).join('')
        : '<p class="vazio">Nenhuma. Toque em <b>Parcelada</b> (ex.: geladeira 3/10) ou importe a planilha.</p>'}
      ${abertos.length ? `<small>Falta pagar: <b>${reais(abertos.reduce((s, p) => s + p.restante, 0))}</b>. O ${ic('calmais')} põe todas as parcelas no Calendário do iPhone, com aviso às 9h do dia.</small>` : ''}
    </section>
    ${(contasTodas ? meses : meses.slice(0, 3)).map((m) => `<section class="cartao c6"><header><h2>${MESES[+m.slice(5) - 1]} ${m.slice(0, 4)}</h2><b>${reais(soma(porMes[m]))}</b></header>${porMes[m].map(linha).join('')}</section>`).join('')}
    ${meses.length > 3 ? `<button id="todosMeses">${contasTodas ? 'Mostrar só 3 meses' : `Ver os outros ${meses.length - 3} meses`}</button>` : ''}
    ${!itens.length ? '<p class="vazio">Nada a pagar. 🎉</p>' : ''}
  </div>`;
  $('#novaConta').onclick = () => modal(`<h2>Conta a pagar</h2><div class="dupla"><label>Valor (R$)<input name="valor" required inputmode="decimal"></label><label>Vencimento<input type="date" name="vencimento" required value="${hoje()}"></label></div>
    <label>Descrição<input name="descricao" required placeholder="luz, internet, escola…"></label>${caixaWhats(true, 'Avisar no WhatsApp no dia (9h)')}
    <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="cal" ${avisosLigados() ? '' : 'checked'}> Pôr no Calendário do iPhone (aviso às 9h)</label>`,
    (v) => { const g = contaAPagar(v); if (v.whats) avisarConta(g); if (v.cal) paraCalendario({ titulo: `Pagar ${g.descricao} — ${reais(g.valor)}`, data: g.vencimento }); avisar('Conta anotada'); });
  $('#parcelada').onclick = () => formParcelada();
  $('#importar').onclick = () => formImportar();
  $$('[data-g]').forEach((r) => (r.onclick = () => formEditarGasto(E.gastos.find((g) => g.id === r.dataset.g))));
  $$('[data-pagar]').forEach((b) => (b.onclick = () => { pagar(b.dataset.pagar); avisar('Paga ✓ (foi para os gastos de hoje)'); render(); }));
  $$('[data-fatura]').forEach((b) => (b.onclick = () => { const [c, v] = b.dataset.fatura.split('|'); if (confirm(`Fatura ${c} de ${dataBR(v)} paga?`)) { pagarFatura(c, v); render(); } }));
  $$('[data-venc]').forEach((b) => (b.onclick = () => { const p = ps.find((x) => x.id === b.dataset.venc);
    modal(`<h2>${esc(p.descricao)}</h2><label>Vencimento da próxima parcela<input type="date" name="v" required value="${p.proxima ? p.proxima.vencimento : ''}"></label><small>As seguintes caem no mesmo dia dos meses seguintes.</small>
      <button type="button" class="mini" id="apagarP" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar esta conta</button>`, (v) => { vencimentoParcelamento(p.id, v.v); avisar('Vencimentos atualizados'); });
    $('#apagarP').onclick = () => { if (confirm('Apagar esta conta parcelada (as parcelas em aberto)?')) { apagarParcelamento(p.id); $('#modal').close(); render(); } }; }));
  $$('[data-cal]').forEach((b) => (b.onclick = () => { const p = ps.find((x) => x.id === b.dataset.cal); if (!p.proxima) return avisar('Defina o vencimento primeiro', true); paraCalendario({ titulo: `Pagar ${p.descricao} — ${reais(p.valor)}`, data: p.proxima.vencimento, repetirMeses: p.faltam }); }));
  if ($('#todosMeses')) $('#todosMeses').onclick = () => { contasTodas = !contasTodas; render(); };
}
function formParcelada() {
  modal(`<h2>Conta parcelada</h2><label>Descrição<input name="descricao" required placeholder="Ex.: geladeira Magalu"></label>
    <div class="tripla"><label>Parcela (R$)<input name="valor" required inputmode="decimal"></label><label>Atual<input name="parcela" type="number" min="1" value="1"></label><label>De<input name="total" type="number" min="1" value="10"></label></div>
    <label>Vencimento da parcela atual<input type="date" name="vencimento" required value="${hoje()}"></label>
    ${caixaWhats(true, 'Avisar cada parcela no WhatsApp (9h do dia)')}
    <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="cal" ${avisosLigados() ? '' : 'checked'}> Pôr todas no Calendário do iPhone</label>`,
  (v) => {
    const r = importarContas([{ ...v, categoria: categoriaDe(v.descricao), whats: !!v.whats }]);
    if (r.repetidos.length) throw new Error('Essa conta já está cadastrada.');
    const p = parcelados().find((x) => sem(x.descricao) === sem(v.descricao));
    if (v.cal && p && p.proxima) paraCalendario({ titulo: `Pagar ${p.descricao} — ${reais(p.valor)}`, data: p.proxima.vencimento, repetirMeses: p.faltam });
    avisar(`${p ? p.faltam : ''} parcelas cadastradas`);
  });
}
let xlsx = null;
const carregarXlsx = () => (xlsx ||= new Promise((ok, erro) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload = () => ok(window.XLSX); s.onerror = () => { xlsx = null; erro(new Error('Sem internet para abrir a planilha.')); }; document.head.append(s); }));
function formImportar() {
  const f = modal(`<h2>Importar contas</h2><p class="suave" style="margin:0;font-size:14px">Planilha (Excel, Numbers exportado ou CSV) com uma conta por linha: nome, parcela (ex.: <b>3/10</b>), valor e, se tiver, vencimento.</p>
    <label>Arquivo<input type="file" name="arq" required accept=".xlsx,.xls,.csv,.txt"></label>`,
  async (v) => {
    let texto;
    if (/\.(xlsx|xls)$/i.test(v.arq.name)) { const X = await carregarXlsx(), wb = X.read(await v.arq.arrayBuffer(), { type: 'array', cellDates: true }); texto = wb.SheetNames.map((s) => X.utils.sheet_to_csv(wb.Sheets[s], { FS: ';', blankrows: false, dateNF: 'dd/mm/yyyy' })).join('\n'); }
    else texto = await v.arq.text();
    const itens = lerContasTexto(texto);
    if (!itens.length) throw new Error('Não achei contas no arquivo (cada linha precisa ter um valor como 150,00).');
    setTimeout(() => conferirContas(itens), 60);
  }, { textoOk: 'Ler arquivo' });
}
function conferirContas(itens) {
  modal(`<h2>Conferir · ${itens.length} conta${itens.length > 1 ? 's' : ''}</h2><small>Vencimento = o da parcela atual. Pode deixar em branco e definir depois.</small>
    ${itens.map((i, k) => `<div class="exercicio" style="padding:10px"><label style="display:flex;gap:8px;align-items:center;color:var(--texto)"><input type="checkbox" name="x_${k}" checked><input name="d_${k}" value="${esc(i.descricao)}" style="flex:1"></label>
      <div class="tripla" style="margin-top:6px"><label>Valor<input name="v_${k}" inputmode="decimal" value="${String(i.valor).replace('.', ',')}"></label><label>Parcela<input name="p_${k}" type="number" value="${i.parcela}"></label><label>De<input name="t_${k}" type="number" value="${i.total}"></label></div>
      <label style="margin-top:6px">Vencimento<input type="date" name="e_${k}" value="${i.vencimento}"></label></div>`).join('')}
    ${caixaWhats(true, 'Avisar as parcelas no WhatsApp (9h do dia)')}`,
  (v) => {
    const sel = itens.map((_, k) => k).filter((k) => v['x_' + k]).map((k) => ({ descricao: v['d_' + k], valor: v['v_' + k], parcela: v['p_' + k], total: v['t_' + k], vencimento: v['e_' + k], whats: !!v.whats }));
    const r = importarContas(sel); avisar(`${r.feitos} cadastrada${r.feitos === 1 ? '' : 's'}${r.repetidos.length ? ` · ${r.repetidos.length} já existia${r.repetidos.length > 1 ? 'm' : ''}` : ''}`);
  }, { textoOk: 'Cadastrar' });
}

// ==================== AGENDA ====================
async function telaAgenda() {
  const fut = E.compromissos.filter((c) => c.data >= hoje()).sort((a, b) => (a.data + (a.hora || '99')).localeCompare(b.data + (b.hora || '99')));
  const passados = E.compromissos.filter((c) => c.data < hoje()).sort((a, b) => b.data.localeCompare(a.data)).slice(0, 10);
  const porDia = {}; for (const c of fut) (porDia[c.data] ||= []).push(c);
  const item = (c) => `<div class="linha ${c.feito ? 'suave' : ''}"><input type="checkbox" data-feito="${c.id}" ${c.feito ? 'checked' : ''} aria-label="Feito"><b style="width:46px">${c.hora || '—'}</b><div class="tit clicavel" data-comp="${c.id}"><span style="${c.feito ? 'text-decoration:line-through' : ''}">${esc(c.titulo)}</span>${c.local ? `<small>${esc(c.local)}</small>` : ''}</div></div>`;
  $('#conteudo').innerHTML = `<div class="topo"><h1>Agenda</h1><button class="primario" id="novoComp">${ic('mais')} Novo</button></div><div class="grade">
    ${Object.keys(porDia).length ? Object.entries(porDia).map(([d, l]) => `<section class="cartao c6"><header><h2>${d === hoje() ? 'Hoje' : d === somaDias(hoje(), 1) ? 'Amanhã' : diaLongo(d)}</h2></header>${l.map(item).join('')}</section>`).join('')
      : `<section class="cartao"><p class="vazio">Nada marcado. Toque em <b>Novo</b>: o compromisso fica aqui e vai para o Calendário do iPhone, que te avisa na hora.</p></section>`}
    ${passados.length ? `<section class="cartao"><header><h2>Passados</h2></header>${passados.map((c) => `<div class="linha suave"><small style="width:70px">${dataBR(c.data)}</small><div class="tit clicavel" data-comp="${c.id}"><span>${esc(c.titulo)}</span></div></div>`).join('')}</section>` : ''}
  </div>`;
  $('#novoComp').onclick = () => formCompromisso();
  $$('[data-comp]').forEach((r) => (r.onclick = () => formCompromisso(E.compromissos.find((c) => c.id === r.dataset.comp))));
  $$('[data-feito]').forEach((c) => (c.onchange = () => { E.compromissos.find((x) => x.id === c.dataset.feito).feito = c.checked; salvar(); render(); }));
}
function formCompromisso(c = {}) {
  const f = modal(`<h2>${c.id ? 'Compromisso' : 'Novo compromisso'}</h2><label>O quê<input name="titulo" required value="${esc(c.titulo)}" placeholder="Dentista, reunião, prova de 5 km…"></label>
    <div class="dupla"><label>Dia<input type="date" name="data" required value="${c.data || hoje()}"></label><label>Hora<input type="time" name="hora" value="${c.hora || ''}"></label></div>
    <label>Local<input name="local" value="${esc(c.local)}"></label>
    <label>Avisar<select name="antes">${[[10, '10 min antes'], [30, '30 min antes'], [60, '1 hora antes'], [120, '2 horas antes'], [1440, '1 dia antes']].map(([v, t]) => `<option value="${v}" ${(c.antes || 30) === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
    ${caixaWhats(!c.id || temAviso(c.id))}
    <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="cal" ${c.id || avisosLigados() ? '' : 'checked'}> Pôr no Calendário do iPhone (ele avisa)</label>
    ${c.id ? `<button type="button" class="mini" id="apagarComp" style="justify-self:start;color:var(--vermelho)">${ic('lixo')} Apagar</button>` : ''}`,
  (v) => {
    const dados = { titulo: v.titulo.trim(), data: v.data, hora: v.hora || null, local: v.local || '', antes: +v.antes };
    if (c.id) Object.assign(c, dados); else { c = { id: id(), feito: false, ...dados }; E.compromissos.push(c); }
    if (v.whats) {
      // com hora: X minutos antes; sem hora (dia todo): às 8h do dia (ou na véspera, se "1 dia antes")
      const quando = dados.hora ? new Date(new Date(`${dados.data}T${dados.hora}:00`) - dados.antes * 60e3).toISOString() : instante(dados.antes >= 1440 ? somaDias(dados.data, -1) : dados.data, '08:00');
      const qdo = dados.antes >= 1440 ? `amanhã${dados.hora ? ' às ' + dados.hora : ''}` : dados.hora ? `às ${dados.hora} (em ${dados.antes >= 60 ? dados.antes / 60 + ' h' : dados.antes + ' min'})` : 'hoje';
      agendarAvisos(c.id, [{ quando, texto: `📌 *${dados.titulo}* ${qdo}${dados.local ? `\n📍 ${dados.local}` : ''}` }]);
    } else cancelarAvisos(c.id);
    salvar();
    if (v.cal) paraCalendario({ titulo: dados.titulo, data: dados.data, hora: dados.hora, minutosAntes: dados.antes, notas: dados.local });
    avisar('Salvo');
  });
  if ($('#apagarComp')) $('#apagarComp').onclick = () => { if (confirm('Apagar este compromisso?')) { cancelarAvisos(c.id); E.compromissos = E.compromissos.filter((x) => x.id !== c.id); salvar(); $('#modal').close(); render(); } };
}

// ==================== MAIS ====================
async function telaMais() {
  $('#conteudo').innerHTML = `<div class="topo"><h1>Mais</h1></div><div class="menu-mais">
    <button data-ir="leitura">${ic('livro')}<b>Leitura</b><small>livro atual, páginas e histórico</small></button>
    <button data-ir="noticias">${ic('jornal')}<b>Notícias</b><small>principais, economia e corrida</small></button>
    <button data-ir="treino/corpo">${ic('corpo')}<b>Corpo</b><small>peso e medidas</small></button>
    <button data-ir="ajustes">${ic('ajustes')}<b>Ajustes</b><small>metas, cartões e cópia de segurança</small></button></div>`;
  ligarComuns();
}
async function telaLeitura() {
  const L = leitura(), l = L.atual;
  $('#conteudo').innerHTML = `<div class="topo"><div><button class="mini" data-ir="mais">${ic('voltar')} Mais</button><h1 style="margin-top:8px">Leitura</h1></div><button class="primario" id="novoLivro">${ic('mais')} Livro</button></div><div class="grade">
    <section class="cartao destaque">${l ? `<small>Lendo agora</small><div class="grande" style="font-size:22px">${esc(l.titulo)}</div>${l.autor ? `<small>${esc(l.autor)}</small>` : ''}
      <div class="barra" style="margin:12px 0 6px;background:rgba(255,255,255,.3)"><div style="width:${l.pct || 0}%;background:#fff"></div></div>
      <small>página ${l.pagina}${l.paginas ? ` de ${l.paginas} · ${l.pct}%` : ''}${l.previsao ? ` · termina ~${dataBR(l.previsao)}` : ''}</small>
      <form class="dupla" id="fLer" style="margin-top:12px"><input name="pagina" type="number" inputmode="numeric" placeholder="Parei na página…" style="background:#fff"><button style="background:#fff;color:var(--acento);border:0">Salvar</button></form>
      <div class="acoes" style="margin-top:10px"><button class="mini" style="background:rgba(255,255,255,.2);color:#fff;border:0" id="terminei">${ic('trofeu')} Terminei</button></div>`
      : '<p style="margin:0">Nenhum livro em leitura. Toque em <b>Livro</b> para começar.</p>'}</section>
    <section class="cartao c6"><div class="kpis"><div class="kpi"><small>Hoje</small><b>${L.lidosHoje}</b><small>de ${E.config.meta_paginas_dia} pág.</small></div><div class="kpi"><small>Sequência</small><b>${L.sequencia}</b><small>dias</small></div><div class="kpi"><small>No ano</small><b>${L.concluidosAno}</b><small>livros</small></div></div></section>
    <section class="cartao c6"><header><h2>Histórico</h2></header>${L.historico.length ? L.historico.map((x) => `<div class="linha"><div class="tit"><span>${esc(x.titulo)}</span><small>${x.status === 'concluido' ? '✓' : 'parado'} · ${x.dias} dias${x.nota != null ? ' · nota ' + x.nota : ''}</small></div></div>`).join('') : '<p class="vazio">Os livros que você terminar aparecem aqui.</p>'}</section>
  </div>`;
  ligarComuns();
  $('#novoLivro').onclick = () => modal(`<h2>Começar um livro</h2><label>Título<input name="titulo" required></label><div class="dupla"><label>Autor<input name="autor"></label><label>Páginas<input name="paginas" type="number" min="1"></label></div>`,
    (v) => { E.livros.push({ id: id(), titulo: v.titulo.trim(), autor: v.autor.trim(), paginas: +v.paginas || null, pagina: 0, inicio: hoje(), fim: null, status: 'lendo', nota: null }); salvar(); avisar('Boa leitura! 📚'); });
  if ($('#fLer')) $('#fLer').onsubmit = (e) => { e.preventDefault(); const p = e.target.pagina.value; if (p === '') return; const lidas = ler(l.id, p); avisar(lidas > 0 ? `+${lidas} páginas` : 'Página atualizada'); render(); };
  if ($('#terminei')) $('#terminei').onclick = () => modal(`<h2>Terminou "${esc(l.titulo)}"! 🏆</h2><label>Nota (0 a 10)<input name="nota" type="number" min="0" max="10"></label>`,
    (v) => { const x = E.livros.find((b) => b.id === l.id); if (x.paginas && x.pagina < x.paginas) ler(x.id, x.paginas); Object.assign(x, { status: 'concluido', fim: hoje(), nota: v.nota === '' ? null : +v.nota }); salvar(); });
}
async function telaNoticias() {
  $('#conteudo').innerHTML = `<div class="topo"><div><button class="mini" data-ir="mais">${ic('voltar')} Mais</button><h1 style="margin-top:8px">Notícias</h1></div></div><div id="nots"><p class="vazio">Carregando…</p></div>`;
  ligarComuns();
  const N = await noticias();
  if (!N) { $('#nots').innerHTML = '<div class="cartao"><p class="vazio">Sem internet agora. As notícias aparecem quando voltar a conexão.</p></div>'; return; }
  const ROT = { principais: 'Principais', economia: 'Economia', corrida: 'Corrida e bem-estar' };
  $('#nots').innerHTML = `<small>Atualizado ${new Date(N.gerado).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</small><div class="grade" style="margin-top:8px">${Object.entries(N.secoes).map(([s, l]) => `<section class="cartao c6"><header><h2>${ROT[s] || s}</h2></header>
    ${l.slice(0, 8).map((n) => `<a class="noticia" href="${esc(n.link)}" target="_blank" rel="noopener">${n.img ? `<img src="${esc(n.img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<div><b>${esc(n.titulo)}</b><small>${esc(n.fonte)}${n.data ? ' · ' + new Date(n.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</small></div></a>`).join('')}</section>`).join('')}</div>`;
}
let cacheNoticias = null;
async function noticias() {
  if (cacheNoticias && Date.now() - cacheNoticias.t < 10 * 60e3) return cacheNoticias.v;
  try { const r = await fetch('noticias.json', { cache: 'no-cache' }); if (!r.ok) throw 0; const v = await r.json(); cacheNoticias = { t: Date.now(), v }; return v; } catch { return null; }
}
async function manchetesInicio() {
  const N = await noticias(), el = $('#manchetes'); if (!el) return;
  if (!N) { el.querySelector('.vazio').textContent = 'Sem internet agora.'; return; }
  const top = Object.values(N.secoes).flatMap((l) => l.slice(0, 2)).slice(0, 4);
  el.innerHTML = `<header><h2>${ic('jornal')} Notícias</h2><button class="mini" data-ir="noticias">ver</button></header>${top.map((n) => `<a class="noticia" href="${esc(n.link)}" target="_blank" rel="noopener"><div><b>${esc(n.titulo)}</b><small>${esc(n.fonte)}</small></div></a>`).join('')}`;
  ligarComuns();
}
async function telaAjustes() {
  const c = E.config;
  $('#conteudo').innerHTML = `<div class="topo"><div><button class="mini" data-ir="mais">${ic('voltar')} Mais</button><h1 style="margin-top:8px">Ajustes</h1></div></div><div class="grade">
    <section class="cartao c6"><header><h2>Você e suas metas</h2></header><form class="form" id="fMetas">
      <label>Seu nome<input name="nome" value="${esc(E.perfil.nome)}"></label>
      <div class="dupla"><label>Km/semana<input name="km" type="number" inputmode="decimal" value="${c.meta_km_semana}"></label><label>Treinos/semana<input name="treinos" type="number" value="${c.meta_treinos_semana}"></label></div>
      <div class="dupla"><label>Horas de estudo/semana<input name="horas" type="number" inputmode="decimal" value="${c.meta_horas_estudo}"></label><label>Páginas/dia<input name="pag" type="number" value="${c.meta_paginas_dia}"></label></div>
      <button class="primario">Salvar</button></form></section>
    ${NUVEM.url ? `<section class="cartao c6"><header><h2>${ic('whats')} Avisos no WhatsApp</h2>${avisosLigados() ? '<span class="etiqueta verde">ligados</span>' : ''}</header>
      <p style="margin-top:0;font-size:14px">Compromissos, contas, provas e revisões com a caixinha <b>"Avisar no WhatsApp"</b> chegam no seu WhatsApp na hora, pelo número do <b>Painel da Vida</b>. Ele só manda avisos: o que você responder lá não é lido.</p>
      <form class="form" id="fWhats"><label>Seu WhatsApp (com DDD)<input name="tel" inputmode="tel" value="${esc(c.whatsapp)}" placeholder="43 99999-9999"></label>
        <label style="display:flex;gap:10px;align-items:center;color:var(--texto)"><input type="checkbox" name="liga" ${c.avisos_whats ? 'checked' : ''}> Quero receber avisos no WhatsApp</label>
        <div class="dupla"><button class="primario">Salvar</button><button type="button" id="testeWhats" ${avisosLigados() ? '' : 'disabled'}>Enviar teste</button></div></form>
      ${E.filaAvisos.length ? `<small style="display:block;margin-top:8px">${E.filaAvisos.length} aviso${E.filaAvisos.length > 1 ? 's' : ''} esperando internet para subir.</small>` : ''}
      <small style="display:block;margin-top:8px">Só sai do celular o lembrete (dia, hora e texto). O resto dos seus dados continua só aqui.</small></section>` : ''}
    <section class="cartao c6"><header><h2>${ic('cartao')} Cartões</h2></header><form class="form" id="fCartoes">
      <label>Um por linha, com o dia do vencimento (ex.: <b>Nubank - dia 10</b>)<textarea name="cartoes" rows="4">${esc(c.cartoes.map((x) => `${x.nome} - dia ${x.dia}`).join('\n'))}</textarea></label>
      <label>Categorias (uma por linha)<textarea name="cats" rows="5">${esc(c.categorias.join('\n'))}</textarea></label>
      <button class="primario">Salvar</button></form></section>
    <section class="cartao"><header><h2>${ic('baixar')} Cópia de segurança</h2></header>
      <p style="margin-top:0;font-size:14px">Seus dados ficam <b>só neste celular</b>. Faça uma cópia de vez em quando e guarde no iCloud Drive (Arquivos). Se trocar de celular, é só restaurar a cópia.</p>
      <div class="acoes"><button class="primario" id="exportar">${ic('baixar')} Salvar cópia</button><label class="botao" style="color:var(--texto);display:inline-flex">${ic('upload')} Restaurar cópia<input type="file" id="importarBk" accept=".json,application/json" hidden></label></div>
      ${E.ultimaCopia ? `<small style="display:block;margin-top:8px">Última cópia: ${new Date(E.ultimaCopia).toLocaleDateString('pt-BR')}</small>` : ''}</section>
    <section class="cartao"><header><h2>Instalar no iPhone</h2></header><ol class="passos"><li>Abra este endereço no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (o quadrado com a seta para cima).</li><li>Escolha <b>Adicionar à Tela de Início</b> e toque em <b>Adicionar</b>.</li><li>Abra pelo ícone <b>Meu Painel</b>: tela cheia, funciona até sem internet.</li></ol></section>
    <section class="cartao"><button class="mini" id="apagarTudo" style="color:var(--vermelho)">${ic('lixo')} Apagar todos os dados deste celular</button></section>
  </div>`;
  ligarComuns();
  $('#fMetas').onsubmit = (e) => { e.preventDefault(); const f = e.target; E.perfil.nome = f.nome.value.trim(); Object.assign(c, { meta_km_semana: valorDe(f.km.value) || 15, meta_treinos_semana: +f.treinos.value || 3, meta_paginas_dia: +f.pag.value || 15, meta_horas_estudo: valorDe(f.horas.value) || 10 }); salvar(); avisar('Salvo'); render(); };
  if ($('#fWhats')) {
    $('#fWhats').onsubmit = (e) => {
      e.preventDefault(); const f = e.target;
      let tel = f.tel.value.replace(/\D/g, ''); if (tel.length >= 12 && tel.startsWith('55')) tel = tel.slice(2);
      if (f.liga.checked && !/^\d{10,11}$/.test(tel)) return avisar('Coloque o celular com DDD (ex.: 43 99999-9999).', true);
      c.whatsapp = tel; c.avisos_whats = f.liga.checked; salvar(); avisar(c.avisos_whats ? 'Avisos ligados. Toque em Enviar teste.' : 'Avisos desligados'); render();
    };
    $('#testeWhats').onclick = () => { agendarAvisos('teste-' + id(), [{ quando: new Date(Date.now() + 60e3).toISOString(), texto: `👋 Oi${E.perfil.nome ? ', ' + E.perfil.nome : ''}! Este é o teste dos avisos do *Meu Painel*. Daqui pra frente seus lembretes chegam por aqui.\n_(Este número só envia avisos.)_` }]); avisar('Teste agendado: chega em 1 a 2 minutos'); };
  }
  $('#fCartoes').onsubmit = (e) => {
    e.preventDefault(); const f = e.target;
    c.cartoes = f.cartoes.value.split('\n').map((s) => s.trim().replace(/^cart[ãa]o\s+/i, '')).filter(Boolean).map((s) => { const m = /^(.*?)[\s\-–—:;,]+(?:vence\s*)?(?:dia\s*)?(\d{1,2})$/i.exec(s); return { nome: (m ? m[1] : s).trim(), dia: m ? Math.min(31, Math.max(1, +m[2])) : 10 }; });
    const cats = f.cats.value.split('\n').map((s) => s.trim()).filter(Boolean); if (cats.length) c.categorias = cats;
    salvar(); avisar('Salvo'); render();
  };
  $('#exportar').onclick = tentar(async () => {
    const nome = `meu-painel-${hoje()}.json`, arq = new File([exportar()], nome, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [arq] })) await navigator.share({ files: [arq], title: 'Cópia do Meu Painel' });
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(arq); a.download = nome; a.click(); }
    E.ultimaCopia = new Date().toISOString(); salvar(); render();
  });
  $('#importarBk').onchange = tentar(async (e) => { const f = e.target.files[0]; if (!f) return; if (!confirm('Restaurar esta cópia? O que está no celular agora será substituído.')) return; importar(await f.text()); avisar('Cópia restaurada'); render(); });
  $('#apagarTudo').onclick = () => { if (confirm('Apagar TODOS os dados deste celular? Faça uma cópia antes.') && confirm('Tem certeza? Não dá para desfazer.')) { E = NOVO(); salvar(); avisar('Tudo apagado'); ir('inicio'); } };
}

// ---------- início ----------
function relogio() { $('#relogio').textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
setInterval(relogio, 15000); relogio();
// lembrete de cópia: depois de 30 dias sem copiar, avisa uma vez por dia ao abrir
function lembrarCopia() {
  const dias = E.ultimaCopia ? (Date.now() - new Date(E.ultimaCopia)) / 864e5 : (Date.now() - new Date(E.criado)) / 864e5;
  if (dias > 30 && localStorage.getItem('lembrete-copia') !== hoje()) { try { localStorage.setItem('lembrete-copia', hoje()); } catch {} setTimeout(() => avisar('Faz tempo sem cópia de segurança: Mais › Ajustes › Salvar cópia'), 1500); }
}
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  // versão nova publicada: entra sozinha, menos no meio de corrida/treino (recarregar cortaria o GPS ou o treino)
  const tinhaVersao = !!navigator.serviceWorker.controller;
  let recarregou = false;
  const trocar = () => { if (recarregou) return; if (!$('#tela-cheia').hidden || $('#modal').open) return setTimeout(trocar, 5000); recarregou = true; location.reload(); };
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (tinhaVersao) trocar(); });
  navigator.serviceWorker.register('sw.js').then((r) => r.update()).catch(() => {});
}
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h && h !== aba + (sub[aba] ? '/' + sub[aba] : '')) ir(h); });
carregar().then(() => { ir(location.hash.slice(1) || 'inicio'); lembrarCopia(); sincronizarAvisos(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) sincronizarAvisos(); });
