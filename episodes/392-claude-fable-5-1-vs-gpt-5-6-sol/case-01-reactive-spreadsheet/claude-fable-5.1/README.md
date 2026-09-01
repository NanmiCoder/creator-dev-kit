# Reactive Spreadsheet

A compact Excel-like spreadsheet with a hand-written formula engine, a real dependency graph with
incremental recalculation, cycle detection, error propagation, undo/redo and backend persistence.

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express, persists the workbook to `data/workbook.json`
- **Engine:** `src/engine/` (tokenizer → recursive-descent parser → evaluator → dependency graph)

## Setup

Requires Node.js 18+.

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts the API server on `http://localhost:3001` and the Vite dev server on
`http://127.0.0.1:4021` (which proxies `/api/*` to the backend). Open **http://127.0.0.1:4021**.

## Production build & start

```bash
npm run build     # type-checks and builds the client into dist/
npm start         # serves dist/ + the API on http://localhost:3001
```

Optional environment variables: `PORT` (default `3001`) and `DATA_FILE` (default `data/workbook.json`).
`npm start` passes `--serve` to the server, which makes it host `dist/` (`NODE_ENV=production` works too).

## Tests

```bash
npm test          # engine unit tests (vitest)
npm run typecheck
```

## Using the sheet

| Action | Keys |
| --- | --- |
| Move selection | Arrow keys, Tab / Shift+Tab, Home / End |
| Extend selection | Shift + arrows, Shift + click, or click-drag |
| Edit cell | Enter or F2 (or just start typing) |
| Commit edit | Enter (moves down), Tab (moves right) |
| Cancel edit | Esc |
| Clear cells | Delete / Backspace |
| Copy / Cut / Paste | Ctrl/Cmd + C / X / V (tab-separated text, works with Excel and Google Sheets) |
| Undo / Redo | Ctrl/Cmd + Z, Ctrl/Cmd + Shift + Z (or Ctrl/Cmd + Y) |

Cells accept plain text, numbers (`42`, `1.5e3`), booleans (`TRUE`) and formulas starting with `=`.
Prefix with `'` to force text. Empty cells count as `0` in arithmetic and are skipped by `SUM`/`AVG`;
a formula that resolves to an empty cell (`=B2` with `B2` blank) shows `0`, like Excel.
Copy/paste moves the raw text of cells (formulas are pasted verbatim, references are not shifted).

### Formula language

- References: `A1`, `$B$2`; ranges: `A1:A5`
- Operators: `+ - * / ^ &` and comparisons `= <> < > <= >=`, unary minus, `%`, parentheses
- Functions: `SUM`, `AVG` / `AVERAGE`, `MIN`, `MAX`, `COUNT`, `COUNTA`, `ABS`, `ROUND`, `SQRT`, `MOD`,
  `POWER`, `LEN`, `UPPER`, `LOWER`, `CONCAT`, `IF`, `AND`, `OR`, `NOT`, `ISERROR`
- Example: `=SUM(A1:A5) * 2 + AVG(B1:B5) / (C1 - 1)`

### Errors

| Error | Meaning |
| --- | --- |
| `#DIV/0!` | Division by zero, or `AVG` of no numbers |
| `#REF!` | Reference outside the sheet (e.g. `=A999`) |
| `#VALUE!` | Text used in arithmetic (`="abc"+1`), wrong argument count, range used as a scalar |
| `#CYCLE!` | The cell takes part in a circular reference (direct or indirect) |
| `#NAME?` | Unknown function |
| `#NUM!` | Non-finite result (e.g. `=SQRT(-1)`) |
| `#ERROR!` | Formula could not be parsed |

Errors propagate to every dependent cell. Select any cell to see the detailed error message in the
inspector panel.

### Dependency highlighting

Selecting a cell highlights its **precedents** (cells it reads, green) and its **dependents** (cells
that read it, orange). Direct relationships use a solid tint; indirect (transitive) ones use a lighter
tint. The inspector lists both sets; click any chip to jump to that cell.

## How the engine works

1. **Parse.** `=` formulas are tokenized and parsed into an AST (`src/engine/parser.ts`) with correct
   precedence: comparison < `&` < `+ -` < `* /` < `^` (right-assoc) < unary sign < `%`.
2. **Graph.** Every reference and expanded range becomes an edge in a bidirectional graph
   (`precedents` / `dependents`) stored per cell (`src/engine/workbook.ts`).
3. **Incremental recalculation.** On an edit, the affected set is the edited cells plus all
   transitive dependents. Tarjan's SCC algorithm runs on that sub-graph only; components come out in
   dependency order, so each cell is evaluated once after its inputs. A component with more than one
   cell (or a self reference) is a cycle: every member gets `#CYCLE!`, downstream cells inherit it.
   Nothing outside the affected set is touched.
4. **Persistence.** Raw inputs (plus computed values for inspection) are debounced and `PUT` to
   `/api/workbook`. On reload the client loads the raw inputs and recomputes the entire sheet, so
   computed values, errors and cycles are always consistent.

## Project layout

```
server/index.js          Express API + static hosting of dist/ in production
src/engine/              formula engine (types, tokenizer, parser, evaluator, workbook, tests)
src/hooks/useWorkbook.ts engine <-> React bridge, undo/redo, autosave
src/components/          Toolbar, FormulaBar, Grid, Inspector
src/lib/                 history stack, API client
data/workbook.json       persisted workbook (created on first save)
```
