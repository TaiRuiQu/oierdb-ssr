import { z } from "zod";
import supabase from "@/lib/db";

export type SearchResult = {
  id: number;
  name: string;
  province: string;
  grade: string;
  score: number;
  ccf: number;
};

export type SearchParams = {
  query?: string;
};

export function computeGradeText(
  enrollMiddle: number | null,
  now: Date = new Date()
): string {
  if (!enrollMiddle || !Number.isFinite(enrollMiddle)) return "未知";

  const thisMonth = now.getMonth() + 1; // 1..12
  const academicYearStart = now.getFullYear() - (thisMonth < 9 ? 1 : 0);
  const highSchoolEntryYear = enrollMiddle + 3;
  const highDelta = academicYearStart - highSchoolEntryYear;

  if (highDelta < 0) {
    const middleDelta = academicYearStart - enrollMiddle;
    if (middleDelta <= 0) return "初一";
    if (middleDelta === 1) return "初二";
    if (middleDelta === 2) return "初三";
    return "初中";
  }
  if (highDelta === 0) return "高一";
  if (highDelta === 1) return "高二";
  if (highDelta === 2) return "高三";

  const yearsSinceGraduate = highDelta - 2;
  return yearsSinceGraduate <= 0 ? "高中毕业" : `高中毕业 ${yearsSinceGraduate} 年`;
}

const RowSchema = z.object({
  uid: z.union([z.number(), z.string()]),
  name: z.string(),
  enroll_middle: z.union([z.number(), z.null()]),
  oierdb_score: z.union([z.number(), z.string(), z.null()]),
  ccf_level: z.union([z.number(), z.null()]),
  record: z
    .array(
      z.object({
        province: z.union([z.string(), z.null()]),
        id: z.number(),
        contest: z
          .object({
            year: z.number(),
            fall_semester: z.boolean(),
          })
          .optional(),
      })
    )
    .optional(),
});

export async function searchServer(
  params: SearchParams
): Promise<SearchResult[]> {
  const q = (params.query ?? "").trim();
  if (!q) return [];

  const like = `%${q}%`;

  // 嵌套选择 record 并在子表上按 id 倒序，仅取最新一条，近似于“最近省份”
  let query = supabase
    .from("oier")
    .select(
      `uid,name,enroll_middle,oierdb_score,ccf_level,
       record:record(id,province,contest:contest(year,fall_semester))`
    )
    .or(`name.ilike.${like},initials.ilike.${like}`)
    .order("oierdb_score", { ascending: false, nullsFirst: false })
    .order("ccf_level", { ascending: false, nullsFirst: false })
    .order("uid", { ascending: true })
    .limit(50);

  // 针对子表 record 仅返回 1 条，并按 id 倒序取“最近”
  query = query
    .order("id", { referencedTable: "record", ascending: false })
    .limit(1, { referencedTable: "record" });

  const { data, error } = await query;
  if (error) {
    return [];
  }

  const rows: z.infer<typeof RowSchema>[] = (data ?? []).map((row: unknown) =>
    RowSchema.parse(row)
  );

  const results: SearchResult[] = rows.map((r) => {
    const scoreNumber =
      r.oierdb_score === null
        ? 0
        : typeof r.oierdb_score === "string"
        ? parseFloat(r.oierdb_score)
        : r.oierdb_score;
    const idNumber = typeof r.uid === "string" ? Number.parseInt(r.uid, 10) : r.uid;
    const latestProvince = r.record && r.record.length > 0 ? r.record[0]?.province ?? "" : "";

    return {
      id: Number.isFinite(idNumber) ? (idNumber as number) : 0,
      name: r.name,
      province: latestProvince ?? "",
      grade: computeGradeText(r.enroll_middle),
      score: Number.isFinite(scoreNumber) ? (scoreNumber as number) : 0,
      ccf: r.ccf_level ?? 0,
    };
  });

  return results;
}
