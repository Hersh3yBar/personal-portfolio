// Server component — auto-fetches public GitHub repos with ISR.
// Re-runs every 30 minutes; Vercel rebuilds on push (or set up a Deploy Hook
// + GitHub webhook for instant rebuild — see README).

const GITHUB_USER = "Hersh3yBar";

// Repos to hide from the auto-feed (e.g. throwaway class labs).
// Easy to edit; everything else surfaces automatically.
const EXCLUDE = new Set<string>([
  "CSC322-GitLab",
]);

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  "Jupyter Notebook": "#DA5B0B",
};

type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.max(1, Math.round((now - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.round(mo / 12);
  return `${yr}y ago`;
}

async function fetchRepos(): Promise<Repo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=20`,
      {
        headers: { Accept: "application/vnd.github+json" },
        // ISR: re-fetch at most every 30 minutes
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return null;
    const repos = (await res.json()) as Repo[];
    return repos
      .filter(
        (r) => !r.fork && !r.archived && !r.private && !EXCLUDE.has(r.name)
      )
      .slice(0, 6);
  } catch {
    return null;
  }
}

export async function GitHubRecent() {
  const repos = await fetchRepos();
  if (!repos || repos.length === 0) return null;

  return (
    <section
      className="relative mx-auto max-w-6xl px-6 pb-24 lg:px-12"
      aria-labelledby="github-recent-heading"
    >
      <div className="mb-6 flex flex-col gap-1.5 md:flex-row md:items-baseline md:justify-between">
        <div className="flex items-baseline gap-3">
          <h3
            id="github-recent-heading"
            className="text-sm font-semibold uppercase"
            style={{
              color: "var(--text-secondary)",
              letterSpacing: "0.18em",
              fontFamily: "var(--font-body)",
            }}
          >
            Recent on GitHub
          </h3>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] uppercase"
            style={{ color: "var(--text-muted)", letterSpacing: "0.14em" }}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
            Auto-updates when I push
          </span>
        </div>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((r) => (
          <li key={r.id}>
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex h-full flex-col gap-2 rounded-xl p-4 transition-colors hover:border-[color:var(--accent)]/40"
              data-cursor-hover
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.69-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  <span
                    className="truncate text-[13px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.name}
                  </span>
                </div>
                <span
                  className="shrink-0 text-[10px] tabular-nums"
                  style={{ color: "var(--text-muted)" }}
                >
                  {relativeTime(r.pushed_at)}
                </span>
              </div>
              {r.description && (
                <p
                  className="line-clamp-2 text-[12px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {r.description}
                </p>
              )}
              <div
                className="mt-auto flex items-center gap-3 pt-1 text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        background:
                          LANGUAGE_COLORS[r.language] ?? "#a78bfa",
                      }}
                    />
                    {r.language}
                  </span>
                )}
                {r.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 tabular-nums">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {r.stargazers_count}
                  </span>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
