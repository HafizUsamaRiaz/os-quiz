import { useState, useEffect, useCallback, useRef } from "react";
import { ALL_QUESTIONS } from "./questions.js";

// ═══════════════════════════════════════════════════════════════
//  🔧 CONFIGURATION — fill these in after Google Sheets setup
// ═══════════════════════════════════════════════════════════════
const SHEET_CHECK_URL  = "YOUR_APPS_SCRIPT_URL_HERE"; // same URL for both
const SHEET_SUBMIT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
const QUIZ_SIZE        = 10;
const TIME_PER_Q       = 45; // seconds per question
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#080c14", card: "#0f1623", border: "#1a2d45",
  accent: "#00d4aa", warn: "#ffb300", danger: "#ff5252",
  blue: "#3a8eff",
  text: "#c8daf0", muted: "#4a6080", dim: "#131f30",
  mono: "'Courier New', monospace",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Reusable UI ────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 36px", ...style }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ color: C.muted, fontSize: 10, letterSpacing: 4, marginBottom: 8, textTransform: "uppercase" }}>{children}</div>;
}

function Input({ value, onChange, placeholder, onKeyDown }) {
  return (
    <input
      value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
      style={{
        width: "100%", padding: "13px 16px", background: C.dim,
        border: `1px solid ${C.border}`, borderRadius: 10,
        color: C.text, fontSize: 14, fontFamily: C.mono,
        boxSizing: "border-box", outline: "none",
      }}
    />
  );
}

function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "14px 24px", background: disabled ? "#1a2540" : C.accent,
      color: disabled ? C.muted : "#021a14", border: "none", borderRadius: 10,
      fontSize: 13, fontWeight: 800, cursor: disabled ? "default" : "pointer",
      fontFamily: C.mono, letterSpacing: 1.5, transition: "all 0.18s", ...style
    }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: "14px 24px", background: "transparent",
      color: C.accent, border: `1px solid ${C.border}`, borderRadius: 10,
      fontSize: 13, fontWeight: 700, cursor: "pointer",
      fontFamily: C.mono, letterSpacing: 1, transition: "all 0.18s", ...style
    }}>
      {children}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.dim}`, fontSize: 12 }}>
      <span style={{ color: C.muted }}>{label}</span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  );
}

// ── Screen: Register ───────────────────────────────────────────
function RegisterScreen({ onStart }) {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return setError("Please enter your full name.");
    if (!roll.trim()) return setError("Please enter your roll number.");
    setError("");
    setChecking(true);

    try {
      if (SHEET_CHECK_URL !== "YOUR_APPS_SCRIPT_URL_HERE") {
        const res = await fetch(`${SHEET_CHECK_URL}?action=check&roll=${encodeURIComponent(roll.trim().toUpperCase())}`);
        const data = await res.json();
        if (data.exists) {
          setError(`⚠ Roll number ${roll.trim().toUpperCase()} has already completed this quiz. Each student may attempt only once.`);
          setChecking(false);
          return;
        }
      }
    } catch {
      // If check fails (network), allow through — sheet will deduplicate on submit
    }

    setChecking(false);
    onStart(name.trim(), roll.trim().toUpperCase());
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono, padding: 16 }}>
      {/* Subtle grid bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.dim} 1px, transparent 1px), linear-gradient(90deg, ${C.dim} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.4, pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, width: "100%", position: "relative" }}>
        {/* Header badge */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-block", background: C.dim, border: `1px solid ${C.border}`, borderRadius: 30, padding: "8px 20px", fontSize: 11, color: C.accent, letterSpacing: 3 }}>
            ITU · CE210T · OPERATING SYSTEMS
          </div>
        </div>

        <Card>
          <h1 style={{ color: C.text, fontSize: 28, fontWeight: 900, margin: "0 0 4px" }}>Labs 1–3 Quiz</h1>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
            Linux CLI &nbsp;·&nbsp; GNU Toolchain &nbsp;·&nbsp; C File I/O
          </p>

          <div style={{ marginBottom: 16 }}>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ali Hassan" onKeyDown={e => e.key === "Enter" && handleStart()} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <Label>Roll Number</Label>
            <Input value={roll} onChange={e => setRoll(e.target.value)} placeholder="e.g. 23-CE-001" onKeyDown={e => e.key === "Enter" && handleStart()} />
          </div>

          {error && (
            <div style={{ background: "#1f0a0a", border: `1px solid #4a1a1a`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: C.danger, fontSize: 12, lineHeight: 1.6 }}>
              {error}
            </div>
          )}

          <div style={{ background: C.dim, borderRadius: 10, padding: "16px 20px", marginBottom: 28 }}>
            <InfoRow label="Questions" value={`${QUIZ_SIZE} random from pool of ${ALL_QUESTIONS.length}`} />
            <InfoRow label="Time per question" value={`${TIME_PER_Q} seconds — auto-submits`} />
            <InfoRow label="Attempts allowed" value="One attempt only" />
            <InfoRow label="Anti-cheat" value="Tab switching is recorded" />
          </div>

          <PrimaryBtn onClick={handleStart} disabled={checking} style={{ width: "100%" }}>
            {checking ? "CHECKING…" : "BEGIN QUIZ →"}
          </PrimaryBtn>
        </Card>
      </div>
    </div>
  );
}

// ── Screen: Quiz ───────────────────────────────────────────────
function QuizScreen({ studentName, rollNumber, onFinish }) {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, QUIZ_SIZE));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [opts, setOpts] = useState([]);
  const timerRef = useRef(null);

  const q = questions[current];

  useEffect(() => {
    setOpts(shuffle(q.options));
    setSelected(null);
    setConfirmed(false);
    setTimeLeft(TIME_PER_Q);
  }, [current]);

  const confirm = useCallback((auto = false) => {
    clearInterval(timerRef.current);
    setAnswers(prev => ({ ...prev, [q.id]: auto ? null : selected }));
    setConfirmed(true);
  }, [q, selected]);

  useEffect(() => {
    if (confirmed) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); confirm(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, confirmed, confirm]);

  useEffect(() => {
    const fn = () => { if (document.hidden && !confirmed) setTabWarnings(w => w + 1); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, [confirmed]);

  useEffect(() => {
    const block = e => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  const next = () => {
    if (current + 1 >= questions.length) onFinish(questions, answers, tabWarnings);
    else setCurrent(c => c + 1);
  };

  const tColor = timeLeft > 20 ? C.accent : timeLeft > 10 ? C.warn : C.danger;
  const tPct = (timeLeft / TIME_PER_Q) * 100;
  const isOk = confirmed && selected === q.answer;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.mono, padding: "24px 16px", userSelect: "none" }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <span style={{ color: C.muted, fontSize: 11 }}>{q.lab}</span>
            <span style={{ color: C.dim, fontSize: 11 }}> · Q{current + 1}/{QUIZ_SIZE}</span>
            <span style={{ color: "#2a4060", fontSize: 11 }}> · {studentName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tabWarnings > 0 && <span style={{ color: C.danger, fontSize: 11, background: "#1f0a0a", padding: "4px 10px", borderRadius: 6 }}>⚠ {tabWarnings} switch{tabWarnings > 1 ? "es" : ""}</span>}
            <div style={{ background: C.card, border: `1px solid ${tColor}55`, borderRadius: 8, padding: "5px 14px", color: tColor, fontSize: 22, fontWeight: 900, minWidth: 52, textAlign: "center" }}>{timeLeft}</div>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{ background: C.dim, borderRadius: 3, height: 3, marginBottom: 3 }}>
          <div style={{ height: 3, borderRadius: 3, background: tColor, width: `${tPct}%`, transition: "width 1s linear, background 0.5s" }} />
        </div>
        {/* Progress bar */}
        <div style={{ background: C.dim, borderRadius: 3, height: 3, marginBottom: 24 }}>
          <div style={{ height: 3, borderRadius: 3, background: C.accent, width: `${(current / QUIZ_SIZE) * 100}%`, transition: "width 0.3s" }} />
        </div>

        {/* Question */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "26px", marginBottom: 16 }}>
          <div style={{ color: C.blue, fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>MULTIPLE CHOICE</div>
          <div style={{ color: C.text, fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{q.question}</div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {opts.map((opt, i) => {
            let bg = C.card, border = `1px solid ${C.border}`, color = C.muted;
            if (selected === opt && !confirmed) { bg = "#0c2040"; border = `1px solid ${C.blue}`; color = C.text; }
            if (confirmed) {
              if (opt === q.answer) { bg = "#091f14"; border = `1px solid ${C.accent}`; color = C.accent; }
              else if (opt === selected) { bg = "#1f0909"; border = `1px solid ${C.danger}`; color = C.danger; }
            }
            return (
              <button key={opt} onClick={() => !confirmed && setSelected(opt)}
                style={{ background: bg, border, borderRadius: 10, padding: "13px 16px", color, fontSize: 13, cursor: confirmed ? "default" : "pointer", textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", fontFamily: C.mono, lineHeight: 1.6, transition: "all 0.15s", width: "100%" }}>
                <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: "#0a1120", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.muted, flexShrink: 0, marginTop: 1 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {confirmed && (
          <div style={{ background: isOk ? "#091910" : "#190909", border: `1px solid ${isOk ? "#1a4a2a" : "#4a1a1a"}`, borderRadius: 10, padding: "13px 16px", marginBottom: 16 }}>
            <div style={{ color: isOk ? C.accent : C.danger, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              {isOk ? "✓ Correct!" : selected === null ? "⏰ Time expired — no answer" : "✗ Incorrect"}
            </div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        )}

        {!confirmed
          ? <PrimaryBtn onClick={() => confirm(false)} disabled={!selected} style={{ width: "100%" }}>CONFIRM ANSWER</PrimaryBtn>
          : <GhostBtn onClick={next} style={{ width: "100%" }}>{current + 1 >= QUIZ_SIZE ? "SUBMIT QUIZ →" : "NEXT QUESTION →"}</GhostBtn>
        }
      </div>
    </div>
  );
}

// ── Screen: Submitting ─────────────────────────────────────────
function SubmittingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16, display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Submitting your results to gradebook…</div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

// ── Screen: Result ─────────────────────────────────────────────
function ResultScreen({ studentName, rollNumber, questions, answers, tabWarnings, submitStatus }) {
  const score = questions.reduce((a, q) => answers[q.id] === q.answer ? a + 1 : a, 0);
  const pct = Math.round((score / QUIZ_SIZE) * 100);
  const grade = pct >= 80 ? "Excellent" : pct >= 60 ? "Satisfactory" : "Needs Review";
  const gc = pct >= 80 ? C.accent : pct >= 60 ? C.warn : C.danger;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.mono, padding: "32px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Score hero */}
        <Card style={{ textAlign: "center", marginBottom: 20, padding: "36px" }}>
          <div style={{ color: C.muted, fontSize: 10, letterSpacing: 4, marginBottom: 16 }}>QUIZ COMPLETE</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: gc, lineHeight: 1 }}>{pct}%</div>
          <div style={{ color: gc, fontSize: 18, marginTop: 8 }}>{grade}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 10 }}>
            {studentName} &nbsp;·&nbsp; {rollNumber} &nbsp;·&nbsp; {score}/{QUIZ_SIZE} correct
          </div>
          {tabWarnings > 0 && (
            <div style={{ marginTop: 10, color: C.danger, fontSize: 12 }}>⚠ {tabWarnings} tab switch{tabWarnings > 1 ? "es" : ""} detected</div>
          )}

          {/* Submission badge */}
          <div style={{ marginTop: 20, display: "inline-block", padding: "10px 20px", borderRadius: 8, fontSize: 12, lineHeight: 1.5,
            background: submitStatus === "ok" ? "#091f14" : submitStatus === "error" ? "#1f0909" : "#0c1a2a",
            border: `1px solid ${submitStatus === "ok" ? "#1a4a2a" : submitStatus === "error" ? "#4a1a1a" : C.border}`,
            color: submitStatus === "ok" ? C.accent : submitStatus === "error" ? C.danger : C.muted
          }}>
            {submitStatus === "ok"    && "✓ Score saved to gradebook"}
            {submitStatus === "error" && "⚠ Gradebook submission failed — inform your instructor"}
            {submitStatus === "demo"  && "ℹ Demo mode · Paste your Apps Script URL to enable gradebook"}
          </div>
        </Card>

        {/* Per-question review */}
        <div style={{ color: C.muted, fontSize: 10, letterSpacing: 4, marginBottom: 12 }}>QUESTION REVIEW</div>
        {questions.map((q, i) => {
          const ua = answers[q.id];
          const ok = ua === q.answer;
          return (
            <div key={q.id} style={{ background: C.card, border: `1px solid ${ok ? "#1a3d2b" : "#3d1a1a"}`, borderRadius: 12, padding: "18px 22px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 11 }}>Q{i + 1} · {q.lab}</span>
                <span style={{ color: ok ? C.accent : C.danger, fontSize: 11, fontWeight: 700 }}>{ok ? "✓ CORRECT" : "✗ WRONG"}</span>
              </div>
              <div style={{ color: C.text, fontSize: 13, marginBottom: 10, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.question}</div>
              {!ok && <div style={{ color: C.danger, fontSize: 12, marginBottom: 4 }}>Your answer: {ua || "— time expired"}</div>}
              <div style={{ color: C.accent, fontSize: 12, marginBottom: 8 }}>Correct answer: {q.answer}</div>
              <div style={{ color: C.muted, fontSize: 11, borderTop: `1px solid ${C.dim}`, paddingTop: 8, lineHeight: 1.6 }}>💡 {q.explanation}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("register");
  const [student, setStudent] = useState({ name: "", roll: "" });
  const [result, setResult] = useState(null);
  const startTime = useRef(null);

  const handleStart = (name, roll) => {
    setStudent({ name, roll });
    startTime.current = new Date().toISOString();
    setPhase("quiz");
  };

  const handleFinish = async (questions, answers, tabWarnings) => {
    setPhase("submitting");
    const score = questions.reduce((a, q) => answers[q.id] === q.answer ? a + 1 : a, 0);
    const pct = Math.round((score / QUIZ_SIZE) * 100);

    const detailedAnswers = questions.map((q, i) => ({
      q: i + 1,
      lab: q.lab,
      studentAnswer: answers[q.id] || "NO ANSWER",
      correct: answers[q.id] === q.answer ? "YES" : "NO",
      correctAnswer: q.answer,
    }));

    const payload = {
      action: "submit",
      timestamp: new Date().toISOString(),
      startTime: startTime.current,
      name: student.name,
      rollNumber: student.roll,
      score: score,
      total: QUIZ_SIZE,
      percentage: pct,
      tabWarnings,
      answers: JSON.stringify(detailedAnswers),
    };

    let submitStatus = "demo";
    if (SHEET_SUBMIT_URL !== "YOUR_APPS_SCRIPT_URL_HERE") {
      try {
        await fetch(SHEET_SUBMIT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        submitStatus = "ok";
      } catch {
        submitStatus = "error";
      }
    }

    setResult({ questions, answers, tabWarnings, submitStatus });
    setPhase("result");
  };

  if (phase === "register")   return <RegisterScreen onStart={handleStart} />;
  if (phase === "quiz")       return <QuizScreen studentName={student.name} rollNumber={student.roll} onFinish={handleFinish} />;
  if (phase === "submitting") return <SubmittingScreen />;
  if (phase === "result")     return <ResultScreen studentName={student.name} rollNumber={student.roll} {...result} />;
}
