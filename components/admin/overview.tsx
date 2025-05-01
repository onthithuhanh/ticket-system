"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface OverviewProps {
  data?: {
    month: number;
    total: number;
  }[];
}

export function Overview({ data }: OverviewProps) {
  const chartData = data?.map(item => ({
    name: `T${item.month}`,
    total: item.total
  })) || []

  return (
    <ChartContainer
      config={{
        total: {
          label: "Doanh thu",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000000}tr`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
