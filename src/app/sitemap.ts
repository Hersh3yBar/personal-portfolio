import type { MetadataRoute } from "next";

// NOTE: keep in sync with metadataBase in src/app/layout.tsx
const BASE_URL = "https://hrishimucherla.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/story`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /uses is intentionally noindex (see metadata in src/app/uses/page.tsx)
    // and is omitted from the sitemap.
  ];
}
