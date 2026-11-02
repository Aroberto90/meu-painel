// Meu Painel ↔ Strava. Roda no Supabase (Edge Function "strava").
// A chave secreta do app do Strava fica só aqui (tabela strava_contas, fechada); o celular conversa usando o "segredo" dele.
// GET  ?acao=conectar&segredo=...  → manda para o login do Strava
// GET  ?acao=retorno&code=...&state=segredo → o Strava volta aqui; troca o código pelo acesso e mostra "pronto"
// POST {acao: configurar|status|atividades|desconectar, segredo, ...}
const BASE = Deno.env.get('SUPABASE_URL')!;
const SERVICO = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP = 'https://aroberto90.github.io/meu-painel/';
const EU = `${BASE}/functions/v1/strava`;
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, 'content-type': 'application/json' } });

async function db(caminho: string, init: RequestInit = {}) {
  const r = await fetch(`${BASE}/rest/v1/${caminho}`, {
    ...init,
    headers: { apikey: SERVICO, authorization: `Bearer ${SERVICO}`, 'content-type': 'application/json', prefer: 'return=representation', ...(init.headers || {}) },
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`base ${r.status}: ${t.slice(0, 200)}`);
  return t ? JSON.parse(t) : null;
}
type Conta = { segredo: string; client_id: string; client_secret: string; access_token: string | null; refresh_token: string | null; expira: number | null; atleta: Record<string, unknown> | null };
const conta = async (seg: string): Promise<Conta | undefined> => (await db(`strava_contas?segredo=eq.${encodeURIComponent(seg)}&select=*`))[0];
const atualizar = (seg: string, campos: Record<string, unknown>) => db(`strava_contas?segredo=eq.${encodeURIComponent(seg)}`, { method: 'PATCH', body: JSON.stringify(campos) });

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const pagina = (titulo: string, texto: string, ok: boolean) => new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titulo)}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#fff7f4;color:#1f1724;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center">
<div><div style="font-size:56px">${ok ? '✅' : '⚠️'}</div><h1 style="font-size:24px;margin:8px 0">${esc(titulo)}</h1><p style="color:#7a6f80;max-width:340px">${esc(texto)}</p>
<a href="${APP}#ajustes" style="display:inline-block;margin-top:12px;padding:12px 20px;border-radius:14px;background:linear-gradient(135deg,#ff5a5f,#ff8a3d);color:#fff;text-decoration:none;font-weight:700">Voltar ao Meu Painel</a></div></body></html>`,
{ headers: { 'content-type': 'text/html; charset=utf-8' } });

// acesso do Strava vale 6 h: renova quando faltar menos de 5 min
async function acesso(c: Conta) {
  if (c.access_token && (c.expira || 0) > Date.now() / 1000 + 300) return c.access_token;
  const r = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: c.client_id, client_secret: c.client_secret, grant_type: 'refresh_token', refresh_token: c.refresh_token }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Strava recusou renovar o acesso (${r.status}). Conecte de novo em Ajustes.`);
  await atualizar(c.segredo, { access_token: j.access_token, refresh_token: j.refresh_token, expira: j.expires_at });
  return j.access_token as string;
}
const CORRIDAS = new Set(['Run', 'TrailRun', 'VirtualRun']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const u = new URL(req.url);
  try {
    if (req.method === 'GET') {
      const acao = u.searchParams.get('acao');
      if (acao === 'conectar') {
        const seg = u.searchParams.get('segredo') || '', c = seg.length >= 32 ? await conta(seg) : undefined;
        if (!c) return pagina('Falta configurar', 'Cole o ID e o segredo do seu app do Strava em Ajustes antes de conectar.', false);
        const ir = new URL('https://www.strava.com/oauth/authorize');
        ir.search = new URLSearchParams({ client_id: c.client_id, response_type: 'code', redirect_uri: `${EU}?acao=retorno`, approval_prompt: 'auto', scope: 'read,activity:read_all', state: seg }).toString();
        return Response.redirect(ir.toString(), 302);
      }
      if (acao === 'retorno') {
        if (u.searchParams.get('error')) return pagina('Conexão cancelada', 'Você não autorizou o acesso no Strava. Dá para tentar de novo em Ajustes.', false);
        const seg = u.searchParams.get('state') || '', c = seg.length >= 32 ? await conta(seg) : undefined;
        if (!c) return pagina('Não deu certo', 'Não achei a configuração deste celular. Tente conectar de novo pelo app.', false);
        if (!(u.searchParams.get('scope') || '').includes('activity:read')) return pagina('Falta uma permissão', 'Na tela do Strava, deixe marcada a opção de ver suas atividades e conecte de novo.', false);
        const r = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ client_id: c.client_id, client_secret: c.client_secret, code: u.searchParams.get('code'), grant_type: 'authorization_code' }),
        });
        const j = await r.json();
        if (!r.ok) return pagina('Não deu certo', `O Strava recusou (${r.status}). Confira se o ID e o segredo do app estão certos.`, false);
        const a = j.athlete || {};
        await atualizar(seg, { access_token: j.access_token, refresh_token: j.refresh_token, expira: j.expires_at, conectado_em: new Date().toISOString(), atleta: { id: a.id, nome: [a.firstname, a.lastname].filter(Boolean).join(' '), foto: a.profile_medium || null } });
        return pagina(`Strava conectado${a.firstname ? ', ' + a.firstname : ''}!`, 'Suas corridas vão aparecer sozinhas no Meu Painel. Volte para o app.', true);
      }
      return pagina('Meu Painel', 'Nada para ver aqui.', false);
    }

    const b = await req.json().catch(() => ({}));
    const seg = String(b.segredo || '');
    if (seg.length < 32) return json({ erro: 'Celular sem identificação.' }, 400);

    if (b.acao === 'configurar') {
      const client_id = String(b.client_id || '').trim(), client_secret = String(b.client_secret || '').trim();
      if (!/^\d{3,12}$/.test(client_id)) return json({ erro: 'O ID do cliente é um número (ex.: 123456).' }, 400);
      if (!/^[0-9a-f]{30,64}$/i.test(client_secret)) return json({ erro: 'O segredo do cliente tem 40 letras e números. Confira se copiou inteiro.' }, 400);
      const ja = await conta(seg);
      if (ja) await atualizar(seg, { client_id, client_secret, ...(ja.client_id !== client_id ? { access_token: null, refresh_token: null, expira: null, atleta: null } : {}) });
      else await db('strava_contas', { method: 'POST', body: JSON.stringify({ segredo: seg, client_id, client_secret }) });
      return json({ ok: true });
    }
    if (b.acao === 'status') {
      const c = await conta(seg);
      return json({ configurado: !!c, conectado: !!(c && c.refresh_token), atleta: c ? c.atleta : null, client_id: c ? c.client_id : null });
    }
    if (b.acao === 'atividades') {
      const c = await conta(seg);
      if (!c || !c.refresh_token) return json({ erro: 'Strava não conectado.' }, 409);
      const token = await acesso(c), depois = Math.max(0, Math.floor(+b.depois || 0));
      const lista: unknown[] = [];
      for (let pag = 1; pag <= 3; pag++) {
        const r = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${depois}&per_page=100&page=${pag}`, { headers: { authorization: `Bearer ${token}` } });
        if (r.status === 429) return json({ erro: 'O Strava pediu uma pausa (muitas consultas). Tente daqui a 15 minutos.' }, 429);
        if (!r.ok) throw new Error(`Strava ${r.status}`);
        const l = await r.json();
        lista.push(...l);
        if (l.length < 100) break;
      }
      // só corridas; o resto (bike, caminhada, musculação) fica no Strava
      const corridas = (lista as Record<string, any>[]).filter((a) => CORRIDAS.has(a.sport_type || a.type)).map((a) => ({
        id: String(a.id), nome: a.name, inicio: a.start_date, data: String(a.start_date_local).slice(0, 10), hora: String(a.start_date_local).slice(11, 16),
        km: Math.round(a.distance / 10) / 100, seg: a.moving_time, total: a.elapsed_time, tipo: a.sport_type || a.type, treino: a.workout_type,
        subida: a.total_elevation_gain, fc: a.average_heartrate || null, linha: (a.map && a.map.summary_polyline) || null,
      }));
      return json({ corridas });
    }
    if (b.acao === 'desconectar') {
      const c = await conta(seg);
      if (c && c.access_token) await fetch('https://www.strava.com/oauth/deauthorize', { method: 'POST', headers: { authorization: `Bearer ${c.access_token}` } }).catch(() => {});
      if (c) await atualizar(seg, { access_token: null, refresh_token: null, expira: null, atleta: null });
      return json({ ok: true });
    }
    return json({ erro: 'Ação desconhecida.' }, 400);
  } catch (e) {
    return json({ erro: (e as Error).message }, 500);
  }
});
