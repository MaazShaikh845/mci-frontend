// src/components/Card.jsx
export default function Card({ title, value, subtitle }) {
  return (
    <div className="p-5 rounded-2xl bg-white/6 backdrop-blur-md border border-white/6 shadow-sm">
      <div className="text-sm text-slate-300">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
}
