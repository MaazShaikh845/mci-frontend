// src/components/LineChartComponent.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChartComponent({ data, xKey, yKey, color = "#7c3aed", title }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 shadow-inner">
      <div className="text-sm text-slate-300 mb-2">{title}</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey={xKey} tick={{ fill: "#cbd5e1" }} />
            <YAxis tick={{ fill: "#cbd5e1" }} />
            <Tooltip contentStyle={{ background: "#0b1220", borderRadius: 8 }} />
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
