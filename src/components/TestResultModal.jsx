// src/components/TestResultModal.jsx
import { motion } from "framer-motion";

export default function TestResultModal({ session, onClose }) {
  const risk = Math.round(session.mci_risk_score * 100);
  const level =
    risk < 30 ? "Low risk" :
    risk < 50 ? "Borderline" :
    risk < 70 ? "Moderate concern" : "High concern";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10 w-full max-w-lg rounded-2xl bg-white/6 backdrop-blur-md border border-white/6 p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">Test Result</h3>
            <p className="text-sm text-slate-300">Prototype estimate — not a clinical diagnosis.</p>
          </div>
          <button onClick={onClose} className="text-slate-300">✕</button>
        </div>

        <div className="mt-4 flex gap-4 items-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#f472b6)" }}>
            {risk}%
          </div>

          <div>
            <div className="text-lg font-semibold text-white">{level}</div>
            <div className="text-sm text-slate-300 mt-1">Duration: {session.duration_seconds}s • {new Date(session.date).toLocaleString()}</div>
            <div className="mt-3">
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-indigo-500 text-black font-semibold">Close</button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-slate-300 mb-2">Subscores</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(session.subscores).map(k => (
              <div key={k} className="p-2 rounded-md bg-white/6">
                <div className="text-xs text-slate-300">{k}</div>
                <div className="font-medium text-white">{String(session.subscores[k])}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
