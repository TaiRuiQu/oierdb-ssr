"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProvinceSelect({ value }: { value?: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();
  const current = value ?? sp.get("province") ?? "all";

  function onValueChange(next: string) {
    const params = new URLSearchParams(sp.toString());
    if (next && next !== "all") params.set("province", next);
    else params.delete("province");
    params.delete("page");
    const s = params.toString();
    router.push(s ? `${pathname}?${s}` : `${pathname}`);
  }

  return (
    <Select value={current} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="省份" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        <SelectItem value="all">全国</SelectItem>
        <SelectItem value="北京">北京</SelectItem>
        <SelectItem value="上海">上海</SelectItem>
        <SelectItem value="天津">天津</SelectItem>
        <SelectItem value="重庆">重庆</SelectItem>
        <SelectItem value="河北">河北</SelectItem>
        <SelectItem value="山西">山西</SelectItem>
        <SelectItem value="内蒙古">内蒙古</SelectItem>
        <SelectItem value="辽宁">辽宁</SelectItem>
        <SelectItem value="吉林">吉林</SelectItem>
        <SelectItem value="黑龙江">黑龙江</SelectItem>
        <SelectItem value="江苏">江苏</SelectItem>
        <SelectItem value="浙江">浙江</SelectItem>
        <SelectItem value="安徽">安徽</SelectItem>
        <SelectItem value="福建">福建</SelectItem>
        <SelectItem value="江西">江西</SelectItem>
        <SelectItem value="山东">山东</SelectItem>
        <SelectItem value="河南">河南</SelectItem>
        <SelectItem value="湖北">湖北</SelectItem>
        <SelectItem value="湖南">湖南</SelectItem>
        <SelectItem value="广东">广东</SelectItem>
        <SelectItem value="广西">广西</SelectItem>
        <SelectItem value="海南">海南</SelectItem>
        <SelectItem value="四川">四川</SelectItem>
        <SelectItem value="贵州">贵州</SelectItem>
        <SelectItem value="云南">云南</SelectItem>
        <SelectItem value="西藏">西藏</SelectItem>
        <SelectItem value="陕西">陕西</SelectItem>
        <SelectItem value="甘肃">甘肃</SelectItem>
        <SelectItem value="青海">青海</SelectItem>
        <SelectItem value="宁夏">宁夏</SelectItem>
        <SelectItem value="新疆">新疆</SelectItem>
        <SelectItem value="香港">香港</SelectItem>
        <SelectItem value="澳门">澳门</SelectItem>
        <SelectItem value="台湾">台湾</SelectItem>
      </SelectContent>
    </Select>
  );
}


