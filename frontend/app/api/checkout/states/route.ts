import { NextResponse } from "next/server";
import { getCountryStates } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

/** States/provinces for a country (ISO alpha-2). Empty array = no state field. */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("country") ?? "";
  if (!/^[A-Za-z]{2}$/.test(code)) return NextResponse.json({ states: [] });
  const states = await getCountryStates(code);
  return NextResponse.json({ states }, { headers: { "cache-control": "public, max-age=86400" } });
}
