import supabase from "@/lib/db";
import { unstable_cache } from "next/cache";

export type SchoolSummary = {
  id: number;
  name: string;
  province: string;
  city: string | null;
  score: number;
  rank: number;
};

export type ListSchoolsParams = {
  page?: number;
  pageSize?: number;
  province?: string;
};

export type ListSchoolsResponse = {
  items: SchoolSummary[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

async function listSchoolsServerUncached(
  params: ListSchoolsParams
): Promise<ListSchoolsResponse> {
  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;
  const province = (params.province ?? "all").trim();

  let countQuery = supabase
    .from("school")
    .select("id", { count: "exact", head: true });
  if (province && province !== "all") {
    countQuery = countQuery.eq("province", province);
  }
  const { count: totalRaw } = await countQuery;
  const total = typeof totalRaw === "number" && Number.isFinite(totalRaw) ? totalRaw : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  let dataQuery = supabase
    .from("school")
    .select("id,name,province,city,score")
    .order("score", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .range(offset, offset + pageSize - 1);
  if (province && province !== "all") {
    dataQuery = dataQuery.eq("province", province);
  }
  const { data, error } = await dataQuery;

  if (error || !data?.length) {
    return { items: [], total, totalPages, page, pageSize };
  }

  const items: SchoolSummary[] = data.map((s, idx) => ({
    id: s.id as number,
    name: s.name as string,
    province: s.province as unknown as string,
    city: (s.city ?? null) as string | null,
    score: (s.score as number) ?? 0,
    // rank 是全局排名，应基于当前页的起始位置计算
    rank: offset + idx + 1,
  }));

  return { items, total, totalPages, page, pageSize };
}

export const listSchoolsServer = unstable_cache(
  async (params: ListSchoolsParams) => listSchoolsServerUncached(params),
  ["listSchoolsServer"],
  { revalidate: 300 }
);


