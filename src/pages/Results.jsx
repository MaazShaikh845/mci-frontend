// src/pages/Results.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Results() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("testSessions") || "[]");
    setSessions(stored.reverse());
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-10 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl flex items-center justify-between mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-white">🧾 Test Results</h1>
        <Link
          to="/"
          className="bg-indigo-500/80 hover:bg-indigo-500/95 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          ⬅ Back to Dashboard
        </Link>
      </motion.div>

      {sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-slate-400 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 w-full max-w-lg"
        >
          <p>No tests taken yet.</p>
          <Link to="/test" className="text-indigo-400 underline hover:text-indigo-300 mt-2 inline-block">
            Take a test now →
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-lg"
        >
          <motion.table
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="w-full text-left border-collapse"
          >
            <thead className="bg-white/10 text-white">
              <tr>
                {["#", "Date", "Duration (s)", "MCI Risk %", "Interpretation"].map((h, i) => (
                  <motion.th key={i} variants={fadeUp} className="py-3 px-4 text-sm font-semibold">
                    {h}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => {
                const risk = Math.round(s.mci_risk_score * 100);
                const level =
                  risk < 30
                    ? "Low"
                    : risk < 50
                    ? "Borderline"
                    : risk < 70
                    ? "Moderate"
                    : "High";
                const color =
                  risk < 30
                    ? "text-green-400"
                    : risk < 50
                    ? "text-yellow-400"
                    : risk < 70
                    ? "text-orange-400"
                    : "text-red-500";

                return (
                  <motion.tr
                    key={s.session_id}
                    custom={i}
                    variants={fadeUp}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4 text-slate-200">{i + 1}</td>
                    <td className="py-3 px-4 text-slate-300">{new Date(s.date).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300">{s.duration_seconds}</td>
                    <td className={`py-3 px-4 font-semibold ${color}`}>{risk}%</td>
                    <td className="py-3 px-4 text-slate-200">{level}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </motion.table>
        </motion.div>
      )}
    </div>
  );
}
