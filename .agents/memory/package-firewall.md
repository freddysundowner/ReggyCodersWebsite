---
name: Package firewall workaround
description: Why package.json has an npm override for shell-quote
---

Rule: `package.json` contains `"overrides": { "shell-quote": "^1.10.0" }`. Do not remove it.

**Why:** Replit's package firewall blocks shell-quote 1.8.x (security policy). It is a transitive dep of `drizzle-kit` → `gel`. Without the override, `npm install` fails with 403.

**How to apply:** If installs start failing with a 403 on some package, find the transitive parent via package-lock.json and add an override to a newer, unblocked version rather than bypassing the firewall.
