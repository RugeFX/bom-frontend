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

export default function BarChart({ data,flag }: { data: any; flag:number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartRechart
        width={500}
        height={300}
        data={data}
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
        {
          flag == 1 && (
            <>
            <Bar dataKey="Total" fill="#8884d8" />
            <Bar dataKey="OutOfService" fill="#a54630" />
            <Bar dataKey="ReadyForRent" fill="#82ca9d" />
            <Bar dataKey="InRental" fill="#556d76" />
            </>
          )
        }
        {
          flag == 2 && (
            <>
              <Bar type="monotone" dataKey="Total" fill="#8884d8"/>
              <Bar type="monotone" dataKey="OutOfService" fill="#a54630"/>
              <Bar type="monotone" dataKey="ReadyForRent" fill="#82ca9d"/>
              <Bar type="monotone" dataKey="InRental" fill="#556d76"/>
              <Bar type="monotone" dataKey="Scrab" fill="#fea96e"/>
              <Bar type="monotone" dataKey="Lost" fill="#261c00"/>
            </>
          )
        }
        {
          flag == 3 && (
            <>
              <Bar type="monotone" dataKey="Total" fill="#8884d8"/>
              <Bar type="monotone" dataKey="Complete" fill="#a54630"/>
              <Bar type="monotone" dataKey="Incomplete" fill="#82ca9d"/>
              <Bar type="monotone" dataKey="InRental" fill="#556d76"/>
              <Bar type="monotone" dataKey="Lost" fill="#261c00"/>
            </>
          )
        }
      </BarChartRechart>
    </ResponsiveContainer>
  );
}
