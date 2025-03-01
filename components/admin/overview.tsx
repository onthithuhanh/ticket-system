"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "T1",
    total: 120000000,
  },
  {
    name: "T2",
    total: 132000000,
  },
  {
    name: "T3",
    total: 95000000,
  },
  {
    name: "T4",
    total: 99000000,
  },
  {
    name: "T5",
    total: 112000000,
  },
  {
    name: "T6",
    total: 133000000,
  },
  {
    name: "T7",
    total: 142000000,
  },
  {
    name: "T8",
    total: 152000000,
  },
  {
    name: "T9",
    total: 0,
  },
  {
    name: "T10",
    total: 0,
  },
  {
    name: "T11",
    total: 0,
  },
  {
    name: "T12",
    total: 0,
  },
]

export function Overview() {
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
        <BarChart data={data}>
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
