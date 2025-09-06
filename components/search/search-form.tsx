"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [query, setQuery] = useState(sp.get("query") ?? "");

  useEffect(() => {
    setQuery(sp.get("query") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    router.push("/?" + params.toString());
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        placeholder="输入姓名或拼音首字母..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
    // <Card>
    //   <CardHeader>
    //     <CardTitle>搜索</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <form className="flex items-center gap-3" onSubmit={onSubmit}>
    //       <div className="relative w-full">
    //         <Input
    //           placeholder="输入姓名或编号..."
    //           value={query}
    //           onChange={(e) => setQuery(e.target.value)}
    //         />
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <Switch id="advanced" checked={advanced} onCheckedChange={setAdvanced} />
    //         <Label htmlFor="advanced" className="text-sm text-muted-foreground">高级搜索</Label>
    //       </div>
    //       <button type="submit" className="hidden" aria-hidden />
    //     </form>
    //   </CardContent>
    // </Card>
  );
}
