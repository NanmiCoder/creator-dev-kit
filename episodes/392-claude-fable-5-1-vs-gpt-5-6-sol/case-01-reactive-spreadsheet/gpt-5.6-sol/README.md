# Chain Sheet

A compact reactive spreadsheet with a hand-written formula parser, incremental dependency-graph recalculation, cycle detection, undo/redo, and backend persistence.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite development server proxies persistence requests to the Express server on port 3001.

## Production

```bash
npm run build
npm start
```

Open [http://localhost:3001](http://localhost:3001). The Express server serves the production bundle and stores workbook state in `data/workbook.json`.

## Test

```bash
npm test
```

## Controls

- Click a cell to select it; use the arrow keys to move.
- Press `Enter` or `F2`, double-click, or start typing to edit.
- Press `Enter` to commit and move down. `Escape` cancels an in-cell edit.
- Copy and paste single cells or tab/newline-delimited ranges.
- Undo with `Cmd/Ctrl+Z`; redo with `Shift+Cmd/Ctrl+Z` or `Ctrl+Y`.
- Edit raw formulas in the formula bar. The computed result appears at its right.

## Formula support

- A1 references and rectangular ranges
- `+`, `-`, `*`, `/`, parentheses, unary `+`/`-`, and standard precedence
- `SUM(...)` and `AVG(...)`, including multiple expression or range arguments
- `#CYCLE!`, `#DIV/0!`, `#REF!`, and `#VALUE!` propagation

Selecting a cell highlights its full upstream chain in blue and its full downstream chain in coral. The inspector distinguishes direct links while the grid shows indirect relationships too. Only the selected edit and its transitive dependents are evaluated after a change.
