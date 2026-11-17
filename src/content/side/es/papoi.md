---
lang: es
order: 1
title: "papoi-monitor"
kind: "App web en tiempo real"
role: "Arquitecto y desarrollador"
year: "2026"
stack: ["Cloudflare Workers", "TypeScript", "D1", "Durable Objects", "R2", "WebSockets"]
summary: "App colaborativa en tiempo real para un grupo pequeño, instalable en el móvil y con notificaciones, pensada para funcionar dentro de un plan gratuito."
tags: ["Tiempo real", "Web", "Móvil"]
---
App colaborativa en tiempo real para un grupo privado, desplegada en el edge de Cloudflare (workers.dev). Usa D1 con 19 migraciones, R2 para imágenes, un Durable Object con WebSockets hibernantes y un cron diario. El frontend es JS vanilla, instalable como PWA y con notificaciones push.
