import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifequest-game.vercel.app"),
  applicationName: "Life Quest",
  title: {
    default: "Life Quest — turn life into a quest",
    template: "%s · Life Quest"
  },
  description: "Turn real-life goals into quests, earn XP, build chains, beat weekly bosses and unlock personal rewards.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Life Quest",
    title: "Life Quest — turn life into a quest",
    description: "A bilingual gamified goal tracker with quests, XP, chains, weekly bosses and personal rewards."
  },
  twitter: {
    card: "summary",
    title: "Life Quest — turn life into a quest",
    description: "A bilingual gamified goal tracker with quests, XP, chains, weekly bosses and personal rewards."
  }
};

export const viewport: Viewport = {
  themeColor: "#672b45",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
