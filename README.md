# Hrishi Mucherla — Portfolio

A personal portfolio website built with Next.js 16, React Three Fiber, Framer Motion, animejs v4, and Supabase. Tells my life journey from Markapur, India to Hyderabad, Overland Park, St. Louis, the University of Miami, and now Dallas — through scroll-driven particle animation.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Three.js** via **React Three Fiber** + **drei** — particle map
- **Framer Motion** — page and component motion
- **animejs v4** — micro-interactions, timeline, scramble text
- **Lenis** — smooth scroll
- **Supabase** — contact form storage
- **Zod** + **React Hook Form** + **@hookform/resolvers** — form validation
- **next-themes** — theme switching
- **canvas-confetti** — Konami easter egg

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

The contact form will work locally without Supabase configured — it logs a warning and returns success — so you can develop UI without secrets.

## Post-deploy TODO

| Where | What |
| --- | --- |
| `src/app/layout.tsx` | Update `metadataBase` from `https://hrishimucherla.vercel.app` to the real production URL once Vercel assigns it (or after a custom domain is attached) |
| `src/app/sitemap.ts` & `src/app/robots.ts` | Same — they reference `BASE_URL` at the top; update alongside `metadataBase` |

### Intentionally NOT on the public site

- **Phone number** — kept off the public site (spam magnet and unnecessary surface). It's on your resume, which you share privately with recruiters.
- **School email (`dxm1858@miami.edu`)** — kept off; personal email `mucherla.hrishi@gmail.com` is the public contact. The resume carries both.
- **Date of birth** — the previous "Born December 1, 2004" label on the particle map was removed; year ranges only.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com/).
2. Open SQL Editor → New query → run:

   ```sql
   CREATE TABLE contact_messages (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     name text NOT NULL,
     email text NOT NULL,
     message text NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "insert_only" ON contact_messages FOR INSERT WITH CHECK (true);
   ```

3. Go to **Settings → API**. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste both into `.env.local`.

## How project content updates

Two layers, by design:

| Layer | Source | How it updates |
| --- | --- | --- |
| **Featured Work** (rich cards) | Hand-curated in `src/components/Projects.tsx` (`FEATURED` array) | You edit the array. Each card has a status, description, stack, and links — written for the recruiter, not auto-generated. |
| **Recent on GitHub** (compact strip) | Live from `api.github.com/users/Hersh3yBar/repos?sort=pushed` | Auto-fetched at build time with Incremental Static Regeneration (ISR). Re-fetches at most every **30 minutes**. New public repos appear on their own. |

### Exclude a public repo from the auto-feed

Some public repos shouldn't show up (e.g. class labs, throwaway forks). Edit the `EXCLUDE` set near the top of `src/components/GitHubRecent.tsx`:

```ts
const EXCLUDE = new Set<string>([
  "CSC322-GitLab",
  "another-throwaway-repo",
]);
```

### Instant rebuild on every GitHub push (optional)

ISR's 30-minute window is fine for most cases. If you want **instant** updates whenever you push to any of your repos:

1. In Vercel → your portfolio project → **Settings → Git → Deploy Hooks** → create a hook named `github-push`, branch `main`. Copy the URL.
2. In each GitHub repo whose pushes should trigger a rebuild (e.g. `FrontEndStockPrediction`, future public projects) → **Settings → Webhooks → Add webhook** → paste the Deploy Hook URL → content type `application/json` → event `Just the push event`.
3. Now every push to those repos triggers a fresh build of the portfolio with up-to-date GitHub data.

For the portfolio repo itself, Vercel auto-deploys on push by default once it's connected — no webhook needed.

## Deploy to Vercel

1. Push to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. `vercel.json` ships strict security headers; no extra config required.

## Custom domain

1. In Vercel → your project → **Settings → Domains** → Add domain.
2. Update DNS at your registrar following Vercel's instructions (a CNAME for subdomains, A records for apex).
3. After verification, update `metadataBase` in `src/app/layout.tsx` to match.

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint
```

---

<details>
<summary>Private notes (don't publish): all 8 easter eggs and how to trigger them</summary>

1. **Console message** — Open DevTools console on any page.
2. **Konami code** — `↑ ↑ ↓ ↓ ← → ← → B A` triggers confetti + a dialog with a fact about the National Geographic Bee.
3. **Navbar logo 7-click glitch** — Click the "Hrishi.M" cursive logo in the navbar 7 times within ~1.5s. Full-page color invert + shake.
4. **The `/uses` page** — Tucked away in the footer (not in the top nav). Lists the actual stack and setup. Includes an HTML comment: `<!-- You found /uses. Nice. -->`.
5. **View-source comment** — In the `<body>` of every page: `<!-- If you're reading this, you're exactly the kind of person I want to work with. mucherla.hrishi@gmail.com -->`.
6. **Idle mode** — After 60 seconds of no mouse/keyboard/scroll/touch input: particles shift to warm gold and animate 2× faster. `document.title` becomes `"still here? 👀"`. Any activity snaps it back.
7. **HM keyboard shortcut** — Press `H` and `M` together. A giant "HM" in indigo flashes center-screen for 0.8 s.
8. **Cursor trail** — Move the mouse faster than ~800 px/s. Saffron and indigo trail dots fade behind the cursor.
</details>
