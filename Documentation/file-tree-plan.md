# File Tree Plan — Typing Speed Test

## Rationale

The project spec (PROJECT-REQ.txt) requires:
- Vanilla HTML5 / CSS3 / JavaScript ES6 — no build tools
- `script.js` as the named JS entry point
- Paragraphs stored in an array or JSON
- Semantic HTML (`header`, `main`, `section`, `footer`)
- Responsive CSS with pseudo-classes and transitions
- Deployment via GitHub (GitHub Pages compatible)

The step-by-step tasks in the spec reference a `/static/` + `/templates/` layout (a Flask tutorial pattern). That layout is irrelevant here — there is no server. The project is pure client-side, so paths must be relative and the structure must work when opened directly in a browser or served from GitHub Pages.

---

## Proposed File Tree

```
2526-dual-education-worddash/
│
├── src/                            # All application source code
│   ├── index.html                  # Entry point — semantic structure
│   │                               # (header, main, section, footer)
│   │
│   ├── css/
│   │   └── styles.css              # Single stylesheet (required by spec)
│   │                               # Responsive layout, transitions,
│   │                               # pseudo-classes, timer + result styles
│   │
│   └── js/
│       ├── script.js               # Main entry point (required name in spec)
│       │                           # Imports and orchestrates all modules;
│       │                           # registers event listeners (input, click)
│       │
│       ├── modules/                # ES6 feature modules (one concern each)
│       │   ├── timer.js            # start / stop / reset / formatTime
│       │   ├── calculator.js       # calculateWPM(), calculateAccuracy()
│       │   ├── paragraph.js        # getRandomParagraph(), displayParagraph()
│       │   └── ui.js               # All DOM reads/writes; keeps modules
│       │                           # decoupled from specific element IDs
│       │
│       └── data/
│           └── paragraphs.js       # Exported array of paragraph strings
│                                   # (grows independently of logic)
│
├── assets/                         # Static non-code resources
│   ├── fonts/                      # Web fonts (e.g. a monospace font for
│   │                               # the typing area — improves UX)
│   └── images/                     # Icons, favicon, any decorative graphics
│
├── Documentation/
│   ├── file-tree-plan.md           # This document
│   ├── architecture.md             # How modules connect; data flow diagram
│   └── user-guide.md               # How to open/use the app (for the defense)
│
├── README.md                       # Required by spec:
│                                   # project description, tech stack,
│                                   # run instructions, team names
└── CLAUDE.md                       # Claude Code guidance (auto-generated)
```

**Note:** This is the base structure plan. See `feature-plan.md` for the full
expanded file tree including modes, leaderboard, settings, and all additional
modules that were added in the second planning pass.

---

## Design Decisions

### Why `src/css/` instead of `styles.css` at root?
A dedicated `css/` folder costs nothing now and prevents a flat soup of files
as the project grows. The spec only requires `styles.css` exists — not where.

### Why `src/js/modules/`?
The spec explicitly requires ES6 and "functions, objects, arrays." Module files
enforce single-responsibility:

| Module | Responsibility |
|---|---|
| `timer.js` | Tick logic, `setInterval`/`clearInterval`, time formatting |
| `calculator.js` | WPM formula, accuracy formula — pure functions, no DOM |
| `paragraph.js` | Paragraph pool access, random selection |
| `ui.js` | All `getElementById` / `textContent` / class toggles |

`script.js` only wires them together and registers event listeners.
This makes each piece independently readable and defensible.

### Why `data/paragraphs.js` separate from `paragraph.js`?
Data and logic change for different reasons. Adding more paragraphs (content
work) should never touch the selection logic (code work).

### Why `assets/fonts/` and `assets/images/`?
A typing test benefits from a monospace font for both the reference paragraph
and the textarea — it makes character-level comparison visually obvious.
Reserving the folder now avoids restructuring later.

---

## Grading Alignment

| Criterion (spec) | Covered by |
|---|---|
| Коректна JS логика (20%) | `modules/` — each concern isolated and testable |
| HTML структура и семантика (20%) | `index.html` — `header/main/section/footer` |
| CSS дизайн и респонсивност (10%) | `css/styles.css` — responsive, transitions |
| Функционалност WPM/Accuracy (10%) | `modules/calculator.js` |
| Работа в екип и GitHub (10%) | Clean commits, clear folder ownership per module |
| Документация README (10%) | `README.md` + `Documentation/` |
| Защита на проекта (20%) | `Documentation/architecture.md`, `user-guide.md` |
