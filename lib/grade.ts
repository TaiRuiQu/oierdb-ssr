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


