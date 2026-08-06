---
name: SEO injection architecture
description: How SEO tags are generated server-side and why base URL must not come from request headers
---

Rule: All SEO meta/JSON-LD tags are injected server-side in `server/seo.ts` (used by both dev Vite middleware and production static serving in `server/vite.ts`). Client `seo-head.tsx` only syncs tags on SPA navigation.

**Why:** A code review found the original implementation trusted `X-Forwarded-Host`/`Host` headers for canonical/OG/sitemap URLs — an attacker-controllable value enabling SEO/cache poisoning. Base URL now comes from `PUBLIC_BASE_URL` env or `REPLIT_DOMAINS`, falling back to headers only if neither exists.

**How to apply:** When adding new public routes, add them to `resolveSeoData()` and the sitemap in `registerSeoRoutes()`. Unknown content slugs should return `notFound: true` (→ HTTP 404 + noindex), never fall through to a 200 with listing-page SEO. `injectSeoTags` returns `{html, status}` — respect the status at call sites.
