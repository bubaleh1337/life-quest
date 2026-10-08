import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/demo", "/login", "/privacy"],
      disallow: ["/app", "/api/"]
    },
    sitemap: "https://lifequest-game.vercel.app/sitemap.xml"
  };
}
