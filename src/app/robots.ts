import type { MetadataRoute } from "next";

// NOTE: keep in sync with metadataBase in src/app/layout.tsx
const BASE_URL = "https://hrishimucherla.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /uses is a quiet dev page; keep crawlers off it (matches the
        // robots: { index: false } metadata in src/app/uses/page.tsx).
        disallow: ["/uses", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
