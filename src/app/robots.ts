import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/demo", "/privacy"],
      disallow: ["/app", "/api/", "/login"]
    },
    sitemap: "https://lifequest-game.vercel.app/sitemap.xml"
  };
}
