import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/app";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const incomingError = url.searchParams.get("error_code") ?? url.searchParams.get("error");

  if (incomingError) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error_code", incomingError);
    const description = url.searchParams.get("error_description");
    if (description) loginUrl.searchParams.set("error_description", description);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("error_code", "auth_failed");
  return NextResponse.redirect(loginUrl);
}
