# Folio — reactive spreadsheet

A complete React + TypeScript + Express spreadsheet with a custom formula engine, incremental recalculation, visible dependencies, and disk persistence. Includes a connected studio-budget example.

中文运行入口和归档说明见[本期 README](../../README.md)。

## Run

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` to the Node server on port 3001.

Production:

```sh
npm run build
npm start
```

Open http://127.0.0.1:3001. The server binds IPv4 loopback by default; using this explicit address avoids reaching an unrelated IPv6 service on the same port via `localhost`. Express serves both the production frontend and API. `PORT` changes the production port and `HOST` changes the listening interface. `DATA_FILE` changes the workbook file location; it defaults to `data/workbook.json` relative to the working directory. Run commands from the project root. If the requested address is occupied, startup reports the error and exits unsuccessfully instead of claiming that the server started.

```sh
npm test
```

## Using the sheet

- 40 rows × 12 columns (A1:L40). Click a cell, use arrows or Tab to navigate, and Enter/F2/double-click to edit. Typing also starts an edit.
- Enter commits and moves down; Tab commits and moves right. Escape cancels. The formula bar can edit the raw value directly.
- Shift + arrows or Shift + click selects a rectangular range. Ctrl/Cmd + A selects the whole sheet. Delete/Backspace clears the selection.
- Ctrl/Cmd + C copies raw cell contents as tab-separated text. Ctrl/Cmd + V pastes a rectangle from a spreadsheet or text editor. Pasting is one undoable action. Copied formulas retain their original references; relative-reference translation is not implemented.
- Undo: Ctrl/Cmd + Z. Redo: Ctrl/Cmd + Shift + Z or Ctrl + Y. Toolbar buttons work too. The last 100 edit transactions are retained in the current session.
- Blue cells are references; amber cells are dependents. Both include indirect connections. Click an address in the inspector to navigate. The 显示公式 toggle displays raw formulas in the grid.
- Export CSV downloads computed values. The plus button opens options to clear the workbook or restore the example; either action can be undone.
- Edits save immediately to the backend in order. Wait for **所有更改已保存** before reloading. Failed saves remain queued and can be retried with the save-status button.

## Formula semantics

The engine supports A1 references (case insensitive), decimal/scientific numbers, unary +/−, +, −, *, /, postfix percentages, parentheses, six comparisons (`=`, `<>`, `<`, `>`, `<=`, `>=`), quoted text, TRUE/FALSE literals, and nested `SUM`, `AVG`, `ROUND`, and `IF` calls. Function names are case insensitive; quoted text preserves its case and supports doubled quotes (`"He said ""Yes"""`). Comparisons return TRUE or FALSE, which count as 1 or 0 in arithmetic. Text comparison is case insensitive; mixed types sort numbers before text before logical values. Blank references compare as zero, empty text, or FALSE according to the other operand.

```text
=B4*C4
=SUM(D4:D7)
=SUM(A1:B5, AVG(C1:C5)*2) / (D1+1)
=8%
=ROUND(D6*B7, 2)
=IF(D8>200,"yes","no")
```

Ranges are inclusive, rectangular, and may have reversed endpoints. Empty references evaluate as zero in arithmetic. SUM and AVG ignore text and blank values; an empty AVG returns `#DIV/0!`. Text in arithmetic returns `#VALUE!`. A direct reference to text returns that text. Bare ranges outside functions return `#VALUE!`.

`ROUND(number, digits)` requires two arguments and rounds decimal ties away from zero, including negative numbers. Positive digits round fractional places, zero rounds to an integer, and negative digits round to tens/hundreds/etc. Fractional digit counts truncate toward zero. Decimal digit rounding avoids the common `ROUND(1.005,2)` floating-point trap, yielding 1.01.

`IF(condition, when_true, [when_false])` evaluates only its selected branch; an unused branch's division-by-zero or invalid-reference error does not affect the result. A missing false branch returns FALSE. Conditions accept logical values, numbers (zero is false), blank references (false), and the text TRUE/FALSE; other text returns `#VALUE!`. The dependency graph conservatively tracks references in **both** branches, so changing either branch's inputs invalidates the formula and syntactic cycles in either branch remain `#CYCLE!`.

Supported operators follow the corresponding [Excel precedence rules](https://support.microsoft.com/en-us/excel/calculation-operators-and-precedence-in-excel). Function syntax follows [ROUND](https://support.microsoft.com/en-us/excel/functions/round-function) and [IF](https://support.microsoft.com/zh-cn/excel/functions/if-function); this compact engine does not implement every Excel coercion or function.

- `#DIV/0!`: division by zero or AVG with no numeric inputs.
- `#REF!`: reference outside A1:L40, including invalid row zero.
- `#VALUE!`: invalid syntax, argument count, or operand type.
- `#NAME?`: unknown function or identifier, propagated through dependent formulas.
- `#NUM!`: numeric overflow, including ROUND results outside the finite number range.
- `#CYCLE!`: all participants in a circular dependency, propagated to their dependents. Breaking the cycle recovers affected values automatically.

Raw values are limited to 10,000 characters. Dates, formatting controls, absolute references, cross-sheet references, and functions beyond SUM/AVG/ROUND/IF are outside this compact workbook's scope. The intentionally invalid `FOO(1)` sample remains a `#NAME?` test, and deliberately circular and division-by-zero samples remain errors.

## Architecture

- `shared/engine.ts`: tokenizer and recursive-descent parser build an AST without `eval` or formula libraries. Forward and reverse adjacency maps maintain real dependencies. Each edit updates its edges and finds the downstream affected closure. Tarjan's strongly connected components algorithm marks every cycle participant within that closure. Dependency-first evaluation recalculates affected cells once, retaining unaffected cached values. The status bar reports the last recalculation count and timing.
- `shared/engine.ts` also owns transactional undo/redo; restoring an edit uses the same graph update path.
- `src/App.tsx`: grid keyboard and clipboard interactions, formula editor, dependency inspection, and serialized save queue.
- `server/app.ts`: `GET /api/workbook` returns raw cells and freshly calculated results. `PUT /api/workbook` accepts `{ "cells": { "A1": "12", "B1": "=A1*2" } }` patches. Empty strings clear cells. Requests are validated and serialized. Saves use a temporary file and atomic rename.
- The server rebuilds computed values from saved raw cells on startup, so stale cached results cannot survive a reload. Undo history and activity are session-local. This is a single-user local workbook; simultaneous users are not coordinated.

## Acceptance walkthrough

Use the unused J column:

1. Paste `2`, `=J1+1`, `=J2*2`, `=J3+1` vertically into J1:J4. J4 is 7.
2. Change J1 to 5. J2:J4 become 6, 12, 13. Select J2 to inspect both directions.
3. Change J1 to `=J3`. J1:J3 display `#CYCLE!`, and J4 propagates it.
4. Undo to recover 5, 6, 12, 13; redo to restore the cycle; undo again.
5. Wait for the saved status, reload the full page, and verify the raw formulas and values.

Automated tests cover operator precedence, nested aggregates, percentages, decimal ROUND edge cases, comparisons and text, lazy IF branches, unknown names, the original Fable invoice formulas, forward/diamond dependencies, unaffected-cell caching, direct/indirect and range cycles, cycle recovery, error propagation, graph edge removal, 30-step undo/redo, atomic edits, and persistence of numbers, logical values, strings and errors across an actual HTTP server restart.

## Interface notes

The restrained warm-white, green, blue, and amber palette separates editing, references, and dependents. System fonts avoid external font requests. The grid scrolls independently; on small screens the inspector is hidden to preserve editing space. Keyboard focus, dialog focus containment, error/loading states, and reduced-motion styles are included. The frontend uses no chart library or image assets.
