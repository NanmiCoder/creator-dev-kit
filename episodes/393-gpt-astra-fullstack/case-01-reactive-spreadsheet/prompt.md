# Challenge 1: Reactive Spreadsheet Engine

Starting from the current empty directory, build a complete, runnable full-stack web application: **a compact spreadsheet with formula evaluation and dependency tracking**.

## Goal

Users should be able to edit cells much like they would in Excel. Whenever a cell changes, every formula that depends on it—directly or indirectly—must be recalculated in the correct order. The interface must make raw formulas, computed values, errors, and dependency relationships easy to inspect.

## Required functionality

1. Build an editable grid with at least 20 rows and 10 columns. Support keyboard selection, Enter to edit, arrow-key navigation, and copy/paste.
2. Cells must accept text, numbers, and formulas beginning with `=`.
3. Implement the formula parser and evaluator yourself. At minimum, support:
   - A1-style cell references.
   - `+`, `-`, `*`, `/`, parentheses, and correct operator precedence.
   - `SUM(A1:A5)` and `AVG(B1:B5)`.
   - Formulas that combine functions, ranges, references, and arithmetic expressions.
4. Maintain a real dependency graph and recalculate only affected cells. Multi-level indirect dependencies and forward references must work correctly.
5. Detect both direct and indirect circular references. Every cell participating in a cycle must display `#CYCLE!`; the application must never hang or crash.
6. Correctly produce and propagate `#DIV/0!`, `#REF!`, and `#VALUE!` errors.
7. When a cell is selected, clearly highlight both the cells it references and the cells that depend on it.
8. Implement undo and redo for at least the 20 most recent edits.
9. Persist the workbook through a backend. After a page reload, raw values, formulas, and computed results must remain correct.
10. Provide clear setup and start commands in a README, and ensure the project can complete a production build.

## Acceptance scenario

I will create a formula dependency chain at least three levels deep, change the root value, and observe the cascade recalculation. I will then create an indirect circular reference and inspect the resulting errors. Finally, I will test undo, redo, and persistence across a full page reload.

This is a **15-minute challenge**. Start implementing immediately. Prioritize the formula engine, dependency graph, error propagation, and a runnable end-to-end result.
