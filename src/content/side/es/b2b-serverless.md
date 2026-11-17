---
lang: es
order: 2
title: "Plataforma B2B de compras"
kind: "Serverless en AWS"
role: "Autor"
year: "2026"
stack: ["AWS Lambda", "TypeScript", "pnpm", "Zod", "Drizzle", "PostgreSQL", "AWS CDK"]
---
Plataforma B2B de compras para clínicas, con núcleo serverless en AWS Lambda. Es un monorepo en TypeScript con arquitectura hexagonal (dominio, aplicación, contratos y adaptadores), tasas de cambio y eventos, con 45 maquetas de pantalla. PostgreSQL es la fuente de verdad (transacciones, bloqueos de fila, RLS y dinero exacto) y DynamoDB solo guarda proyecciones reconstruibles: si falla, se degradan lecturas aceleradas, no la corrección.
