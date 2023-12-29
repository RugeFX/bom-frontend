/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart as LineChartRC,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChart({ data,flag }: { data: any; flag:number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChartRC
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
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
            <Line dataKey="Total" stroke="#8884d8"  activeDot={{ r: 8 }} />
            <Line dataKey="OutOfService" stroke="#a54630" />
            <Line dataKey="ReadyForRent" stroke="#82ca9d" />
            <Line dataKey="InRental" stroke="#556d76" />
            </>
          )
        }
        {
          flag == 2 && (
            <>
            <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="OutOfService" stroke="#a54630" />
            <Line type="monotone" dataKey="ReadyForRent" stroke="#82ca9d" />
            <Line type="monotone" dataKey="InRental" stroke="#556d76" />
            <Line type="monotone" dataKey="Scrab" stroke="#fea96e" />
            <Line type="monotone" dataKey="Lost" stroke="#261c00" />
            </>
          )
        }
      </LineChartRC>
    </ResponsiveContainer>
  );
}
