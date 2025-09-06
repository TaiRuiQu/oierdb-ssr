import supabase from "@/lib/db";
import type { SearchResult } from "@/lib/search-types";
import { unstable_cache } from "next/cache";

export type ListOiersParams = {
  page?: number;
  pageSize?: number;
  province?: string | undefined;
};

async function listOiersServerUncached(
  params: ListOiersParams
): Promise<SearchResult[]> {
  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;

  const province = (params.province ?? "").trim();
  const recordSelect =
    province && province !== "all"
      ? `record:record!inner(id,province,contest:contest(year,fall_semester))`
      : `record:record(id,province,contest:contest(year,fall_semester))`;

  let query = supabase
    .from("oier")
    .select(
      `*,
       ${recordSelect}`
    )
    .order("oierdb_score", { ascending: false, nullsFirst: false })
    .order("ccf_level", { ascending: false, nullsFirst: false })
    .order("uid", { ascending: true })
    .range(offset, offset + pageSize - 1);

  // 省份筛选：当存在 province 且非 "all" 时基于 record.province 过滤
  if (province && province !== "all") {
    query = query.eq("province", province);
  }

  query = query
    .limit(1, { foreignTable: "record" });

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as unknown as SearchResult[];
}

export const listOiersServer = unstable_cache(
  async (params: ListOiersParams) => listOiersServerUncached(params),
  ["listOiersServer"],
  { revalidate: 300 }
);
