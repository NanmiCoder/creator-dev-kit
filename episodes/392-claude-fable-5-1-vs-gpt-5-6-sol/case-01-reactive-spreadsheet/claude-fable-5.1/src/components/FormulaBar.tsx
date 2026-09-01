import { useEffect, useRef, type KeyboardEvent } from 'react';

export interface FormulaBarProps {
  addr: string;
  selectionLabel: string;
  value: string;
  editing: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}

export function FormulaBar(p: FormulaBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  // When editing moves back to the grid, make sure the bar releases focus.
  useEffect(() => {
    if (!p.editing && document.activeElement === ref.current) ref.current?.blur();
  }, [p.editing]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      p.onCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      p.onCancel();
    }
  };

  return (
    <div className="formula-bar">
      <div className="formula-bar__addr" title="Active cell">{p.selectionLabel}</div>
      <span className="formula-bar__fx">fx</span>
      <input
        ref={ref}
        className={`formula-bar__input${p.value.startsWith('=') ? ' formula-bar__input--formula' : ''}`}
        value={p.value}
        placeholder={`Enter a value or formula for ${p.addr}, e.g. =SUM(A1:A5)*2`}
        onFocus={p.onFocus}
        onChange={(e) => p.onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => p.editing && p.onCommit()}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
