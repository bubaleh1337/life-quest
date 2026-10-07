import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Life Quest",
  title: {
    default: "Life Quest",
    template: "%s · Life Quest"
  },
  description: "Life Quest turns real-life goals into quests with XP, chains, weekly bosses and rewarding progress.",
  manifest: "/manifest.webmanifest"
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
