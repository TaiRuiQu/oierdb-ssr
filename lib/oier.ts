import { z } from "zod";
import supabase from "@/lib/db";
import { computeGradeText } from "@/lib/grade";
import { unstable_cache } from "next/cache";

export type OierRecordItem = {
  id: number;
  contestName: string;
  year: number | null;
  fallSemester: boolean | null;
  contestFullScore: number | null;
  contestCapacity: number | null;
  level: string | null;
  score: number | null;
  rank: number | null;
  province: string | null;
  schoolName: string | null;
  contestId: number | null;
};

export type OierDetail = {
  uid: number;
  name: string;
  grade: string;
  oierdbScore: number;
  ccfLevel: number | null;
  ccfScore: number | null;
  records: OierRecordItem[];
};

const DetailRowSchema = z.object({
  uid: z.union([z.number(), z.string()]),
  name: z.string(),
  enroll_middle: z.union([z.number(), z.null()]),
  oierdb_score: z.union([z.number(), z.string(), z.null()]).nullable().optional(),
  ccf_level: z.union([z.number(), z.null()]).nullable().optional(),
  ccf_score: z.union([z.number(), z.null()]).nullable().optional(),
  record: z
    .array(
      z.object({
        id: z.number(),
        rank: z.union([z.number(), z.null()]).optional(),
        level: z.union([z.string(), z.null()]).optional(),
        score: z.union([z.number(), z.null()]).optional(),
        province: z.union([z.string(), z.null()]).optional(),
        school: z
          .object({
            name: z.string(),
            province: z.union([z.string(), z.null()]).optional(),
          })
          .optional(),
        contest: z
          .object({
            year: z.number(),
            fall_semester: z.boolean(),
            name: z.string(),
            full_score: z.number(),
            capacity: z.union([z.number(), z.null()]).optional(),
            type: z.string(),
            id: z.number(),
          })
          .optional(),
      })
    )
    .optional(),
});

async function fetchOierDetailByUidUncached(uid: number): Promise<OierDetail | null> {
  const { data, error } = await supabase
    .from("oier")
    .select(
      `uid,name,enroll_middle,oierdb_score,ccf_level,ccf_score,
       record:record(
        id,rank,level,score,province,
        school:school(name,province),
        contest:contest(year,fall_semester,name,full_score,capacity,type,id)
       )`
    )
    .eq("uid", uid)
    .order("id", { referencedTable: "record", ascending: false });

  if (error) {
    return null;
  }

  const rows: z.infer<typeof DetailRowSchema>[] = (data ?? []).map((row: unknown) =>
    DetailRowSchema.parse(row)
  );

  if (!rows.length) return null;
  const row = rows[0];

  const scoreNumber =
    row.oierdb_score == null
      ? 0
      : typeof row.oierdb_score === "string"
      ? parseFloat(row.oierdb_score)
      : row.oierdb_score;

  const uidNumber = typeof row.uid === "string" ? Number.parseInt(row.uid, 10) : row.uid;

  const records: OierRecordItem[] = (row.record ?? []).map((r) => ({
    id: r.id,
    contestName: r.contest?.name ?? "",
    year: r.contest?.year ?? null,
    fallSemester: r.contest?.fall_semester ?? null,
    contestFullScore: r.contest?.full_score ?? null,
    contestCapacity: (r.contest?.capacity ?? null) as number | null,
    level: r.level ?? null,
    score: r.score ?? null,
    rank: r.rank ?? null,
    province: r.province ?? null,
    schoolName: r.school?.name ?? null,
    contestId: r.contest?.id ?? null,
  }));

  return {
    uid: Number.isFinite(uidNumber) ? (uidNumber as number) : 0,
    name: row.name,
    grade: computeGradeText(row.enroll_middle),
    oierdbScore: Number.isFinite(scoreNumber) ? (scoreNumber as number) : 0,
    ccfLevel: row.ccf_level ?? null,
    ccfScore: row.ccf_score ?? null,
    records,
  };
}

export const fetchOierDetailByUid = unstable_cache(
  async (uid: number) => fetchOierDetailByUidUncached(uid),
  ["fetchOierDetailByUid"],
  { revalidate: 300 }
);


