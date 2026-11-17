import { useEffect, useRef, useState } from 'preact/hooks';
import type { ConsoleCopy, ConsoleEndpoint } from '../i18n';

type StageState = { cls: string; note: string };
type Props = { copy: ConsoleCopy; endpoints: ConsoleEndpoint[]; email: string };

const STAGE_IDS = ['client', 'gateway', 'lambda', 'db'] as const;

/* Resaltado de JSON sin innerHTML: devuelve nodos Preact. */
function Highlight({ value }: { value: unknown }) {
  const src = JSON.stringify(value, null, 2);
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?/g;
  const out: preact.ComponentChildren[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[1]) {
      out.push(<span key={i++} class={m[2] ? 'k' : 's'}>{m[1]}</span>);
      if (m[2]) out.push(m[2]);
    } else {
      out.push(<span key={i++} class="n">{m[0]}</span>);
    }
    last = re.lastIndex;
  }
  out.push(src.slice(last));
  return <>{out}</>;
}

function Render({ ep, copy, email }: { ep: ConsoleEndpoint; copy: ConsoleCopy; email: string }) {
  const b = ep.body as Record<string, any>;
  if (ep.ui === 'list') {
    return (
      <>
        {(b.items as { name: string; type: string; status: string }[]).map((p) => (
          <div class="row" key={p.name}>
            <div>
              <b>{p.name}</b>
              <div class="mono">{p.type}</div>
            </div>
            <span class="tag">{p.status}</span>
          </div>
        ))}
      </>
    );
  }
  if (ep.ui === 'availability') {
    return (
      <>
        <div class="card">
          <span class="mono">{copy.availLabel}</span>
          <span class="big">{copy.availTitle}</span>
          <span>{copy.availText}</span>
        </div>
        {copy.availRows.map(([k, v]) => (
          <div class="row" key={k}>
            <span>{k}</span>
            <span class="tag">{v}</span>
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      <div class="card pk">
        <span class="mono">{copy.contactLabel}</span>
        <span class="big">{copy.contactTitle}</span>
      </div>
      <a class="btn sm" href={`mailto:${email}`}>
        {copy.contactCta} <span class="arr" aria-hidden="true">→</span>
      </a>
    </>
  );
}

const idle = (): StageState[] => STAGE_IDS.map(() => ({ cls: '', note: '' }));

export default function ApiConsole({ copy, endpoints, email }: Props) {
  const first = endpoints[0];
  // Estado inicial = respuesta ya servida, para que sin JS también haya contenido.
  const [active, setActive] = useState<ConsoleEndpoint>(first);
  const [shown, setShown] = useState<ConsoleEndpoint | null>(first);
  const [pending, setPending] = useState<string | null>(null);
  const [stages, setStages] = useState<StageState[]>(STAGE_IDS.map(() => ({ cls: 'done', note: '' })));
  const [ms, setMs] = useState<string>('—');
  const [status, setStatus] = useState<string>(`${first.status} OK`);
  const [served, setServed] = useState(0);
  const [cache, setCache] = useState(false);
  const busy = useRef(false);
  const seen = useRef<Record<string, boolean>>({});
  const reduced = useRef(false);
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const wait = (t: number) => new Promise<void>((r) => setTimeout(r, reduced.current ? 0 : t));
  const rnd = (a: number, b: number) => Math.round(a + Math.random() * (b - a));

  async function run(ep: ConsoleEndpoint) {
    if (busy.current) return;
    busy.current = true;
    setActive(ep);
    setPending(ep.id);
    const hit = cacheRef.current && ep.method === 'GET' && !!seen.current[ep.id];
    const st = idle();
    setStages([...st]);
    setShown(null);
    setMs('…');
    setStatus('…');

    const plan: [number, string, number][] = [
      [0, 'fetch()', rnd(1, 3)],
      [1, hit ? copy.cacheHit : copy.cacheMiss, rnd(3, 7)],
    ];
    if (!hit) plan.push([2, copy.lambdaNote, rnd(8, 18)], [3, ep.sql, rnd(6, 20)]);
    else {
      st[2] = { cls: 'skipped', note: '' };
      st[3] = { cls: 'skipped', note: '' };
    }
    let total = 0;
    for (const [idx, label, t] of plan) {
      total += t;
      st[idx] = { cls: 'on', note: `${label} · ${t}ms` };
      setStages([...st]);
      await wait(240);
      st[idx] = { ...st[idx], cls: 'done' };
      setStages([...st]);
    }
    for (const [idx] of [...plan].reverse()) {
      st[idx] = { ...st[idx], cls: 'back' };
      setStages([...st]);
      await wait(90);
      st[idx] = { ...st[idx], cls: 'done' };
      setStages([...st]);
    }
    seen.current[ep.id] = true;
    setServed((n) => n + 1);
    setMs(`${total} ms${hit ? ` · ${copy.cacheShort}` : ''}`);
    setStatus(`${ep.status} ${ep.status === 201 ? 'Created' : 'OK'}`);
    setShown(ep);
    setPending(null);
    busy.current = false;
  }

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) return;
    const id = setTimeout(() => run(first), 700);
    return () => clearTimeout(id);
  }, []);

  const countLabel = `${served} ${served === 1 ? copy.countOne : copy.countMany}`;

  return (
    <div class="demo" role="region" aria-labelledby="demo-title">
      <div class="demo-bar">
        <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
        <b id="demo-title">{copy.title}</b>
        <span class="count">{countLabel}</span>
      </div>
      <div class="demo-body">
        <p class="demo-hint">
          {copy.hintA} <b>{copy.hintB}</b> {copy.hintC}
        </p>
        <div class="eps" role="group" aria-label={copy.groupLabel}>
          {endpoints.map((ep) => (
            <button
              type="button"
              class="ep"
              key={ep.id}
              aria-pressed={String(active.id === ep.id && served > 0) as 'true' | 'false'}
              aria-busy={pending === ep.id ? 'true' : undefined}
              onClick={() => run(ep)}
            >
              <em class={ep.method === 'POST' ? 'post' : undefined}>{ep.method}</em>
              {ep.path}
            </button>
          ))}
          <label class="cache">
            <input type="checkbox" checked={cache} onChange={(e) => setCache((e.target as HTMLInputElement).checked)} />
            {copy.cacheLabel}
          </label>
        </div>
        <div class="pipe" aria-hidden="true">
          {copy.stages.map((name, i) => (
            <div class={`stage ${stages[i].cls}`} key={name}>
              {name}
              <small>{stages[i].note}</small>
            </div>
          ))}
        </div>
        <div class="out">
          <div class="pane">
            <h3><span>{copy.jsonTitle}</span><span>{ms}</span></h3>
            <pre tabIndex={0} aria-label={copy.jsonAria}>
              {shown ? (
                <Highlight value={shown.body} />
              ) : (
                <span class="c">{`→ ${active.method} ${active.path}`}</span>
              )}
            </pre>
          </div>
          <div class="pane">
            <h3><span>{copy.uiTitle}</span><span>{status}</span></h3>
            <div class="ui" aria-live="polite">
              {shown ? <Render ep={shown} copy={copy} email={email} /> : <p class="demo-hint">{copy.loading}</p>}
            </div>
          </div>
        </div>
        <p class="demo-note">{copy.note}</p>
      </div>
    </div>
  );
}
