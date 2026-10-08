import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lifequest-game.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/demo`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 }
  ];
}
