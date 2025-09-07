"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 约定取值："all" | "初一" | "初二" | "初三" | "高一" | "高二" | "高三" | "高中毕业"
// 与后端的筛选参数对应为 enroll_middle 的区间推导，在服务端实现。
export function GradeSelect({ value }: { value?: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();
  const current = value ?? sp.get("grade") ?? "all";

  function onValueChange(next: string) {
    const params = new URLSearchParams(sp.toString());
    if (next && next !== "all") params.set("grade", next);
    else params.delete("grade");
    params.delete("page");
    const s = params.toString();
    router.push(s ? `${pathname}?${s}` : `${pathname}`);
  }

  return (
    <Select value={current} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="年级" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        <SelectItem value="all">全部年级</SelectItem>
        <SelectItem value="初一">初一</SelectItem>
        <SelectItem value="初二">初二</SelectItem>
        <SelectItem value="初三">初三</SelectItem>
        <SelectItem value="高一">高一</SelectItem>
        <SelectItem value="高二">高二</SelectItem>
        <SelectItem value="高三">高三</SelectItem>
        <SelectItem value="高中毕业">高中毕业</SelectItem>
      </SelectContent>
    </Select>
  );
}


