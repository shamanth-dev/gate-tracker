# GATE CSE — 6-Month Execution Manual
*Companion to the strategy blueprint. This document answers: HOW, WHERE, HOW MUCH, and WHEN — down to the day.*

> **Resource caveat:** Playlist names, test-series pricing, and batch structures change every cycle. Everything below reflects the ecosystem as of early 2026 — verify current prices/editions before purchase. The *selection logic* (one primary + one backup, never more) is permanent even if a specific product changes.

---

# PART A — LEARNING PATHS + RESOURCES + PROBLEM COUNTS (per subject)

Format per subject: concept sequence tree → resources (ONE primary, ONE backup) → problem quota table → subject-specific mastery notes.

The universal problem-quota logic: **Easy problems build the schema, medium problems are GATE's actual level, hard problems build the safety margin.** GATE 2-markers are "medium" by coaching-site standards; "hard" practice exists so that exam-day medium feels easy.

---

## A1. Engineering Mathematics (Discrete + Prob + LA + Calculus)

### Learning path
```
Discrete Math
│
├── Propositional Logic → First-Order Logic (quantifier negation, validity)
├── Set Theory → Relations (closure, equivalence, POSET) → Lattices
├── Functions (injective/surjective counting)
├── Combinatorics → Recurrences → (light) Generating Functions
├── Graph Theory: basics → connectivity → Euler/Hamilton → coloring → matching → planarity
└── Group Theory: axioms → order → subgroups → cyclic groups (stop here)

Probability
│
├── Counting-based probability → Conditional → Bayes
├── Random variables → Expectation/Variance → Linearity of expectation
└── Distributions: Uniform, Binomial, Poisson, Geometric, Normal (properties only)

Linear Algebra
│
├── Matrix operations → Determinant → Rank
├── System of equations (consistency conditions)
└── Eigenvalues/Eigenvectors → properties (trace, det, triangular shortcuts) → LU (light)

Calculus: Limits → Continuity/Differentiability → Maxima-Minima → Definite Integrals (light)
```
**Prerequisites:** none — this is the root of the dependency graph. Start Day 1.

### Resources
- **Primary: GO Classes Discrete Math + Engineering Math lectures (YouTube, free)** — currently the most GATE-calibrated math treatment; rigorous without going beyond exam depth.
- **Backup/reference: Kenneth Rosen** (Discrete) — for when a GO Classes proof feels too fast; solve its mid-level exercise sets for combinatorics/graphs. For LA doubts: Gilbert Strang's short videos (reference only, don't binge).
- **Notes:** self-made only (per blueprint §5). GateOverflow's subject-wise PYQ books = your question bank.

### Problem quota (before topic is "closed")
| Topic | Easy | Medium | Hard | PYQs | Topic tests |
|---|---|---|---|---|---|
| Logic (both) | 15 | 25 | 10 | all (~60) | 2 |
| Sets/Relations/Functions/Lattices | 15 | 25 | 5 | all (~50) | 1 |
| Combinatorics + Recurrences | 20 | 35 | 15 | all (~45) | 2 |
| Graph Theory | 15 | 30 | 15 | all (~55) | 2 |
| Group Theory | 10 | 15 | 5 | all (~25) | 1 |
| Probability | 20 | 35 | 15 | all (~55) | 2 |
| Linear Algebra | 15 | 25 | 10 | all (~45) | 1 |
| Calculus | 10 | 15 | 5 | all (~30) | 1 |

**Days: 26–28 total** (you have logic + graph theory momentum — those compress to revision-grade passes; combinatorics + probability deserve the surplus). Multiple-revision flag: Probability and Combinatorics (skills decay fastest — they're technique, not fact).

---

## A2. C Programming + Data Structures

### Learning path
```
C Programming
│
├── Operators, precedence, evaluation order
├── Control flow + loops (trace drills)
├── Functions → parameter passing → scope/storage classes (static!)
├── Recursion (trace 30+ functions by hand — this is a motor skill)
├── Pointers → pointer arithmetic → pointers & arrays → char* / strings
├── 2D arrays + pointer duality → function pointers (light)
└── Structs / unions / self-referential structs

Data Structures  (prereq: pointers + recursion COLD)
│
├── Arrays → Stacks (applications: infix/postfix, spans) → Queues (circular arithmetic)
├── Linked Lists (singly/doubly/circular — every op with edge cases)
├── Binary Trees → Traversals (incl. construction-from-traversals) 
├── BST (ops, counting BSTs = Catalan, order statistics)
├── AVL (rotations, min-nodes-for-height recurrence)
├── Heaps (build-heap O(n), heapify, k-largest patterns)
├── Hashing (chaining, linear/quadratic probing, double hashing — probe traces)
└── B / B+ trees (order arithmetic — shared with DBMS, learn ONCE here)
```

### Resources
- **Primary: Neso Academy C Programming (free) for C** + **your own tracing practice** (C is 70% drill, 30% content). For DS: **GO Classes / standard GATE DS lectures**.
- **Backup:** *The C Programming Language* (K&R) exercises for C edge cases; CLRS chapters 6, 10–13 for DS reference only (do not read CLRS cover-to-cover — it's a reference, not a course).

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| C output/trace questions | 30 | 40 | 15 | all (~80) | 3 |
| Stacks/Queues/Linked Lists | 20 | 30 | 10 | all (~50) | 2 |
| Trees + BST + AVL | 20 | 35 | 15 | all (~60) | 2 |
| Heaps + Hashing | 15 | 25 | 10 | all (~40) | 2 |
| B/B+ trees | 5 | 15 | 5 | all (~20) | 1 |

**Days: 22–24.** More time: pointers/recursion tracing (the single most repeated GATE pattern). Quick wins: stacks/queues. Multiple-revision flag: hashing probe sequences and AVL counting (fact-decay prone).

---

## A3. Algorithms

### Learning path
```
Asymptotics (comparing functions, log identities)
│
├── Recurrences: recursion tree → Master theorem → substitution  [you: consolidation only]
├── Divide & Conquer (merge sort, counting inversions, binary search variants)
├── Sorting: full properties table + quicksort partition behavior + heap/counting/radix
├── Greedy: activity selection → Huffman → fractional knapsack → exchange-argument intuition
├── Dynamic Programming: LCS → 0/1 knapsack → matrix chain → LIS → subset sum
├── Graph algorithms: BFS/DFS (+edge classification) → topological sort → SCC
│        → Dijkstra → Bellman-Ford → Floyd-Warshall → Prim/Kruskal (cut & cycle properties)
└── Complexity classes: P, NP, NP-complete, NP-hard, reduction direction logic
```
**Prerequisites:** DS complete; discrete graph theory helps graph algorithms enormously.

### Resources
- **Primary: GO Classes Algorithms / Abdul Bari's algorithms playlist (YouTube)** — Bari for intuition-first learning, GO Classes for GATE calibration; pick ONE as primary based on 2 sample lectures, relegate the other to backup.
- **Backup: CLRS** for precise statements of properties (reference), GateOverflow discussions for contested PYQs.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| Asymptotics + recurrences | 15 | 25 | 10 | all (~50) | 2 |
| Sorting + D&C | 15 | 25 | 10 | all (~45) | 2 |
| Greedy + DP | 15 | 30 | 15 | all (~50) | 2 |
| Graph algorithms | 20 | 35 | 15 | all (~60) | 2 |
| P/NP | 5 | 15 | 5 | all (~25) | 1 |

**Days: 20–22.** More time: graph algorithms + DP. Quick: asymptotics (your base). Multiple-revision flag: P/NP classification logic and edge-case behavior of shortest-path algorithms.

---

## A4. Theory of Computation

### Learning path
```
Basics: alphabets, strings, languages, countability
│
├── Regular: DFA → NFA → ε-NFA → equivalence → minimization (Myhill-Nerode intuition)
│        → Regular expressions ↔ automata → closure properties → pumping lemma (disproof tool)
├── Context-Free: CFG → derivations/ambiguity → simplification → CNF → PDA (intuition)
│        → CFL closure table → CFL pumping lemma → DCFL vs CFL
├── Turing Machines: model → variants (concept) → RE vs REC
└── Decidability: reductions → standard problem table → Rice's theorem → countability arguments
```
**Prerequisites:** Discrete math (logic, sets, countability). Your DM base makes this a fast subject.

### Resources
- **Primary: GO Classes TOC** (widely regarded as the strongest single-subject offering in the ecosystem).
- **Backup: Peter Linz, *An Introduction to Formal Languages and Automata*** — the exercises are GATE-adjacent gold; solve Linz exercises for regular + CFL chapters.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| Regular languages | 20 | 30 | 15 | all (~70) | 2 |
| CFL/PDA | 15 | 25 | 10 | all (~50) | 2 |
| TM + RE/REC | 10 | 15 | 5 | all (~30) | 1 |
| Decidability + Rice | 10 | 25 | 10 | all (~45) | 2 |

**Days: 16–18.** Multiple-revision flag: BOTH master tables (closure, decidability) — these are pure recall and go straight into Anki.

---

## A5. Compiler Design

### Learning path
```
Phases overview (what happens where — 1-mark factory)
│
├── Lexical analysis (regex link to TOC — nearly free after TOC)
├── FIRST/FOLLOW → LL(1) table + conflict detection
├── Bottom-up: LR(0) items → SLR(1) → CLR(1) → LALR(1) → grammar-class hierarchy
├── SDT: S-attributed vs L-attributed → evaluation questions
├── Intermediate code: three-address code, quadruples/triples
└── Runtime environment: activation records, static vs dynamic scoping → basic blocks + DAG
```
**Prerequisites:** TOC regular + CFG sections. Do Compiler immediately after TOC while CFGs are hot.

### Resources
- **Primary: GO Classes Compiler / GATE-focused compiler playlist** — mechanical subject; any GATE-calibrated source works.
- **Backup: Aho-Ullman (Dragon book)** chapters 3–5 ONLY as reference for parsing-table edge cases.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| FIRST/FOLLOW/LL | 10 | 20 | 10 | all (~35) | 1 |
| LR family | 10 | 25 | 10 | all (~40) | 2 |
| SDT + ICG + runtime | 10 | 20 | 10 | all (~40) | 1 |

**Days: 10–12.** The highest marks-per-day subject in the syllabus. Multiple-revision flag: LR item construction (procedural skill — decays without practice; schedule a 1-hour drill every 3 weeks after completion).

---

## A6. Operating Systems

### Learning path
```
Processes: states → PCB → context switch → fork() semantics (2^n drill)
│
├── Threads (user vs kernel)
├── Scheduling: FCFS → SJF/SRTF → RR → Priority → Gantt-chart speed drills
├── Synchronization: race conditions → Peterson → semaphores → classic problems
│        → "analyze this code for ME/progress/bounded-waiting" drills
├── Deadlock: 4 conditions → RAG → Banker's → prevention vs avoidance vs detection
├── Memory: contiguous → paging → multi-level page tables → TLB/EAT → segmentation
├── Virtual memory: demand paging → replacement (FIFO/LRU/Optimal, Belady) → thrashing
└── Files & disk: allocation methods → inode arithmetic → disk scheduling
```
**Prerequisites:** C (fork questions), COA memory hierarchy helps (paging ↔ cache are twin skills).

### Resources
- **Primary: GO Classes OS / a single GATE-focused OS playlist.**
- **Backup: Galvin (*Operating System Concepts*)** — reference for synchronization chapter; its exercise problems on scheduling/paging are solid secondary practice.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| Processes + scheduling + fork | 15 | 30 | 10 | all (~55) | 2 |
| Synchronization | 15 | 30 | 15 | all (~50) | 2 |
| Deadlock | 10 | 15 | 5 | all (~25) | 1 |
| Paging/VM/EAT | 20 | 35 | 15 | all (~60) | 2 |
| Files + disk | 10 | 15 | 5 | all (~25) | 1 |

**Days: 18–20.** More time: synchronization code-analysis + paging numericals. Multiple-revision flag: EAT formula variants (TLB hit/miss × page fault combinations — students perpetually confuse the composition order).

---

## A7. DBMS

### Learning path
```
ER model → ER-to-relational mapping (min/max table counting)
│
├── Relational algebra → tuple relational calculus → equivalences
├── SQL: basic → aggregation/GROUP BY/HAVING → nested → correlated (hand-trace drills)
├── FDs: Armstrong → attribute closure → candidate key hunting (speed drill) 
│        → minimal cover → normalization 1NF→BCNF → decomposition properties
├── Transactions: ACID → schedules → conflict serializability (precedence graph drill)
│        → view serializability → recoverable/cascadeless/strict
├── Concurrency: 2PL variants → timestamp ordering → deadlock in 2PL
└── Indexing: B+ tree arithmetic (imported from DS) → sparse vs dense
```
**Prerequisites:** DS (B+ trees), relational algebra benefits from set theory; OS synchronization makes concurrency intuitive.

### Resources
- **Primary: GO Classes DBMS / single GATE-focused DBMS playlist.**
- **Backup: Korth (*Database System Concepts*)** — reference for normalization edge cases and its SQL exercises.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| ER + rel. algebra | 10 | 20 | 5 | all (~35) | 1 |
| SQL | 15 | 30 | 10 | all (~45) | 2 |
| FDs + normalization | 15 | 30 | 10 | all (~50) | 2 |
| Transactions + concurrency | 15 | 25 | 10 | all (~45) | 2 |
| Indexing | 5 | 15 | 5 | all (~20) | 1 |

**Days: 14–16.** Speed-drill flags: candidate-key hunting (<2 min) and precedence graphs (<3 min) — these are exam-time gold.

---

## A8. Computer Networks

### Learning path (arithmetic-first ordering — deliberately NOT layer order)
```
Delays: transmission vs propagation → bandwidth-delay product   [arithmetic engine #1]
│
├── Sliding windows: stop-&-wait utilization → GBN → SR → sequence number space rules  [#2]
├── IP addressing: classful → CIDR → subnetting speed drills → fragmentation math  [#3]
├── TCP: handshake → flow control → congestion (slow start/AIMD window-evolution drills) [#4]
├── MAC: CSMA/CD min-frame derivation → collision math → Ethernet basics
├── Error control: CRC long-division drill → Hamming distance/code
├── Routing: distance vector (count-to-infinity) → link state → longest-prefix match
└── Glue theory: ARP/DHCP/DNS/HTTP roles (1-mark facts → Anki)
```
**Prerequisites:** probability (ARQ expected attempts). Otherwise independent — that's why it slots last.

### Resources
- **Primary: single GATE-focused CN playlist (GO Classes / equivalent).**
- **Backup: Kurose & Ross** (top-down) for TCP/congestion conceptual clarity — reference chapters 3–4 only. (Tanenbaum for MAC-layer reference if needed; never both cover-to-cover.)

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| Delays + windows | 15 | 30 | 10 | all (~45) | 2 |
| IP/subnetting | 15 | 25 | 10 | all (~40) | 2 |
| TCP | 10 | 25 | 10 | all (~35) | 1 |
| MAC + error control | 10 | 20 | 10 | all (~35) | 1 |
| Routing + app layer | 10 | 15 | 5 | all (~30) | 1 |

**Days: 14–16.** Unit-discipline subject #1: every problem solved with explicit bit/byte and ms/µs annotations, no exceptions.

---

## A9. COA

### Learning path
```
[Your K-map/RISC base slots in here — Digital Logic first if doing both]
Machine instructions → addressing modes (effective address drills)
│
├── ALU/datapath basics → instruction cycle
├── Pipelining: ideal speedup → structural/data/control hazards → forwarding cycle-count drills
│        → branch penalty arithmetic
├── Memory hierarchy: locality → cache mapping (direct/SA/FA address-split drills)
│        → replacement → write policies → AMAT → multi-level caches
├── Main memory interfacing arithmetic → DMA (cycle stealing)
└── IEEE 754 (single/double layout, range, special values) → Booth's (result-level)
```
**Prerequisites:** Digital Logic (done for you at K-map level — finish sequential circuits first).

### Resources
- **Primary: GO Classes COA / single GATE playlist.**
- **Backup: Hamacher (*Computer Organization*)** — reference for pipelining and cache chapters.

### Problem quota
| Topic | Easy | Medium | Hard | PYQs | Tests |
|---|---|---|---|---|---|
| Addressing + instruction cycle | 10 | 15 | 5 | all (~25) | 1 |
| Pipelining | 15 | 30 | 15 | all (~45) | 2 |
| Cache + memory | 20 | 35 | 15 | all (~55) | 2 |
| IEEE 754 + arithmetic + DMA | 10 | 20 | 5 | all (~30) | 1 |

**Days: 16–18** (12–14 for you, given the base). Twin-skill note: schedule cache address-split drills back-to-back with OS paging drills once — they reinforce each other.

---

## A10. Digital Logic
```
Number systems/complements → Boolean algebra → K-maps [done] → 
combinational blocks (mux/decoder/adders + delay counting) → 
flip-flops (excitation tables) → counters/state machines
```
- **Primary:** any single GATE DL playlist. **Backup:** Morris Mano (reference).
- Quota: 25 easy / 45 medium / 15 hard / all PYQs (~70) / 2 tests. **Days: 8–10** (6–7 for you).

## A11. Aptitude
- **Primary:** PYQ aptitude sets (all 15 years, all GATE papers — aptitude is shared across branches, so the bank is huge and free). **Backup:** any single aptitude YouTube playlist for weak micro-areas.
- No "study days" — 3 × 30 min/week from Month 2. Quota: ~400 questions total across 5 months, ≥93% accuracy in final month.

---

# PART B — THE UNIVERSAL MASTERY PROCESS

The same 7-step machine applied to every topic. **Advance triggers are explicit — never advance on feel.**

**Step 1 — Learn theory (1 session, max 2 for big topics).**
Watch/read ONE primary resource pass with pen active: pause every 10 min, reproduce the last idea from memory. Produce nothing polished — scratch work only.
→ *Advance when:* you can blank-page reconstruct the topic's skeleton (definitions + main procedure) immediately after the session. If you can't, re-watch the failed section only — never the whole lecture.

**Step 2 — Solve worked examples (same day, mandatory).**
5–10 solved examples: attempt BEFORE reading each solution, minimum 5 minutes of struggle.
→ *Advance when:* 3 consecutive examples solved without peeking.

**Step 3 — PYQs, untimed (next session).**
The topic's full PYQ set (per Part A quotas), grouped: 1-markers first, then 2-markers. Every error → error log with root cause. This step CALIBRATES depth — if PYQs feel harder than the theory prepared you for, the resource under-taught; go to backup for that slice only.
→ *Advance when:* ≥75% accuracy on the PYQ set. Below 75% → return to Step 1 for the specific failing sub-concepts (not the whole topic).

**Step 4 — Standard questions, timed (1–2 sessions).**
The Easy+Medium quota from Part A at GATE pace (1.5 min / 3 min budgets). Start note-making NOW — notes capture what Steps 3–4 revealed, not what Step 1 said.
→ *Advance when:* ≥85% accuracy AND within time budget on the last 15 questions.

**Step 5 — Advanced questions (1 session).**
The Hard quota. Expect 50–60% accuracy — that's the point; these map your boundary. Harvest every miss into the trap list.
→ *Advance when:* quota done (accuracy threshold does NOT apply here — hard problems are reconnaissance, not certification).

**Step 6 — Revision entry (10 min).**
Finalize ≤2-page notes, add recall facts to Anki, register the topic in the spaced queue (2d → 7d → 21d → 60d).
→ *Advance:* immediately.

**Step 7 — Topic test (2–4 days AFTER Step 6 — the delay is deliberate; testing hot memory certifies nothing).**
Fresh timed set of 20 questions (test series topic test, or unseen PYQs from adjacent years).
→ *Topic CLOSED when:* the mastery criteria below all pass. Any fail → 3-day micro-cycle (blueprint §7) → retest.

## Mastery Criteria (objective, all required)
1. **≥90% on the delayed topic test** (18/20, fresh questions, timed).
2. **≥85% on 2-markers specifically** within that test.
3. **Blank-page teach-back:** explain the topic + its 3 standard traps aloud/on paper without notes, in <5 min. (Record voice memo; if you hesitate on the traps, you don't own them.)
4. **Time compliance:** average ≤ GATE budget on the test.
5. **7-day retention check** (10 questions from the interleave queue) ≥ 90%.
"30 consecutive correct" is NOT a criterion — streaks reward easy-question selection. Fresh-set percentage + delay is the honest measure.

---

# PART C — PYQ PROTOCOL (exact answer)

- **When:** AFTER Step 2, BEFORE standard-question grinding (Step 3 above). Never before learning (wasted signal), never postponed to revision (loses calibration value).
- **How many years:** 15 years fully for all subjects; extend to ~25 years for TOC/Compiler/DL/Math only.
- **Repeat? Yes — exactly twice more:**
  - **Pass 2 (Month 5):** timed, in shuffled mixed-topic sets of 30. Target ≥90%. Every question that was wrong in Pass 1 AND Pass 2 gets a permanent flag → final-week review list.
  - **Pass 3 (final 3 weeks):** flagged questions + entire error log ONLY. Not the full bank.
- Three passes is the ceiling — a 4th pass measures memorization of answers, not skill.

---

# PART D — TEST SERIES COMPARISON & STRATEGY

*(Prices approximate/2025-26 cycle; verify. Reputation summarized from the aspirant community consensus — GateOverflow forums, r/GATEtard, topper interviews.)*

| Series | Difficulty vs GATE | Similarity to GATE style | Solution quality | Analytics | Approx price | Reputation summary |
|---|---|---|---|---|---|---|
| **GO Classes test series** | Slightly harder | **Highest** — conceptually faithful, modern MSQ/NAT mix | Excellent, detailed | Good | ₹1.5–3k | The current community favorite for serious rankers |
| **GateOverflow (GO) practice + previous tests** | Mixed | High (much of it IS PYQ-derived) | Community-vetted, best-in-class discussions | Basic | Free/low | Essential as a question bank regardless of paid choice |
| **Made Easy** | Noticeably harder + occasional out-of-depth trivia | Medium — leans memorization-heavy | Adequate, occasional errors | Strong (huge test-taker pool → best percentile signal) | ₹1–1.5k | Best crowd-size for rank estimation; treat scores as pessimistic |
| **ACE Academy** | Medium-hard | Medium | Adequate | Decent pool | ₹1–1.5k | Similar tier to Made Easy; slightly gentler |
| **Unacademy** | Varies by educator | Medium | Inconsistent | Platform-decent | Subscription (₹ varies, high) | Worth it only if you also want its lectures; not for tests alone |
| **TestBook** | Easy-medium | Low-medium | Basic | Basic | Cheap | Volume play; fine for extra topic tests only |
| **Exergic** | — | — | — | — | — | Primarily Mechanical-focused; not a CSE recommendation |

### Recommendations by target
- **AIR <10:** GO Classes test series (primary) + Made Easy full mocks only (for the large-pool percentile reality check) + all GO hard-tagged questions. Two series is the max even here.
- **AIR <100 (your target):** **GO Classes test series as primary** + GateOverflow free bank. Optionally add Made Easy *full mocks only* in Month 5–6 for crowd calibration. Skip everything else.
- **AIR <500:** One series only — GO Classes or ACE. Crowd size matters less than finishing your analysis loop.
- **Beginners:** No paid series until first-pass ~50% done; PYQs + GateOverflow free tests until then.

### Purchase & usage timing
- **Buy:** end of Month 1 (topic tests unlock value immediately; buying later wastes the topic-test tier). If budget-splitting, topic tests can be substituted by PYQ sets and you can buy the mocks-only tier before Month 4.
- **Topic tests:** from Month 2, as Step 7 of every topic's mastery process.
- **Subject tests:** within 1 week of finishing each subject; repeat weakest subject's test in Month 5.
- **Full mocks:** Month 5 = 1/week; Month 6 = 2/week for 3 weeks; total 12–15. Always in your real exam slot.
- **Analysis:** the blueprint §7 quadrant protocol, 2× mock duration, same day or next morning. A mock without written analysis is counted as NOT taken — track "mocks analyzed," never "mocks attempted."

---

# PART E — REVISION SYSTEM (time-boxed)

| Revision | When | What | Time per topic | Cumulative time budget |
|---|---|---|---|---|
| **R1** | +2 days after closing topic | Notes reread + 5 interleave problems | 20–30 min | Runs inside daily loop |
| **R2** | +7 days | 10 timed problems + trap-list recall aloud | 40 min | Runs inside daily loop |
| **R3** | +21–30 days | Subject-chunk revision: formula sheet reconstruction from memory + 15 mixed problems | 1.5–2 h per subject-chunk | ~15% of Months 3–5 |
| **R-Final** | Last 25 days | Error log re-solve + flagged PYQs + formula sheets + Anki only. NO textbooks, NO videos. | 0.5–1 day per subject, 2 cycles | ~70% of final 25 days (rest = mocks) |

Failure handling: any R-stage <80% accuracy → topic re-enters queue at R1 spacing and gets a slot in the next weekly plan. Your tracker's due-queue should surface exactly this automatically.

---

# PART F — GOAL SYSTEM (all measurable)

**Daily (binary pass/fail, ≥5 of 7 days must pass):**
□ Flashcards cleared (due count = 0) □ ≥20 problems solved □ ≥1 error logged with root cause □ interleave set done □ tomorrow's first topic written down.

**Weekly (reviewed every Sunday, 30 min):**
□ Topics closed = plan (typically 2–4) □ ≥140 problems □ 1 timed test taken AND analyzed □ revision queue debt = 0 (no overdue topics) □ error-log weekly read done.

**Subject goals (set when subject starts):**
□ All Part-A quotas met □ subject test ≥ target (start 65%, +5% each retake, ceiling 85%+) □ notes ≤20 pages □ formula sheet exists □ trap list ≥15 items.

**Monthly milestones:**
- M1: Math + C/DS closed; 500+ problems; error log ≥ 60 entries.
- M2: Algorithms + COA closed, OS started; first subject-test scores ≥65%.
- M3: TOC + OS closed, DBMS + Compiler in flight; first multi-subject test ≥60%.
- M4: **Syllabus closed. PYQ pass-1 = 100%.** All subject tests ≥70%.
- M5: 4 full mocks analyzed; PYQ pass-2 ≥90%; mock scores trending +3–5 marks/mock.
- M6: 6–8 more mocks; final 3 mocks within 5 marks of each other (consistency = readiness); error-log root causes: concept-gap share <20%.

**Mock goals (score trajectory, GO Classes difficulty):** first mock ≥45 → M5 end ≥58 → M6 mid ≥65 → final mocks 68–75 with ≤3 execution errors. (Series mocks run harder than GATE; these map to ~72–80 real-paper equivalent — AIR <100 territory.)

**Final goals (day −7 checklist):** every Extremely-Important chapter certified mastered; all 4 R-stages complete for every closed topic; Anki mature; 12+ mocks analyzed; attempt strategy rehearsed; sleep aligned.

---

# PART G — COMMON MISTAKES BY LEVEL, PER SUBJECT

**Math** — *Beginner:* memorizing formulas without counting practice. *Intermediate:* confusing independent/mutually-exclusive; quantifier negation errors. *Advanced:* over-studying group theory/generating functions beyond GATE depth.
**C/DS** — *B:* reading code instead of tracing it. *I:* pointer-arithmetic step-size slips; heap≠BST confusion. *A:* solving LeetCode-style instead of GATE-style (implementation vs analysis mismatch).
**Algorithms** — *B:* memorizing pseudocode. *I:* Master-theorem misapplication to non-conforming recurrences; edge-classification errors. *A:* skipping "obvious" property questions and losing 1-markers.
**TOC** — *B:* using pumping lemma to prove regularity. *I:* closure-table gaps (CFL ∩ CFL). *A:* Rice's theorem over-application to machine (not language) properties.
**Compiler** — *B:* memorizing parser hierarchy without building item sets. *I:* FIRST/FOLLOW errors with ε-productions. *A:* rusting out — no drills after topic closure (schedule the 3-week drill!).
**OS** — *B:* scheduling by formula instead of Gantt chart. *I:* EAT composition-order errors; semaphore initial-value slips. *A:* assuming textbook semantics when the question defines its own (READ the question's model).
**DBMS** — *B:* normalization by pattern-matching instead of FD closure. *I:* NULL/UNKNOWN traps in SQL; conflict vs view serializability. *A:* slow candidate-key hunting (accuracy fine, speed fatal).
**CN** — *B:* memorizing headers instead of drilling arithmetic. *I:* bits/bytes and ms/µs unit slips; GBN vs SR window rules swapped. *A:* over-investing in application-layer breadth.
**COA** — *B:* formula-plugging without drawing the pipeline table / address split. *I:* stall-count errors with vs without forwarding. *A:* ignoring the question's specific machine model assumptions.
**DL** — *B:* K-map grouping errors under time pressure. *I:* excitation vs characteristic table confusion. *A:* none — this subject is closed early and just maintained.
**Aptitude (all levels):** treating it as beneath preparation, then donating 4 marks on exam day.

---

# PART H — DAY-BY-DAY ROADMAP (Day 1 → Day 180)

Structure: a fixed **daily template** + a **week-by-week assignment table**. (A literal 180-row unique-per-day table would be fake precision — real prep needs the ±1-day slack the weekly grain provides. Within each week, days follow the template; the table tells you what feeds it.)

### The Daily Template (every study day)
| Slot | Duration | Content |
|---|---|---|
| 1. Recall opener | 10 min | Blank-page dump of yesterday + Anki due cards |
| 2. Learn | 40–60 min | Current topic, primary resource, pen active (skip on practice-only days) |
| 3. Practice | 60–90 min | Current topic problems per the Step 2–5 stage you're in |
| 4. Log + notes | 10 min | Error log + note updates |
| 5. Interleave | 20–30 min | Revision-queue problems (R1/R2 due items) |
| 6. Close | 5 min | Tracker update + tomorrow's first topic |
Weekend addition: Sunday = weekly review (30 min) + one timed test + its analysis. Aptitude 3×30min slots from Week 5.

### Week-by-Week Assignment
| Week | Track A (theory-heavy) | Track B (practice-heavy) | Test/Milestone |
|---|---|---|---|
| 1 | Logic + Set/Relations consolidation (fast pass, you have base) | C: operators→recursion tracing | Error log + Anki live |
| 2 | Combinatorics + recurrences | C: pointers→structs (trace drills daily) | C PYQ set ≥75% |
| 3 | Graph theory consolidation + group theory | DS: stacks/queues/linked lists | Math topic tests ×2 |
| 4 | Probability | DS: trees + BST + AVL | **M1 gate: Math closed** |
| 5 | Linear algebra + calculus (light) | DS: heaps + hashing + B+ trees | **C/DS closed**; buy test series; aptitude starts |
| 6 | Algo: asymptotics+recurrences (consolidation) + sorting/D&C | COA: addressing + instruction cycle + DL sequential circuits | DS subject test ≥65% |
| 7 | Algo: greedy + DP | COA: pipelining drills | Math subject test |
| 8 | Algo: graph algorithms | COA: cache + memory hierarchy | Algo topic tests ×2 |
| 9 | Algo: P/NP + subject wrap | COA: IEEE 754 + DMA + wrap; **DL closed** | **M2 gate: Algo+COA closed** |
| 10 | TOC: regular languages (full) | OS: processes + scheduling + fork drills | COA subject test ≥65% |
| 11 | TOC: CFL/PDA | OS: synchronization (code-analysis drills) | TOC regular topic test |
| 12 | TOC: TM + decidability + Rice | OS: deadlock + paging/VM | Algo subject test |
| 13 | Compiler: phases + FIRST/FOLLOW/LL | OS: files/disk + subject wrap | **M3 gate: TOC+OS closed**; first multi-subject test ≥60% |
| 14 | Compiler: LR family | DBMS: ER + relational algebra + SQL | OS subject test ≥70% |
| 15 | Compiler: SDT + runtime + wrap | DBMS: FDs + normalization (speed drills) | Compiler subject test |
| 16 | Digital Logic final consolidation + buffer | DBMS: transactions + concurrency + indexing, wrap | DBMS subject test |
| 17 | CN: delays + sliding windows + IP/subnetting | PYQ pass-1 cleanup (any subject <100%) | Multi-subject test #2 |
| 18 | CN: TCP + MAC + error control + routing + wrap | PYQ pass-1 cleanup complete | **M4 gate: syllabus closed, PYQ-1 = 100%**; CN subject test |
| 19 | R3 revision block: Math + DS + Algo | PYQ pass-2 mixed sets begin (timed) | **Full mock #1** + analysis |
| 20 | R3: TOC + Compiler + DL | PYQ pass-2 continues | Full mock #2 |
| 21 | R3: OS + DBMS | PYQ pass-2 continues | Full mock #3; error-log root-cause review |
| 22 | R3: CN + COA | PYQ pass-2 complete ≥90% | Full mock #4; **M5 gate: trend +3–5/mock** |
| 23 | Weak-subject micro-cycles (mock-driven) | Flagged-question re-solve | Mocks #5–6 |
| 24 | Weak-subject micro-cycles | Error-log full re-solve begins | Mocks #7–8 |
| 25 | R-Final cycle 1: subjects 1–5 (0.5–1 day each) | Formula sheets from memory | Mocks #9–10 |
| 26 (days 176–180) | R-Final cycle 2: rapid pass, all subjects; Anki + trap lists + flagged PYQs only | Light mock by day −5 max; sleep alignment; exam-slot rehearsal | **Exam** |

### Daily knowledge of "what/where/solve/revise/test":
- **What to study** = the week's Track A/B cell, at whatever Step (1–7) that topic currently sits.
- **Where** = the ONE primary resource named in Part A for that subject (backup only on a specific failure).
- **What problems** = the Part-A quota row for the current topic, sliced by your current Step.
- **When to revise** = whatever the tracker's due-queue shows in Slot 5 — never by mood.
- **When to test** = topic test 2–4 days post-closure; subject test per the table; mocks per Weeks 19–26.
- **Milestone** = the gate in the rightmost column; a missed gate triggers next-week rebalancing at the Sunday review, cutting Optional-tier content first, never revision.

**The invariant that maximizes AIR over syllabus:** at every Sunday review, if forced to choose, protect (in order) — error log work > revision queue > PYQ passes > mocks+analysis > new Extremely-Important content > everything else. Rank lives at the top of that stack.
