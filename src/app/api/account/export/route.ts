import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const tables = [
  "profiles",
  "quests",
  "quest_steps",
  "weekly_bosses",
  "chains",
  "chain_checkins",
  "rewards"
] as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await supabase.from(table).select("*");
        if (error) throw error;
        return [table, data ?? []] as const;
      })
    );

    const payload = {
      product: "Life Quest",
      exported_at: new Date().toISOString(),
      account: {
        id: authData.user.id,
        email: authData.user.email ?? null,
        created_at: authData.user.created_at
      },
      data: Object.fromEntries(results)
    };

    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="life-quest-export-${stamp}.json"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Data export failed." },
      { status: 500 }
    );
  }
}
