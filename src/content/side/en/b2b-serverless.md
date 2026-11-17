---
lang: en
order: 2
title: "B2B purchasing platform"
kind: "Serverless on AWS"
role: "Author"
year: "2026"
stack: ["AWS Lambda", "TypeScript", "pnpm", "Zod", "Drizzle", "PostgreSQL", "AWS CDK"]
---
A B2B purchasing platform for clinics, with a serverless core on AWS Lambda. It’s a TypeScript monorepo with hexagonal architecture (domain, application, contracts and adapters), exchange rates and events, plus 45 screen mockups. PostgreSQL is the source of truth (transactions, row locks, RLS and exact money) and DynamoDB only holds rebuildable projections: if it fails, accelerated reads degrade, not correctness.
