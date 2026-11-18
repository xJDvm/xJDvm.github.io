/* Registro de iconos de arquitectura para los diagramas.
   - aws: AWS Architecture Icons (paquete npm `aws-icons`, MIT; los iconos son de AWS y se usan según sus condiciones para diagramas).
   - si: Simple Icons (paquete npm `simple-icons`, CC0; las marcas pertenecen a sus dueños).
   - lucide: Lucide (`lucide-static`, ISC) para conceptos sin marca (webhook, temporizador, regla…).
   Todo se lee en el build y se incrusta como SVG: no hay peticiones a CDN. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as simple from 'simple-icons';
import * as lucide from 'lucide-static';

type Src = { kind: 'aws'; file: string; name: string } | { kind: 'si'; slug: string; name: string } | { kind: 'lucide'; icon: string; name: string };

export const CLOUD_ICONS = {
  apigw: { kind: 'aws', file: 'AmazonAPIGateway', name: 'Amazon API Gateway' },
  lambda: { kind: 'aws', file: 'AWSLambda', name: 'AWS Lambda' },
  sqs: { kind: 'aws', file: 'AmazonSimpleQueueService', name: 'Amazon SQS' },
  sns: { kind: 'aws', file: 'AmazonSimpleNotificationService', name: 'Amazon SNS' },
  aurora: { kind: 'aws', file: 'AmazonAurora', name: 'Amazon Aurora' },
  dynamodb: { kind: 'aws', file: 'AmazonDynamoDB', name: 'Amazon DynamoDB' },
  bedrock: { kind: 'aws', file: 'AmazonBedrock', name: 'Amazon Bedrock' },
  agentcore: { kind: 'aws', file: 'AmazonBedrockAgentCore', name: 'Amazon Bedrock AgentCore' },
  secrets: { kind: 'aws', file: 'AWSSecretsManager', name: 'AWS Secrets Manager' },
  eventbridge: { kind: 'aws', file: 'AmazonEventBridge', name: 'Amazon EventBridge' },
  s3: { kind: 'aws', file: 'AmazonSimpleStorageService', name: 'Amazon S3' },
  ses: { kind: 'aws', file: 'AmazonSimpleEmailService', name: 'Amazon SES' },
  ecs: { kind: 'aws', file: 'AmazonElasticContainerService', name: 'Amazon ECS' },
  cloudformation: { kind: 'aws', file: 'AWSCloudFormation', name: 'AWS CloudFormation' },
  workers: { kind: 'si', slug: 'Cloudflareworkers', name: 'Cloudflare Workers' },
  cloudflare: { kind: 'si', slug: 'Cloudflare', name: 'Cloudflare' },
  postgresql: { kind: 'si', slug: 'Postgresql', name: 'PostgreSQL' },
  python: { kind: 'si', slug: 'Python', name: 'Python' },
  typescript: { kind: 'si', slug: 'Typescript', name: 'TypeScript' },
  node: { kind: 'si', slug: 'Nodedotjs', name: 'Node.js' },
  express: { kind: 'si', slug: 'Express', name: 'Express' },
  nestjs: { kind: 'si', slug: 'Nestjs', name: 'NestJS' },
  fastapi: { kind: 'si', slug: 'Fastapi', name: 'FastAPI' },
  ollama: { kind: 'si', slug: 'Ollama', name: 'Ollama' },
  react: { kind: 'si', slug: 'React', name: 'React' },
  nextjs: { kind: 'si', slug: 'Nextdotjs', name: 'Next.js' },
  expo: { kind: 'si', slug: 'Expo', name: 'Expo' },
  n8n: { kind: 'si', slug: 'N8n', name: 'n8n' },
  claude: { kind: 'si', slug: 'Claude', name: 'Claude' },
  whatsapp: { kind: 'si', slug: 'Whatsapp', name: 'WhatsApp' },
  messenger: { kind: 'si', slug: 'Messenger', name: 'Messenger' },
  instagram: { kind: 'si', slug: 'Instagram', name: 'Instagram' },
  googlechat: { kind: 'si', slug: 'Googlechat', name: 'Google Chat' },
  webhook: { kind: 'lucide', icon: 'Webhook', name: 'Webhook' },
  chat: { kind: 'lucide', icon: 'MessagesSquare', name: 'Chat' },
  shield: { kind: 'lucide', icon: 'ShieldCheck', name: 'Regla' },
  timer: { kind: 'lucide', icon: 'Timer', name: 'Temporizador' },
  gate: { kind: 'lucide', icon: 'Stethoscope', name: 'Puerta clínica' },
  note: { kind: 'lucide', icon: 'FileText', name: 'Nota' },
  braces: { kind: 'lucide', icon: 'Braces', name: 'JSON' },
  hexagon: { kind: 'lucide', icon: 'Hexagon', name: 'Dominio' },
  phone: { kind: 'lucide', icon: 'MonitorSmartphone', name: 'Apps' },
  person: { kind: 'lucide', icon: 'Headset', name: 'Persona' },
  check: { kind: 'lucide', icon: 'CircleCheck', name: 'Confirmación' },
  filter: { kind: 'lucide', icon: 'Filter', name: 'Filtro' },
  split: { kind: 'lucide', icon: 'Split', name: 'Reparto' },
  workflow: { kind: 'lucide', icon: 'Workflow', name: 'Procesos' },
  bot: { kind: 'lucide', icon: 'Bot', name: 'Asistente' },
  clock: { kind: 'lucide', icon: 'Clock', name: 'Horas' },
  key: { kind: 'lucide', icon: 'KeyRound', name: 'Verificación' },
} satisfies Record<string, Src>;

export type CloudIconName = keyof typeof CLOUD_ICONS;

const cache = new Map<string, string>();
const AWS_DIR = join(process.cwd(), 'node_modules', 'aws-icons', 'icons', 'architecture-service');

/** Contenido interno (sin <svg> exterior) y viewBox del icono, listo para incrustar. */
export function iconSvg(name: CloudIconName, size: number): string {
  const key = `${name}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const src = CLOUD_ICONS[name] as Src;
  let out: string;
  if (src.kind === 'aws') {
    const raw = readFileSync(join(AWS_DIR, `${src.file}.svg`), 'utf8');
    out = raw
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace('<svg', `<svg class="ci ci-aws" width="${size}" height="${size}" focusable="false" aria-hidden="true"`);
  } else if (src.kind === 'si') {
    const icon = (simple as unknown as Record<string, { path: string; hex: string }>)[`si${src.slug}`];
    if (!icon) throw new Error(`Simple Icons: falta ${src.slug}`);
    out = `<svg class="ci ci-brand" style="--brand:#${icon.hex}" viewBox="0 0 24 24" width="${size}" height="${size}" focusable="false" aria-hidden="true"><path d="${icon.path}"/></svg>`;
  } else {
    const raw = (lucide as unknown as Record<string, string>)[src.icon];
    if (!raw) throw new Error(`Lucide: falta ${src.icon}`);
    out = raw
      .replace(/\sclass="[^"]*"/, '')
      .replace(/\swidth="\d+"/, ` width="${size}"`)
      .replace(/\sheight="\d+"/, ` height="${size}"`)
      .replace('<svg', '<svg class="ci ci-line" focusable="false" aria-hidden="true"')
      .replace(/\n\s*/g, ' ');
  }
  cache.set(key, out);
  return out;
}

export const iconKind = (name: CloudIconName) => (CLOUD_ICONS[name] as Src).kind;
