import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginClient from "@/components/LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Life Quest" },
  robots: {
    index: false,
    follow: false
  }
};

export default async function LoginPage() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect("/app");
  } catch {
    // LoginClient will show a clear configuration message if env vars are missing.
  }

  return <LoginClient />;
}
