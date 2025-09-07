import supabase from "@/lib/db";
import type { SearchParams, SearchResult } from "@/lib/search-types";
import { unstable_cache } from "next/cache";

async function searchServerUncached(
  params: SearchParams
): Promise<SearchResult[]> {
  const q = (params.query ?? "").trim();
  const gender = (params.gender ?? "all");
  const enrollMiddle = params.enroll_middle;
  const school = params.school;
  const province = (params.province ?? "all");
  const grade = (params.grade ?? "all");

  const pageSize =
    Number.isFinite(params.pageSize) && (params.pageSize as number) > 0
      ? (params.pageSize as number)
      : 50;
  const page =
    Number.isFinite(params.page) && (params.page as number) > 0
      ? (params.page as number)
      : 1;
  const offset = (page - 1) * pageSize;

  // 如果按学校名称过滤，则先解析为学校 ID 列表
  let schoolIdsForFilter: number[] | null = null;
  if (typeof school === "string" && school.trim()) {
    const maybeId = Number.parseInt(school.trim(), 10);
    if (Number.isFinite(maybeId)) {
      schoolIdsForFilter = [maybeId as number];
    } else {
      const like = `%${school.trim()}%`;
      const { data: schools } = await supabase
        .from("school")
        .select("id")
        .ilike("name", like)
        .limit(50);
      schoolIdsForFilter = (schools ?? []).map((s: { id: number }) => s.id);
    }
  } else if (typeof school === "number" && Number.isFinite(school)) {
    schoolIdsForFilter = [school as number];
  }

  let query = supabase
    .from("oier")
    .select(
      `*,
       record:record(id,province,contest:contest(year,fall_semester))`
    )
    .order("oierdb_score", { ascending: false, nullsFirst: false })
    .order("ccf_level", { ascending: false, nullsFirst: false })
    .order("uid", { ascending: true })
    .range(offset, offset + pageSize - 1);

  // 名称/姓名简写模糊匹配
  if (q) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},initials.ilike.${like}`);
  }

  // 性别
  if (gender && gender !== "all") {
    query = query.eq("gender", gender as string);
  }

  // 入学年份（进入中学）
  if (typeof enrollMiddle === "number" && Number.isFinite(enrollMiddle)) {
    query = query.eq("enroll_middle", enrollMiddle);
  }

  // 学校：通过 oier.schools 数组包含任一 schoolId 过滤
  if (schoolIdsForFilter && schoolIdsForFilter.length > 0) {
    // 若有多 ID，使用 any-of 方式：多次 or contains
    const ors = schoolIdsForFilter
      .slice(0, 10) // 防止条件过多
      .map((id) => `schools.cs.{${id}}`)
      .join(",");
    query = query.or(ors);
  }

  // 省份
  if (province && province !== "all") {
    query = query.eq("province", province as string);
  }

  // 年级（按当前学年起始年推导 enroll_middle 区间）
  if (grade && grade !== "all") {
    const now = new Date();
    const month = now.getMonth() + 1; // 1..12
    const academicYearStart = now.getFullYear() - (month < 9 ? 1 : 0);
    switch (grade as string) {
      case "初一":
        query = query.gte("enroll_middle", academicYearStart);
        break;
      case "初二":
        query = query.eq("enroll_middle", academicYearStart - 1);
        break;
      case "初三":
        query = query.eq("enroll_middle", academicYearStart - 2);
        break;
      case "高一":
        query = query.eq("enroll_middle", academicYearStart - 3);
        break;
      case "高二":
        query = query.eq("enroll_middle", academicYearStart - 4);
        break;
      case "高三":
        query = query.eq("enroll_middle", academicYearStart - 5);
        break;
      case "高中毕业":
        query = query.lte("enroll_middle", academicYearStart - 6);
        break;
    }
  }

  // 限制关联记录数量与排序
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


