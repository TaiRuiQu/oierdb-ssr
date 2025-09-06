import supabase from "@/lib/db";
import type { SearchParams, SearchResult } from "@/lib/search-types";
import { unstable_cache } from "next/cache";

async function searchServerUncached(
  params: SearchParams
): Promise<SearchResult[]> {
  const q = (params.query ?? "").trim();
  if (!q) return [];

  const like = `%${q}%`;

  let query = supabase
    .from("oier")
    .select(
      `*,
       record:record(id,province,contest:contest(year,fall_semester))`
    )
    .or(`name.ilike.${like},initials.ilike.${like}`)
    .order("oierdb_score", { ascending: false, nullsFirst: false })
    .order("ccf_level", { ascending: false, nullsFirst: false })
    .order("uid", { ascending: true })
    .limit(50);

  query = query
    .order("id", { referencedTable: "record", ascending: false })
    .limit(1, { referencedTable: "record" });

  const { data, error } = await query;
  if (error) {
    return [];
  }

  return (data ?? []) as unknown as SearchResult[];
}

export const searchServer = unstable_cache(
  async (params: SearchParams) => searchServerUncached(params),
  ["searchServer"],
  { revalidate: 300 }
);


