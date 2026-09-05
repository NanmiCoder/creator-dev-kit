export const ROWS = 40;
export const COLS = 12;
export type ErrorCode = '#DIV/0!' | '#REF!' | '#VALUE!' | '#CYCLE!' | '#NAME?' | '#NUM!';
export type Value = number | string | boolean | null | { error: ErrorCode };
export type RawCells = Record<string, string>;
type Node =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'name'; name: string }
  | { type: 'ref'; id: string }
  | { type: 'range'; from: string; to: string }
  | { type: 'unary'; op: string; child: Node }
  | { type: 'binary'; op: string; left: Node; right: Node }
  | { type: 'call'; name: string; args: Node[] };
type Token = { kind: string; text: string };

export const error = (code: ErrorCode): Value => ({ error: code });
export const isError = (v: Value): v is { error: ErrorCode } => typeof v === 'object' && v !== null;
export const displayValue = (v: Value): string => isError(v) ? v.error : v === null ? '' : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v);
export const cellId = (row: number, col: number) => `${String.fromCharCode(65 + col)}${row + 1}`;
export function coordinates(id: string): [number, number] {
  const match = /^([A-Z]+)([1-9]\d*)$/.exec(id.toUpperCase());
  if (!match) return [-1, -1];
  const col = [...match[1]].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
  return [Number(match[2]) - 1, col];
}
export function validId(id: string) {
  const [r, c] = coordinates(id);
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}
export function rangeIds(from: string, to: string): string[] {
  if (!validId(from) || !validId(to)) throw '#REF!';
  const [r1, c1] = coordinates(from), [r2, c2] = coordinates(to);
  const result: string[] = [];
  for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++)
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) result.push(cellId(r, c));
  return result;
}

// Recursive descent grammar. No eval, Function constructor, or formula library.
class Parser {
  tokens: Token[] = [];
  index = 0;
  constructor(input: string) {
    const pattern = /\s+|"(?:[^"]|"")*"|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z_0-9.]*|<>|<=|>=|[+\-*/%():,=<>]/gy;
    let offset = 0;
    while (offset < input.length) {
      pattern.lastIndex = offset;
      const match = pattern.exec(input);
      if (!match) throw '#VALUE!';
      offset = pattern.lastIndex;
      const lexeme = match[0];
      const text = lexeme.startsWith('"') ? lexeme.slice(1, -1).replaceAll('""', '"') : lexeme.toUpperCase();
      if (lexeme.startsWith('"')) { this.tokens.push({ kind: 'string', text }); continue; }
      if (/^\s/.test(text)) continue;
      const kind = /^(\d|\.)/.test(text) ? 'number' : /^[A-Z]+\d+$/.test(text) ? 'ref' : /^[A-Z_]/.test(text) ? 'name' : text;
      this.tokens.push({ kind, text });
    }
    this.tokens.push({ kind: 'end', text: '' });
  }
  peek() { return this.tokens[this.index]; }
  consume(kind: string) {
    if (this.peek().kind !== kind) throw '#VALUE!';
    return this.tokens[this.index++];
  }
  parse(): Node {
    const result = this.expression();
    this.consume('end');
    return result;
  }
  expression(): Node {
    let left = this.sum();
    while (['=', '<>', '<', '>', '<=', '>='].includes(this.peek().kind)) {
      const op = this.tokens[this.index++].kind;
      left = { type: 'binary', op, left, right: this.sum() };
    }
    return left;
  }
  sum(): Node {
    let left = this.product();
    while (['+', '-'].includes(this.peek().kind)) {
      const op = this.tokens[this.index++].kind;
      left = { type: 'binary', op, left, right: this.product() };
    }
    return left;
  }
  product(): Node {
    let left = this.percent();
    while (['*', '/'].includes(this.peek().kind)) {
      const op = this.tokens[this.index++].kind;
      left = { type: 'binary', op, left, right: this.percent() };
    }
    return left;
  }
  percent(): Node {
    let child = this.unary();
    while (this.peek().kind === '%') {
      this.index++;
      child = { type: 'unary', op: '%', child };
    }
    return child;
  }
  unary(): Node {
    if (['+', '-'].includes(this.peek().kind)) {
      const op = this.tokens[this.index++].kind;
      return { type: 'unary', op, child: this.unary() };
    }
    return this.atom();
  }
  atom(): Node {
    const token = this.peek();
    if (token.kind === 'number') { this.index++; return { type: 'number', value: Number(token.text) }; }
    if (token.kind === 'string') { this.index++; return { type: 'string', value: token.text }; }
    if (token.kind === '(') {
      this.index++;
      const node = this.expression();
      this.consume(')');
      return node;
    }
    if (token.kind === 'ref') {
      this.index++;
      if (this.peek().kind === ':') {
        this.index++;
        return { type: 'range', from: token.text, to: this.consume('ref').text };
      }
      return { type: 'ref', id: token.text };
    }
    if (token.kind === 'name') {
      this.index++;
      if (this.peek().kind !== '(') {
        if (token.text === 'TRUE' || token.text === 'FALSE') return { type: 'boolean', value: token.text === 'TRUE' };
        return { type: 'name', name: token.text };
      }
      this.consume('(');
      const args: Node[] = [];
      if (this.peek().kind !== ')') {
        args.push(this.expression());
        while (this.peek().kind === ',') { this.index++; args.push(this.expression()); }
      }
      this.consume(')');
      return { type: 'call', name: token.text, args };
    }
    throw '#VALUE!';
  }
}

function refs(node: Node, result = new Set<string>()): Set<string> {
  if (node.type === 'ref' && validId(node.id)) result.add(node.id);
  if (node.type === 'range') {
    try { rangeIds(node.from, node.to).forEach(id => result.add(id)); } catch { /* evaluator reports invalid range */ }
  }
  if (node.type === 'binary') { refs(node.left, result); refs(node.right, result); }
  if (node.type === 'unary') refs(node.child, result);
  if (node.type === 'call') node.args.forEach(arg => refs(arg, result));
  return result;
}

function numeric(v: Value): number | { error: ErrorCode } {
  if (isError(v)) return v;
  if (v === null || v === '') return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return Number(v);
  return { error: '#VALUE!' };
}

function logical(v: Value): boolean | { error: ErrorCode } {
  if (isError(v)) return v;
  if (v === null) return false;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (/^(TRUE|FALSE)$/i.test(v)) return v.toUpperCase() === 'TRUE';
  return { error: '#VALUE!' };
}

function compare(left: Exclude<Value, { error: ErrorCode }>, right: Exclude<Value, { error: ErrorCode }>): number {
  // Blank references take the other operand's type. Text comparison is case-insensitive.
  if (left === null) left = typeof right === 'string' ? '' : typeof right === 'boolean' ? false : 0;
  if (right === null) right = typeof left === 'string' ? '' : typeof left === 'boolean' ? false : 0;
  if (typeof left !== typeof right) {
    const rank = (v: typeof left) => typeof v === 'number' ? 0 : typeof v === 'string' ? 1 : 2;
    return rank(left) - rank(right);
  }
  if (typeof left === 'string' && typeof right === 'string') { left = left.toLowerCase(); right = right.toLowerCase(); }
  return left === right ? 0 : left < right ? -1 : 1;
}

function roundDecimal(value: number, precision: number): Value {
  const places = Math.trunc(precision);
  const [mantissa, exponent = '0'] = Math.abs(value).toString().split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  const digits = whole + fraction;
  const shift = Number(exponent) - fraction.length + places;
  if (shift >= 0 || value === 0) return value;
  if (-shift > digits.length) return 0;
  // Round the decimal digits directly, avoiding 1.005 * 100's binary rounding error.
  // The divisor is bounded by the input's digit count, even for enormous precisions.
  const coefficient = BigInt(digits), divisor = 10n ** BigInt(-shift);
  const rounded = coefficient / divisor + (coefficient % divisor * 2n >= divisor ? 1n : 0n);
  if (rounded === 0n) return 0;
  const result = Math.sign(value) * Number(`${rounded}e${-places}`);
  return Number.isFinite(result) ? result : error('#NUM!');
}

function evaluate(node: Node, get: (id: string) => Value): Value {
  switch (node.type) {
    case 'number': return Number.isFinite(node.value) ? node.value : error('#NUM!');
    case 'string':
    case 'boolean': return node.value;
    case 'name': return error('#NAME?');
    case 'ref': return validId(node.id) ? get(node.id) : error('#REF!');
    case 'range': return error(validId(node.from) && validId(node.to) ? '#VALUE!' : '#REF!');
    case 'unary': {
      const v = numeric(evaluate(node.child, get));
      return isError(v) ? v : node.op === '-' ? -v : node.op === '%' ? v / 100 : v;
    }
    case 'binary': {
      const leftValue = evaluate(node.left, get), rightValue = evaluate(node.right, get);
      if (isError(leftValue)) return leftValue;
      if (isError(rightValue)) return rightValue;
      if (['=', '<>', '<', '>', '<=', '>='].includes(node.op)) {
        const comparison = compare(leftValue, rightValue);
        switch (node.op) {
          case '=': return comparison === 0;
          case '<>': return comparison !== 0;
          case '<': return comparison < 0;
          case '>': return comparison > 0;
          case '<=': return comparison <= 0;
          case '>=': return comparison >= 0;
        }
      }
      const left = numeric(leftValue), right = numeric(rightValue);
      if (isError(left)) return left;
      if (isError(right)) return right;
      if (node.op === '/' && right === 0) return error('#DIV/0!');
      const v = node.op === '+' ? left + right : node.op === '-' ? left - right : node.op === '*' ? left * right : left / right;
      return Number.isFinite(v) ? v : error('#NUM!');
    }
    case 'call': {
      if (node.name === 'IF') {
        if (node.args.length < 2 || node.args.length > 3) return error('#VALUE!');
        const condition = logical(evaluate(node.args[0], get));
        if (isError(condition)) return condition;
        // Evaluate only the chosen branch; references in both branches remain in the graph.
        const branch = condition ? node.args[1] : node.args[2];
        return branch ? evaluate(branch, get) : false;
      }
      if (node.name === 'ROUND') {
        if (node.args.length !== 2) return error('#VALUE!');
        const value = numeric(evaluate(node.args[0], get)), places = numeric(evaluate(node.args[1], get));
        if (isError(value)) return value;
        if (isError(places)) return places;
        return roundDecimal(value, places);
      }
      if (!['SUM', 'AVG'].includes(node.name)) return error('#NAME?');
      const values: Value[] = [];
      for (const arg of node.args) {
        if (arg.type === 'range') {
          try { values.push(...rangeIds(arg.from, arg.to).map(get)); } catch { return error('#REF!'); }
        } else values.push(evaluate(arg, get));
      }
      const failure = values.find(isError);
      if (failure) return failure;
      // Like spreadsheets, aggregate functions ignore text and empty cells.
      const numbers = values.filter((v): v is number => typeof v === 'number');
      if (node.name === 'AVG' && numbers.length === 0) return error('#DIV/0!');
      const sum = numbers.reduce((a, b) => a + b, 0);
      const result = node.name === 'SUM' ? sum : sum / numbers.length;
      return Number.isFinite(result) ? result : error('#NUM!');
    }
  }
}

export class Spreadsheet {
  raw: RawCells = {};
  values = new Map<string, Value>();
  dependencies = new Map<string, Set<string>>();
  dependents = new Map<string, Set<string>>();
  private ast = new Map<string, Node>();
  private parseErrors = new Map<string, ErrorCode>();
  lastRecalculated: string[] = [];
  lastDuration = 0;
  constructor(raw: RawCells = {}) { this.apply(raw); }
  value(id: string): Value { return this.values.get(id) ?? null; }
  related(id: string, direction: 'dependencies' | 'dependents', transitive = true): Set<string> {
    const graph = this[direction], result = new Set<string>(), queue = [...(graph.get(id) ?? [])];
    for (let i = 0; i < queue.length; i++) {
      const next = queue[i];
      if (result.has(next)) continue;
      result.add(next);
      if (transitive) queue.push(...(graph.get(next) ?? []));
    }
    result.delete(id);
    return result;
  }
  apply(edits: RawCells): string[] {
    const start = performance.now();
    const changed = Object.keys(edits).filter(id => validId(id) && (this.raw[id] ?? '') !== edits[id]);
    if (!changed.length) { this.lastRecalculated = []; return []; }
    const affected = new Set<string>();
    for (const id of changed) {
      affected.add(id);
      this.related(id, 'dependents').forEach(cell => affected.add(cell));
    }
    for (const id of changed) {
      for (const dep of this.dependencies.get(id) ?? []) this.dependents.get(dep)?.delete(id);
      this.dependencies.delete(id);
      this.ast.delete(id);
      this.parseErrors.delete(id);
      const raw = edits[id];
      if (raw) this.raw[id] = raw; else delete this.raw[id];
      if (raw.trimStart().startsWith('=')) {
        try {
          if (raw.length > 10000) throw '#VALUE!';
          const ast = new Parser(raw.trimStart().slice(1)).parse();
          this.ast.set(id, ast);
          const deps = refs(ast);
          this.dependencies.set(id, deps);
          for (const dep of deps) {
            if (!this.dependents.has(dep)) this.dependents.set(dep, new Set());
            this.dependents.get(dep)!.add(id);
          }
        } catch { this.parseErrors.set(id, '#VALUE!'); }
      }
    }
    for (const id of changed) this.related(id, 'dependents').forEach(cell => affected.add(cell));

    // Tarjan SCC on the affected subgraph identifies every participant in a cycle.
    let index = 0;
    const indices = new Map<string, number>(), low = new Map<string, number>();
    const stack: string[] = [], onStack = new Set<string>(), cycles = new Set<string>();
    const visit = (id: string) => {
      indices.set(id, index); low.set(id, index++); stack.push(id); onStack.add(id);
      for (const dep of this.dependencies.get(id) ?? []) {
        if (!affected.has(dep)) continue;
        if (!indices.has(dep)) { visit(dep); low.set(id, Math.min(low.get(id)!, low.get(dep)!)); }
        else if (onStack.has(dep)) low.set(id, Math.min(low.get(id)!, indices.get(dep)!));
      }
      if (low.get(id) === indices.get(id)) {
        const component: string[] = [];
        let item: string;
        do { item = stack.pop()!; onStack.delete(item); component.push(item); } while (item !== id);
        if (component.length > 1 || this.dependencies.get(id)?.has(id)) component.forEach(c => cycles.add(c));
      }
    };
    affected.forEach(id => { if (!indices.has(id)) visit(id); });
    const done = new Set<string>();
    const order: string[] = [];
    const calculate = (id: string): Value => {
      if (!affected.has(id) || done.has(id)) return this.value(id);
      done.add(id);
      let value: Value;
      if (cycles.has(id)) value = error('#CYCLE!');
      else if (this.parseErrors.has(id)) value = error(this.parseErrors.get(id)!);
      else if (this.ast.has(id)) value = evaluate(this.ast.get(id)!, calculate);
      else {
        const raw = this.raw[id] ?? '';
        const trimmed = raw.trim();
        value = !raw ? null : trimmed !== '' && Number.isFinite(Number(trimmed)) ? Number(trimmed) : raw;
      }
      this.values.set(id, value);
      order.push(id);
      return value;
    };
    affected.forEach(calculate);
    this.lastRecalculated = order;
    this.lastDuration = performance.now() - start;
    return order;
  }
}

export class History {
  private undoStack: { before: RawCells; after: RawCells }[] = [];
  private redoStack: { before: RawCells; after: RawCells }[] = [];
  constructor(public sheet: Spreadsheet) {}
  get canUndo() { return this.undoStack.length > 0; }
  get canRedo() { return this.redoStack.length > 0; }
  edit(edits: RawCells) {
    const after = Object.fromEntries(Object.entries(edits).filter(([id, raw]) => validId(id) && (this.sheet.raw[id] ?? '') !== raw));
    if (!Object.keys(after).length) return false;
    const before = Object.fromEntries(Object.keys(after).map(id => [id, this.sheet.raw[id] ?? '']));
    this.sheet.apply(after);
    this.undoStack.push({ before, after });
    if (this.undoStack.length > 100) this.undoStack.shift();
    this.redoStack = [];
    return true;
  }
  undo() {
    const entry = this.undoStack.pop();
    if (!entry) return false;
    this.sheet.apply(entry.before); this.redoStack.push(entry); return true;
  }
  redo() {
    const entry = this.redoStack.pop();
    if (!entry) return false;
    this.sheet.apply(entry.after); this.undoStack.push(entry); return true;
  }
}
