"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { year: number; [key: string]: number | string | null }[];
  legend: string[];
};

export default function AwardsChart({ data, legend }: Props) {
  // Tailwind 主题色系：使用与表格一致的低对比灰网格，强调配色为金/银/铜
  const palette: Record<string, string> = {
    "金牌": "#f59e0b", // amber-500
    "银牌": "#9ca3af", // gray-400
    "铜牌": "#b45309", // orange-700
    "一等奖": "#f59e0b",
    "二等奖": "#9ca3af",
    "三等奖": "#b45309",
  };

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
          <Tooltip wrapperStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {legend.map((k) => (
            <Line key={k} type="monotone" dataKey={k} stroke={palette[k] ?? "#8884d8"} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


