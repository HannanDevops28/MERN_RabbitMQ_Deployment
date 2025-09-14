import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data, dataKey, nameKey }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey={nameKey} stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
