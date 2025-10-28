// src/pages/TestForm.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestResultModal from "../components/TestResultModal";

/**
 * Dark glass TestForm - simplified UI (visible inputs), soft motion.
 * 3-minute total timer, 5s encoding (words visible) -> hide -> Start Test
 * Mixed questions, progress bar, stores session to localStorage.
 */

const WEIGHTS = {
  immediate: 2,
  delayed: 3,
  orientation: 1,
  attention: 1.5,
  executive: 2,
  language: 1,
  fluency: 1,
  subjective: 1,
  emotion: 1,
  pattern: 1,
  reaction: 1
};
const WEIGHTED_MAX = 34; // adjust if you change questions

export default function TestForm() {
  const TOTAL_TIME = 180; // 3 minutes
  const ENCODE_TIME = 5; // seconds to show words

  // 3 words (could randomize later)
  const [threeWords] = useState(["River", "Cloud", "Lamp"]);
  const [encodingCountdown, setEncodingCountdown] = useState(ENCODE_TIME);
  const [showWords, setShowWords] = useState(true);

  // timer and start state
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isStarted, setIsStarted] = useState(false);

  // navigation & answers
  const [index, setIndex] = useState(0);
  const [resultSession, setResultSession] = useState(null);

  const [answers, setAnswers] = useState({
    immediate: "",
    delayed: "",
    orientation: "",
    attention: "",
    executive: null,
    language: null,
    fluency: "",
    subjective: 2, // 0..4 (neutral default)
    emotion: "",
    pattern: "",
    reaction: null
  });

  const questions = useMemo(() => ([
    { id: "immediate", type: "recall", label: "Immediate recall — type the 3 words you saw" },
    { id: "orientation", type: "text", label: "What is the current year?" },
    { id: "attention", type: "text", label: "Serial subtraction: 100 - 7 (enter '93' or '93,86')" },
    { id: "emotion", type: "choice", label: "Emotion recognition: which emotion fits this sentence?", prompt: "'I just finished and I feel so relieved and happy.'" , choices: ["Angry","Sad","Happy","Neutral"] },
    { id: "pattern", type: "choice", label: "Pattern logic: choose the next in the sequence: Circle → Triangle → Circle → Triangle → ?", choices: ["Square","Triangle","Circle","Star"] },
    { id: "executive", type: "binary", label: "Executive: Did you complete the quick connect task?" },
    { id: "language", type: "binary", label: "Language: Could you name the object shown (pen)?" },
    { id: "fluency", type: "number", label: "Fluency: How many words starting with 'F' can you list? (enter number)" },
    { id: "reaction", type: "binary", label: "Reaction control: Did you press the button when the screen flashed?" },
    { id: "subjective", type: "likert", label: "Subjective: How is your memory compared to 6 months ago? (1 worse → 5 better)", scale: 5 }
  ]), []);

  // encoding countdown
  useEffect(() => {
    if (!showWords) return;
    if (encodingCountdown <= 0) {
      setShowWords(false);
      return;
    }
    const t = setTimeout(() => setEncodingCountdown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [encodingCountdown, showWords]);

  // main timer (runs only while started and not finished)
  useEffect(() => {
    if (!isStarted) return;
    if (timeLeft <= 0) {
      // time up -> auto submit
      handleFinish();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [isStarted, timeLeft]);

  function setAnswer(key, value) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  // scoring helpers (kept simple & explainable)
  function scoreRecall(str, maxPoints) {
    if (!str) return 0;
    const tokens = str.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const target = threeWords.map(w => w.toLowerCase());
    let count = 0;
    const used = new Set();
    tokens.forEach(t => {
      if (target.includes(t) && !used.has(t)) {
        used.add(t);
        count++;
      }
    });
    return Math.min(count, maxPoints);
  }

  function computeScore() {
    const s = {};
    s.immediate = scoreRecall(answers.immediate, 3);
    s.delayed = scoreRecall(answers.delayed, 3);

    const currentYear = new Date().getFullYear();
    s.orientation = Number(answers.orientation) === currentYear ? 1 : 0;

    // attention expects up to two correct steps: 93 and 86 (if provided)
    let att = 0;
    if (answers.attention) {
      const str = String(answers.attention);
      const toks = str.split(/[\s,]+/).map(t => Number(t)).filter(n => !isNaN(n));
      if (toks.includes(93)) att++;
      if (toks.includes(86)) att = Math.min(att + 1, 2);
    }
    s.attention = Math.min(Math.max(att, 0), 2);

    s.executive = answers.executive ? 1 : 0;
    s.language = answers.language ? 1 : 0;
    s.fluency = Math.min(Math.max(Number(answers.fluency) || 0, 0), 5);
    s.subjective = Math.min(Math.max(Number(answers.subjective) || 0, 0), 4);

    s.emotion = (answers.emotion && answers.emotion.toLowerCase() === "happy") ? 1 : 0;
    s.pattern = (answers.pattern && answers.pattern.toLowerCase() === "triangle") ? 1 : 0;
    s.reaction = answers.reaction ? 1 : 0;

    let weightedSum = 0;
    Object.keys(s).forEach(k => {
      const w = WEIGHTS[k] || 1;
      weightedSum += s[k] * w;
    });

    const raw = weightedSum / WEIGHTED_MAX;
    return {
      subscores: s,
      raw,
      percent: Math.round(raw * 100),
      weightedSum
    };
  }

  function handleFinish() {
    const res = computeScore();
    const session = {
      subject_id: `TEMP_${Date.now()}`,
      session_id: `TEST_${Date.now()}`,
      date: new Date().toISOString(),
      duration_seconds: TOTAL_TIME - timeLeft,
      test_answers: answers,
      subscores: res.subscores,
      mci_risk_score: res.raw,
      mci_risk_percent: res.percent
    };

    const stored = JSON.parse(localStorage.getItem("testSessions") || "[]");
    stored.push(session);
    localStorage.setItem("testSessions", JSON.stringify(stored));

    setResultSession(session);
    setIsStarted(false);
  }

  // navigation
  function goNext() {
    setIndex(i => Math.min(i + 1, questions.length - 1));
  }
  function goPrev() {
    setIndex(i => Math.max(i - 1, 0));
  }

  // progress
  const progress = Math.round((index / questions.length) * 100);

  // motion variants (soft)
  const soft = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 6 }, transition: { duration: 0.22 } };

  return (
    <div className="min-h-[80vh] flex items-start md:items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl rounded-3xl bg-white/6 backdrop-blur-md border border-white/6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">🧠 Quick Cognitive Test</h2>
            <p className="text-sm text-slate-300">3-minute timed test — prototype only</p>
          </div>
          <div className="text-sm text-slate-200">
            Time left: <span className="font-semibold">{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</span>
          </div>
        </div>

        {/* Encoding words */}
        <AnimatePresence>
          {showWords && (
            <motion.div {...soft} className="mb-4 p-4 rounded-lg bg-white/5 border border-white/6">
              <div className="text-sm text-slate-200 mb-2">Memorize these words (will hide in {encodingCountdown}s)</div>
              <div className="flex flex-wrap gap-3">
                {threeWords.map(w => (
                  <div key={w} className="px-4 py-2 rounded-md bg-white/10 text-white font-semibold">{w}</div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start button (visible after encoding) */}
        {!showWords && !isStarted && !resultSession && (
          <motion.div {...soft} className="mb-4">
            <button
              onClick={() => { setIsStarted(true); setTimeLeft(TOTAL_TIME); setIndex(0); }}
              className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-black font-semibold"
            >
              Start Test
            </button>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-white/3 h-2 rounded-full mb-4 overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-2 bg-indigo-400"></div>
        </div>

        {/* Question area */}
        <div>
          <AnimatePresence>
            {isStarted && !resultSession && (
              <motion.div key={questions[index].id} {...soft} className="p-4 rounded-md bg-white/5 border border-white/6">
                <Question
                  q={questions[index]}
                  answers={answers}
                  setAnswer={setAnswer}
                  index={index}
                  total={questions.length}
                  goNext={goNext}
                  goPrev={goPrev}
                  finish={() => handleFinish()}
                />
              </motion.div>
            )}

            {/* If not started and result exists, show delayed recall input plainly for visibility */}
            {!isStarted && resultSession && (
              <motion.div {...soft} className="p-4 rounded-md bg-white/5 border border-white/6">
                <div className="text-sm text-slate-200 mb-2">Delayed recall — type the 3 words you remember</div>
                <input
                  value={answers.delayed}
                  onChange={e => setAnswer("delayed", e.target.value)}
                  placeholder="Type the words"
                  className="w-full p-3 rounded-md bg-[#071226] border border-white/12 text-white placeholder:text-slate-400"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* result modal */}
      <AnimatePresence>
        {resultSession && <TestResultModal session={resultSession} onClose={() => { setResultSession(null); setAnswers(a => ({ ...a, delayed: "" })); }} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Question component ---------- */
function Question({ q, answers, setAnswer, index, total, goNext, goPrev, finish }) {
  const commonInputClass = "w-full p-3 rounded-md bg-[#071226] border border-white/12 text-white placeholder:text-slate-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">Question {index + 1} of {total}</div>
        <div className="text-xs text-slate-400">{Math.round((index/total) * 100)}% done</div>
      </div>

      <h3 className="text-lg font-medium text-white mb-3">{q.label}</h3>

      {q.type === "recall" && (
        <input
          value={answers[q.id] || ""}
          onChange={e => setAnswer(q.id, e.target.value)}
          placeholder="Type the words here"
          className={commonInputClass}
        />
      )}

      {q.type === "text" && (
        <input
          value={answers[q.id] || ""}
          onChange={e => setAnswer(q.id, e.target.value)}
          className={commonInputClass}
        />
      )}

      {q.type === "number" && (
        <input
          value={answers[q.id] || ""}
          onChange={e => setAnswer(q.id, e.target.value)}
          type="number"
          className={commonInputClass}
        />
      )}

      {q.type === "choice" && (
        <div>
          {q.prompt && <div className="text-sm text-slate-300 mb-2">{q.prompt}</div>}
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map(choice => (
              <button
                key={choice}
                type="button"
                onClick={() => setAnswer(q.id, choice)}
                className={`p-3 rounded-md text-left ${answers[q.id] === choice ? "bg-indigo-400 text-black" : "bg-white/6 text-white"}`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {q.type === "binary" && (
        <div className="flex gap-3">
          <button onClick={() => setAnswer(q.id, true)} className={`px-4 py-2 rounded-md ${answers[q.id] ? "bg-green-400 text-black" : "bg-white/6 text-white"}`}>Yes</button>
          <button onClick={() => setAnswer(q.id, false)} className={`px-4 py-2 rounded-md ${answers[q.id] === false ? "bg-red-400 text-black" : "bg-white/6 text-white"}`}>No</button>
        </div>
      )}

      {q.type === "likert" && (
        <div className="flex gap-2">
          {Array.from({ length: q.scale }).map((_, i) => (
            <button key={i} onClick={() => setAnswer(q.id, i)} className={`px-3 py-2 rounded-md ${answers[q.id] === i ? "bg-yellow-400 text-black" : "bg-white/6 text-white"}`}>{i + 1}</button>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center gap-3">
        <div>
          <button onClick={goPrev} className="px-4 py-2 rounded-md bg-white/6 text-white">Previous</button>
        </div>

        <div className="flex gap-3">
          {index < total - 1 ? (
            <button onClick={goNext} className="px-4 py-2 rounded-md bg-indigo-500 text-black">Next</button>
          ) : (
            <button onClick={finish} className="px-4 py-2 rounded-md bg-green-400 text-black font-semibold">Finish & Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}
