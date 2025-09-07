import { listContestRecordsServer } from "@/lib/fetch-contest";
import { RecordsTable } from "./records-table";

type Props = {
  contestId: number;
  page: number;
  fullScore: number;
  capacity: number | null;
  year: number;
  fallSemester: boolean;
  province?: string;
  grade?: string;
};

export default async function RecordsSection({
  contestId,
  page,
  fullScore,
  capacity,
  year,
  fallSemester,
  province,
  grade,
}: Props) {
  const { items, totalPages } = await listContestRecordsServer({
    contestId,
    page,
    pageSize: 50,
    province: province as any,
    grade: grade as any,
  });

  return (
    <RecordsTable
      items={items}
      fullScore={fullScore}
      capacity={capacity}
      year={year}
      fallSemester={fallSemester}
      page={page}
      totalPages={totalPages}
    />
  );
}


