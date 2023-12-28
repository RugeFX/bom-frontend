/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Tooltip, ResponsiveContainer, PieChart as PieChartRC, Pie } from "recharts";

export default function PieChart({ data, flag }: { data: any; flag: number }) {
  const mapped = useMemo(() => {
    if (!data) return null;

    if (flag === 1) {
      return data.Fak.map((d: any) => ({
        ...d,
        data: [
          {
            name: "Complete",
            value: d.Complete,
          },
          {
            name: "InRental",
            value: d.InRental,
          },
          {
            name: "Incomplete",
            value: d.Incomplete,
          },
          {
            name: "Lost",
            value: d.Lost,
          },
          {
            name: "Total",
            value: d.Total,
          },
        ],
      }));
    } else if (flag === 2) {
      return data.AllMotor.map((d: any) => ({
        ...d,
        data: [
          {
            name: "ReadyForRent",
            value: d.ReadyForRent,
          },
          {
            name: "OutOfService",
            value: d.OutOfService,
          },
          {
            name: "InRental",
            value: d.InRental,
          },
          {
            name: "Total",
            value: d.Total,
          },
        ],
      }));
    } else {
      return [];
    }
  }, [data, flag]);

  return mapped.map((d: any, i: number) => (
    <ResponsiveContainer width="100%" height="100%" key={i}>
      <PieChartRC width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={d.data}
          outerRadius={80}
          fill="#8884d8"
          label
        />
        {/* <Pie dataKey="value" data={data02} innerRadius={60} outerRadius={80} fill="#82ca9d" /> */}
        <Tooltip />
      </PieChartRC>
    </ResponsiveContainer>
  ));
}
