import { FUNCTION_NAMES, valueKind, type CellSnapshot } from '../engine';

export interface InspectorProps {
  cell: CellSnapshot;
  transitivePrecedents: string[];
  transitiveDependents: string[];
  onJump: (addr: string) => void;
}

const KIND_LABEL: Record<ReturnType<typeof valueKind>, string> = {
  empty: 'empty',
  number: 'number',
  text: 'text',
  boolean: 'boolean',
  error: 'error',
};

function Chips(p: { addrs: string[]; tone: 'precedent' | 'dependent'; dim?: boolean; onJump: (a: string) => void }) {
  if (p.addrs.length === 0) return <span className="inspector__none">none</span>;
  return (
    <div className="chips">
      {p.addrs.map((a) => (
        <button key={a} type="button" className={`chip chip--${p.tone}${p.dim ? ' chip--dim' : ''}`} onClick={() => p.onJump(a)} title={`Go to ${a}`}>
          {a}
        </button>
      ))}
    </div>
  );
}

export function Inspector(p: InspectorProps) {
  const { cell } = p;
  const kind = valueKind(cell.value);
  const direct = new Set(cell.precedents);
  const indirectPrecedents = p.transitivePrecedents.filter((a) => !direct.has(a));
  const directDep = new Set(cell.dependents);
  const indirectDependents = p.transitiveDependents.filter((a) => !directDep.has(a));

  return (
    <aside className="inspector">
      <div className="inspector__head">
        <h2 className="inspector__addr">{cell.addr}</h2>
        <span className={`badge badge--${kind}`}>{cell.isFormula ? `formula → ${KIND_LABEL[kind]}` : KIND_LABEL[kind]}</span>
      </div>

      <section className="inspector__section">
        <h3>Raw input</h3>
        <code className="inspector__code">{cell.raw === '' ? <span className="inspector__none">(empty)</span> : cell.raw}</code>
      </section>

      <section className="inspector__section">
        <h3>Computed value</h3>
        <code className={`inspector__code${cell.error ? ' inspector__code--error' : ''}`}>
          {cell.display === '' ? <span className="inspector__none">(empty)</span> : cell.display}
        </code>
        {cell.error ? <p className="inspector__error">{cell.errorMessage || cell.error}</p> : null}
      </section>

      <section className="inspector__section">
        <h3>
          <span className="legend legend--precedent" /> References (precedents)
          <span className="inspector__count">{cell.precedents.length}</span>
        </h3>
        <Chips addrs={cell.precedents} tone="precedent" onJump={p.onJump} />
        {indirectPrecedents.length > 0 && (
          <>
            <h4>indirect</h4>
            <Chips addrs={indirectPrecedents} tone="precedent" dim onJump={p.onJump} />
          </>
        )}
      </section>

      <section className="inspector__section">
        <h3>
          <span className="legend legend--dependent" /> Dependents
          <span className="inspector__count">{cell.dependents.length}</span>
        </h3>
        <Chips addrs={cell.dependents} tone="dependent" onJump={p.onJump} />
        {indirectDependents.length > 0 && (
          <>
            <h4>indirect</h4>
            <Chips addrs={indirectDependents} tone="dependent" dim onJump={p.onJump} />
          </>
        )}
      </section>

      <section className="inspector__section inspector__help">
        <h3>Cheat sheet</h3>
        <ul>
          <li><kbd>Enter</kbd> / <kbd>F2</kbd> edit · <kbd>Esc</kbd> cancel · <kbd>Tab</kbd> next cell</li>
          <li><kbd>Shift</kbd>+arrows select · <kbd>Del</kbd> clear</li>
          <li><kbd>⌘/Ctrl</kbd>+<kbd>C</kbd>/<kbd>X</kbd>/<kbd>V</kbd> copy / cut / paste</li>
          <li><kbd>⌘/Ctrl</kbd>+<kbd>Z</kbd> undo · <kbd>⌘/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> redo</li>
        </ul>
        <p className="inspector__fns">
          Functions: {FUNCTION_NAMES.join(', ')}. Operators: + - * / ^ &amp; % and comparisons.
        </p>
        <p className="inspector__fns">Errors: #DIV/0! #REF! #VALUE! #CYCLE! #NAME? #NUM! #ERROR!</p>
      </section>
    </aside>
  );
}
