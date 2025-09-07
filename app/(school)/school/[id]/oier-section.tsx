import { listSchoolOiersServer } from "@/lib/fetch-school";
import { OierTable } from "@/app/(school)/school/[id]/oier-table";

type Props = {
  schoolId: number;
  page: number;
  grade?: string;
};

export default async function OierSection({ schoolId, page, grade }: Props) {
  const { items, totalPages } = await listSchoolOiersServer({
    schoolId,
    page,
    pageSize: 50,
    grade: grade as any,
  });

  return (
    <OierTable items={items} page={page} totalPages={totalPages} />
  );
}


