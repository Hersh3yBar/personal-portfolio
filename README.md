# Hrishi Mucherla — Portfolio

Personal portfolio site for Hrishi Mucherla. Live at the URL in the repo's About section.

The home page walks through a life journey from Markapur, India to Hyderabad, Overland Park, St. Louis, Miami, and Dallas — rendered as a scroll-driven particle map. Beyond the map: an about section, a timeline of highlights, a skills grid, featured work, a live feed of recent GitHub repos, and a contact form.

## Stack

- **Next.js 16** with the App Router and Turbopack
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** for the design system
- **Three.js** via **React Three Fiber** + **drei** — the particle map
- **Framer Motion** — page-level motion and layout transitions
- **anime.js v4** — micro-interactions, timelines, and the scramble-text effect
- **Lenis** — smooth scroll
- **next-themes** — light/dark theming
- **Supabase** — Postgres-backed contact form storage
- **Zod** + **React Hook Form** — contact-form validation
- **canvas-confetti** — used by the Konami-code easter egg

## How the site is organized

- `/` — Hero, About, Highlights timeline, Skills, Featured Work, Recent on GitHub, Contact
- `/story` — Six chapters, one per city. A sticky React Three Fiber map highlights each city as its chapter scrolls into the reading zone.
- `/uses` — The editor, languages, frameworks, tools, and hardware that make this site (and everything else) possible.
- Custom 404, `robots.txt`, `sitemap.xml`, OG/Twitter share images, and a runtime-generated favicon.

## How project content updates

Two layers, by design:

| Layer | Source | How it updates |
| --- | --- | --- |
| **Featured Work** (rich cards) | `FEATURED` array in `src/components/Projects.tsx` | Hand-curated. Each card has status, description, stack, and links — written for the reader, not auto-generated. |
| **Recent on GitHub** (compact strip) | Live from `api.github.com/users/Hersh3yBar/repos?sort=pushed` | Auto-fetched with Incremental Static Regeneration. Re-fetches at most every 30 minutes. New public repos appear on their own; an `EXCLUDE` set in `GitHubRecent.tsx` filters out class labs and throwaways. |

## Contact form

POSTs to `/api/contact`. The handler:

1. Validates the body with Zod (`name 2–80`, `email`, `message 10–2000`).
2. Rate-limits to 3 submissions per IP per hour, in-memory.
3. Strips control characters and inserts into a `contact_messages` table in Supabase.
4. Returns a soft-fail success if Supabase env vars are missing, so local dev never breaks the form.

The Supabase table runs with row-level security and an `insert_only` policy — the anon key can write a row, but cannot read anything back. The dashboard is the only place messages are visible.

## Intentionally not on the public site

- **Phone number** — kept off; spam magnet, unnecessary surface. The resume carries it.
- **School email (`dxm1858@miami.edu`)** — kept off; personal email `mucherla.hrishi@gmail.com` is the public contact.
- **Date of birth** — only year ranges appear on the journey map.

## Easter eggs

There are eight, in rough order of discoverability:

1. **DevTools console message** — Open the console on any page.
2. **Konami code** — `↑ ↑ ↓ ↓ ← → ← → B A` triggers confetti and a dialog with a fact about the National Geographic Bee.
3. **Logo 7-click glitch** — Tap the cursive **Hrishi.M** logo seven times within ~1.5 s. Full-page color invert with a brief shake.
4. **The `/uses` page** — Tucked into the footer rather than the top nav. Contains the HTML comment `<!-- You found /uses. Nice. -->`.
5. **View-source comment** — In the `<body>` of every page: `<!-- If you're reading this, you're exactly the kind of person I want to work with. mucherla.hrishi@gmail.com -->`.
6. **Idle mode** — After 60 seconds of no mouse / keyboard / scroll / touch input, particles shift to warm gold and animate 2× faster. The document title becomes `still here? 👀`. Any activity snaps it back.
7. **HM keyboard shortcut** — Press `H` and `M` together. A giant "HM" in indigo flashes center-screen for ~0.8 s.
8. **Cursor trail** — Move the mouse faster than ~800 px/s. Saffron and indigo trail dots fade behind the cursor.
