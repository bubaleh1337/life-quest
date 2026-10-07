import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "QuestFrame",
  title: {
    default: "QuestFrame",
    template: "%s · QuestFrame"
  },
  description: "Turn real-life goals into quests and earn XP for the steps that actually move you forward.",
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
