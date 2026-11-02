// Meu Painel — dados. Tudo fica no próprio celular (IndexedDB).
// Só os lembretes que ela pedir no WhatsApp saem do celular (data, hora e texto), para uma base na nuvem que o Painel da Vida lê e envia.
// As regras de dinheiro (cartão → fatura, parcelas, contas parceladas) são as mesmas do Painel da Vida.
const BANCO = 'meu-painel', LOJA = 'estado', CHAVE = 'principal';
// base dos lembretes (Supabase). A chave é a pública: ela só deixa criar lembrete e ver/apagar os do próprio celular.
const NUVEM = { url: 'https://uphefleffjtbyuycnpyp.supabase.co', chave: 'sb_publishable_oQHSGI0AAyzRB_zNsy7fxA_9qBNE3hj' };
const CATEGORIAS = ['Alimentação', 'Mercado', 'Transporte', 'Casa', 'Saúde', 'Beleza', 'Esporte', 'Lazer', 'Educação', 'Vestuário', 'Trabalho', 'Outros'];
const NOVO = () => ({
  versao: 1, criado: new Date().toISOString(),
  perfil: { nome: '' },
  config: { categorias: CATEGORIAS, cartoes: [], meta_km_semana: 15, meta_treinos_semana: 3, meta_paginas_dia: 15, meta_horas_estudo: 10, whatsapp: '', avisos_whats: false },
  compromissos: [], gastos: [], parcelamentos: [], faturasPagas: [],
  livros: [], leituras: [],
  corridas: [], plano: null,
  fichas: [], treinos: [], corpo: [],
  materias: [], sessoes: [], provas: [], revisoes: [],
  segredo: '', avisos: {}, filaAvisos: [], // avisos: idDoItem -> [ids dos lembretes na nuvem]
});

// ---------- guardar/abrir (um objeto só, salvo inteiro; pequeno mesmo com anos de uso) ----------
function abrirBanco() {
  return new Promise((ok, erro) => {
    const r = indexedDB.open(BANCO, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(LOJA);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => erro(r.error);
  });
}
let banco = null, E = null, gravando = null;
async function carregar() {
  try {
    banco = await abrirBanco();
    E = await new Promise((ok, erro) => { const t = banco.transaction(LOJA).objectStore(LOJA).get(CHAVE); t.onsuccess = () => ok(t.result); t.onerror = () => erro(t.error); });
  } catch { banco = null; }
  if (!E) { try { E = JSON.parse(localStorage.getItem('meu-painel-reserva') || 'null'); } catch {} }
  E = completar(E || NOVO());
  // pede ao iPhone para não apagar os dados quando faltar espaço
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch {}
  return E;
}
// estado salvo por uma versão antiga ganha os campos novos
function completar(x) { const base = NOVO(); for (const k of Object.keys(base)) if (x[k] === undefined) x[k] = base[k]; x.config = { ...base.config, ...x.config }; return x; }
function salvar() {
  clearTimeout(gravando);
  gravando = setTimeout(() => {
    try { localStorage.setItem('meu-painel-reserva', JSON.stringify(E)); } catch {}
    if (banco) try { banco.transaction(LOJA, 'readwrite').objectStore(LOJA).put(E, CHAVE); } catch {}
  }, 150);
}
const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ---------- datas (sempre no horário do celular, como texto) ----------
const agora = () => new Date().toLocaleString('sv-SE').slice(0, 16);
const hoje = () => agora().slice(0, 10);
const somaDias = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toLocaleString('sv-SE').slice(0, 10); };
function somaMeses(d, k) {
  const [a, m, dia] = d.split('-').map(Number);
  const ult = new Date(a, m - 1 + k + 1, 0).getDate();
  return new Date(a, m - 1 + k, Math.min(dia, ult)).toLocaleString('sv-SE').slice(0, 10);
}
const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const inicioSemana = (d = hoje()) => { const x = new Date(d + 'T12:00:00'); return somaDias(d, -((x.getDay() + 6) % 7)); }; // segunda
const valorDe = (v) => { const s = String(v ?? '').trim(); return s.includes(',') ? +s.replace(/\./g, '').replace(',', '.') : +s; };
const sem = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// ---------- Gastos, cartões e contas ----------
const PALAVRAS = [
  ['Mercado', /mercado|supermerc|feira|a[çc]ougue|hortifr|atacad|sacol[aã]o/],
  ['Alimentação', /almo[çc]|jant|lanch|pastel|salgad|refri|restaur|ifood|padar|caf[eé]|pizza|hamb|marmit|sorvet|a[çc]a[ií]|doce/],
  ['Transporte', /gasolin|combust|etanol|posto|uber|99|t[aá]xi|estacion|ped[aá]gio|[oô]nibus|mec[aâ]nic|pneu|ipva/],
  ['Casa', /aluguel|luz|energia|copel|sanepar|internet|condom|g[aá]s|faxin|diarista|m[oó]vel|telefone|celular/],
  ['Saúde', /farm[aá]c|rem[eé]d|m[eé]dic|consult|exame|dentist|plano de sa|psic|hospital|vitamina|suplement|whey|creatina/],
  ['Beleza', /sal[aã]o|cabel|unha|manicure|maqui|cosm[eé]t|perfum|depila|est[eé]tica|sobrancelha|skin|creme/],
  ['Esporte', /academia|t[eê]nis de corrida|corrida|inscri[çc][aã]o|prova|personal|pilates|crossfit|yoga|nata[çc]/],
  ['Lazer', /cinema|show|viag|hotel|passeio|netflix|spotify|streaming|festa|bar\b/],
  ['Educação', /curso|livro|escola|faculd|mensalidade|material/],
  ['Vestuário', /roupa|sapato|camis|cal[çc]a|vestido|bolsa|legging|top\b|loja/],
];
function categoriaDe(texto) {
  const t = String(texto || '').toLowerCase();
  const exata = E.config.categorias.find((k) => t.includes(k.toLowerCase()));
  if (exata) return exata;
  for (const [cat, re] of PALAVRAS) if (re.test(t) && E.config.categorias.includes(cat)) return cat;
  return E.config.categorias.includes('Outros') ? 'Outros' : E.config.categorias[E.config.categorias.length - 1];
}
// fatura da k-ésima parcela: dia do vencimento do cartão, k meses depois da compra
function faturaDe(forma, compra, k = 1) {
  if (!/^Cartão /.test(forma || '')) return null;
  const c = E.config.cartoes.find((x) => 'Cartão ' + x.nome === forma), dia = (c && c.dia) || 10;
  const [a, m] = compra.split('-').map(Number), x = new Date(a, m - 1 + k, 1);
  const ult = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(Math.min(dia, ult)).padStart(2, '0')}`;
}
// gasto à vista ou parcelado; no cartão cada parcela cai numa fatura, sem cartão uma por mês
function gastar({ valor, descricao, categoria, data, forma, parcelas = 1 }) {
  const v = Math.round(valorDe(valor) * 100);
  if (!(v > 0 && v < 1e9)) throw new Error('Valor inválido.');
  const cat = categoria || categoriaDe(descricao), compra = data || hoje(), n = Math.max(1, Math.min(48, +parcelas || 1)), base = Math.floor(v / n);
  const novos = [];
  for (let i = 1; i <= n; i++) {
    const cartao = /^Cartão /.test(forma || '');
    novos.push({
      id: id(), valor: (i === n ? v - base * (n - 1) : base) / 100, categoria: cat, descricao: n > 1 ? `${descricao || cat} (${i}/${n})` : descricao || '',
      forma: forma || null, pago: 1, data: n > 1 && !cartao ? somaMeses(compra, i) : compra, fatura: faturaDe(forma, compra, n > 1 ? i : 1),
    });
  }
  E.gastos.push(...novos); salvar();
  return novos;
}
function contaAPagar({ valor, descricao, vencimento, categoria }) {
  const g = { id: id(), valor: Math.round(valorDe(valor) * 100) / 100, categoria: categoria || categoriaDe(descricao), descricao, forma: 'boleto', pago: 0, vencimento: vencimento || hoje(), data: vencimento || hoje() };
  if (!(g.valor > 0)) throw new Error('Valor inválido.');
  E.gastos.push(g); salvar(); return g;
}
const pagar = (gid) => { const g = E.gastos.find((x) => x.id === gid); if (g) { g.pago = 1; g.data = hoje(); cancelarAvisos(g.id); salvar(); } };
// aviso de conta: às 9h do dia do vencimento
const dinheiroTxt = (v) => (+v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const avisarConta = (g) => agendarAvisos(g.id, [{ quando: instante(g.vencimento, '09:00'), texto: `🧾 Vence hoje: *${g.descricao || g.categoria}* — ${dinheiroTxt(g.valor)}` }]);
const avisarParcelamento = (p) => { for (const g of E.gastos.filter((x) => x.parcelamento === p.id && !x.pago)) avisarConta(g); };
function faturas() {
  const pagas = new Set(E.faturasPagas), mapa = {};
  for (const g of E.gastos.filter((x) => x.fatura && /^Cartão /.test(x.forma || '')).sort((a, b) => (a.fatura + a.data).localeCompare(b.fatura + b.data))) {
    const cartao = g.forma.slice(7), k = cartao + '|' + g.fatura;
    if (pagas.has(k)) continue;
    const f = (mapa[k] ||= { cartao, venc: g.fatura, total: 0, itens: [] });
    f.total = Math.round((f.total + g.valor) * 100) / 100; f.itens.push(g);
  }
  return Object.values(mapa).sort((a, b) => a.venc.localeCompare(b.venc) || a.cartao.localeCompare(b.cartao));
}
const pagarFatura = (cartao, venc) => { E.faturasPagas.push(cartao + '|' + venc); salvar(); };
function gastosDoMes(mes = hoje().slice(0, 7)) {
  const lista = E.gastos.filter((g) => g.pago && g.data.slice(0, 7) === mes).sort((a, b) => b.data.localeCompare(a.data));
  const total = lista.reduce((s, g) => s + g.valor, 0), porCategoria = {};
  for (const g of lista) porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.valor;
  const meses = [];
  for (let k = -5; k <= 0; k++) { const m = somaMeses(mes + '-15', k).slice(0, 7); meses.push({ mes: m, total: E.gastos.filter((g) => g.pago && g.data.slice(0, 7) === m).reduce((s, g) => s + g.valor, 0) }); }
  return { mes, lista, total, porCategoria, meses, hoje: lista.filter((g) => g.data === hoje()).reduce((s, g) => s + g.valor, 0) };
}
const aPagar = () => E.gastos.filter((g) => !g.pago).sort((a, b) => (a.vencimento || '').localeCompare(b.vencimento || ''));

// contas parceladas: "3/10" → cria da parcela atual até a última
function gerarParcelas(p) {
  if (!p.venc_ini) return;
  const tem = new Set(E.gastos.filter((g) => g.parcelamento === p.id).map((g) => g.parcela));
  for (let i = p.parcela_ini; i <= p.total; i++) {
    if (tem.has(i)) continue;
    const venc = somaMeses(p.venc_ini, i - p.parcela_ini);
    E.gastos.push({ id: id(), valor: p.valor, categoria: p.categoria || categoriaDe(p.descricao), descricao: p.total > 1 ? `${p.descricao} (${i}/${p.total})` : p.descricao, forma: p.forma || 'boleto', pago: 0, vencimento: venc, data: venc, parcelamento: p.id, parcela: i });
  }
}
function importarContas(itens) {
  let feitos = 0; const repetidos = [];
  for (const it of itens) {
    const descricao = String(it.descricao || '').trim(), valor = Math.round(valorDe(it.valor) * 100) / 100;
    if (!descricao || !(valor > 0)) continue;
    const total = Math.max(1, Math.round(+it.total || 1)), parcela = Math.max(1, Math.min(total, Math.round(+it.parcela || 1)));
    if (E.parcelamentos.some((p) => sem(p.descricao) === sem(descricao) && p.valor === valor && p.total === total)) { repetidos.push(descricao); continue; }
    const p = { id: id(), descricao, valor, parcela_ini: parcela, total, categoria: it.categoria || categoriaDe(descricao), forma: it.forma || 'boleto', venc_ini: /^\d{4}-\d{2}-\d{2}$/.test(it.vencimento || '') ? it.vencimento : null, whats: !!it.whats };
    E.parcelamentos.push(p); gerarParcelas(p); if (p.whats) avisarParcelamento(p); feitos++;
  }
  salvar();
  return { feitos, repetidos };
}
function vencimentoParcelamento(pid, venc) {
  const p = E.parcelamentos.find((x) => x.id === pid);
  E.gastos.filter((g) => g.parcelamento === pid && !g.pago).forEach((g) => cancelarAvisos(g.id));
  E.gastos = E.gastos.filter((g) => !(g.parcelamento === pid && !g.pago));
  const pagas = Math.max(0, ...E.gastos.filter((g) => g.parcelamento === pid && g.pago).map((g) => g.parcela));
  const ini = pagas ? pagas + 1 : p.parcela_ini;
  p.venc_ini = somaMeses(venc, p.parcela_ini - ini);
  gerarParcelas(p); if (p.whats) avisarParcelamento(p); salvar();
}
function apagarParcelamento(pid) {
  E.gastos.filter((g) => g.parcelamento === pid && !g.pago).forEach((g) => cancelarAvisos(g.id));
  E.gastos = E.gastos.filter((g) => !(g.parcelamento === pid && !g.pago));
  E.parcelamentos = E.parcelamentos.filter((p) => p.id !== pid); salvar();
}
function parcelados() {
  return E.parcelamentos.map((p) => {
    const ps = E.gastos.filter((g) => g.parcelamento === p.id).sort((a, b) => a.parcela - b.parcela), abertas = ps.filter((g) => !g.pago);
    const pagas = p.parcela_ini - 1 + ps.filter((g) => g.pago).length, faltam = p.venc_ini ? abertas.length : p.total - p.parcela_ini + 1;
    return { ...p, pagas, faltam, restante: Math.round(faltam * p.valor * 100) / 100, proxima: abertas[0] || null, quitado: !!p.venc_ini && !abertas.length };
  });
}
// planilha/CSV: uma conta por linha — "Loja X;1/10;150,00;10/12/2026" (mesmas regras do Painel da Vida)
function lerContasTexto(texto) {
  const itens = [];
  for (const linha of String(texto || '').split(/\r?\n/)) {
    if (!/\d/.test(linha) || /\b(total|subtotal|saldo)\b/i.test(linha)) continue;
    const parc = /\b(\d{1,3})\s*(?:\/|de)\s*(\d{1,3})\b(?!\/)/.exec(linha.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, ' '));
    const data = /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/.exec(linha);
    const din = [...linha.replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, ' ').matchAll(/(?:r\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+\.\d{2}\b)/gi)].map((m) => m[1]);
    if (!din.length) continue;
    let desc = linha.replace(/r\$\s*/gi, ' ').replace(/\d{1,3}(?:\.\d{3})*,\d{2}|\d+\.\d{2}\b/g, ' ').replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, ' ')
      .replace(/\b\d{1,3}\s*(?:\/|de)\s*\d{1,3}\b/g, ' ').replace(/[;,\t|]+/g, ' ').replace(/\bparcelas?\b/gi, ' ').replace(/\s+/g, ' ').trim() || 'Conta';
    itens.push({ descricao: desc, valor: valorDe(din[0]), parcela: parc ? +parc[1] : 1, total: parc ? +parc[2] : 1, categoria: categoriaDe(desc),
      vencimento: data ? `${data[3].length === 2 ? '20' + data[3] : data[3]}-${data[2].padStart(2, '0')}-${data[1].padStart(2, '0')}` : '' });
  }
  return itens;
}

// ---------- Leitura ----------
function livroDetalhe(l) {
  const dias = diasEntre(l.inicio, l.fim || hoje()) + 1, ritmo = l.pagina && dias ? l.pagina / dias : null, faltam = l.paginas ? Math.max(0, l.paginas - l.pagina) : null;
  return { ...l, dias, ritmo, faltam, pct: l.paginas ? Math.min(100, Math.round((l.pagina / l.paginas) * 100)) : null, previsao: l.status === 'lendo' && faltam && ritmo ? somaDias(hoje(), Math.ceil(faltam / ritmo)) : null };
}
function leitura() {
  const atuais = E.livros.filter((l) => l.status === 'lendo').map(livroDetalhe).reverse();
  const historico = E.livros.filter((l) => l.status !== 'lendo').map(livroDetalhe).sort((a, b) => (b.fim || '').localeCompare(a.fim || ''));
  const datas = new Set(E.leituras.map((r) => r.data));
  let seq = 0, d = datas.has(hoje()) ? hoje() : somaDias(hoje(), -1);
  while (datas.has(d)) { seq++; d = somaDias(d, -1); }
  return { atual: atuais[0] || null, atuais, historico, lidosHoje: E.leituras.filter((r) => r.data === hoje()).reduce((s, r) => s + r.paginas, 0), sequencia: seq,
    concluidosAno: historico.filter((l) => l.status === 'concluido' && (l.fim || '').startsWith(hoje().slice(0, 4))).length };
}
function ler(lid, pagina) {
  const l = E.livros.find((x) => x.id === lid);
  let ate = Math.round(+pagina); if (l.paginas) ate = Math.min(ate, l.paginas);
  if (ate > l.pagina) E.leituras.push({ livro: l.id, data: hoje(), paginas: ate - l.pagina });
  const lidas = ate - l.pagina; l.pagina = Math.max(0, ate); salvar(); return lidas;
}

// ---------- Corrida ----------
const fmtTempo = (s) => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
const lerTempo = (t) => { const p = String(t || '').trim().split(':').map(Number); if (p.some(isNaN) || !p.length) return 0; return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : p[0] * 60; };
const pace = (seg, km) => (km > 0 ? seg / km : 0); // segundos por km
const fmtPace = (spk) => (spk > 0 && isFinite(spk) ? fmtTempo(spk) + '/km' : '—');
function corridaResumo() {
  const ini = inicioSemana(), semana = E.corridas.filter((c) => c.data >= ini), mes = E.corridas.filter((c) => c.data.slice(0, 7) === hoje().slice(0, 7));
  const km = (l) => Math.round(l.reduce((s, c) => s + c.km, 0) * 10) / 10;
  const semanas = []; for (let k = 11; k >= 0; k--) { const a = somaDias(ini, -7 * k), b = somaDias(a, 6); semanas.push({ ini: a, km: km(E.corridas.filter((c) => c.data >= a && c.data <= b)) }); }
  const melhorPace = (dist) => { const l = E.corridas.filter((c) => c.km >= dist * 0.97); return l.length ? l.reduce((m, c) => (pace(c.seg, c.km) < pace(m.seg, m.km) ? c : m)) : null; };
  return { semanaKm: km(semana), semanaQtd: semana.length, mesKm: km(mes), mesQtd: mes.length, totalKm: km(E.corridas), semanas, meta: E.config.meta_km_semana,
    recordes: { maior: E.corridas.reduce((m, c) => (!m || c.km > m.km ? c : m), null), r5: melhorPace(5), r10: melhorPace(10) },
    ultimas: [...E.corridas].sort((a, b) => (b.data + b.id).localeCompare(a.data + a.id)) };
}
// planos de 3 treinos por semana: [semana][treino] = descrição curta
const PLANOS = {
  '5k': { nome: '5 km do zero', semanas: [
    ['1 min correndo + 2 min andando × 8', '1 min correndo + 2 min andando × 8', '1 min correndo + 1,5 min andando × 8'],
    ['2 min correndo + 2 min andando × 6', '2 min correndo + 2 min andando × 6', '3 min correndo + 2 min andando × 5'],
    ['4 min correndo + 2 min andando × 4', '5 min correndo + 2 min andando × 4', '5 min correndo + 1 min andando × 4'],
    ['8 min correndo + 2 min andando × 3', '8 min correndo + 2 min andando × 3', '10 min correndo + 2 min andando × 2'],
    ['12 min correndo + 2 min andando × 2', '15 min correndo + 2 min andando + 10 min', '20 min correndo'],
    ['20 min correndo', '22 min correndo', '25 min correndo'],
    ['25 min correndo', '27 min correndo', '30 min correndo'],
    ['30 min leve', '20 min leve', 'Prova: 5 km! 🎉'],
  ] },
  '10k': { nome: '10 km (já corre 5 km)', semanas: [
    ['5 km leve', '6 × 400 m forte (2 min andando entre)', '6 km longão leve'],
    ['5 km leve', '20 min em ritmo de prova', '7 km longão leve'],
    ['6 km leve', '5 × 800 m forte', '8 km longão leve'],
    ['5 km leve', '25 min em ritmo de prova', '8 km longão leve'],
    ['6 km leve', '6 × 800 m forte', '9 km longão leve'],
    ['6 km leve', '30 min em ritmo de prova', '10 km longão leve'],
    ['5 km leve', '4 × 1 km forte', '8 km leve'],
    ['4 km leve', '3 km com 3 tiros curtos', 'Prova: 10 km! 🎉'],
  ] },
};
function planoHoje() {
  if (!E.plano) return null;
  const P = PLANOS[E.plano.tipo]; if (!P) return null;
  const feitos = E.plano.feitos || [], i = feitos.length, semana = Math.floor(i / 3), treino = i % 3;
  return { ...P, tipo: E.plano.tipo, total: P.semanas.length * 3, feitos: i, semana: semana + 1, treino: treino + 1, proximo: semana < P.semanas.length ? P.semanas[semana][treino] : null };
}

// ---------- Academia ----------
const FICHAS_MODELO = [
  { nome: 'A — Pernas e glúteos', exercicios: [['Agachamento livre', 4, '10-12', 20], ['Leg press 45°', 4, '12', 80], ['Cadeira extensora', 3, '12-15', 25], ['Mesa flexora', 3, '12', 20], ['Elevação pélvica', 4, '12', 40], ['Abdução na máquina', 3, '15', 30]] },
  { nome: 'B — Superiores', exercicios: [['Puxada frente', 4, '10-12', 30], ['Remada baixa', 3, '12', 25], ['Supino com halteres', 3, '10-12', 8], ['Desenvolvimento com halteres', 3, '12', 6], ['Rosca direta', 3, '12', 6], ['Tríceps na polia', 3, '12-15', 15]] },
  { nome: 'C — Glúteos e core', exercicios: [['Stiff com halteres', 4, '10-12', 12], ['Afundo / passada', 3, '10 cada', 8], ['Glúteo no cabo (coice)', 3, '12-15', 10], ['Panturrilha em pé', 4, '15-20', 30], ['Prancha', 3, '40 s', 0], ['Abdominal infra', 3, '15', 0]] },
];
const novaFicha = (nome, exs = []) => ({ id: id(), nome, exercicios: exs.map(([n, s, r, c]) => ({ id: id(), nome: n, series: s, reps: r, carga: c, descanso: 60 })) });
function academiaResumo() {
  const ini = inicioSemana(), semana = E.treinos.filter((t) => t.data >= ini), mes = E.treinos.filter((t) => t.data.slice(0, 7) === hoje().slice(0, 7));
  const dias = new Set(E.treinos.map((t) => t.data));
  // semanas seguidas batendo a meta (contando a atual só se já bateu)
  let seq = 0; for (let k = 0; k < 52; k++) { const a = somaDias(ini, -7 * k), b = somaDias(a, 6), q = E.treinos.filter((t) => t.data >= a && t.data <= b).length; if (q >= E.config.meta_treinos_semana) seq++; else if (k > 0) break; }
  // próxima ficha: a que vem depois da última feita
  const ult = [...E.treinos].sort((a, b) => b.data.localeCompare(a.data))[0];
  const iUlt = ult ? E.fichas.findIndex((f) => f.id === ult.fichaId) : -1, proxima = E.fichas.length ? E.fichas[(iUlt + 1) % E.fichas.length] : null;
  const diasSem = ult ? diasEntre(ult.data, hoje()) : null;
  return { semanaQtd: semana.length, mesQtd: mes.length, meta: E.config.meta_treinos_semana, sequencia: seq, proxima, ultimo: ult, diasSem, diasMarcados: dias,
    historico: [...E.treinos].sort((a, b) => (b.data + b.id).localeCompare(a.data + a.id)) };
}
// carga máxima de um exercício em cada treino (para o gráfico de evolução)
function evolucao(nomeEx) {
  return E.treinos.filter((t) => t.exercicios.some((e) => sem(e.nome) === sem(nomeEx))).sort((a, b) => a.data.localeCompare(b.data))
    .map((t) => { const e = t.exercicios.find((x) => sem(x.nome) === sem(nomeEx)); return { x: t.data, y: Math.max(0, ...e.series.filter((s) => s.feito).map((s) => +s.carga || 0)) }; }).filter((p) => p.y > 0);
}
// fez todas as repetições nas 2 últimas vezes com a mesma carga → sugere subir
function sugerirCarga(nomeEx, cargaAtual) {
  const vezes = E.treinos.filter((t) => t.exercicios.some((e) => sem(e.nome) === sem(nomeEx))).sort((a, b) => b.data.localeCompare(a.data)).slice(0, 2);
  if (vezes.length < 2) return null;
  const ok = vezes.every((t) => { const e = t.exercicios.find((x) => sem(x.nome) === sem(nomeEx)); return e.series.length && e.series.every((s) => s.feito && +s.carga >= +cargaAtual); });
  return ok && +cargaAtual > 0 ? Math.round((+cargaAtual * (+cargaAtual < 20 ? 1.1 : 1.05)) * 2) / 2 : null;
}

// ---------- Estudos ----------
const CORES_MATERIA = ['#ff5a5f', '#3b82f6', '#12b886', '#8b5cf6', '#f59f00', '#ec4899', '#0ea5e9', '#84cc16'];
const materia = (mid) => E.materias.find((m) => m.id === mid) || { nome: '—', cor: '#999' };
function estudosResumo() {
  const ini = inicioSemana(), h = (l) => Math.round((l.reduce((s, x) => s + x.min, 0) / 60) * 10) / 10;
  const semana = E.sessoes.filter((s) => s.data >= ini), mes = E.sessoes.filter((s) => s.data.slice(0, 7) === hoje().slice(0, 7));
  const semanas = []; for (let k = 7; k >= 0; k--) { const a = somaDias(ini, -7 * k), b = somaDias(a, 6); semanas.push({ ini: a, h: h(E.sessoes.filter((s) => s.data >= a && s.data <= b)) }); }
  const porMateria = E.materias.map((m) => {
    const ss = E.sessoes.filter((s) => s.materiaId === m.id), notas = E.provas.filter((p) => p.materiaId === m.id && p.nota != null && p.nota !== '');
    const pesos = notas.reduce((s, p) => s + (+p.peso || 1), 0);
    const media = pesos ? notas.reduce((s, p) => s + (+p.nota / (+p.notaMax || 10)) * 10 * (+p.peso || 1), 0) / pesos : null;
    return { ...m, semana: h(ss.filter((s) => s.data >= ini)), mes: h(ss.filter((s) => s.data.slice(0, 7) === hoje().slice(0, 7))), total: h(ss), media, provas: notas.length };
  });
  const datas = new Set(E.sessoes.map((s) => s.data));
  let seq = 0, d = datas.has(hoje()) ? hoje() : somaDias(hoje(), -1);
  while (datas.has(d)) { seq++; d = somaDias(d, -1); }
  return { semanaH: h(semana), mesH: h(mes), meta: E.config.meta_horas_estudo, semanas, porMateria, sequencia: seq, hojeMin: E.sessoes.filter((s) => s.data === hoje()).reduce((s, x) => s + x.min, 0),
    revisoesHoje: E.revisoes.filter((r) => !r.feita && r.data <= hoje()).sort((a, b) => a.data.localeCompare(b.data)),
    proximas: E.provas.filter((p) => p.data >= hoje() && (p.nota == null || p.nota === '')).sort((a, b) => (a.data + (a.hora || '')).localeCompare(b.data + (b.hora || ''))),
    sessoes: [...E.sessoes].sort((a, b) => (b.data + b.id).localeCompare(a.data + a.id)) };
}
// estudou um assunto: revisões em 1, 7 e 30 dias (curva do esquecimento)
const DIAS_REVISAO = [1, 7, 30];
function registrarEstudo({ materiaId, min, assunto, data, revisar }) {
  const s = { id: id(), materiaId, min: Math.max(1, Math.round(+min)), assunto: String(assunto || '').trim(), data: data || hoje() };
  E.sessoes.push(s);
  const novas = [];
  if (revisar && s.assunto) for (const dd of DIAS_REVISAO) novas.push({ id: id(), materiaId, assunto: s.assunto, data: somaDias(s.data, dd), dias: dd, feita: false, sessao: s.id });
  E.revisoes.push(...novas); salvar();
  return { sessao: s, revisoes: novas };
}

// ---------- Avisos no WhatsApp (enviados pelo número do Painel da Vida) ----------
// cada item (compromisso, conta, prova, revisão) guarda os ids dos lembretes que criou; mudou ou apagou = troca/apaga os lembretes
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)));
const avisosLigados = () => !!(E.config.avisos_whats && /^\d{10,13}$/.test(E.config.whatsapp) && NUVEM.url);
// "AAAA-MM-DD" + "HH:MM" no horário do celular → instante (ISO)
const instante = (data, hora = '09:00') => new Date(`${data}T${hora}:00`).toISOString();
function agendarAvisos(itemId, lista) {
  cancelarAvisos(itemId);
  if (!avisosLigados()) return;
  if (!E.segredo) E.segredo = uuid().replace(/-/g, '') + uuid().replace(/-/g, '');
  const agoraIso = new Date().toISOString(), ids = [];
  for (const a of lista) {
    if (!a || a.quando <= agoraIso) continue; // horário que já passou não vira lembrete
    const aid = uuid(); ids.push(aid);
    E.filaAvisos.push({ op: 'criar', id: aid, quando: a.quando, texto: String(a.texto).slice(0, 580) });
  }
  if (ids.length) E.avisos[itemId] = ids;
  salvar(); sincronizarAvisos();
}
function cancelarAvisos(itemId) {
  const ids = E.avisos[itemId];
  if (!ids) return;
  for (const aid of ids) {
    // ainda não subiu: é só tirar da fila
    const i = E.filaAvisos.findIndex((f) => f.op === 'criar' && f.id === aid);
    if (i >= 0) E.filaAvisos.splice(i, 1); else E.filaAvisos.push({ op: 'apagar', id: aid });
  }
  delete E.avisos[itemId]; salvar(); sincronizarAvisos();
}
const temAviso = (itemId) => !!(E.avisos[itemId] && E.avisos[itemId].length);
// manda a fila para a nuvem quando tiver internet (sem internet, fica guardada e vai depois)
let sincronizando = false;
async function sincronizarAvisos() {
  if (sincronizando || !NUVEM.url || !E.filaAvisos.length || !navigator.onLine) return;
  sincronizando = true;
  const cab = { apikey: NUVEM.chave, 'content-type': 'application/json', 'x-segredo': E.segredo, prefer: 'return=minimal' };
  try {
    while (E.filaAvisos.length) {
      const f = E.filaAvisos[0];
      const r = f.op === 'criar'
        ? await fetch(`${NUVEM.url}/rest/v1/lembretes`, { method: 'POST', headers: cab, body: JSON.stringify({ id: f.id, segredo: E.segredo, telefone: E.config.whatsapp, quando: f.quando, texto: f.texto }) })
        : await fetch(`${NUVEM.url}/rest/v1/lembretes?id=eq.${f.id}`, { method: 'DELETE', headers: cab });
      // 409 = já estava lá (mandou duas vezes): tudo bem
      if (!r.ok && r.status !== 409) throw new Error('nuvem ' + r.status);
      E.filaAvisos.shift(); salvar();
    }
  } catch (e) { console.warn('Avisos:', e.message); }
  finally { sincronizando = false; }
}
window.addEventListener('online', () => sincronizarAvisos());

// ---------- backup ----------
const exportar = () => JSON.stringify({ app: 'meu-painel', exportado: new Date().toISOString(), ...E }, null, 1);
function importar(txt) {
  const x = JSON.parse(txt);
  if (x.app !== 'meu-painel' || !x.config) throw new Error('Este arquivo não é uma cópia do Meu Painel.');
  delete x.app; delete x.exportado; E = completar(x); salvar(); return E;
}
