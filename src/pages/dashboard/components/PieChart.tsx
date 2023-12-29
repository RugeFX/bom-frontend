/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Tooltip, ResponsiveContainer, PieChart as PieChartRC, Pie } from "recharts";

export default function PieChart({ data, flag }: { data: any; flag: number }) {
  const mapped = useMemo(() => {
    if (!data) return null;

    if (flag === 1) {
      return data.AllFakData.map((d: any) => ({
        ...d,
        color: "#82ca9d",
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
        ],
      }));
    } else if (flag === 2) {
      return data.AllMotor.map((d: any) => ({
        ...d,
        color: "#fea96e",
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
        ],
      }));
    } 
    else if (flag === 3) {
      return data.AllHardcase.map((d: any) => ({
        ...d,
        color: "#a54630",
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
            name: "Lost",
            value: d.Lost,
          },
          {
            name: "Scrab",
            value: d.Scrab,
          },
          {
            name: "InRental",
            value: d.InRental,
          },
        ],
      }));
    } 
    else if (flag === 4) {
      return data.AllHelmet.map((d: any) => ({
        ...d,
        color: "#8884d8",
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
            name: "Lost",
            value: d.Lost,
          },
          {
            name: "Scrab",
            value: d.Scrab,
          },
          {
            name: "InRental",
            value: d.InRental,
          },
        ],
      }));
    } 
    else {
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
          innerRadius={30}
          outerRadius={80}
          fill={d.color}
          label
        />
        <Tooltip />
      </PieChartRC>
    </ResponsiveContainer>
  ));
}
