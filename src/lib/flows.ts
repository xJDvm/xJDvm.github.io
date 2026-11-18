import type { Lang } from '../i18n';

/* Diagramas de flujo con iconos (Lucide) por caso.
   `home`: versión en lenguaje llano para la portada. `arch`: arquitectura técnica para la página del caso.
   Solo describen piezas que ya están en el texto de cada caso; sin datos ni nombres de clientes. */

export type FlowStep = { icon: string; label: string; sub?: string; tone?: 'hot' | 'teal' | 'ink' };
type Flows = { home?: FlowStep[]; arch: FlowStep[] };

const es: Record<string, Flows> = {
  'contact-center-ai': {
    home: [
      { icon: 'MessageCircle', label: 'El cliente escribe', sub: 'WhatsApp o web' },
      { icon: 'Filter', label: '¿Pregunta frecuente?', sub: 'respuesta aprobada al instante', tone: 'teal' },
      { icon: 'Bot', label: 'Asistente de IA', sub: 'ventas, recepción o soporte', tone: 'hot' },
      { icon: 'Headset', label: 'Asesor humano', sub: 'cuando hace falta' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Webhook de Respond.io' },
      { icon: 'Shield', label: 'API Gateway', sub: 'solo las IP del proveedor' },
      { icon: 'Layers', label: 'SNS → SQS', sub: 'con cola de mensajes fallidos' },
      { icon: 'Filter', label: 'Lambda normalizadora', sub: 'FAQ cerrada → DynamoDB, sin LLM', tone: 'teal' },
      { icon: 'Bot', label: 'AgentCore Runtime', sub: 'Strands · Claude Haiku 4.5 · 6 herramientas', tone: 'hot' },
      { icon: 'Send', label: 'MCP de Respond.io', sub: 'la respuesta vuelve al cliente' },
    ],
  },
  'respondio-aws': {
    home: [
      { icon: 'MessagesSquare', label: 'Chat de ventas', sub: 'mensajes, contactos, conversaciones' },
      { icon: 'Split', label: 'Se reparte por tipo', sub: 'cada proceso por su lado', tone: 'hot' },
      { icon: 'Workflow', label: 'Procesos', sub: 'avisos, cotizaciones, despachos' },
      { icon: 'Database', label: 'Base de datos', sub: 'sin perder eventos', tone: 'teal' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Webhooks de Respond.io' },
      { icon: 'Shield', label: 'API Gateway', sub: 'IP permitidas + API key' },
      { icon: 'Radio', label: 'SNS', sub: '3 tópicos · 16 suscripciones filtradas', tone: 'hot' },
      { icon: 'Layers', label: '19 colas SQS', sub: 'una por proceso' },
      { icon: 'Cpu', label: '25 Lambdas', sub: 'Python 3.12' },
      { icon: 'Database', label: 'Aurora PostgreSQL 16', sub: 'en VPC · secretos en Secrets Manager', tone: 'teal' },
    ],
  },
  'mcp-cedar-gateway': {
    home: [
      { icon: 'MessageCircle', label: 'Escribes en Google Chat', sub: '«regístrame 3 horas»' },
      { icon: 'Bot', label: 'El asistente propone', sub: 'entiende la frase en español' },
      { icon: 'ShieldCheck', label: 'Reglas estrictas', sub: '10 acciones, ninguna de borrar', tone: 'hot' },
      { icon: 'CircleCheck', label: 'Confirmas', sub: 'y se registra una sola vez', tone: 'teal' },
    ],
    arch: [
      { icon: 'MessageCircle', label: 'Google Chat' },
      { icon: 'KeyRound', label: 'Lambda receptora', sub: 'verifica JWT · deduplica' },
      { icon: 'Bot', label: 'AgentCore Runtime', sub: 'agente en Python con Strands' },
      { icon: 'ShieldCheck', label: 'AgentCore Gateway', sub: 'MCP · política Cedar default-deny', tone: 'hot' },
      { icon: 'Cpu', label: '10 Lambdas adaptadoras', sub: 'Node 22 · OpenAPI 3.1' },
      { icon: 'Clock', label: 'API de horas', sub: 'idempotencia en DynamoDB', tone: 'teal' },
    ],
  },
  clinic: {
    home: [
      { icon: 'MessageCircle', label: 'El paciente escribe', sub: 'Messenger o Instagram' },
      { icon: 'Timer', label: 'Espera 4 s', sub: 'agrupa la ráfaga de mensajes' },
      { icon: 'Stethoscope', label: 'Puerta clínica', sub: 'qué puede contestar la IA', tone: 'hot' },
      { icon: 'Bot', label: 'IA o una persona', sub: 'con traspaso al equipo', tone: 'teal' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Webhook de Meta' },
      { icon: 'KeyRound', label: 'Lambda de ingreso', sub: 'firma HMAC · 200 solo si SQS confirmó' },
      { icon: 'ListOrdered', label: 'SQS FIFO', sub: 'agrupada por paciente' },
      { icon: 'Timer', label: 'Debounce de 4 s', sub: 'idempotencia en Aurora' },
      { icon: 'Stethoscope', label: 'Responder', sub: 'puerta clínica · ¿hay un mensaje más nuevo?', tone: 'hot' },
      { icon: 'Sparkles', label: 'IA + base de conocimiento', sub: 'o traspaso a personal', tone: 'teal' },
    ],
  },
  sportapp: {
    arch: [
      { icon: 'MonitorSmartphone', label: 'App móvil y panel web', sub: 'clientes y complejos' },
      { icon: 'Shield', label: 'API /api/v1', sub: 'Express 5 · Zod · argon2 · JWT' },
      { icon: 'Hexagon', label: '16 módulos hexagonales', sub: '69 casos de uso · Result ok/err', tone: 'hot' },
      { icon: 'Database', label: 'PostgreSQL', sub: 'GiST contra doble reserva · RLS · auditoría', tone: 'teal' },
    ],
  },
  'clinical-inventory-ai': {
    arch: [
      { icon: 'FileText', label: 'Nota en texto libre', sub: '«faltan guantes M…»' },
      { icon: 'Server', label: 'Backend NestJS', sub: 'roles y permisos por almacén' },
      { icon: 'Cpu', label: 'FastAPI + Ollama', sub: 'modelo local de 7B', tone: 'hot' },
      { icon: 'Braces', label: 'Parámetros', sub: 'reabastecimiento estructurado', tone: 'teal' },
    ],
  },
};

const en: Record<string, Flows> = {
  'contact-center-ai': {
    home: [
      { icon: 'MessageCircle', label: 'The customer writes', sub: 'WhatsApp or web' },
      { icon: 'Filter', label: 'A frequent question?', sub: 'approved answer, instantly', tone: 'teal' },
      { icon: 'Bot', label: 'AI assistant', sub: 'sales, reception or support', tone: 'hot' },
      { icon: 'Headset', label: 'Human advisor', sub: 'when needed' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Respond.io webhook' },
      { icon: 'Shield', label: 'API Gateway', sub: 'only the provider’s IPs' },
      { icon: 'Layers', label: 'SNS → SQS', sub: 'with a dead-letter queue' },
      { icon: 'Filter', label: 'Normalizer Lambda', sub: 'closed FAQ → DynamoDB, no LLM', tone: 'teal' },
      { icon: 'Bot', label: 'AgentCore Runtime', sub: 'Strands · Claude Haiku 4.5 · 6 tools', tone: 'hot' },
      { icon: 'Send', label: 'Respond.io MCP', sub: 'the reply goes back to the customer' },
    ],
  },
  'respondio-aws': {
    home: [
      { icon: 'MessagesSquare', label: 'Sales chat', sub: 'messages, contacts, conversations' },
      { icon: 'Split', label: 'Split by type', sub: 'each process on its own', tone: 'hot' },
      { icon: 'Workflow', label: 'Processes', sub: 'alerts, quotes, deliveries' },
      { icon: 'Database', label: 'Database', sub: 'no events lost', tone: 'teal' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Respond.io webhooks' },
      { icon: 'Shield', label: 'API Gateway', sub: 'IP allowlist + API key' },
      { icon: 'Radio', label: 'SNS', sub: '3 topics · 16 filtered subscriptions', tone: 'hot' },
      { icon: 'Layers', label: '19 SQS queues', sub: 'one per process' },
      { icon: 'Cpu', label: '25 Lambdas', sub: 'Python 3.12' },
      { icon: 'Database', label: 'Aurora PostgreSQL 16', sub: 'in a VPC · secrets in Secrets Manager', tone: 'teal' },
    ],
  },
  'mcp-cedar-gateway': {
    home: [
      { icon: 'MessageCircle', label: 'You write in Google Chat', sub: '“log 3 hours for me”' },
      { icon: 'Bot', label: 'The assistant proposes', sub: 'it understands Spanish' },
      { icon: 'ShieldCheck', label: 'Strict rules', sub: '10 actions, none that delete', tone: 'hot' },
      { icon: 'CircleCheck', label: 'You confirm', sub: 'and it’s logged exactly once', tone: 'teal' },
    ],
    arch: [
      { icon: 'MessageCircle', label: 'Google Chat' },
      { icon: 'KeyRound', label: 'Receiver Lambda', sub: 'verifies JWT · deduplicates' },
      { icon: 'Bot', label: 'AgentCore Runtime', sub: 'Python agent with Strands' },
      { icon: 'ShieldCheck', label: 'AgentCore Gateway', sub: 'MCP · default-deny Cedar policy', tone: 'hot' },
      { icon: 'Cpu', label: '10 adapter Lambdas', sub: 'Node 22 · OpenAPI 3.1' },
      { icon: 'Clock', label: 'Time-tracking API', sub: 'idempotency in DynamoDB', tone: 'teal' },
    ],
  },
  clinic: {
    home: [
      { icon: 'MessageCircle', label: 'The patient writes', sub: 'Messenger or Instagram' },
      { icon: 'Timer', label: 'Wait 4 s', sub: 'groups the burst of messages' },
      { icon: 'Stethoscope', label: 'Clinical gate', sub: 'what the AI may answer', tone: 'hot' },
      { icon: 'Bot', label: 'AI or a person', sub: 'with handoff to the staff', tone: 'teal' },
    ],
    arch: [
      { icon: 'Webhook', label: 'Meta webhook' },
      { icon: 'KeyRound', label: 'Intake Lambda', sub: 'HMAC signature · 200 only once SQS confirmed' },
      { icon: 'ListOrdered', label: 'SQS FIFO', sub: 'grouped by patient' },
      { icon: 'Timer', label: '4 s debounce', sub: 'idempotency in Aurora' },
      { icon: 'Stethoscope', label: 'Responder', sub: 'clinical gate · is there a newer message?', tone: 'hot' },
      { icon: 'Sparkles', label: 'AI + knowledge base', sub: 'or handoff to staff', tone: 'teal' },
    ],
  },
  sportapp: {
    arch: [
      { icon: 'MonitorSmartphone', label: 'Mobile app and web panel', sub: 'customers and venues' },
      { icon: 'Shield', label: 'API /api/v1', sub: 'Express 5 · Zod · argon2 · JWT' },
      { icon: 'Hexagon', label: '16 hexagonal modules', sub: '69 use cases · Result ok/err', tone: 'hot' },
      { icon: 'Database', label: 'PostgreSQL', sub: 'GiST against double booking · RLS · audit', tone: 'teal' },
    ],
  },
  'clinical-inventory-ai': {
    arch: [
      { icon: 'FileText', label: 'Free-text note', sub: '“out of size M gloves…”' },
      { icon: 'Server', label: 'NestJS backend', sub: 'roles and per-warehouse permissions' },
      { icon: 'Cpu', label: 'FastAPI + Ollama', sub: 'local 7B model', tone: 'hot' },
      { icon: 'Braces', label: 'Parameters', sub: 'structured restocking', tone: 'teal' },
    ],
  },
};

export const flows: Record<Lang, Record<string, Flows>> = { es, en };
