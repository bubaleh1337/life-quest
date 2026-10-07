import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/components/Dashboard";

export const metadata = { title: { absolute: "QuestFrame" } };

export default async function AppPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/login");

  return <Dashboard userId={data.user.id} email={data.user.email ?? ""} />;
}
