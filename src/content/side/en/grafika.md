---
lang: en
order: 1
title: "Grafika"
kind: "Academic resources site"
role: "Author"
year: "2026"
stack: ["HTML", "CSS", "JavaScript", "Markdown", "Service Worker", "Lucide"]
link: "https://github.com/xJDvm/grafika"
gallery: "grafika"
summary: "An academic guidance site for Graphic Design students: classes, guides, a glossary and typo-tolerant search, which also works offline."
tags: ["Web", "Content", "Accessibility"]
---
A static site with no dependencies and no CMS. Content lives apart from the code: a JSON catalog with 8 classes and Markdown articles that a hand-written parser turns into pages with a side index and related topics. Search indexes the catalog and articles on load, ignores accents and tolerates typos (edit distance), with `/` and Ctrl/Cmd+K shortcuts. A 40-term glossary, hash routing and a service worker that keeps the guides readable offline. The screenshots come from a local copy with the repository’s own content.
