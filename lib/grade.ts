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


export function computeGradeTextAtContest(
  enrollMiddle: number | null,
  contestYear: number,
  fallSemester: boolean
): string {
  if (!enrollMiddle || !Number.isFinite(enrollMiddle)) return "未知";

  // 学年起始年。例如：2025 春季属于 2024-2025 学年 → start=2024
  const academicYearStart = contestYear - (fallSemester ? 0 : 1);
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


export type EnrollMiddleFilter = { eq?: number; gte?: number; lte?: number };

export function deriveEnrollMiddleFilterForGrade(
  grade: string | "all",
  now: Date = new Date()
): EnrollMiddleFilter | null {
  if (!grade || grade === "all") return null;
  const month = now.getMonth() + 1; // 1..12
  const academicYearStart = now.getFullYear() - (month < 9 ? 1 : 0);
  switch (grade) {
    case "初一":
      return { gte: academicYearStart };
    case "初二":
      return { eq: academicYearStart - 1 };
    case "初三":
      return { eq: academicYearStart - 2 };
    case "高一":
      return { eq: academicYearStart - 3 };
    case "高二":
      return { eq: academicYearStart - 4 };
    case "高三":
      return { eq: academicYearStart - 5 };
    case "高中毕业":
      return { lte: academicYearStart - 6 };
    default:
      return null;
  }
}

