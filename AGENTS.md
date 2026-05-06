<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Phalanx Monorepo Vercel Deployment Guide

Based on the DR.O tenant deployment retrospective, here is the optimal, fail-safe deployment strategy:

1. **Local Pre-flight Check (Crucial)**
   - Do NOT rely entirely on the editor's syntax highlighting.
   - Run `npx tsc --noEmit` locally in the target project folder before committing.
   - If modifying Next.js routing, layouts, or `src/proxy.ts` (middleware), run `npm run build` locally to catch unclosed JSX tags or Next.js build errors before pushing.

2. **Middleware Routing (Common Pitfall)**
   - When adding a new tenant (e.g., `dro`), you MUST add the tenant slug to the `KNOWN_TENANTS` array in `src/proxy.ts` (or equivalent middleware file). 
   - Failure to do this will cause the middleware to interpret the path as a route for the default tenant, resulting in a 404 error on production even if the build succeeds.

3. **Workspace Path Awareness**
   - Phalanx has both OS (`phalanx-os`) and Media (`phalanx-media`).
   - Ensure you are working in the correct directory. When using git CLI, use `-C "c:\Users\User\phalanx-media"` if the terminal is rooted in OS.

4. **Git Push for Vercel Auto-deploy**
   - The most reliable deployment method is triggering Vercel via Git push to the `master` branch.
   - Run:
     ```bash
     git add -A
     git commit -m "feat/fix: descriptive message"
     git push origin master
     ```
   - Monitor the deployment progress at Vercel Dashboard -> Deployments.

5. **Post-Deployment Verification**
   - Check the production URLs.
   - Verify specific sub-paths (e.g., `/[tenant]/moments`, `/[tenant]/admin`).
   - If a 404 occurs, check `proxy.ts` first. If a 500 occurs, check Vercel runtime logs.
