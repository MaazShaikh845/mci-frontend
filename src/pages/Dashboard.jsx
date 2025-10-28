// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChartComponent from "../components/LineChartComponent";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [summary, setSummary] = useState({ avgRisk: 0, count: 0 });
  const stored = JSON.parse(localStorage.getItem("testSessions") || "[]");
  useEffect(() => {
    if (stored.length > 0) {
      const avgRisk = stored.reduce((sum, s) => sum + s.mci_risk_score, 0) / stored.length;
      setSummary({ avgRisk: (avgRisk * 100).toFixed(1), count: stored.length });
    }
  }, []); // eslint-disable-line

  const chartData = stored.slice(-10).map((s) => ({ subject: new Date(s.date).toLocaleTimeString(), risk: Math.round(s.mci_risk_score * 100) }));

  const list = [
    { title: "Average MCI Risk", value: `${summary.avgRisk}%`, subtitle: "Across saved tests" },
    { title: "Total Tests Taken", value: summary.count, subtitle: "Local storage" },
    { title: "Last Test", value: stored.length ? `${Math.round(stored[stored.length-1].mci_risk_score*100)}%` : "—", subtitle: "Most recent" }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {list.map((l, i) => (
            <motion.div key={l.title} variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Card title={l.title} value={l.value} subtitle={l.subtitle} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent data={chartData} xKey="subject" yKey="risk" title="Recent test risk (%)" color="#60a5fa" />
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
          <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• This demo is for prototyping — not a clinical diagnosis.</li>
            <li>• Data stored locally. Use a backend for persistence & sharing.</li>
            <li>• Replace scoring with ML model later via an API call.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
