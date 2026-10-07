import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingClient from "@/components/LandingClient";

export default async function HomePage() {
  let signedIn = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    // The landing page is still useful before environment setup.
  }

  if (signedIn) redirect("/app");

  return <LandingClient />;
}
