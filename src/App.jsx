import React, { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "./firebase/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEFAULT_SYLLABUS } from "./syllabus/syllabus";

const STATUSES = {
  none: { label: "Not started", color: "var(--dim)", dot: "var(--dim)" },
  learning: { label: "Learning", color: "#BA7517", dot: "#EF9F27" },
  revised: { label: "Revised", color: "#0F6E56", dot: "#1D9E75" },
  mastered: { label: "Mastered", color: "#185FA5", dot: "#378ADD" },
};
const STATUS_ORDER = ["none", "learning", "revised", "mastered"];

const PYQ = {
  none: { label: "—", color: "var(--dim)" },
  attempted: { label: "Attempted", color: "#BA7517" },
  done: { label: "Solved", color: "#0F6E56" },
};
const PYQ_ORDER = ["none", "attempted", "done"];

const PRIORITY = {
  none: { label: "—", color: "var(--dim)" },
  low: { label: "Low", color: "#5DCAA5" },
  med: { label: "Medium", color: "#BA7517" },
  high: { label: "High", color: "#A32D2D" },
};
const PRIORITY_ORDER = ["none", "low", "med", "high"];

function cycle(order, cur) {
  const i = order.indexOf(cur);
  return order[(i + 1) % order.length];
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(fromISO, toISO) {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(toISO + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

function relativeDays(iso) {
  if (!iso) return "never";
  const d = daysBetween(iso, todayISO());
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Detect a link's kind from its URL, for icons and future filtering.
function linkType(url) {
  const u = (url || "").toLowerCase();
  if (/\.pdf($|\?)/.test(u) || u.includes("adobe.com") || u.includes("acrobat"))
    return "pdf";
  if (
    u.includes("youtube.com") ||
    u.includes("youtu.be") ||
    u.includes("vimeo.com")
  )
    return "video";
  if (
    u.includes("onedrive") ||
    u.includes("sharepoint") ||
    u.includes("1drv.ms")
  )
    return "onedrive";
  if (u.includes("drive.google") || u.includes("docs.google"))
    return "drive";
  if (u.includes("github.com")) return "github";
  return "web";
}

// Small inline-SVG brand-ish icons (drawn, not copied, to stay simple
// and license-clean). Each returns a 14px glyph tinted to the brand.
function LinkIcon({ type }) {
  const common = { width: 14, height: 14, viewBox: "0 0 24 24", "aria-hidden": true };
  switch (type) {
    case "pdf":
      return (
        <svg {...common}>
          <path fill="#E24B4A" d="M6 2h9l5 5v15a0 0 0 0 1 0 0H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <path fill="#fff" d="M8 13h1.6c1 0 1.6.5 1.6 1.4S10.6 16 9.6 16H9v1.6H8V13zm1 2.2h.5c.4 0 .6-.2.6-.6s-.2-.6-.6-.6H9v1.2zM12 13h1.4c1.2 0 2 .8 2 2.3s-.8 2.3-2 2.3H12V13zm1 3.7h.3c.6 0 1-.4 1-1.4s-.4-1.4-1-1.4H13v2.8zM16 13h2.4v.9H17v.9h1.3v.9H17V18h-1V13z" />
        </svg>
      );
    case "video":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="4" fill="#E24B4A" />
          <path fill="#fff" d="M10 8.5l6 3.5-6 3.5z" />
        </svg>
      );
    case "onedrive":
      return (
        <svg {...common}>
          <path fill="#0F6CBD" d="M6.5 18a3.5 3.5 0 0 1-.3-7 5 5 0 0 1 9.4-1.6A4 4 0 0 1 20 13a3 3 0 0 1-3 3H6.5z" />
        </svg>
      );
    case "drive":
      return (
        <svg {...common}>
          <path fill="#1D9E75" d="M9 3h6l6 10.5-3 5.5H6l-3-5.5z" />
          <path fill="#3B6D11" d="M9 3l-6 10.5h6L15 3z" opacity="0.35" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path fill="var(--ink)" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path fill="none" stroke="#185FA5" strokeWidth="2" d="M9 15l6-6M8 8h-.5A3.5 3.5 0 0 0 4 11.5v0A3.5 3.5 0 0 0 7.5 15H9m6-7h1.5A3.5 3.5 0 0 1 20 11.5v0A3.5 3.5 0 0 1 16.5 15H15" />
        </svg>
      );
  }
}

function authMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That doesn't look like a valid email.";
    case "auth/missing-password":
      return "Enter a password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account already exists for this email. Try signing in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// ---- Auth gate: email + password ----
export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("gate-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gate-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const submit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(authMessage(err.code));
    }
    setBusy(false);
  };

  if (!authReady)
    return (
      <div style={{ ...styles.page, textAlign: "center", color: "var(--dim)" }}>
        <style>{css}</style>
        Checking sign-in…
      </div>
    );

  if (!user)
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.loginTopbar}>
          <button className="reset-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
        <div style={styles.loginBox}>
          <div style={styles.eyebrow}>GATE CSE · Preparation</div>
          <h1 style={styles.h1}>Syllabus tracker</h1>
          <p style={styles.sub}>
            {mode === "signup"
              ? "Create an account to sync your progress across devices."
              : "Sign in to sync your progress across devices."}
          </p>

          <form onSubmit={submit} style={styles.authForm}>
            <input
              className="note auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="note auth-input"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
            <button
              type="submit"
              className="add-btn add-btn-strong"
              disabled={busy}
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          {error && <p style={styles.err}>{error}</p>}

          <p style={styles.switchLine}>
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              className="link-btn"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError("");
              }}
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    );

  return <Tracker user={user} theme={theme} onToggleTheme={toggleTheme} />;
}

// ---- Main tracker ----
function Tracker({ user, theme, onToggleTheme }) {
  const [syllabus, setSyllabus] = useState(null);
  const [data, setData] = useState({});
  const [mocks, setMocks] = useState([]);
  const [hours, setHours] = useState([]);
  const [settings, setSettings] = useState({ examDate: "" });
  const [resources, setResources] = useState([]);

  const [open, setOpen] = useState({});
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("syllabus"); // syllabus | dashboard | mocks | hours
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newSubject, setNewSubject] = useState("");
  const [topicDraft, setTopicDraft] = useState({});
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [detail, setDetail] = useState(null); // { subj, topic } or null
  const openDetail = (subj, topic) => setDetail({ subj, topic });
  const closeDetail = () => setDetail(null);

  const userDoc = useMemo(() => doc(db, "users", user.uid), [user.uid]);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const snap = await getDoc(userDoc);
      let syl = DEFAULT_SYLLABUS;
      let prog = {};
      let mk = [];
      let hr = [];
      let st = { examDate: "" };
      let res = [];
      if (snap.exists()) {
        const saved = snap.data();
        if (saved.syllabus) syl = saved.syllabus;
        if (saved.data) prog = saved.data;
        if (Array.isArray(saved.mocks)) mk = saved.mocks;
        if (Array.isArray(saved.hours)) hr = saved.hours;
        if (saved.settings) st = { ...st, ...saved.settings };
        if (Array.isArray(saved.resources)) res = saved.resources;
      } else {
        await setDoc(userDoc, {
          syllabus: DEFAULT_SYLLABUS,
          data: {},
          mocks: [],
          hours: [],
          settings: { examDate: "" },
          resources: [],
        });
      }
      setSyllabus(syl);
      setData(prog);
      setMocks(mk);
      setHours(hr);
      setSettings(st);
      setResources(res);
      setOpen((prev) => {
        const o = { ...prev };
        Object.keys(syl).forEach((s) => {
          if (!(s in o)) o[s] = false;
        });
        return o;
      });
      setLoadError(false);
      setLoaded(true);
    } catch (e) {
      console.error("Failed to load tracker", e);
      setLoadError(true);
      setLoaded(true);
    }
    setRefreshing(false);
  }, [userDoc]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Central save. Pass any subset of fields to override; the rest come
  // from current state. Adding a new top-level field later is one line.
  const persist = useCallback(
    async (patch) => {
      if (loadError) {
        console.warn("Save blocked: data has not loaded cleanly yet.");
        return;
      }
      const next = {
        syllabus,
        data,
        mocks,
        hours,
        settings,
        resources,
        ...patch,
      };
      if (patch.syllabus !== undefined) setSyllabus(patch.syllabus);
      if (patch.data !== undefined) setData(patch.data);
      if (patch.mocks !== undefined) setMocks(patch.mocks);
      if (patch.hours !== undefined) setHours(patch.hours);
      if (patch.settings !== undefined) setSettings(patch.settings);
      if (patch.resources !== undefined) setResources(patch.resources);
      setSaving(true);
      try {
        await setDoc(userDoc, next, { merge: true });
      } catch (e) {
        console.error("Failed to save tracker", e);
      }
      setSaving(false);
    },
    [syllabus, data, mocks, hours, settings, resources, userDoc, loadError]
  );

  const keyFor = (subj, topic) => `${subj}::${topic}`;
  const get = (subj, topic) =>
    data[keyFor(subj, topic)] || {
      status: "none",
      pyq: "none",
      note: "",
      revCount: 0,
      lastRevised: "",
      priority: "none",
      links: [],
    };

  // Advancing status to revised/mastered stamps the date and counts a pass.
  const bump = (subj, topic, field, order) => {
    const k = keyFor(subj, topic);
    const cur = get(subj, topic);
    const nextVal = cycle(order, cur[field]);
    const patch = { [field]: nextVal };
    if (field === "status" && (nextVal === "revised" || nextVal === "mastered")) {
      patch.lastRevised = todayISO();
    }
    persist({ data: { ...data, [k]: { ...cur, ...patch } } });
  };

  const addRevision = (subj, topic) => {
    const k = keyFor(subj, topic);
    const cur = get(subj, topic);
    persist({
      data: {
        ...data,
        [k]: {
          ...cur,
          revCount: (cur.revCount || 0) + 1,
          lastRevised: todayISO(),
          status: cur.status === "none" ? "revised" : cur.status,
        },
      },
    });
  };

  const setNote = (subj, topic, note) => {
    const k = keyFor(subj, topic);
    persist({ data: { ...data, [k]: { ...get(subj, topic), note } } });
  };

  const addLink = (subj, topic, rawUrl, label) => {
    let url = (rawUrl || "").trim();
    if (!url) return;
    // Add a scheme if the user typed a bare domain, so the link works.
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const k = keyFor(subj, topic);
    const cur = get(subj, topic);
    const links = [
      ...(cur.links || []),
      { url, label: (label || "").trim(), type: linkType(url) },
    ];
    persist({ data: { ...data, [k]: { ...cur, links } } });
  };

  const removeLink = (subj, topic, idx) => {
    const k = keyFor(subj, topic);
    const cur = get(subj, topic);
    const links = (cur.links || []).filter((_, i) => i !== idx);
    persist({ data: { ...data, [k]: { ...cur, links } } });
  };

  const addSubject = () => {
    const name = newSubject.trim();
    if (!name || syllabus[name]) return;
    persist({ syllabus: { ...syllabus, [name]: [] } });
    setOpen({ ...open, [name]: true });
    setNewSubject("");
  };

  const deleteSubject = (subj) => {
    const nextSyl = { ...syllabus };
    delete nextSyl[subj];
    const nextData = { ...data };
    (syllabus[subj] || []).forEach((t) => delete nextData[keyFor(subj, t)]);
    persist({ syllabus: nextSyl, data: nextData });
  };

  const addTopic = (subj) => {
    const t = (topicDraft[subj] || "").trim();
    if (!t || syllabus[subj].includes(t)) return;
    persist({ syllabus: { ...syllabus, [subj]: [...syllabus[subj], t] } });
    setTopicDraft({ ...topicDraft, [subj]: "" });
  };

  const deleteTopic = (subj, topic) => {
    const nd = { ...data };
    delete nd[keyFor(subj, topic)];
    persist({
      syllabus: { ...syllabus, [subj]: syllabus[subj].filter((t) => t !== topic) },
      data: nd,
    });
  };

  const startEdit = (subj, topic) => {
    setEditing({ subj, topic });
    setEditText(topic);
  };

  const commitEdit = () => {
    if (!editing) return;
    const { subj, topic } = editing;
    const newName = editText.trim();
    if (!newName || newName === topic || syllabus[subj].includes(newName)) {
      setEditing(null);
      return;
    }
    const nextTopics = syllabus[subj].map((t) => (t === topic ? newName : t));
    const nextData = { ...data };
    const oldK = keyFor(subj, topic);
    if (nextData[oldK]) {
      nextData[keyFor(subj, newName)] = nextData[oldK];
      delete nextData[oldK];
    }
    persist({ syllabus: { ...syllabus, [subj]: nextTopics }, data: nextData });
    setEditing(null);
  };

  const resetToDefault = () => {
    if (
      !window.confirm(
        "Reset the whole tracker to the default GATE syllabus? This erases your custom topics AND all progress. Mocks, hours, and exam date are kept."
      )
    )
      return;
    const o = {};
    Object.keys(DEFAULT_SYLLABUS).forEach((s) => (o[s] = false));
    setOpen(o);
    persist({ syllabus: DEFAULT_SYLLABUS, data: {} });
  };

  // ---- Mock test log ----
  const addMock = (m) =>
    persist({ mocks: [{ id: uid(), ...m }, ...mocks] });
  const deleteMock = (id) =>
    persist({ mocks: mocks.filter((m) => m.id !== id) });

  // ---- Study hours log ----
  const addHours = (h) =>
    persist({ hours: [{ id: uid(), ...h }, ...hours] });
  const deleteHours = (id) =>
    persist({ hours: hours.filter((h) => h.id !== id) });

  const setExamDate = (examDate) =>
    persist({ settings: { ...settings, examDate } });

  // ---- Global links / resources ----
  const addResource = (r) =>
    persist({ resources: [{ id: uid(), ...r }, ...resources] });
  const deleteResource = (id) =>
    persist({ resources: resources.filter((r) => r.id !== id) });

  // ---- Export ----
  const exportJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { syllabus, data, mocks, hours, settings, resources },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gate-tracker-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    if (!syllabus) return { total: 0, revised: 0, mastered: 0, pyqDone: 0 };
    let total = 0, revised = 0, mastered = 0, pyqDone = 0;
    Object.entries(syllabus).forEach(([s, topics]) =>
      topics.forEach((t) => {
        total++;
        const st = get(s, t);
        if (st.status === "revised" || st.status === "mastered") revised++;
        if (st.status === "mastered") mastered++;
        if (st.pyq === "done") pyqDone++;
      })
    );
    return { total, revised, mastered, pyqDone };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, syllabus]);

  const totalHours = useMemo(
    () => hours.reduce((sum, h) => sum + (Number(h.hours) || 0), 0),
    [hours]
  );

  const daysLeft = settings.examDate
    ? daysBetween(todayISO(), settings.examDate)
    : null;

  const subjProgress = (subj) => {
    const topics = syllabus[subj];
    let done = 0;
    topics.forEach((t) => {
      const st = get(subj, t).status;
      if (st === "revised" || st === "mastered") done++;
    });
    return { done, total: topics.length };
  };

  const visible = (subj, topic) => {
    if (filter === "all") return true;
    const st = get(subj, topic);
    if (filter === "todo")
      return st.status === "none" || st.status === "learning";
    if (filter === "pyq-todo") return st.pyq !== "done";
    if (filter === "high") return st.priority === "high";
    return true;
  };

  if (loadError)
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.loginBox}>
          <div style={styles.eyebrow}>GATE CSE · Preparation</div>
          <h1 style={styles.h1}>Couldn't load your data</h1>
          <p style={styles.sub}>
            We couldn't reach the database, so editing is paused to protect
            your saved progress. Check your connection and try again.
          </p>
          <button
            className="add-btn add-btn-strong"
            onClick={loadData}
            disabled={refreshing}
            style={{ opacity: refreshing ? 0.6 : 1 }}
          >
            {refreshing ? "Retrying…" : "Retry"}
          </button>
          <p style={styles.switchLine}>
            <button className="link-btn" onClick={() => signOut(auth)}>
              Sign out
            </button>
          </p>
        </div>
      </div>
    );

  if (!loaded || !syllabus)
    return (
      <div style={{ ...styles.page, textAlign: "center", color: "var(--dim)" }}>
        <style>{css}</style>
        Loading your tracker…
      </div>
    );

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.topbar}>
        <span style={styles.userLine}>
          {user.displayName || user.email}
          <span style={styles.saveState}>
            {saving ? " · saving…" : " · synced"}
          </span>
        </span>
        <span style={styles.topbarActions}>
          <button
            className="reset-btn"
            onClick={loadData}
            disabled={refreshing}
            title="Reload from database"
          >
            {refreshing ? "…" : "↻ Refresh"}
          </button>
          <button className="reset-btn" onClick={onToggleTheme}>
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
          <button className="reset-btn" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </span>
      </div>

      <header style={styles.header}>
        <div style={styles.eyebrow}>GATE CSE · Preparation</div>
        <h1 style={styles.h1}>Syllabus tracker</h1>
        {daysLeft !== null && (
          <p style={styles.countdown}>
            {daysLeft >= 0
              ? `${daysLeft} days to exam`
              : `Exam was ${Math.abs(daysLeft)} days ago`}
          </p>
        )}
      </header>

      <nav style={styles.tabs}>
        {[
          ["syllabus", "Syllabus"],
          ["dashboard", "Dashboard"],
          ["mocks", "Mock tests"],
          ["hours", "Study hours"],
          ["links", "Links"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={tab === k ? "tab tab-on" : "tab"}
          >
            {l}
          </button>
        ))}
      </nav>

      {tab === "syllabus" && (
        <SyllabusView
          syllabus={syllabus}
          filter={filter}
          setFilter={setFilter}
          open={open}
          setOpen={setOpen}
          get={get}
          bump={bump}
          addRevision={addRevision}
          setNote={setNote}
          openDetail={openDetail}
          subjProgress={subjProgress}
          visible={visible}
          deleteSubject={deleteSubject}
          deleteTopic={deleteTopic}
          startEdit={startEdit}
          commitEdit={commitEdit}
          editing={editing}
          editText={editText}
          setEditText={setEditText}
          setEditing={setEditing}
          topicDraft={topicDraft}
          setTopicDraft={setTopicDraft}
          addTopic={addTopic}
          newSubject={newSubject}
          setNewSubject={setNewSubject}
          addSubject={addSubject}
          stats={stats}
        />
      )}

      {tab === "dashboard" && (
        <DashboardView
          stats={stats}
          syllabus={syllabus}
          subjProgress={subjProgress}
          totalHours={totalHours}
          mocks={mocks}
          daysLeft={daysLeft}
          examDate={settings.examDate}
          setExamDate={setExamDate}
          exportJSON={exportJSON}
          resetToDefault={resetToDefault}
        />
      )}

      {tab === "mocks" && (
        <MocksView mocks={mocks} addMock={addMock} deleteMock={deleteMock} />
      )}

      {tab === "hours" && (
        <HoursView
          hours={hours}
          addHours={addHours}
          deleteHours={deleteHours}
          subjects={Object.keys(syllabus).sort((a, b) => a.localeCompare(b))}
          totalHours={totalHours}
        />
      )}

      {tab === "links" && (
        <LinksTabView
          resources={resources}
          addResource={addResource}
          deleteResource={deleteResource}
        />
      )}

      <footer style={styles.footer}>
        <p style={{ margin: 0 }}>
          For your physical book: ○ not started · ◐ learning · ● revised · ★
          mastered. Everything here syncs to your account.
        </p>
      </footer>

      {detail && (
        <TopicPanel
          subj={detail.subj}
          topic={detail.topic}
          st={get(detail.subj, detail.topic)}
          onClose={closeDetail}
          bump={bump}
          addRevision={addRevision}
          setNote={setNote}
          addLink={addLink}
          removeLink={removeLink}
        />
      )}
    </div>
  );
}

// ---- Topic detail panel (focused view over one topic) ----
function TopicPanel({
  subj,
  topic,
  st,
  onClose,
  bump,
  addRevision,
  setNote,
  addLink,
  removeLink,
}) {
  const links = st.links || [];

  const hostOf = (u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return u;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.panelHead}>
          <div>
            <div style={styles.panelSubj}>{subj}</div>
            <h2 style={styles.panelTitle}>{topic}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div style={styles.panelStats}>
          <div style={styles.panelStat}>
            <div style={styles.panelStatLabel}>Status</div>
            <button
              className="pill"
              style={{ color: STATUSES[st.status].color }}
              onClick={() => bump(subj, topic, "status", STATUS_ORDER)}
            >
              {STATUSES[st.status].label}
            </button>
          </div>
          <div style={styles.panelStat}>
            <div style={styles.panelStatLabel}>PYQ</div>
            <button
              className="pill"
              style={{ color: PYQ[st.pyq].color }}
              onClick={() => bump(subj, topic, "pyq", PYQ_ORDER)}
            >
              {PYQ[st.pyq].label}
            </button>
          </div>
          <div style={styles.panelStat}>
            <div style={styles.panelStatLabel}>Priority</div>
            <button
              className="pill"
              style={{ color: PRIORITY[st.priority || "none"].color }}
              onClick={() => bump(subj, topic, "priority", PRIORITY_ORDER)}
            >
              {PRIORITY[st.priority || "none"].label}
            </button>
          </div>
        </div>

        <div style={styles.panelRevRow}>
          <span style={styles.panelRevText}>
            Revised {st.revCount || 0}× · last {relativeDays(st.lastRevised)}
          </span>
          <button className="pill pill-accent" onClick={() => addRevision(subj, topic)}>
            + Revise
          </button>
        </div>

        <div style={styles.panelSection}>
          <div style={styles.panelSectionLabel}>Note</div>
          <textarea
            className="note panel-textarea"
            placeholder="Anything worth remembering — weak spots, formulas, page numbers…"
            value={st.note}
            onChange={(e) => setNote(subj, topic, e.target.value)}
          />
        </div>

        <div style={styles.panelSection}>
          <div style={styles.panelSectionLabel}>Resources</div>
          {links.length === 0 && (
            <p style={styles.panelEmpty}>No links yet.</p>
          )}
          <div style={styles.panelLinks}>
            {links.map((lnk, i) => (
              <div key={i} style={styles.panelLinkItem}>
                <a
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.panelLinkAnchor}
                >
                  <LinkIcon type={lnk.type || linkType(lnk.url)} />
                  <span style={{ marginLeft: 6 }}>
                    {lnk.label || hostOf(lnk.url)}
                  </span>
                </a>
                <button
                  className="link-x"
                  onClick={() => removeLink(subj, topic, i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <PanelAddLink onAdd={(u, l) => addLink(subj, topic, u, l)} />
        </div>
      </div>
    </div>
  );
}

function PanelAddLink({ onAdd }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const submit = () => {
    if (!url.trim()) return;
    onAdd(url, label);
    setUrl("");
    setLabel("");
  };
  return (
    <div style={styles.panelAddLink}>
      <input
        className="note"
        style={{ marginLeft: 0, maxWidth: "100%" }}
        placeholder="Paste a link (PDF, YouTube, OneDrive, Drive…)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="note"
          style={{ marginLeft: 0, flex: 1 }}
          placeholder="label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="add-btn" onClick={submit}>
          + Add
        </button>
      </div>
    </div>
  );
}

// ---- Syllabus tab ----
function SyllabusView(p) {
  const {
    syllabus, filter, setFilter, open, setOpen, get, bump, addRevision,
    setNote, openDetail, subjProgress, visible, deleteSubject, deleteTopic, startEdit,
    commitEdit, editing, editText, setEditText, setEditing, topicDraft,
    setTopicDraft, addTopic, newSubject, setNewSubject, addSubject, stats,
  } = p;

  // Two-step delete: first click arms, second confirms.
  const [confirmDel, setConfirmDel] = useState(null); // topic key or subject name

  return (
    <>
      <div style={styles.statRow}>
        <Stat label="Topics" value={stats.total} />
        <Stat label="Revised+" value={stats.revised} accent="#0F6E56" />
        <Stat label="Mastered" value={stats.mastered} accent="#185FA5" />
        <Stat label="PYQs solved" value={stats.pyqDone} accent="#BA7517" />
      </div>

      <div style={styles.bar}>
        <div
          style={{
            ...styles.barFill,
            width: `${stats.total ? (stats.revised / stats.total) * 100 : 0}%`,
          }}
        />
      </div>
      <div style={styles.barLabel}>
        {Math.round(stats.total ? (stats.revised / stats.total) * 100 : 0)}% of
        syllabus revised
      </div>

      <div style={styles.filters}>
        {[
          ["all", "All"],
          ["todo", "Needs revision"],
          ["pyq-todo", "PYQ pending"],
          ["high", "High priority"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={filter === k ? "chip chip-on" : "chip"}
          >
            {l}
          </button>
        ))}
      </div>

      {Object.entries(syllabus)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([subj, topics]) => {
        const pr = subjProgress(subj);
        const rows = topics.filter((t) => visible(subj, t));
        return (
          <section key={subj} style={styles.subject}>
            <div style={styles.subjHead}>
              <button
                style={styles.subjNameBtn}
                onClick={() => setOpen({ ...open, [subj]: !open[subj] })}
              >
                <span style={styles.caret}>{open[subj] ? "▾" : "▸"}</span>
                <span style={styles.subjName}>{subj}</span>
              </button>
              <span style={styles.subjRight}>
                <span style={styles.subjCount}>
                  {pr.done}/{pr.total}
                </span>
                {confirmDel === `s:${subj}` ? (
                  <>
                    <button
                      className="pill pill-danger"
                      onClick={() => {
                        deleteSubject(subj);
                        setConfirmDel(null);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="pill pill-quiet"
                      onClick={() => setConfirmDel(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="icon-btn"
                    title="Delete subject"
                    onClick={() => setConfirmDel(`s:${subj}`)}
                  >
                    ✕
                  </button>
                )}
              </span>
            </div>

            {open[subj] && (
              <>
                {rows.map((topic) => {
                  const st = get(subj, topic);
                  const isEdit =
                    editing && editing.subj === subj && editing.topic === topic;
                  return (
                    <div key={topic} style={styles.row}>
                      <div style={styles.topicLine}>
                        <span
                          style={{
                            ...styles.statusDot,
                            background: STATUSES[st.status].dot,
                          }}
                        />
                        {isEdit ? (
                          <input
                            className="note edit-inline"
                            autoFocus
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") setEditing(null);
                            }}
                          />
                        ) : (
                          <span
                            style={styles.topicName}
                            onDoubleClick={() => startEdit(subj, topic)}
                            title="Double-click to rename"
                          >
                            {topic}
                          </span>
                        )}
                        {st.revCount > 0 && (
                          <span style={styles.revBadge}>×{st.revCount}</span>
                        )}
                        {(st.links || []).length > 0 && (
                          <span style={styles.linkCount}>
                            🔗 {(st.links || []).length}
                          </span>
                        )}
                        <button
                          className="expand-btn"
                          title="Open topic details"
                          onClick={() => openDetail(subj, topic)}
                        >
                          ⤢
                        </button>
                      </div>

                      <div style={styles.metaLine}>
                        <span>last: {relativeDays(st.lastRevised)}</span>
                      </div>

                      <div style={styles.controls}>
                        <button
                          className="pill"
                          style={{ color: STATUSES[st.status].color }}
                          onClick={() => bump(subj, topic, "status", STATUS_ORDER)}
                        >
                          {STATUSES[st.status].label}
                        </button>
                        <button
                          className="pill"
                          style={{ color: PYQ[st.pyq].color }}
                          onClick={() => bump(subj, topic, "pyq", PYQ_ORDER)}
                        >
                          PYQ: {PYQ[st.pyq].label}
                        </button>
                        <button
                          className="pill"
                          style={{ color: PRIORITY[st.priority || "none"].color }}
                          onClick={() =>
                            bump(subj, topic, "priority", PRIORITY_ORDER)
                          }
                        >
                          ! {PRIORITY[st.priority || "none"].label}
                        </button>
                        <button
                          className="pill pill-accent"
                          onClick={() => addRevision(subj, topic)}
                          title="Log a revision pass"
                        >
                          + Revise
                        </button>
                        {confirmDel === `t:${subj}::${topic}` ? (
                          <>
                            <button
                              className="pill pill-danger"
                              onClick={() => {
                                deleteTopic(subj, topic);
                                setConfirmDel(null);
                              }}
                            >
                              Confirm delete
                            </button>
                            <button
                              className="pill pill-quiet"
                              onClick={() => setConfirmDel(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="pill pill-quiet"
                            onClick={() => setConfirmDel(`t:${subj}::${topic}`)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <input
                        className="note topic-note"
                        placeholder="note (source, weak spot…)"
                        value={st.note}
                        onChange={(e) => setNote(subj, topic, e.target.value)}
                      />
                    </div>
                  );
                })}
                <div style={styles.addTopicRow}>
                  <input
                    className="note add-input"
                    placeholder={`Add a topic to ${subj}…`}
                    value={topicDraft[subj] || ""}
                    onChange={(e) =>
                      setTopicDraft({ ...topicDraft, [subj]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && addTopic(subj)}
                  />
                  <button className="add-btn" onClick={() => addTopic(subj)}>
                    + Add
                  </button>
                </div>
              </>
            )}
          </section>
        );
      })}

      <div style={styles.addSubjectBox}>
        <input
          className="note add-input"
          placeholder="New subject name…"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
        />
        <button className="add-btn add-btn-strong" onClick={addSubject}>
          + Add subject
        </button>
      </div>
    </>
  );
}

// ---- Dashboard tab ----
function DashboardView(p) {
  const {
    stats, syllabus, subjProgress, totalHours, mocks, daysLeft, examDate,
    setExamDate, exportJSON, resetToDefault,
  } = p;

  const revisedPct = stats.total
    ? Math.round((stats.revised / stats.total) * 100)
    : 0;
  const pyqPct = stats.total
    ? Math.round((stats.pyqDone / stats.total) * 100)
    : 0;
  const bestMock = mocks.reduce(
    (best, m) => {
      const pct = m.maxScore ? (m.score / m.maxScore) * 100 : 0;
      return pct > best ? pct : best;
    },
    0
  );

  return (
    <>
      <div style={styles.statRow}>
        <Stat label="Days to exam" value={daysLeft !== null ? daysLeft : "—"} accent="#A32D2D" />
        <Stat label="Revised" value={`${revisedPct}%`} accent="#0F6E56" />
        <Stat label="PYQ coverage" value={`${pyqPct}%`} accent="#BA7517" />
        <Stat label="Hours logged" value={Math.round(totalHours)} accent="#185FA5" />
      </div>

      <div style={styles.examRow}>
        <label style={styles.examLabel}>Exam date</label>
        <input
          type="date"
          className="note"
          style={{ marginLeft: 0, maxWidth: 200 }}
          value={examDate || ""}
          onChange={(e) => setExamDate(e.target.value)}
        />
      </div>

      <h2 style={styles.h2}>Per-subject progress</h2>
      {Object.keys(syllabus)
        .sort((a, b) => a.localeCompare(b))
        .map((subj) => {
        const pr = subjProgress(subj);
        const pct = pr.total ? Math.round((pr.done / pr.total) * 100) : 0;
        return (
          <div key={subj} style={styles.subjBarRow}>
            <div style={styles.subjBarHead}>
              <span style={styles.subjBarName}>{subj}</span>
              <span style={styles.subjBarPct}>
                {pr.done}/{pr.total}
              </span>
            </div>
            <div style={styles.bar}>
              <div style={{ ...styles.barFill, width: `${pct}%` }} />
            </div>
          </div>
        );
      })}

      <h2 style={styles.h2}>Mock tests</h2>
      {mocks.length === 0 ? (
        <p style={styles.sub}>No mocks logged yet. Add them in the Mock tests tab.</p>
      ) : (
        <div style={styles.statRow}>
          <Stat label="Attempts" value={mocks.length} />
          <Stat label="Best %" value={`${Math.round(bestMock)}%`} accent="#0F6E56" />
        </div>
      )}

      <h2 style={styles.h2}>Data</h2>
      <div style={styles.controls}>
        <button className="add-btn" onClick={exportJSON}>
          ↓ Export backup (JSON)
        </button>
        <button className="reset-btn" onClick={resetToDefault}>
          Reset syllabus to default
        </button>
      </div>
    </>
  );
}

// ---- Mock tests tab ----
function MocksView({ mocks, addMock, deleteMock }) {
  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [weakAreas, setWeakAreas] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!score) return;
    addMock({
      date,
      name: name.trim() || "Mock",
      score: Number(score),
      maxScore: Number(maxScore) || 100,
      weakAreas: weakAreas.trim(),
      note: note.trim(),
    });
    setName("");
    setScore("");
    setWeakAreas("");
    setNote("");
  };

  return (
    <>
      <div style={styles.formCard}>
        <div style={styles.formGrid}>
          <input type="date" className="note" style={inp} value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="note" style={inp} placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="note" style={inp} type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} />
          <input className="note" style={inp} type="number" placeholder="Out of" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
        </div>
        <input className="note" style={{ marginLeft: 0, maxWidth: "100%" }} placeholder="Weak areas (comma separated)" value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} />
        <input className="note" style={{ marginLeft: 0, maxWidth: "100%" }} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="add-btn add-btn-strong" onClick={submit}>
          + Log mock
        </button>
      </div>

      {mocks.length === 0 && <p style={styles.sub}>No mocks logged yet.</p>}
      {mocks.map((m) => {
        const pct = m.maxScore ? Math.round((m.score / m.maxScore) * 100) : 0;
        return (
          <div key={m.id} style={styles.logCard}>
            <div style={styles.logHead}>
              <span style={styles.logTitle}>{m.name}</span>
              <span style={styles.logScore}>
                {m.score}/{m.maxScore} · {pct}%
              </span>
            </div>
            <div style={styles.metaLine}>{m.date}</div>
            {m.weakAreas && (
              <div style={styles.weakLine}>Weak: {m.weakAreas}</div>
            )}
            {m.note && <div style={styles.metaLine}>{m.note}</div>}
            <button className="pill pill-quiet" onClick={() => deleteMock(m.id)}>
              Delete
            </button>
          </div>
        );
      })}
    </>
  );
}

// ---- Study hours tab ----
function HoursView({ hours, addHours, deleteHours, subjects, totalHours }) {
  const [date, setDate] = useState(todayISO());
  const [hrs, setHrs] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!hrs) return;
    addHours({
      date,
      hours: Number(hrs),
      subject: subject || "",
      note: note.trim(),
    });
    setHrs("");
    setNote("");
  };

  // last 7 days total
  const last7 = hours
    .filter((h) => daysBetween(h.date, todayISO()) <= 6 && daysBetween(h.date, todayISO()) >= 0)
    .reduce((s, h) => s + (Number(h.hours) || 0), 0);

  return (
    <>
      <div style={styles.statRow}>
        <Stat label="Total hours" value={Math.round(totalHours)} accent="#185FA5" />
        <Stat label="Last 7 days" value={Math.round(last7)} accent="#0F6E56" />
        <Stat label="Sessions" value={hours.length} />
      </div>

      <div style={styles.formCard}>
        <div style={styles.formGrid}>
          <input type="date" className="note" style={inp} value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="note" style={inp} type="number" step="0.5" placeholder="Hours" value={hrs} onChange={(e) => setHrs(e.target.value)} />
          <select className="note" style={inp} value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subject (optional)</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <input className="note" style={{ marginLeft: 0, maxWidth: "100%" }} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="add-btn add-btn-strong" onClick={submit}>
          + Log hours
        </button>
      </div>

      {hours.length === 0 && <p style={styles.sub}>No hours logged yet.</p>}
      {hours.map((h) => (
        <div key={h.id} style={styles.logCard}>
          <div style={styles.logHead}>
            <span style={styles.logTitle}>
              {h.hours}h{h.subject ? ` · ${h.subject}` : ""}
            </span>
            <span style={styles.metaLine}>{h.date}</span>
          </div>
          {h.note && <div style={styles.metaLine}>{h.note}</div>}
          <button className="pill pill-quiet" onClick={() => deleteHours(h.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

// ---- Links tab: global resource library ----
function LinksTabView({ resources, addResource, deleteResource }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const hostOf = (u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return u;
    }
  };

  const submit = () => {
    let u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    addResource({
      url: u,
      label: label.trim(),
      category: category.trim() || "General",
      type: linkType(u),
    });
    setUrl("");
    setLabel("");
    setCategory("");
  };

  // group by category
  const groups = {};
  resources.forEach((r) => {
    const c = r.category || "General";
    (groups[c] = groups[c] || []).push(r);
  });
  const categoryNames = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  // existing categories for the datalist
  const existingCats = [...new Set(resources.map((r) => r.category || "General"))];

  return (
    <>
      <p style={styles.sub}>
        Your link library — websites, playlists, drives, PDFs you keep coming
        back to. Group them with a category (e.g. “PYQ sites”, “YouTube
        channels”, “Notes”).
      </p>

      <div style={styles.formCard}>
        <input
          className="note"
          placeholder="Paste a link (https://…)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <div style={styles.formGrid}>
          <input
            className="note"
            placeholder="Label (e.g. GATE Overflow)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <input
            className="note"
            list="cat-list"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <datalist id="cat-list">
            {existingCats.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <button className="add-btn add-btn-strong" onClick={submit}>
          + Add link
        </button>
      </div>

      {resources.length === 0 && (
        <p style={styles.sub}>No links saved yet.</p>
      )}

      {categoryNames.map((cat) => (
        <section key={cat} style={{ marginBottom: 18 }}>
          <h2 style={styles.linkCatHead}>{cat}</h2>
          {groups[cat].map((r) => (
            <div key={r.id} style={styles.panelLinkItem}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.panelLinkAnchor}
                title={r.url}
              >
                <LinkIcon type={r.type || linkType(r.url)} />
                <span style={{ marginLeft: 6 }}>
                  {r.label || hostOf(r.url)}
                </span>
              </a>
              {confirmId === r.id ? (
                <span style={{ display: "flex", gap: 6 }}>
                  <button
                    className="pill pill-danger"
                    onClick={() => {
                      deleteResource(r.id);
                      setConfirmId(null);
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="pill pill-quiet"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  className="link-x"
                  onClick={() => setConfirmId(r.id)}
                  title="Delete link"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={styles.stat}>
      <div style={{ ...styles.statVal, color: accent || "var(--ink)" }}>
        {value}
      </div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const inp = { marginLeft: 0, maxWidth: "100%" };

const styles = {
  page: {
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    background: "var(--paper)",
    color: "var(--ink)",
    minHeight: "100vh",
    padding: "32px 20px 60px",
    maxWidth: 720,
    margin: "0 auto",
    boxSizing: "border-box",
    position: "relative",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    fontFamily: "ui-monospace, monospace",
    fontSize: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  topbarActions: { display: "flex", gap: 8, alignItems: "center" },
  loginTopbar: { display: "flex", justifyContent: "flex-end", marginBottom: 8 },
  userLine: { color: "var(--ink-soft)" },
  saveState: { color: "var(--dim)" },
  loginBox: { marginTop: 60, textAlign: "left" },
  authForm: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 340 },
  switchLine: { fontSize: 13, color: "var(--dim)", marginTop: 16 },
  err: { color: "#A32D2D", fontSize: 13, marginTop: 12 },
  header: { marginBottom: 16 },
  eyebrow: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#BA7517",
    marginBottom: 8,
  },
  h1: { fontSize: 34, fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.02em" },
  h2: { fontSize: 18, fontWeight: 600, margin: "28px 0 12px" },
  countdown: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 13,
    color: "#A32D2D",
    margin: 0,
  },
  sub: { fontSize: 15, color: "var(--dim)", margin: "0 0 18px", lineHeight: 1.5 },
  tabs: {
    display: "flex",
    gap: 4,
    marginBottom: 22,
    borderBottom: "1px solid var(--line)",
    flexWrap: "wrap",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginBottom: 18,
  },
  stat: {
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "12px 10px",
    textAlign: "center",
  },
  statVal: { fontSize: 24, fontWeight: 600, lineHeight: 1 },
  statLabel: {
    fontSize: 11,
    color: "var(--dim)",
    marginTop: 6,
    fontFamily: "ui-monospace, monospace",
    letterSpacing: "0.04em",
  },
  bar: {
    height: 8,
    background: "var(--track)",
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    height: "100%",
    background: "#1D9E75",
    borderRadius: 99,
    transition: "width 0.3s ease",
  },
  barLabel: {
    fontSize: 12,
    color: "var(--dim)",
    marginBottom: 20,
    fontFamily: "ui-monospace, monospace",
  },
  filters: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  subject: { marginBottom: 10 },
  subjHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--line)",
    padding: "10px 2px",
  },
  subjNameBtn: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--ink)",
    padding: 0,
    textAlign: "left",
  },
  subjName: { fontSize: 18, fontWeight: 600 },
  caret: { color: "var(--dim)", fontSize: 13, width: 12 },
  subjRight: { display: "flex", alignItems: "center", gap: 10 },
  subjCount: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 13,
    color: "var(--dim)",
  },
  row: { padding: "12px 2px 12px 22px", borderBottom: "1px solid var(--line-soft)" },
  topicLine: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  statusDot: { width: 9, height: 9, borderRadius: 99, flexShrink: 0 },
  topicName: { fontSize: 15, lineHeight: 1.3, cursor: "text" },
  revBadge: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    color: "#0F6E56",
    background: "var(--track)",
    padding: "1px 6px",
    borderRadius: 99,
  },
  linkCount: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    color: "#185FA5",
    background: "var(--track)",
    padding: "1px 6px",
    borderRadius: 99,
  },
  metaLine: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    color: "var(--dim)",
    marginLeft: 19,
    marginBottom: 6,
  },
  weakLine: { fontSize: 13, color: "#A32D2D", marginBottom: 6 },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "5vh 16px",
    zIndex: 100,
    overflowY: "auto",
  },
  panel: {
    background: "var(--paper)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 560,
    boxSizing: "border-box",
    maxHeight: "90vh",
    overflowY: "auto",
    margin: "auto",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  panelSubj: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#BA7517",
    marginBottom: 4,
  },
  panelTitle: { fontSize: 24, fontWeight: 600, margin: 0, lineHeight: 1.2 },
  panelStats: { display: "flex", gap: 20, marginBottom: 18, flexWrap: "wrap" },
  panelStat: { display: "flex", flexDirection: "column", gap: 6 },
  panelStatLabel: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    color: "var(--dim)",
  },
  panelRevRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--line)",
    borderBottom: "1px solid var(--line)",
    marginBottom: 18,
  },
  panelRevText: { fontSize: 13, color: "var(--ink-soft)" },
  panelSection: { marginBottom: 20 },
  panelSectionLabel: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 12,
    color: "var(--ink-soft)",
    marginBottom: 8,
  },
  panelEmpty: { fontSize: 13, color: "var(--dim)", margin: "0 0 8px" },
  panelLinks: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 },
  panelLinkItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "8px 12px",
    marginBottom: 6,
  },
  panelLinkAnchor: {
    color: "#185FA5",
    textDecoration: "none",
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
  },
  panelAddLink: { display: "flex", flexDirection: "column", gap: 8 },
  linkCatHead: {
    fontSize: 15,
    fontWeight: 600,
    margin: "0 0 8px",
    paddingBottom: 6,
    borderBottom: "1px solid var(--line)",
    color: "#BA7517",
  },
  controls: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
    marginLeft: 19,
    flexWrap: "wrap",
  },
  addTopicRow: {
    display: "flex",
    gap: 8,
    padding: "10px 2px 4px 22px",
    alignItems: "center",
  },
  addSubjectBox: {
    display: "flex",
    gap: 8,
    marginTop: 20,
    paddingTop: 18,
    borderTop: "1px solid var(--line)",
    alignItems: "center",
  },
  examRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  examLabel: { fontSize: 14, color: "var(--ink-soft)" },
  subjBarRow: { marginBottom: 14 },
  subjBarHead: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subjBarName: { fontSize: 14 },
  subjBarPct: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 12,
    color: "var(--dim)",
  },
  formCard: {
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
  },
  logCard: {
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 10,
  },
  logHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  logTitle: { fontSize: 16, fontWeight: 600 },
  logScore: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 14,
    color: "#0F6E56",
  },
  footer: {
    marginTop: 30,
    paddingTop: 16,
    borderTop: "1px solid var(--line)",
    fontSize: 12.5,
    color: "var(--dim)",
    lineHeight: 1.6,
  },
};

const css = `
  :root {
    --ink: #1c1a17;
    --ink-soft: #6b665c;
    --ink-faint: #a49e90;
    --ink-hover: #333;
    --dim: #9b9689;
    --paper: #faf8f3;
    --card: #ffffff;
    --card-input: #fffdf9;
    --line: #e5e1d8;
    --line-soft: #f0ece3;
    --border-strong: #c9c3b6;
    --track: #ece7dd;
    --placeholder: #bdb8ab;
    --danger-soft: #b09a9a;
  }
  [data-theme="dark"] {
    --ink: #ece9e2;
    --ink-soft: #b8b3a8;
    --ink-faint: #7d786e;
    --ink-hover: #f5f2ea;
    --dim: #8a857a;
    --paper: #1a1917;
    --card: #262421;
    --card-input: #2b2825;
    --line: #38352f;
    --line-soft: #302d28;
    --border-strong: #4a463f;
    --track: #322f2a;
    --placeholder: #6b665c;
    --danger-soft: #a87a7a;
  }
  .tab {
    font-family: ui-monospace, monospace;
    font-size: 13px;
    padding: 8px 14px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--dim);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tab-on { color: var(--ink); border-bottom-color: #BA7517; font-weight: 600; }
  .chip {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    padding: 6px 12px;
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 99px;
    cursor: pointer;
    color: var(--ink-soft);
    letter-spacing: 0.02em;
  }
  .chip-on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .pill {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    padding: 5px 12px;
    border: 1px solid var(--line);
    background: var(--card);
    border-radius: 7px;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--ink);
  }
  .pill:hover { border-color: var(--border-strong); }
  .pill-quiet { color: var(--ink-faint) !important; font-weight: 400; }
  .pill-quiet:hover { color: var(--ink-soft) !important; }
  .pill-accent { color: #0F6E56 !important; border-color: #9FE1CB; }
  .pill-danger {
    color: #fff !important; background: #A32D2D !important;
    border-color: #A32D2D !important;
  }
  .pill-danger:hover { background: #791F1F !important; }
  .icon-btn {
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--placeholder);
    border-radius: 6px;
    width: 24px; height: 24px;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
  }
  .icon-btn:hover { color: #A32D2D; border-color: #e0b4b4; }
  .note {
    width: 100%;
    margin-left: 0;
    box-sizing: border-box;
    max-width: 100%;
    font-family: inherit;
    font-size: 13px;
    padding: 6px 10px;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: var(--card-input);
    color: var(--ink);
  }
  .note::placeholder { color: var(--placeholder); font-style: italic; }
  .note:focus { outline: none; border-color: #BA7517; }
  .topic-note { margin-left: 19px; max-width: calc(100% - 19px); }
  .edit-inline { margin-left: 0; max-width: 100%; font-size: 15px; }
  .add-input { margin-left: 0; max-width: 100%; flex: 1; }
  .add-btn {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    padding: 7px 14px;
    border: 1px solid var(--border-strong);
    background: var(--card);
    border-radius: 7px;
    cursor: pointer;
    white-space: nowrap;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .add-btn:hover { border-color: #BA7517; color: #BA7517; }
  .add-btn-strong { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .add-btn-strong:hover { background: var(--ink-hover); color: var(--paper); border-color: var(--ink-hover); }
  .reset-btn {
    font-family: ui-monospace, monospace;
    font-size: 11px;
    padding: 6px 12px;
    border: 1px solid var(--line);
    background: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--danger-soft);
  }
  .reset-btn:hover { color: #A32D2D; border-color: #e0b4b4; }
  .auth-input { margin-left: 0; max-width: 100%; font-size: 14px; padding: 9px 12px; }
  .link-btn {
    background: none; border: none; padding: 0; cursor: pointer;
    color: #BA7517; font-family: inherit; font-size: 13px;
    text-decoration: underline;
  }
  .link-btn:hover { color: #8a560f; }
  .link-x {
    background: none; border: none; cursor: pointer;
    color: var(--ink-faint); font-size: 15px; line-height: 1;
    padding: 0 2px;
  }
  .link-x:hover { color: #A32D2D; }
  .link-input {
    margin-left: 0; max-width: 220px; width: auto; flex: 0 1 200px;
    font-size: 12px; padding: 5px 8px;
  }
  .expand-btn {
    background: none; border: 1px solid var(--line); border-radius: 6px;
    cursor: pointer; color: var(--ink-faint); font-size: 12px;
    width: 24px; height: 22px; line-height: 1; margin-left: auto;
  }
  .expand-btn:hover { color: #185FA5; border-color: #85B7EB; }
  .panel-textarea {
    margin-left: 0; max-width: 100%; min-height: 80px; resize: vertical;
    line-height: 1.5;
  }
`;