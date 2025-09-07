import supabase from "@/lib/db";
import { unstable_cache } from "next/cache";

export type ContestSummary = {
  id: number;
  name: string;
  type: string;
  year: number;
  fall_semester: boolean;
  full_score: number;
  capacity: number | null;
  participants: number;
  awardees: number;
};

export type ListContestsParams = {
  page?: number;
  pageSize?: number;
};

export type ListContestsResponse = {
  items: ContestSummary[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

async function listContestsServerUncached(
  params: ListContestsParams
): Promise<ListContestsResponse> {
  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;

  // 计算总数与总页数
  const { count: totalRaw } = await supabase
    .from("contest")
    .select("id", { count: "exact", head: true });
  const total = typeof totalRaw === "number" && Number.isFinite(totalRaw) ? totalRaw : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const { data: contests, error } = await supabase
    .from("contest")
    .select("id,name,type,year,fall_semester,full_score,capacity,awardees")
    .order("id", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !contests?.length) {
    return { items: [], total, totalPages, page, pageSize };
  }

  const results: ContestSummary[] = contests.map((c) => {
    return {
      id: c.id as number,
      name: c.name as string,
      type: c.type as string,
      year: c.year as number,
      fall_semester: c.fall_semester as boolean,
      full_score: c.full_score as number,
      capacity: (c.capacity ?? null) as number | null,
      participants: c.capacity,
      awardees: c.awardees,
    };
  });

  return { items: results, total, totalPages, page, pageSize };
}

export const listContestsServer = unstable_cache(
  async (params: ListContestsParams) => listContestsServerUncached(params),
  ["listContestsServer"],
  { revalidate: 300 }
);


