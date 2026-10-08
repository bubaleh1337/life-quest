"use client";

import { createBrowserClient } from "@supabase/ssr";

type CreateClientOptions = {
  allowMissing?: boolean;
};

export function createClient(options: CreateClientOptions = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (options.allowMissing) {
      // Demo Mode never performs Supabase requests. The fallback only lets the
      // shared dashboard component render when no project env is configured.
      return createBrowserClient("http://127.0.0.1:54321", "demo-publishable-key");
    }
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(url, key);
}
