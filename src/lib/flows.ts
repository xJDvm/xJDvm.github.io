import type { Lang } from '../i18n';
import type { CloudIconName } from './cloud-icons';

/* Diagramas por caso con iconos de arquitectura (AWS Architecture Icons, Simple Icons y Lucide; ver cloud-icons.ts).
   `home`: versión en lenguaje llano para la portada. `arch`: arquitectura técnica para la página del caso.
   Solo describen piezas que ya están en el texto de cada caso; sin datos ni nombres de clientes. */

export type FlowStep = { icon: CloudIconName; label: string; sub?: string; tone?: 'hot' | 'teal' };
type Flows = { home?: FlowStep[]; arch: FlowStep[] };

const es: Record<string, Flows> = {
  'contact-center-ai': {
    home: [
      { icon: 'whatsapp', label: 'El cliente escribe', sub: 'WhatsApp o web' },
      { icon: 'filter', label: '¿Pregunta frecuente?', sub: 'respuesta aprobada al instante', tone: 'teal' },
      { icon: 'bot', label: 'Asistente de IA', sub: 'ventas, recepción o soporte', tone: 'hot' },
      { icon: 'person', label: 'Asesor humano', sub: 'cuando hace falta' },
    ],
    arch: [
      { icon: 'webhook', label: 'Webhook de Respond.io', sub: 'WhatsApp y web' },
      { icon: 'apigw', label: 'API Gateway', sub: 'solo las IP del proveedor' },
      { icon: 'sns', label: 'SNS', sub: 'desacopla la entrada' },
      { icon: 'sqs', label: 'SQS', sub: 'con cola de mensajes fallidos' },
      { icon: 'lambda', label: 'Lambda normalizadora', sub: 'deduplica y clasifica' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'FAQ cerrada: respuesta sin LLM', tone: 'teal' },
      { icon: 'agentcore', label: 'AgentCore Runtime', sub: 'Strands · Claude Haiku 4.5 · 6 herramientas · memoria', tone: 'hot' },
      { icon: 'chat', label: 'MCP de Respond.io', sub: 'la respuesta vuelve al cliente' },
    ],
  },
  'respondio-aws': {
    home: [
      { icon: 'chat', label: 'Chat de ventas', sub: 'mensajes, contactos, conversaciones' },
      { icon: 'split', label: 'Se reparte por tipo', sub: 'cada proceso por su lado', tone: 'hot' },
      { icon: 'workflow', label: 'Procesos', sub: 'avisos, cotizaciones, despachos' },
      { icon: 'postgresql', label: 'Base de datos', sub: 'sin perder eventos', tone: 'teal' },
    ],
    arch: [
      { icon: 'webhook', label: 'Webhooks de Respond.io', sub: 'mensajes, contactos, conversaciones' },
      { icon: 'apigw', label: 'API Gateway', sub: 'IP permitidas + API key' },
      { icon: 'sns', label: 'SNS', sub: '3 tópicos · 16 suscripciones filtradas', tone: 'hot' },
      { icon: 'sqs', label: '19 colas SQS', sub: 'una por proceso · S3 → SQS para SAP' },
      { icon: 'lambda', label: '25 Lambdas', sub: 'Python 3.12 · tarea programada con EventBridge' },
      { icon: 'aurora', label: 'Aurora PostgreSQL 16', sub: 'en VPC · secretos en Secrets Manager', tone: 'teal' },
    ],
  },
  'mcp-cedar-gateway': {
    home: [
      { icon: 'googlechat', label: 'Escribes en Google Chat', sub: '«regístrame 3 horas»' },
      { icon: 'bot', label: 'El asistente propone', sub: 'entiende la frase en español' },
      { icon: 'shield', label: 'Reglas estrictas', sub: '10 acciones, ninguna de borrar', tone: 'hot' },
      { icon: 'check', label: 'Confirmas', sub: 'y se registra una sola vez', tone: 'teal' },
    ],
    arch: [
      { icon: 'googlechat', label: 'Google Chat' },
      { icon: 'lambda', label: 'Lambda receptora', sub: 'verifica JWT · deduplica' },
      { icon: 'agentcore', label: 'AgentCore Runtime', sub: 'agente en Python con Strands' },
      { icon: 'shield', label: 'AgentCore Gateway', sub: 'MCP · política Cedar default-deny', tone: 'hot' },
      { icon: 'lambda', label: '10 Lambdas adaptadoras', sub: 'Node 22 · OpenAPI 3.1' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'idempotencia · la API de horas registra una vez', tone: 'teal' },
    ],
  },
  clinic: {
    home: [
      { icon: 'messenger', label: 'El paciente escribe', sub: 'Messenger o Instagram' },
      { icon: 'timer', label: 'Espera 4 s', sub: 'agrupa la ráfaga de mensajes' },
      { icon: 'gate', label: 'Puerta clínica', sub: 'qué puede contestar la IA', tone: 'hot' },
      { icon: 'bot', label: 'IA o una persona', sub: 'con traspaso al equipo', tone: 'teal' },
    ],
    arch: [
      { icon: 'webhook', label: 'Webhook de Meta', sub: 'Messenger e Instagram' },
      { icon: 'apigw', label: 'API Gateway' },
      { icon: 'lambda', label: 'Lambda de ingreso', sub: 'firma HMAC · 200 solo si SQS confirmó' },
      { icon: 'sqs', label: 'SQS FIFO', sub: 'agrupada por paciente' },
      { icon: 'aurora', label: 'Aurora', sub: 'idempotencia · debounce de 4 s', tone: 'teal' },
      { icon: 'gate', label: 'Responder', sub: 'puerta clínica · ¿hay un mensaje más nuevo?', tone: 'hot' },
      { icon: 'bot', label: 'IA + base de conocimiento', sub: 'o traspaso a personal' },
    ],
  },
  sportapp: {
    arch: [
      { icon: 'expo', label: 'App móvil (Expo)', sub: 'clientes' },
      { icon: 'react', label: 'Panel web (React 19)', sub: 'complejos' },
      { icon: 'express', label: 'API /api/v1', sub: 'Express 5 · Zod · argon2 · JWT' },
      { icon: 'hexagon', label: '16 módulos hexagonales', sub: '69 casos de uso · Result ok/err', tone: 'hot' },
      { icon: 'postgresql', label: 'PostgreSQL', sub: 'GiST contra doble reserva · RLS · auditoría', tone: 'teal' },
    ],
  },
  'clinical-inventory-ai': {
    arch: [
      { icon: 'note', label: 'Nota en texto libre', sub: '«faltan guantes M…»' },
      { icon: 'nextjs', label: 'Frontend Next.js 15', sub: 'permisos por almacén' },
      { icon: 'nestjs', label: 'Backend NestJS', sub: 'roles y permisos · PostgreSQL' },
      { icon: 'fastapi', label: 'Microservicio FastAPI', sub: 'recibe la nota' },
      { icon: 'ollama', label: 'Ollama', sub: 'modelo local de 7B', tone: 'hot' },
      { icon: 'braces', label: 'Parámetros', sub: 'reabastecimiento estructurado', tone: 'teal' },
    ],
  },
};

const en: Record<string, Flows> = {
  'contact-center-ai': {
    home: [
      { icon: 'whatsapp', label: 'The customer writes', sub: 'WhatsApp or web' },
      { icon: 'filter', label: 'A frequent question?', sub: 'approved answer, instantly', tone: 'teal' },
      { icon: 'bot', label: 'AI assistant', sub: 'sales, reception or support', tone: 'hot' },
      { icon: 'person', label: 'Human advisor', sub: 'when needed' },
    ],
    arch: [
      { icon: 'webhook', label: 'Respond.io webhook', sub: 'WhatsApp and web' },
      { icon: 'apigw', label: 'API Gateway', sub: 'only the provider’s IPs' },
      { icon: 'sns', label: 'SNS', sub: 'decouples intake' },
      { icon: 'sqs', label: 'SQS', sub: 'with a dead-letter queue' },
      { icon: 'lambda', label: 'Normalizer Lambda', sub: 'deduplicates and classifies' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'closed FAQ: answered without an LLM', tone: 'teal' },
      { icon: 'agentcore', label: 'AgentCore Runtime', sub: 'Strands · Claude Haiku 4.5 · 6 tools · memory', tone: 'hot' },
      { icon: 'chat', label: 'Respond.io MCP', sub: 'the reply goes back to the customer' },
    ],
  },
  'respondio-aws': {
    home: [
      { icon: 'chat', label: 'Sales chat', sub: 'messages, contacts, conversations' },
      { icon: 'split', label: 'Split by type', sub: 'each process on its own', tone: 'hot' },
      { icon: 'workflow', label: 'Processes', sub: 'alerts, quotes, deliveries' },
      { icon: 'postgresql', label: 'Database', sub: 'no events lost', tone: 'teal' },
    ],
    arch: [
      { icon: 'webhook', label: 'Respond.io webhooks', sub: 'messages, contacts, conversations' },
      { icon: 'apigw', label: 'API Gateway', sub: 'IP allowlist + API key' },
      { icon: 'sns', label: 'SNS', sub: '3 topics · 16 filtered subscriptions', tone: 'hot' },
      { icon: 'sqs', label: '19 SQS queues', sub: 'one per process · S3 → SQS for SAP' },
      { icon: 'lambda', label: '25 Lambdas', sub: 'Python 3.12 · scheduled job on EventBridge' },
      { icon: 'aurora', label: 'Aurora PostgreSQL 16', sub: 'in a VPC · secrets in Secrets Manager', tone: 'teal' },
    ],
  },
  'mcp-cedar-gateway': {
    home: [
      { icon: 'googlechat', label: 'You write in Google Chat', sub: '“log 3 hours for me”' },
      { icon: 'bot', label: 'The assistant proposes', sub: 'it understands Spanish' },
      { icon: 'shield', label: 'Strict rules', sub: '10 actions, none that delete', tone: 'hot' },
      { icon: 'check', label: 'You confirm', sub: 'and it’s logged exactly once', tone: 'teal' },
    ],
    arch: [
      { icon: 'googlechat', label: 'Google Chat' },
      { icon: 'lambda', label: 'Receiver Lambda', sub: 'verifies JWT · deduplicates' },
      { icon: 'agentcore', label: 'AgentCore Runtime', sub: 'Python agent with Strands' },
      { icon: 'shield', label: 'AgentCore Gateway', sub: 'MCP · default-deny Cedar policy', tone: 'hot' },
      { icon: 'lambda', label: '10 adapter Lambdas', sub: 'Node 22 · OpenAPI 3.1' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'idempotency · the time API logs once', tone: 'teal' },
    ],
  },
  clinic: {
    home: [
      { icon: 'messenger', label: 'The patient writes', sub: 'Messenger or Instagram' },
      { icon: 'timer', label: 'Wait 4 s', sub: 'groups the burst of messages' },
      { icon: 'gate', label: 'Clinical gate', sub: 'what the AI may answer', tone: 'hot' },
      { icon: 'bot', label: 'AI or a person', sub: 'with handoff to the staff', tone: 'teal' },
    ],
    arch: [
      { icon: 'webhook', label: 'Meta webhook', sub: 'Messenger and Instagram' },
      { icon: 'apigw', label: 'API Gateway' },
      { icon: 'lambda', label: 'Intake Lambda', sub: 'HMAC signature · 200 only once SQS confirmed' },
      { icon: 'sqs', label: 'SQS FIFO', sub: 'grouped by patient' },
      { icon: 'aurora', label: 'Aurora', sub: 'idempotency · 4 s debounce', tone: 'teal' },
      { icon: 'gate', label: 'Responder', sub: 'clinical gate · is there a newer message?', tone: 'hot' },
      { icon: 'bot', label: 'AI + knowledge base', sub: 'or handoff to staff' },
    ],
  },
  sportapp: {
    arch: [
      { icon: 'expo', label: 'Mobile app (Expo)', sub: 'customers' },
      { icon: 'react', label: 'Web panel (React 19)', sub: 'venues' },
      { icon: 'express', label: 'API /api/v1', sub: 'Express 5 · Zod · argon2 · JWT' },
      { icon: 'hexagon', label: '16 hexagonal modules', sub: '69 use cases · Result ok/err', tone: 'hot' },
      { icon: 'postgresql', label: 'PostgreSQL', sub: 'GiST against double booking · RLS · audit', tone: 'teal' },
    ],
  },
  'clinical-inventory-ai': {
    arch: [
      { icon: 'note', label: 'Free-text note', sub: '“out of size M gloves…”' },
      { icon: 'nextjs', label: 'Next.js 15 frontend', sub: 'per-warehouse permissions' },
      { icon: 'nestjs', label: 'NestJS backend', sub: 'roles and permissions · PostgreSQL' },
      { icon: 'fastapi', label: 'FastAPI microservice', sub: 'receives the note' },
      { icon: 'ollama', label: 'Ollama', sub: 'local 7B model', tone: 'hot' },
      { icon: 'braces', label: 'Parameters', sub: 'structured restocking', tone: 'teal' },
    ],
  },
};

/* Friends Monitor (selección de proyectos): arquitectura en el edge de Cloudflare. */
export const sideFlows: Record<Lang, Record<string, FlowStep[]>> = {
  es: {
    'friends-monitor': [
      { icon: 'phone', label: 'PWA instalable', sub: 'notificaciones push' },
      { icon: 'workers', label: 'Cloudflare Workers', sub: 'lógica en el edge y cron diario', tone: 'hot' },
      { icon: 'cloudflare', label: 'Durable Object', sub: 'WebSockets hibernantes' },
      { icon: 'cloudflare', label: 'D1 · R2', sub: '19 migraciones · imágenes', tone: 'teal' },
    ],
    'b2b-serverless': [
      { icon: 'typescript', label: 'Monorepo TypeScript', sub: 'dominio, aplicación, contratos (Zod) y adaptadores' },
      { icon: 'lambda', label: 'Lambda', sub: 'núcleo serverless', tone: 'hot' },
      { icon: 'postgresql', label: 'PostgreSQL', sub: 'fuente de verdad · RLS', tone: 'teal' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'proyecciones reconstruibles' },
    ],
  },
  en: {
    'friends-monitor': [
      { icon: 'phone', label: 'Installable PWA', sub: 'push notifications' },
      { icon: 'workers', label: 'Cloudflare Workers', sub: 'edge logic and a daily cron', tone: 'hot' },
      { icon: 'cloudflare', label: 'Durable Object', sub: 'hibernating WebSockets' },
      { icon: 'cloudflare', label: 'D1 · R2', sub: '19 migrations · images', tone: 'teal' },
    ],
    'b2b-serverless': [
      { icon: 'typescript', label: 'TypeScript monorepo', sub: 'domain, application, contracts (Zod) and adapters' },
      { icon: 'lambda', label: 'Lambda', sub: 'serverless core', tone: 'hot' },
      { icon: 'postgresql', label: 'PostgreSQL', sub: 'source of truth · RLS', tone: 'teal' },
      { icon: 'dynamodb', label: 'DynamoDB', sub: 'rebuildable projections' },
    ],
  },
};

export const flows: Record<Lang, Record<string, Flows>> = { es, en };
