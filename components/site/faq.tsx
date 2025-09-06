import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Faq() {
  return (
    <div className="border rounded-sm p-4 space-y-2">
      <h2 className="text-md">为什么要重新写一个 OIerDB？</h2>
      <div className="text-sm text-neutral-500">
        旧版 OIerDB 是基于 React 的纯 CSR
        网站，这意味着在首次进入时，你需要将所有选手的数据全部下载(约
        3.3MB)。这对网速较慢的校园网或移动网络用户不友好。
      </div>
    </div>
  );
}
