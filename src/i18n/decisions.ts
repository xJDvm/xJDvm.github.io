import type { Lang } from './index';

/* Decisiones de ingeniería. Fuente: research/decisiones-y-privados.md (Parte A).
   Reglas: cifras de costo solo si el documento del repo las da, y siempre como estimación de precio de lista
   (nunca como ahorro medido). Donde el research dice "sin cifra", no hay `figure`. ADR-014 (propuesto) no se usa.
   Sin nombres de clientes del empleador. `case` enlaza la decisión con la página del caso. */

export type Decision = {
  id: string;
  tags: string[];
  where: string;
  h: string;
  problem: string;
  options?: string;
  decision: string;
  why: string;
  tradeoff: string;
  figure?: { kind: 'estimate' | 'measured'; value: string };
  code?: { label: string; src: string };
  case?: string;
};

const GIST = `ALTER TABLE reserva ADD CONSTRAINT no_solapamiento
    EXCLUDE USING gist (cancha_id WITH =, rango WITH &&)
    WHERE (estado IN ('pendiente', 'confirmada'));`;

const PRESENCE = `// Presence only needs minute precision: write at most once per minute per user
// instead of on every API request (D1 free tier: 100k row writes/day).
if (!row.last_seen_at || ts - row.last_seen_at > PRESENCE_WRITE_INTERVAL) {
  await env.DB.prepare(\`UPDATE users SET last_seen_at = ? WHERE id = ?\`).bind(ts, row.id).run();
}`;

export const decisions: Record<Lang, Decision[]> = {
  es: [
    {
      id: 'data-api', case: 'cdlf', tags: ['Costo', 'Seguridad'], where: 'CDLF · contact center en AWS',
      h: 'Sacar las Lambdas de la VPC sin exponer la base',
      problem: 'Una Lambda que habla con PostgreSQL suele ir dentro de la VPC, y eso obliga a pagar NAT Gateway para salir a Meta y OpenAI y RDS Proxy para el pool de conexiones.',
      options: 'Lambdas en VPC con NAT y RDS Proxy · un servidor único con PostgreSQL local · Aurora con Data API.',
      decision: 'Aurora Serverless v2 con Data API (SQL por HTTPS) en subredes privadas y Lambdas fuera de la VPC. En la entrada, un HTTP API en vez de REST, sin SNS ni WAF.',
      why: 'No hacen falta NAT ni RDS Proxy. HTTP API trae autorizador JWT nativo, y la firma HMAC, el throttling y la validación de tokens ya cubren la exposición.',
      tradeoff: 'Los límites del Data API (respuestas de hasta 1 MiB, transacciones explícitas) obligan a consultas agregadas y a un adaptador de base de datos con dos implementaciones. El filtro por IP en el borde quedó como decisión pendiente.',
      figure: { kind: 'estimate', value: 'NAT ≈ USD 33/mes y RDS Proxy ≈ USD 88/mes que no se contratan · HTTP API USD 1 frente a USD 3,50 por millón de peticiones' },
    },
    {
      id: 'model-cost', case: 'cdlf', tags: ['Costo', 'Calidad'], where: 'CDLF · IA conversacional',
      h: 'Elegir el modelo por factura y por calidad',
      problem: 'En el contact center, lo que mueve la factura es la IA, no la infraestructura.',
      options: 'Nova Micro, Nova Lite, gpt-5-nano, Gemini 2.5 Flash-Lite y gpt-4o-mini, comparados con el mismo supuesto de tokens por chat.',
      decision: 'Seguir con gpt-4o-mini y cambiar solo después de comparar la calidad en español y el respeto a la puerta clínica con casos sintéticos. Desde el primer día: tope mensual en el proveedor, solo los últimos turnos y la base de conocimiento pertinente, y límite de salida.',
      why: 'Un modelo más barato que contesta peor o se salta la puerta clínica sale más caro. El gasto se controla acotando el contexto y con topes, no solo con el precio por token.',
      tradeoff: 'Se paga más que con la opción más barata hasta que la comparación de calidad justifique el cambio. El ahorro posible de la caché de prompts no se descontó de las cuentas.',
      figure: { kind: 'estimate', value: 'Entre USD 3,76 y 16,13 al mes según el modelo, con el volumen actual y el supuesto de tokens documentado' },
    },
    {
      id: 'debounce', case: 'cdlf', tags: ['Latencia', 'Corrección'], where: 'CDLF · mensajería por eventos',
      h: 'Agrupar ráfagas cuando la cola no lo permite',
      problem: 'Los pacientes escriben en ráfagas y hay que contestar una sola vez y en orden. Un spike demostró que el plan original no funcionaba: SQS FIFO no admite retraso por mensaje y Lambda no acepta ventana de lote con colas FIFO.',
      options: 'Retraso de 3 a 5 s en la cola (plan original) · ventana de lote en Lambda · debounce en dos etapas.',
      decision: 'El worker FIFO, agrupado por conversación, guarda el mensaje y publica un aviso en una cola estándar con 4 s de retraso. El responder solo contesta si el aviso corresponde al último mensaje recibido.',
      why: 'Se mantiene el orden por paciente y el paralelismo entre pacientes, y nadie espera más de unos 4 s.',
      tradeoff: 'Dos colas pequeñas y una Lambda más, y la idempotencia depende del identificador del mensaje de origen.',
    },
    {
      id: 'faq-harness', case: 'contact-center-ai', tags: ['Costo', 'Latencia', 'Operación'], where: 'Agentes de IA · contact center retail',
      h: 'No llamar al modelo si la respuesta ya está escrita',
      problem: 'Muchas consultas (horarios, formas de pago, ubicaciones) tienen un texto aprobado. Resolverlas con el LLM gasta tokens y latencia sin aportar nada.',
      options: 'Un agente recepcionista con LLM · un clasificador LLM intermedio · una Lambda aparte para las FAQ · un harness en la Lambda de entrada.',
      decision: 'Coincidencia determinística por palabras clave en la Lambda de entrada, con las respuestas en DynamoDB bajo demanda. Si hay duda, contesta el agente de ventas con un modelo pequeño (Claude Haiku 4.5). Despliegue con SAM y CodeZip en S3, sin Docker, ECR ni CDK, y sin streaming, porque una respuesta parcial no se puede validar.',
      why: 'Las FAQ cerradas no tocan el LLM, las respuestas quedan auditables y versionadas, y cada capacidad nueva entra solo si justifica su costo y su superficie de seguridad.',
      tradeoff: 'Una coincidencia demasiado agresiva respondería con texto fijo algo que merecía diálogo. Por eso los patrones son conservadores y las preguntas de fletes, cotizaciones o garantías nunca entran a la tabla.',
    },
    {
      id: 'mcp-paging', case: 'mcp-cedar-gateway', tags: ['Fiabilidad', 'Contexto'], where: 'Agente MCP · herramienta interna',
      h: 'Proteger el contexto del modelo, no solo la API',
      problem: 'Los catálogos llegaban enteros, con unos 198.000 caracteres, y el agente daba conteos distintos e incorrectos. La API ignoraba los parámetros de paginación.',
      decision: 'Paginar en memoria dentro de la Lambda adaptadora. Ante una respuesta vacía del modelo, un único reintento, para no entrar en bucles.',
      why: 'El listado que recibe el modelo bajó de unos 198.000 a 611 caracteres. Las respuestas vacías pasaron de 2 de cada 6 invocaciones a 1 de 22 después del cambio.',
      tradeoff: 'La Lambda sigue recibiendo el catálogo completo. Se acepta porque el límite que importa es el contexto del modelo.',
      figure: { kind: 'measured', value: '≈198.000 → 611 caracteres por listado · respuestas vacías de 2/6 a 1/22' },
    },
    {
      id: 'free-tier', tags: ['Costo', 'Tiempo real'], where: 'App colaborativa en tiempo real · Cloudflare',
      h: 'Diseñar para el plan gratuito desde el principio',
      problem: 'Una app en tiempo real para un grupo pequeño tenía que funcionar dentro de los límites del plan gratuito de Cloudflare (D1: 100.000 escrituras de fila al día y 50 consultas por petición).',
      decision: 'Un Durable Object por grupo con la WebSocket Hibernation API, en lugar de un polling cada 45 s; los pings se responden sin despertar el objeto. La presencia se escribe como mucho una vez por minuto y usuario, las estadísticas salen en una sola consulta y un cron diario limpia las tablas.',
      why: 'Un socket inactivo no consume duración, las escrituras quedan lejos del límite diario y las tablas pequeñas mantienen baratas las lecturas indexadas.',
      tradeoff: 'Si se llega al límite de conexiones, el cliente vuelve a polling, y la presencia solo tiene precisión de minutos.',
      code: { label: 'TypeScript · fragmento', src: PRESENCE },
    },
    {
      id: 'gist', case: 'sportapp', tags: ['Integridad', 'Concurrencia'], where: 'SportApp · reservas de canchas',
      h: 'Que la base de datos impida la doble reserva',
      problem: 'Dos clientes pueden reservar a la vez la misma cancha en horarios que se solapan.',
      decision: 'Una restricción de exclusión GiST sobre la reserva: misma cancha y rangos tstzrange [inicio, fin) en UTC que se solapan, activa solo para reservas pendientes o confirmadas.',
      why: 'La garantía es transaccional, no de aplicación: no depende de que cada caso de uso compruebe bien antes de insertar.',
      tradeoff: 'La regla queda atada a PostgreSQL y a la extensión btree_gist.',
      code: { label: 'SQL · migración', src: GIST },
    },
    {
      id: 'hybrid-emulator', tags: ['Operación', 'Desarrollo'], where: 'Plataforma B2B de compras · AWS',
      h: 'Emular AWS en local sin fingir que todo funciona',
      problem: 'El desarrollo local usa un emulador de AWS, pero su runtime de Lambda no es Node real: faltan net, tls y fetch, y los servicios con PostgreSQL no arrancan ahí.',
      decision: 'Modo híbrido: los servicios sin base de datos corren como Lambda en el emulador y los que usan PostgreSQL corren en contenedor. Cada vez que se actualiza el emulador, se revisa la decisión.',
      why: 'Se aprovecha lo que el emulador reproduce bien sin bloquear los servicios que dependen de PostgreSQL, la fuente de verdad de la plataforma.',
      tradeoff: 'Dos formas de ejecutar en local y una revisión obligatoria al subir de versión el emulador.',
    },
  ],
  en: [
    {
      id: 'data-api', case: 'cdlf', tags: ['Cost', 'Security'], where: 'CDLF · contact center on AWS',
      h: 'Take the Lambdas out of the VPC without exposing the database',
      problem: 'A Lambda that talks to PostgreSQL usually sits inside the VPC, which means paying for a NAT Gateway to reach Meta and OpenAI, and for RDS Proxy to pool connections.',
      options: 'Lambdas in the VPC with NAT and RDS Proxy · a single server with local PostgreSQL · Aurora with the Data API.',
      decision: 'Aurora Serverless v2 with the Data API (SQL over HTTPS) in private subnets, with the Lambdas outside the VPC. At the edge, an HTTP API instead of REST, with no SNS and no WAF.',
      why: 'No NAT and no RDS Proxy needed. HTTP API ships a native JWT authorizer, and the HMAC signature, throttling and token validation already cover the exposure.',
      tradeoff: 'Data API limits (responses up to 1 MiB, explicit transactions) force aggregated queries and a database adapter with two implementations. IP filtering at the edge was left as an open decision.',
      figure: { kind: 'estimate', value: 'NAT ≈ USD 33/mo and RDS Proxy ≈ USD 88/mo not contracted · HTTP API USD 1 vs USD 3.50 per million requests' },
    },
    {
      id: 'model-cost', case: 'cdlf', tags: ['Cost', 'Quality'], where: 'CDLF · conversational AI',
      h: 'Pick the model by the bill and by quality',
      problem: 'In the contact center, what drives the bill is the AI, not the infrastructure.',
      options: 'Nova Micro, Nova Lite, gpt-5-nano, Gemini 2.5 Flash-Lite and gpt-4o-mini, compared with the same tokens-per-chat assumption.',
      decision: 'Stay on gpt-4o-mini and switch only after comparing Spanish quality and adherence to the clinical gate with synthetic cases. From day one: a monthly cap at the provider, only the latest turns and the relevant knowledge base, and an output limit.',
      why: 'A cheaper model that answers worse or skips the clinical gate ends up costing more. Spend is controlled by bounding context and setting caps, not just by price per token.',
      tradeoff: 'It costs more than the cheapest option until the quality comparison justifies a switch. Possible prompt-caching savings were not subtracted from the numbers.',
      figure: { kind: 'estimate', value: 'Between USD 3.76 and 16.13 a month depending on the model, at current volume and the documented token assumption' },
    },
    {
      id: 'debounce', case: 'cdlf', tags: ['Latency', 'Correctness'], where: 'CDLF · event-driven messaging',
      h: 'Debounce bursts when the queue won’t let you',
      problem: 'Patients write in bursts and must get one answer, in order. A spike proved the original plan didn’t work: SQS FIFO has no per-message delay, and Lambda doesn’t accept a batching window on FIFO queues.',
      options: '3–5 s delay on the queue (original plan) · a Lambda batching window · a two-stage debounce.',
      decision: 'The FIFO worker, grouped by conversation, stores the message and posts a notice to a standard queue with a 4 s delay. The responder only answers if that notice matches the latest message received.',
      why: 'Order per patient and parallelism across patients are both kept, and nobody waits more than about 4 s.',
      tradeoff: 'Two small queues and one more Lambda, and idempotency depends on the source message id.',
    },
    {
      id: 'faq-harness', case: 'contact-center-ai', tags: ['Cost', 'Latency', 'Operations'], where: 'AI agents · retail contact center',
      h: 'Don’t call the model when the answer is already written',
      problem: 'Many questions (opening hours, payment methods, locations) have an approved answer. Solving them with the LLM spends tokens and latency for no gain.',
      options: 'A receptionist agent with an LLM · an intermediate LLM classifier · a separate Lambda for FAQs · a harness in the ingress Lambda.',
      decision: 'Deterministic keyword matching in the ingress Lambda, with answers in on-demand DynamoDB. When in doubt, the sales agent answers with a small model (Claude Haiku 4.5). Deployed with SAM and a CodeZip in S3, with no Docker, ECR or CDK, and no streaming, because a partial answer can’t be validated.',
      why: 'Closed FAQs never touch the LLM, answers stay auditable and versioned, and every new capability has to justify its cost and its security surface.',
      tradeoff: 'An overly aggressive match would give a canned answer to something that deserved a conversation. So the patterns are conservative, and shipping, quotes and warranty questions never go into the table.',
    },
    {
      id: 'mcp-paging', case: 'mcp-cedar-gateway', tags: ['Reliability', 'Context'], where: 'MCP agent · internal tool',
      h: 'Protect the model’s context, not just the API',
      problem: 'Catalogs came back whole, at about 198,000 characters, and the agent gave different, wrong counts. The API ignored the pagination parameters.',
      decision: 'Paginate in memory inside the adapter Lambda. On an empty model response, retry exactly once, to avoid loops.',
      why: 'The listing the model receives dropped from about 198,000 to 611 characters. Empty responses went from 2 in 6 invocations to 1 in 22 after the change.',
      tradeoff: 'The Lambda still receives the full catalog. That’s accepted, because the limit that matters is the model’s context.',
      figure: { kind: 'measured', value: '≈198,000 → 611 characters per listing · empty responses from 2/6 to 1/22' },
    },
    {
      id: 'free-tier', tags: ['Cost', 'Real time'], where: 'Real-time collaborative app · Cloudflare',
      h: 'Design for the free plan from day one',
      problem: 'A real-time app for a small group had to fit within Cloudflare’s free plan limits (D1: 100,000 row writes a day and 50 queries per request).',
      decision: 'One Durable Object per group with the WebSocket Hibernation API, replacing a 45 s poll; pings are answered without waking the object. Presence is written at most once per minute per user, stats come from a single query, and a daily cron keeps tables small.',
      why: 'An idle socket costs no duration, writes stay far from the daily limit, and small tables keep indexed reads cheap.',
      tradeoff: 'If the connection limit is hit, the client falls back to polling, and presence only has minute precision.',
      code: { label: 'TypeScript · excerpt', src: PRESENCE },
    },
    {
      id: 'gist', case: 'sportapp', tags: ['Integrity', 'Concurrency'], where: 'SportApp · court bookings',
      h: 'Let the database rule out double bookings',
      problem: 'Two customers can book the same court at the same time for overlapping slots.',
      decision: 'A GiST exclusion constraint on bookings: same court and overlapping tstzrange [start, end) ranges in UTC, enforced only for pending or confirmed bookings.',
      why: 'The guarantee is transactional, not application-level: it doesn’t depend on every use case checking correctly before inserting.',
      tradeoff: 'The rule is tied to PostgreSQL and the btree_gist extension.',
      code: { label: 'SQL · migration', src: GIST },
    },
    {
      id: 'hybrid-emulator', tags: ['Operations', 'Development'], where: 'B2B purchasing platform · AWS',
      h: 'Emulate AWS locally without pretending everything works',
      problem: 'Local development uses an AWS emulator, but its Lambda runtime isn’t real Node: net, tls and fetch are missing, and the PostgreSQL services can’t run there.',
      decision: 'Hybrid mode: services without a database run as Lambdas in the emulator, and the ones that use PostgreSQL run in a container. The decision is reviewed every time the emulator is upgraded.',
      why: 'It uses what the emulator reproduces well without blocking the services that depend on PostgreSQL, the platform’s source of truth.',
      tradeoff: 'Two ways to run things locally, and a mandatory review on every emulator upgrade.',
    },
  ],
};
