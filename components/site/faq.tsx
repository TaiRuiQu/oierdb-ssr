export function Faq() {
  return (
    <div className="border rounded-sm p-4 space-y-2">
      <h2 className="text-md">这是什么？</h2>
      <div className="text-sm text-neutral-500">
        这是一个信息学竞赛选手获奖记录并对学校进行排名的数据库。本网站数据与原
        OIerDB 同步更新。
      </div>
      <h2>这个网站有什么用？</h2>
      <div className="text-sm text-neutral-500">
        你能够在这个网站上查询选手的获奖记录，目前可以通过姓名、姓名首字母缩写来进行查询。学校、省份相关查询即将上线。
      </div>
      <h2 className="text-md">为什么要重新写一个 OIerDB？</h2>
      <div className="text-sm text-neutral-500">
        旧版 OIerDB 是基于 React 的纯 CSR
        网站，这意味着在首次进入时，你需要将所有选手的数据全部下载(约
        3.3MB)。这对网速较慢的校园网或移动网络用户不友好。
      </div>
    </div>
  );
}
