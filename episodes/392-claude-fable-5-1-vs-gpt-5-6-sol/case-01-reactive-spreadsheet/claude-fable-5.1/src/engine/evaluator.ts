import type { AstNode } from './parser';
import { CellError, type Address, type GridSize, type Value, inBounds, isError, parseNumber } from './types';

export interface EvalContext {
  grid: GridSize;
  /** Read the current computed value of a cell. Must return null for empty cells. */
  getValue(addr: Address): Value;
}

/** A range evaluates to a list of scalar values (only meaningful as a function argument). */
class RangeValue {
  constructor(public readonly values: Value[]) {}
}
type Operand = Value | RangeValue;

const err = (code: CellError['code'], message?: string) => new CellError(code, message);

// ---------------------------------------------------------------------------
// Coercion helpers
// ---------------------------------------------------------------------------

function toNumber(v: Operand): number | CellError {
  if (v instanceof RangeValue) return err('#VALUE!', 'A range cannot be used as a single value');
  if (isError(v)) return v;
  if (v === null) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = parseNumber(v);
  return n === null ? err('#VALUE!', `"${v}" is not a number`) : n;
}

function toText(v: Operand): string | CellError {
  if (v instanceof RangeValue) return err('#VALUE!', 'A range cannot be used as a single value');
  if (isError(v)) return v;
  if (v === null) return '';
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  return String(v);
}

function toBoolean(v: Operand): boolean | CellError {
  if (v instanceof RangeValue) return err('#VALUE!', 'A range cannot be used as a condition');
  if (isError(v)) return v;
  if (v === null) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  const u = v.trim().toUpperCase();
  if (u === 'TRUE') return true;
  if (u === 'FALSE') return false;
  const n = parseNumber(v);
  return n === null ? err('#VALUE!', `"${v}" is not a valid condition`) : n !== 0;
}

/** Flatten function arguments into scalars; ranges are expanded, errors surface immediately. */
function flatten(args: Operand[]): Value[] | CellError {
  const out: Value[] = [];
  for (const a of args) {
    if (a instanceof RangeValue) {
      for (const v of a.values) {
        if (isError(v)) return v;
        out.push(v);
      }
    } else {
      if (isError(a)) return a;
      out.push(a);
    }
  }
  return out;
}

/** Numbers from arguments: direct arguments are coerced, range cells are only used if numeric. */
function numericArgs(args: Operand[]): number[] | CellError {
  const out: number[] = [];
  for (const a of args) {
    if (a instanceof RangeValue) {
      for (const v of a.values) {
        if (isError(v)) return v;
        if (typeof v === 'number') out.push(v);
      }
    } else {
      const n = toNumber(a);
      if (isError(n)) return n;
      out.push(n);
    }
  }
  return out;
}

function finite(n: number): number | CellError {
  return Number.isFinite(n) ? n : err('#NUM!', 'Result is not a finite number');
}

// ---------------------------------------------------------------------------
// Built-in functions
// ---------------------------------------------------------------------------

type Fn = (args: Operand[], lazy: (() => Operand)[]) => Operand;

const requireArgs = (name: string, args: unknown[], min: number, max = min): CellError | null =>
  args.length < min || args.length > max
    ? err('#VALUE!', `${name} expects ${min === max ? min : `${min}-${max}`} argument(s), got ${args.length}`)
    : null;

const FUNCTIONS: Record<string, Fn> = {
  SUM: (args) => {
    const nums = numericArgs(args);
    return isError(nums) ? nums : nums.reduce((a, b) => a + b, 0);
  },
  AVG: (args) => {
    const nums = numericArgs(args);
    if (isError(nums)) return nums;
    if (nums.length === 0) return err('#DIV/0!', 'AVG of no numeric values');
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  },
  MIN: (args) => {
    const nums = numericArgs(args);
    return isError(nums) ? nums : nums.length ? Math.min(...nums) : 0;
  },
  MAX: (args) => {
    const nums = numericArgs(args);
    return isError(nums) ? nums : nums.length ? Math.max(...nums) : 0;
  },
  COUNT: (args) => {
    const vals = flatten(args);
    return isError(vals) ? vals : vals.filter((v) => typeof v === 'number').length;
  },
  COUNTA: (args) => {
    const vals = flatten(args);
    return isError(vals) ? vals : vals.filter((v) => v !== null && v !== '').length;
  },
  ABS: (args) => {
    const e = requireArgs('ABS', args, 1);
    if (e) return e;
    const n = toNumber(args[0]);
    return isError(n) ? n : Math.abs(n);
  },
  SQRT: (args) => {
    const e = requireArgs('SQRT', args, 1);
    if (e) return e;
    const n = toNumber(args[0]);
    if (isError(n)) return n;
    return n < 0 ? err('#NUM!', 'SQRT of a negative number') : Math.sqrt(n);
  },
  ROUND: (args) => {
    const e = requireArgs('ROUND', args, 1, 2);
    if (e) return e;
    const n = toNumber(args[0]);
    if (isError(n)) return n;
    const d = args.length > 1 ? toNumber(args[1]) : 0;
    if (isError(d)) return d;
    const f = 10 ** Math.trunc(d);
    return finite(Math.round(n * f) / f);
  },
  MOD: (args) => {
    const e = requireArgs('MOD', args, 2);
    if (e) return e;
    const a = toNumber(args[0]);
    if (isError(a)) return a;
    const b = toNumber(args[1]);
    if (isError(b)) return b;
    if (b === 0) return err('#DIV/0!', 'MOD by zero');
    return a - b * Math.floor(a / b);
  },
  POWER: (args) => {
    const e = requireArgs('POWER', args, 2);
    if (e) return e;
    const a = toNumber(args[0]);
    if (isError(a)) return a;
    const b = toNumber(args[1]);
    if (isError(b)) return b;
    return finite(a ** b);
  },
  LEN: (args) => {
    const e = requireArgs('LEN', args, 1);
    if (e) return e;
    const s = toText(args[0]);
    return isError(s) ? s : s.length;
  },
  UPPER: (args) => {
    const e = requireArgs('UPPER', args, 1);
    if (e) return e;
    const s = toText(args[0]);
    return isError(s) ? s : s.toUpperCase();
  },
  LOWER: (args) => {
    const e = requireArgs('LOWER', args, 1);
    if (e) return e;
    const s = toText(args[0]);
    return isError(s) ? s : s.toLowerCase();
  },
  CONCAT: (args) => {
    const vals = flatten(args);
    if (isError(vals)) return vals;
    let out = '';
    for (const v of vals) {
      const s = toText(v);
      if (isError(s)) return s;
      out += s;
    }
    return out;
  },
  NOT: (args) => {
    const e = requireArgs('NOT', args, 1);
    if (e) return e;
    const b = toBoolean(args[0]);
    return isError(b) ? b : !b;
  },
  AND: (args) => {
    const vals = flatten(args);
    if (isError(vals)) return vals;
    for (const v of vals) {
      const b = toBoolean(v);
      if (isError(b)) return b;
      if (!b) return false;
    }
    return true;
  },
  OR: (args) => {
    const vals = flatten(args);
    if (isError(vals)) return vals;
    for (const v of vals) {
      const b = toBoolean(v);
      if (isError(b)) return b;
      if (b) return true;
    }
    return false;
  },
  // IF is lazy: only the chosen branch is evaluated so errors in the other branch are ignored.
  IF: (_args, lazy) => {
    const e = requireArgs('IF', lazy, 2, 3);
    if (e) return e;
    const cond = toBoolean(lazy[0]());
    if (isError(cond)) return cond;
    if (cond) return lazy[1]();
    return lazy.length > 2 ? lazy[2]() : false;
  },
  ISERROR: (_args, lazy) => {
    const e = requireArgs('ISERROR', lazy, 1);
    if (e) return e;
    return isError(lazy[0]());
  },
};
FUNCTIONS.AVERAGE = FUNCTIONS.AVG;

const LAZY_FUNCTIONS = new Set(['IF', 'ISERROR']);

export const FUNCTION_NAMES = Object.keys(FUNCTIONS).sort();

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

function compare(op: string, l: Operand, r: Operand): Value {
  if (l instanceof RangeValue || r instanceof RangeValue) return err('#VALUE!', 'Cannot compare ranges');
  if (isError(l)) return l;
  if (isError(r)) return r;
  const numericLike = (v: Value) => v === null || typeof v === 'number' || typeof v === 'boolean';
  let cmp: number;
  if (numericLike(l) && numericLike(r)) {
    cmp = (toNumber(l) as number) - (toNumber(r) as number);
  } else {
    const ls = (toText(l) as string).toLowerCase();
    const rs = (toText(r) as string).toLowerCase();
    cmp = ls < rs ? -1 : ls > rs ? 1 : 0;
  }
  switch (op) {
    case '=': return cmp === 0;
    case '<>': return cmp !== 0;
    case '<': return cmp < 0;
    case '>': return cmp > 0;
    case '<=': return cmp <= 0;
    default: return cmp >= 0;
  }
}

function arithmetic(op: string, l: Operand, r: Operand): Value {
  const a = toNumber(l);
  if (isError(a)) return a;
  const b = toNumber(r);
  if (isError(b)) return b;
  switch (op) {
    case '+': return finite(a + b);
    case '-': return finite(a - b);
    case '*': return finite(a * b);
    case '/': return b === 0 ? err('#DIV/0!', 'Division by zero') : finite(a / b);
    default: return finite(a ** b);
  }
}

function evalNode(node: AstNode, ctx: EvalContext): Operand {
  switch (node.type) {
    case 'number':
    case 'string':
    case 'boolean':
      return node.value;
    case 'ref':
      if (!inBounds(node.addr, ctx.grid)) return err('#REF!', `${node.text} is outside the sheet`);
      return ctx.getValue(node.addr);
    case 'range': {
      if (!inBounds(node.start, ctx.grid) || !inBounds(node.end, ctx.grid)) {
        return err('#REF!', `${node.text} is outside the sheet`);
      }
      const values: Value[] = [];
      for (let r = node.start.row; r <= node.end.row; r++) {
        for (let c = node.start.col; c <= node.end.col; c++) values.push(ctx.getValue({ col: c, row: r }));
      }
      return new RangeValue(values);
    }
    case 'unary': {
      const v = toNumber(evalNode(node.operand, ctx));
      return isError(v) ? v : node.op === '-' ? -v : v;
    }
    case 'percent': {
      const v = toNumber(evalNode(node.operand, ctx));
      return isError(v) ? v : v / 100;
    }
    case 'binary': {
      const l = evalNode(node.left, ctx);
      const r = evalNode(node.right, ctx);
      if (node.op === '&') {
        const ls = toText(l);
        if (isError(ls)) return ls;
        const rs = toText(r);
        return isError(rs) ? rs : ls + rs;
      }
      if (['=', '<>', '<', '>', '<=', '>='].includes(node.op)) return compare(node.op, l, r);
      return arithmetic(node.op, l, r);
    }
    case 'call': {
      const fn = FUNCTIONS[node.name];
      if (!fn) return err('#NAME?', `Unknown function ${node.name}`);
      const lazy = node.args.map((a) => () => evalNode(a, ctx));
      const args = LAZY_FUNCTIONS.has(node.name) ? [] : lazy.map((f) => f());
      return fn(args, lazy);
    }
  }
}

/** Evaluate a parsed formula. Never throws: every failure is reported as a CellError value. */
export function evaluate(ast: AstNode, ctx: EvalContext): Value {
  try {
    let v = evalNode(ast, ctx);
    if (v instanceof RangeValue) {
      if (v.values.length !== 1) return err('#VALUE!', 'A range cannot be displayed in a single cell');
      v = v.values[0];
    }
    // A formula that resolves to an empty cell shows 0, like Excel (=B2 with B2 blank).
    return v === null ? 0 : v;
  } catch (e) {
    return err('#ERROR!', e instanceof Error ? e.message : String(e));
  }
}
