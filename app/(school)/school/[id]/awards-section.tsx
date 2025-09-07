import { fetchSchoolAwardsTrends } from "@/lib/fetch-school";
import AwardsChart from "@/app/(school)/school/[id]/awards-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = { schoolId: number };

const TYPES: (
  | "NOI"
  | "CTSC"
  | "APIO"
  | "IOI"
  | "NGOI"
  | "WC"
  | "CSP提高"
  | "CSP入门"
  | "NOIP"
  | "NOIP提高"
  | "NOIP普及"
  | "NOID类"
  | "NOIST"
)[] = [
  "NOI",
  "CTSC",
  "APIO",
  "IOI",
  "NGOI",
  "WC",
  "CSP提高",
  "CSP入门",
  "NOIP",
  "NOIP提高",
  "NOIP普及",
  "NOID类",
  "NOIST",
];

export default async function AwardsSection({ schoolId }: Props) {
  const results = await fetchSchoolAwardsTrends({ schoolId });

  const byType = new Map(results.map((r) => [r.type, r] as const));
  const tabs = TYPES.map((t) => ({ type: t, legend: byType.get(t)?.legend ?? [], items: byType.get(t)?.items ?? [] }));

  const nonEmptyTabs = tabs.filter((t) => t.items.length > 0);

  return (
    <div className="border rounded-sm p-4">
      {nonEmptyTabs.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
      ) : (
        <Tabs defaultValue={nonEmptyTabs[0].type} className="w-full space-y-4">
          <TabsList>
            {nonEmptyTabs.map((t) => (
              <TabsTrigger key={t.type} value={t.type}>
                {t.type}
              </TabsTrigger>
            ))}
          </TabsList>
          {nonEmptyTabs.map((t) => (
            <TabsContent key={t.type} value={t.type}>
              <AwardsChart data={t.items as any} legend={t.legend} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}


