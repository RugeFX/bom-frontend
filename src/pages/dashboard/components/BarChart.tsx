/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as BarChartRechart,
  Bar,
} from "recharts";

export default function BarChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartRechart
        width={500}
        height={300}
        data={data.Motor}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Total" fill="#8884d8" />
        <Bar dataKey="OutOfService" fill="#a54630" />
        <Bar dataKey="ReadyForRent" fill="#82ca9d" />
        <Bar dataKey="InRental" fill="#556d76" />
      </BarChartRechart>
    </ResponsiveContainer>
  );
}
