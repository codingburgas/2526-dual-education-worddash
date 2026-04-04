# Feature Plan — Typing Speed Test (Expanded)

## Senior Engineering Perspective

The spec describes a prototype. A real product asks: **why would a user come back?**
The answer is: modes that keep it fresh, a leaderboard that makes scores mean
something, live feedback that makes the act of typing feel good, and settings
that make the experience feel personal.

Every feature below is achievable in vanilla HTML/CSS/JS and fits the grading
criteria. None requires a backend — localStorage handles all persistence.

---

## Feature 1: Test Modes

Modes are the single biggest engagement multiplier. They reuse all existing
logic (timer, calculator, paragraph) through a state machine (`modes.js`)
that reconfigures the test before it starts.

| Mode | What it does | Why users want it |
|---|---|---|
| **Time** | Countdown (15 / 30 / 60 / 120 s), type as many words as possible | Competitive; easy to compare scores |
| **Words** | Complete exactly N words (10 / 25 / 50 / 100) | Controlled difficulty, good for practice |
| **Quote** | Random famous quote (short / medium / long) | Interesting content, variable length |
| **Zen** | No timer, no pressure — results shown when done | Comfortable for beginners |

Mode selector lives on `index.html` as a tab bar (no page navigation needed —
modes are UI state, not separate pages). Switching mode resets the test and
updates the paragraph pool and timer behaviour.

**Files involved:**
- `src/js/modules/modes.js` — mode state machine: `setMode()`, `getMode()`,
  `configureModeUI()`, `getModeOptions()`
- `src/js/data/quotes.js` — quote objects `{ text, author, length }` for Quote mode
- `src/js/data/words.js` — top-1000 common words array for Words mode

---

## Feature 2: Real-Time Character Highlighting

The most impactful UX feature in the whole app. Instead of a blank "did I type
it right?" feeling, every character in the reference paragraph gets coloured
as the user types:

- **Green** — correct character
- **Red** — wrong character (but the user can keep going)
- **Dimmed/default** — not yet reached

Implementation: render the reference paragraph as a `<span>` per character.
On each `input` event, compare `textarea.value[i]` against `paragraph[i]` and
toggle CSS classes. The current position gets a blinking caret class.

This is also what makes the **Stop / Check Results** button meaningful mid-test —
users can see exactly where they went wrong.

**Files involved:**
- `src/js/modules/highlighter.js` — `renderParagraph()` (splits text into spans),
  `updateHighlight(typedText)` (compares and applies classes)
- `src/css/animations.css` — `.caret` blink keyframe, `.wrong` shake animation,
  fade-in for results

---

## Feature 3: Leaderboard (localStorage)

Without a leaderboard, a WPM score is a number that disappears. With one,
every test is a chance to beat yourself or a classmate on the same machine.

The leaderboard stores entries in `localStorage` as a JSON array:
```json
{ "name": "Alex", "wpm": 72, "accuracy": 96, "mode": "time-60", "date": "2026-04-04" }
```

Features:
- Top 10 entries, sorted by WPM descending
- Filterable by mode (dropdown)
- "Clear scores" button with confirmation
- Gold / silver / bronze medal icons for top 3
- After each test, a prompt: "Enter your name to save your score"

**Files involved:**
- `src/leaderboard.html` — standalone page; linked from the main nav
- `src/css/leaderboard.css` — table, medal badges, empty-state illustration
- `src/js/modules/leaderboard.js` — `addScore()`, `getScores()`, `clearScores()`,
  `renderLeaderboard()`, `filterByMode()`
- `src/js/modules/storage.js` — generic `get(key)`, `set(key, val)`, `remove(key)`
  localStorage wrapper used by leaderboard AND settings

---

## Feature 4: Settings Page

Personalisation makes the app feel like *theirs*. All settings persist via
`localStorage` and apply on every page load.

| Setting | Options | Effect |
|---|---|---|
| **Theme** | Light / Dark / Hacker (green on black) | CSS `data-theme` attribute on `<html>` |
| **Font** | Monospace / Sans-serif / Serif | Applied to the reference paragraph and textarea |
| **Caret style** | Line / Block / Underline | CSS class on the current-position span |
| **Difficulty** | Easy / Medium / Hard / Mixed | Filters paragraph pool by tagged difficulty |
| **Sound** | On / Off | Subtle click sound on correct keypress (optional) |

Implementation: `settings.js` reads the form on submit, writes to localStorage,
and applies the values immediately. On every page load, `settings.js` reads
the saved values and calls `theme.js` to apply the theme before the first
paint (avoids flash of wrong theme).

**Files involved:**
- `src/settings.html` — standalone page; linked from the main nav
- `src/css/settings.css` — toggle switches, select menus, preview panel
- `src/css/themes.css` — CSS custom properties for each theme:
  `--bg`, `--text`, `--accent`, `--error`, `--correct`, `--caret`
- `src/js/modules/settings.js` — `loadSettings()`, `saveSettings()`,
  `applySettings()`
- `src/js/modules/theme.js` — `applyTheme(themeName)`, `getTheme()` — called
  early in `<head>` via an inline script to prevent theme flash

---

## Feature 5: Live Stats While Typing

Real-time WPM and accuracy update every second as the user types — not just at
the end. This is what MonkeyType does and it's compelling to watch your WPM
number climb.

Implementation: inside the `setInterval` tick, also call `calculateWPM()` and
`calculateAccuracy()` on the current textarea value and update small live-stat
elements above the typing area.

Also add a **progress bar** under the reference paragraph: fills left-to-right
as the user advances through the text (characters typed / total characters).

**Files involved:**
- Logic added to `timer.js` tick callback
- `calculator.js` already handles the math — just called more frequently
- `ui.js` gets `updateLiveStats(wpm, accuracy, progress)` function

---

## Feature 6: Detailed Results Panel

When the test ends (or Stop is pressed), slide in a results panel (on
`index.html`, no page change) showing:

- **Gross WPM** — raw speed (all words / time)
- **Net WPM** — penalised for errors: (correct words / time)
- **Accuracy %** — correct chars / total chars
- **Characters** — e.g. "87 correct, 4 incorrect, 2 extra"
- **Time elapsed**
- **Mode** played
- **Save to leaderboard** prompt (name input + Save button)
- **Try Again** / **New Test** buttons

The panel slides in over the typing area using a CSS transition — no
navigation, no reload.

**Files involved:**
- `src/js/modules/results.js` — `compileResults(typedText, paragraph, elapsed)`,
  `renderResults(resultsObj)`, `showResultsPanel()`, `hideResultsPanel()`
- `src/css/animations.css` — panel slide-in keyframe

---

## Feature 7: 404 Page

GitHub Pages serves `404.html` automatically for unknown routes. A good 404
keeps users from bouncing:
- Branded with the same header/nav as the rest of the site
- Friendly message + a "Go to test" button back to `index.html`

**Files involved:**
- `src/404.html` — minimal, same nav structure

---

## Expanded File Tree

```
2526-dual-education-worddash/
│
├── src/
│   ├── index.html              ← Main test + mode selector + results panel
│   ├── leaderboard.html        ← High scores table, filterable by mode
│   ├── settings.html           ← Theme, font, difficulty, caret style
│   ├── 404.html                ← GitHub Pages not-found page
│   │
│   ├── css/
│   │   ├── styles.css          ← Global layout, typography, test UI,
│   │   │                          nav, responsive grid, live stats bar
│   │   ├── themes.css          ← CSS custom properties per theme
│   │   │                          (:root = light, [data-theme="dark"],
│   │   │                           [data-theme="hacker"])
│   │   ├── leaderboard.css     ← Table, medal badges, empty state, filter bar
│   │   ├── settings.css        ← Toggle switches, select menus, preview panel
│   │   └── animations.css      ← Caret blink, wrong-char shake, result
│   │                              slide-in, fade-in, progress bar fill
│   │
│   └── js/
│       ├── script.js           ← Entry point: init all modules, bind events
│       │
│       ├── modules/
│       │   ├── timer.js        ← Countdown + stopwatch, live stat tick
│       │   ├── calculator.js   ← Gross WPM, Net WPM, accuracy, char stats
│       │   ├── paragraph.js    ← Random selection filtered by mode+difficulty
│       │   ├── highlighter.js  ← Render paragraph as spans, colour on input
│       │   ├── ui.js           ← All DOM refs and render functions (no logic)
│       │   ├── modes.js        ← Mode state machine, configure UI per mode
│       │   ├── results.js      ← Compile + render detailed results panel
│       │   ├── leaderboard.js  ← Score CRUD, sort, filter, render table
│       │   ├── storage.js      ← Generic localStorage get/set/remove wrapper
│       │   ├── settings.js     ← Load/save/apply user preferences
│       │   └── theme.js        ← Apply theme to <html>, persist choice
│       │
│       └── data/
│           ├── paragraphs.js   ← Paragraphs tagged { text, difficulty }
│           ├── quotes.js       ← Quotes: { text, author, length }
│           └── words.js        ← Top-1000 common words array (words mode)
│
├── assets/
│   ├── fonts/                  ← JetBrains Mono or similar monospace woff2
│   ├── images/                 ← favicon.ico, og-image.png
│   └── icons/                  ← SVG icons: keyboard, trophy, settings, home
│
├── Documentation/
│   ├── file-tree-plan.md       ← Original structure plan
│   ├── feature-plan.md         ← This document
│   ├── architecture.md         ← Module dependency diagram, data flow
│   └── user-guide.md           ← Modes explained, how to use, keyboard shortcuts
│
└── README.md
```

---

## Module Dependency Map

```
script.js
  ├── modes.js        → paragraph.js, timer.js, ui.js
  ├── timer.js        → calculator.js (live stats tick), ui.js
  ├── highlighter.js  (standalone — takes paragraph string + typed string)
  ├── results.js      → calculator.js, leaderboard.js, ui.js
  ├── leaderboard.js  → storage.js
  ├── settings.js     → storage.js, theme.js
  └── ui.js           (leaf node — only touches DOM)

data/ ← imported by paragraph.js, leaderboard.js (for mode names)
```

No circular dependencies. `storage.js` and `ui.js` are leaf nodes used by
everything else. `calculator.js` is pure functions (no imports).

---

## Feature 8: Language Switching (Bulgarian / English)

A BG / EN toggle in the navigation header applies to all pages without a reload.

**Most efficient method: `data-i18n` attribute pattern.**
Every piece of static UI text gets a `data-i18n="section.element"` attribute on its
element. `i18n.js` holds the active translation object and one `applyTranslations()`
call updates every labelled element in a single DOM pass — no re-rendering, no
structural changes.

```html
<!-- HTML markup stays language-neutral -->
<button data-i18n="test.restart">Restart</button>
<textarea data-i18n-placeholder="test.placeholder"></textarea>
```

Three attribute variants handled by `applyTranslations()`:

| Attribute | Sets |
|---|---|
| `data-i18n` | `element.textContent` |
| `data-i18n-placeholder` | `element.placeholder` |
| `data-i18n-aria` | `element.ariaLabel` |

**Translation files** (`src/js/data/i18n/en.js` and `bg.js`): flat exported objects
with `'section.element'` keys — `'nav.leaderboard'`, `'test.stop'`, `'results.net-wpm'`.
`i18n.js` imports both at module load time and selects by current language — zero
async loading, zero latency on switch.

**Typing content:** `paragraphs.js` and `quotes.js` store both languages per entry:
`{ en: "...", bg: "...", ... }`. `words.js` exports two named arrays from one file:
`export const en = [...]` and `export const bg = [...]`. `paragraph.js` receives
`lang` as a parameter from `modes.js` — it does not import `i18n.js`, keeping the
data layer free of language-state coupling.

**Flash prevention:** The existing inline `<script>` in every `<head>` (already used
for theme) is extended to also set `data-lang` on `<html>` from `localStorage` —
before any CSS or JS loads. One script block, two flash vectors eliminated.

**setLanguage flow:**
1. Save to `localStorage` via `storage.js(LANG_KEY)`.
2. Set `data-lang` on `<html>`.
3. `applyTranslations()` — one DOM pass, all text updates.
4. Notify `modes.js` → reload typing content in new language via `paragraph.js`.

**Files involved:**
- `src/js/modules/i18n.js` — `setLanguage()`, `getLanguage()`, `t(key)`, `applyTranslations()`
- `src/js/data/i18n/en.js` — English translation object
- `src/js/data/i18n/bg.js` — Bulgarian translation object
- `src/js/data/paragraphs.js` — updated to `{ en, bg, difficulty }` shape
- `src/js/data/quotes.js` — updated to `{ en, bg, author, length }` shape
- `src/js/data/words.js` — updated to export `{ en, bg }` named arrays
- `src/js/modules/modes.js` — passes `i18n.getLanguage()` to `paragraph.js`
- `src/js/modules/storage.js` — adds `LANG_KEY = 'wds_lang'` constant

---

## Feature 9: JSON Score Database

Replaces the simple `leaderboard.js` score storage with a proper in-memory database
module backed by `localStorage`, with file export and import.

**Why richer than plain localStorage CRUD:**
The original plan stored 5 fields per score. The database stores 11, making every
entry self-describing: mode, language, duration, and character breakdown are all
preserved. This enables filtering by language (critical now that BG/EN exist),
computing statistics across sessions, and sharing scores between machines.

**`database.js` — data layer:**
```
init()              load from localStorage into _cache[] on startup
add(entry)          _validate() → assign id (Date.now()) + date → push → _persist()
getAll(filter?)     { mode?, language? } → filtered + sorted by wpm desc
remove(id)          splice by id → _persist()
clear()             empty _cache → _persist()  [no confirm() — that is UI's job]
exportJSON()        Blob({ version:1, exported, scores }) → <a download="scores.json"> click
importJSON(str)     parse → validate version + schema → merge by id (skip dupes) → _persist()
_persist()          JSON.stringify(_cache) → storage.js.set(SCORES_KEY)
_validate(entry)    check required fields + types → boolean
```

**Score schema:**
```js
{
  id:             string,   // Date.now().toString() — unique, no library needed
  name:           string,
  wpm:            number,   // gross WPM
  netWpm:         number,
  accuracy:       number,   // 0–100
  mode:           string,   // 'time-60' | 'words-25' | 'quote-short' | 'zen'
  language:       string,   // 'en' | 'bg'
  date:           string,   // ISO 8601
  duration:       number,   // seconds elapsed
  charsCorrect:   number,
  charsIncorrect: number
}
```

**Export file format:**
```json
{ "version": 1, "exported": "2026-04-04T12:00:00.000Z", "scores": [...] }
```

The `version` field lets future code detect and migrate old export files without
guessing at schema changes.

**Import merge rule:** entries whose `id` already exists in `_cache` are skipped.
Classmates can share and merge score files without creating duplicates — the
timestamp-based `id` is unique per machine per millisecond.

**`leaderboard.js` becomes display-only:**
- `renderTable(scores)` — builds DOM rows, medal classes
- `onFilter(mode, lang)` — calls `database.getAll({ mode, language: lang })`, re-renders
- `onClear()` — `confirm()` guard, then `database.clear()`, re-renders
- `onExport()` — delegates entirely to `database.exportJSON()`
- `onImport(file)` — `FileReader` → `database.importJSON(str)`, re-renders

**`results.js → onSave(name)` change:**
Calls `database.add({ id, name, wpm, netWpm, accuracy, mode, language, date,
duration, charsCorrect, charsIncorrect })` — all fields available from the compiled
results object.

**`leaderboard.html` UI additions:**
- "Export scores" button (always visible)
- "Import scores" file input (`accept=".json"`)
- Language filter in the existing mode filter bar

**Files involved:**
- `src/js/modules/database.js` — new, replaces score-CRUD in leaderboard.js
- `src/js/modules/leaderboard.js` — stripped to display + event delegation only
- `src/js/modules/results.js` — onSave() calls database.add() with full schema
- `src/js/modules/storage.js` — SCORES_KEY constant already defined here
- `src/leaderboard.html` — export/import buttons, language filter column

---

## What Was NOT Added (and Why)

| Idea | Decision |
|---|---|
| Multiplayer / WebSockets | Requires a server — out of scope |
| Heatmap of errors per key | Complex data viz — better as v2 |
| Code snippets mode | Interesting but scope risk for 12-hour project |
| Sound effects | Mentioned in settings but optional — one JS Audio line |
| User accounts / cloud sync | Needs backend — localStorage is the right call here |
