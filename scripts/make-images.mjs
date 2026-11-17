// Genera public/og.png y public/apple-touch-icon.png a partir de SVG. Uso: node scripts/make-images.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const out = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0B0B0F"/>
<g fill="none" stroke="#ECECF1" stroke-opacity=".08" stroke-width="2"><path d="M1200 0L0 630M1200 0L300 630M1200 0L600 630M1200 0L900 630M1200 0L0 315M960 0A240 240 0 0 0 1200 240M720 0A480 480 0 0 0 1200 480M480 0A720 720 0 0 0 1200 720"/></g>
<rect x="0" y="560" width="1200" height="70" fill="#9B1030"/>
<text x="64" y="606" font-family="Menlo, monospace" font-size="26" font-weight="700" fill="#FFFFFF">TypeScript · Python · AWS · AgentCore · MCP</text>
<circle cx="96" cy="112" r="30" fill="#E0202F" stroke="#ECECF1" stroke-width="6"/>
<text x="146" y="126" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#ECECF1">Juan Diego Valdés M.</text>
<text x="64" y="270" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#ECECF1" letter-spacing="-3">Full-stack developer</text>
<g transform="rotate(-2 300 380)"><rect x="72" y="326" width="290" height="104" rx="14" fill="#19C2BE"/><rect x="64" y="318" width="290" height="104" rx="14" fill="#E0202F" stroke="#ECECF1" stroke-width="6"/>
<text x="92" y="396" font-family="Helvetica, Arial, sans-serif" font-size="82" font-weight="800" fill="#FFFFFF">IA · AI</text></g>
<g transform="rotate(1.5 600 380)"><rect x="390" y="326" width="290" height="104" rx="14" fill="#E0202F"/><rect x="382" y="318" width="290" height="104" rx="14" fill="#19C2BE" stroke="#ECECF1" stroke-width="6"/>
<text x="410" y="396" font-family="Helvetica, Arial, sans-serif" font-size="82" font-weight="800" fill="#0B0B0F">Cloud</text></g>
<rect x="774" y="310" width="372" height="210" rx="18" fill="#E0202F"/>
<rect x="764" y="300" width="372" height="210" rx="18" fill="#15151C" stroke="#ECECF1" stroke-width="6"/>
<rect x="764" y="300" width="372" height="52" rx="18" fill="#9B1030" stroke="#ECECF1" stroke-width="6"/>
<text x="790" y="336" font-family="Menlo, monospace" font-size="22" font-weight="700" fill="#FFFFFF">GET /disponibilidad</text>
<text x="790" y="400" font-family="Menlo, monospace" font-size="24" fill="#19C2BE">"freelance": true,</text>
<text x="790" y="440" font-family="Menlo, monospace" font-size="24" fill="#19C2BE">"full_stack": true</text>
<text x="790" y="484" font-family="Menlo, monospace" font-size="20" fill="#8E8E9A">200 OK</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(out('og.png'));

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0B0B0F"/><circle cx="32" cy="32" r="20" fill="#E0202F" stroke="#ECECF1" stroke-width="5"/></svg>`;
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
console.log('ok');
