export const ROW_COUNT = 20;
export const COLUMN_COUNT = 10;

export type FormulaError = '#CYCLE!' | '#DIV/0!' | '#REF!' | '#VALUE!';

type Scalar = number | string;
type CellValue = { value: Scalar; error?: FormulaError };

type Token =
  | { type: 'number'; value: number }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { type: 'lparen' | 'rparen' | 'colon' | 'comma' | 'eof' };

type AstNode =
  | { type: 'number'; value: number }
  | { type: 'reference'; id: string }
  | { type: 'range'; from: string; to: string }
  | { type: 'binary'; operator: '+' | '-' | '*' | '/'; left: AstNode; right: AstNode }
  | { type: 'unary'; operator: '+' | '-'; operand: AstNode }
  | { type: 'function'; name: 'SUM' | 'AVG'; args: AstNode[] };

type ParsedFormula =
  | { ast: AstNode; dependencies: Set<string> }
  | { error: FormulaError; dependencies: Set<string> };

export interface CellSnapshot {
  id: string;
  raw: string;
  display: string;
  value: Scalar;
  error?: FormulaError;
  dependencies: string[];
  dependents: string[];
}

export interface WorkbookSnapshot {
  cells: Record<string, CellSnapshot>;
  rawCells: Record<string, string>;
  recalculated: string[];
  revision: number;
}

const ERROR_PRIORITY: FormulaError[] = ['#CYCLE!', '#REF!', '#DIV/0!', '#VALUE!'];

export function columnLabel(index: number): string {
  let result = '';
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

export function cellId(column: number, row: number): string {
  return `${columnLabel(column)}${row + 1}`;
}

export function parseCellId(id: string): { column: number; row: number } | null {
  const match = /^([A-Z]+)([1-9]\d*)$/i.exec(id.trim());
  if (!match) return null;
  let column = 0;
  for (const char of match[1].toUpperCase()) {
    column = column * 26 + char.charCodeAt(0) - 64;
  }
  return { column: column - 1, row: Number(match[2]) - 1 };
}

export function isValidCellId(id: string): boolean {
  const parsed = parseCellId(id);
  return Boolean(
    parsed &&
      parsed.column >= 0 &&
      parsed.column < COLUMN_COUNT &&
      parsed.row >= 0 &&
      parsed.row < ROW_COUNT,
  );
}

function allCellIds(): string[] {
  return Array.from({ length: ROW_COUNT * COLUMN_COUNT }, (_, index) =>
    cellId(index % COLUMN_COUNT, Math.floor(index / COLUMN_COUNT)),
  );
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];
    if (/\s/.test(char)) {
      cursor += 1;
      continue;
    }
    if (/[0-9.]/.test(char)) {
      const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(input.slice(cursor));
      if (!match) throw new Error('Invalid number');
      tokens.push({ type: 'number', value: Number(match[0]) });
      cursor += match[0].length;
      continue;
    }
    if (/[A-Za-z_]/.test(char)) {
      const match = /^[A-Za-z_][A-Za-z0-9_]*/.exec(input.slice(cursor));
      if (!match) throw new Error('Invalid identifier');
      tokens.push({ type: 'identifier', value: match[0].toUpperCase() });
      cursor += match[0].length;
      continue;
    }
    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push({ type: 'operator', value: char });
      cursor += 1;
      continue;
    }
    const punctuation: Record<string, Token['type']> = {
      '(': 'lparen',
      ')': 'rparen',
      ':': 'colon',
      ',': 'comma',
    };
    if (punctuation[char]) {
      tokens.push({ type: punctuation[char] } as Token);
      cursor += 1;
      continue;
    }
    throw new Error(`Unexpected token ${char}`);
  }

  tokens.push({ type: 'eof' });
  return tokens;
}

class Parser {
  private cursor = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): AstNode {
    const expression = this.parseExpression();
    if (this.peek().type !== 'eof') throw new Error('Unexpected trailing token');
    return expression;
  }

  private peek(): Token {
    return this.tokens[this.cursor];
  }

  private take(): Token {
    return this.tokens[this.cursor++];
  }

  private expect(type: Token['type']): Token {
    const token = this.take();
    if (token.type !== type) throw new Error(`Expected ${type}`);
    return token;
  }

  private parseExpression(): AstNode {
    let node = this.parseTerm();
    while (this.peek().type === 'operator' && ['+', '-'].includes((this.peek() as { value: string }).value)) {
      const operator = (this.take() as Extract<Token, { type: 'operator' }>).value as '+' | '-';
      node = { type: 'binary', operator, left: node, right: this.parseTerm() };
    }
    return node;
  }

  private parseTerm(): AstNode {
    let node = this.parseUnary();
    while (this.peek().type === 'operator' && ['*', '/'].includes((this.peek() as { value: string }).value)) {
      const operator = (this.take() as Extract<Token, { type: 'operator' }>).value as '*' | '/';
      node = { type: 'binary', operator, left: node, right: this.parseUnary() };
    }
    return node;
  }

  private parseUnary(): AstNode {
    if (this.peek().type === 'operator' && ['+', '-'].includes((this.peek() as { value: string }).value)) {
      const operator = (this.take() as Extract<Token, { type: 'operator' }>).value as '+' | '-';
      return { type: 'unary', operator, operand: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): AstNode {
    const token = this.peek();
    if (token.type === 'number') {
      this.take();
      return { type: 'number', value: token.value };
    }
    if (token.type === 'lparen') {
      this.take();
      const expression = this.parseExpression();
      this.expect('rparen');
      return expression;
    }
    if (token.type === 'identifier') {
      this.take();
      const name = token.value;
      if (this.peek().type === 'lparen') {
        if (name !== 'SUM' && name !== 'AVG') throw new Error('Unknown function');
        this.take();
        const args: AstNode[] = [];
        if (this.peek().type !== 'rparen') {
          do {
            args.push(this.parseExpression());
            if (this.peek().type !== 'comma') break;
            this.take();
          } while (true);
        }
        this.expect('rparen');
        if (args.length === 0) throw new Error('Empty function');
        return { type: 'function', name, args };
      }
      if (!/^[A-Z]+[1-9]\d*$/.test(name)) throw new Error('Invalid reference');
      if (this.peek().type === 'colon') {
        this.take();
        const end = this.expect('identifier');
        if (end.type !== 'identifier' || !/^[A-Z]+[1-9]\d*$/.test(end.value)) {
          throw new Error('Invalid range');
        }
        return { type: 'range', from: name, to: end.value };
      }
      return { type: 'reference', id: name };
    }
    throw new Error('Expected expression');
  }
}

function expandRange(from: string, to: string): string[] | null {
  const start = parseCellId(from);
  const end = parseCellId(to);
  if (!start || !end || !isValidCellId(from) || !isValidCellId(to)) return null;
  const ids: string[] = [];
  for (let row = Math.min(start.row, end.row); row <= Math.max(start.row, end.row); row += 1) {
    for (
      let column = Math.min(start.column, end.column);
      column <= Math.max(start.column, end.column);
      column += 1
    ) {
      ids.push(cellId(column, row));
    }
  }
  return ids;
}

function collectDependencies(node: AstNode, dependencies: Set<string>): void {
  switch (node.type) {
    case 'reference':
      if (isValidCellId(node.id)) dependencies.add(node.id);
      break;
    case 'range': {
      const range = expandRange(node.from, node.to);
      range?.forEach((id) => dependencies.add(id));
      break;
    }
    case 'binary':
      collectDependencies(node.left, dependencies);
      collectDependencies(node.right, dependencies);
      break;
    case 'unary':
      collectDependencies(node.operand, dependencies);
      break;
    case 'function':
      node.args.forEach((argument) => collectDependencies(argument, dependencies));
      break;
    default:
      break;
  }
}

function parseFormula(raw: string): ParsedFormula {
  try {
    const ast = new Parser(tokenize(raw.slice(1))).parse();
    const dependencies = new Set<string>();
    collectDependencies(ast, dependencies);
    return { ast, dependencies };
  } catch {
    return { error: '#VALUE!', dependencies: new Set<string>() };
  }
}

function isError(value: CellValue): value is CellValue & { error: FormulaError } {
  return Boolean(value.error);
}

function higherPriorityError(left?: FormulaError, right?: FormulaError): FormulaError | undefined {
  return ERROR_PRIORITY.find((error) => error === left || error === right);
}

function asNumber(value: CellValue): CellValue {
  if (isError(value)) return value;
  if (typeof value.value === 'number') return value;
  if (value.value.trim() === '') return { value: 0 };
  return { value: '', error: '#VALUE!' };
}

function displayValue(result: CellValue): string {
  if (result.error) return result.error;
  if (typeof result.value === 'number') {
    if (!Number.isFinite(result.value)) return '#VALUE!';
    return Number.isInteger(result.value)
      ? String(result.value)
      : String(Number(result.value.toPrecision(12)));
  }
  return result.value;
}

export class SpreadsheetEngine {
  private raw = new Map<string, string>();
  private values = new Map<string, CellValue>();
  private parsed = new Map<string, ParsedFormula>();
  private dependencies = new Map<string, Set<string>>();
  private dependents = new Map<string, Set<string>>();
  private lastRecalculated = new Set<string>();
  private revision = 0;

  constructor(initial: Record<string, string> = {}) {
    for (const id of allCellIds()) {
      this.raw.set(id, typeof initial[id] === 'string' ? initial[id] : '');
      this.dependencies.set(id, new Set());
      this.dependents.set(id, new Set());
    }
    for (const id of allCellIds()) this.reparseCell(id);
    this.recalculate(new Set(allCellIds()));
  }

  getRaw(id: string): string {
    return this.raw.get(id) ?? '';
  }

  setCell(id: string, raw: string): WorkbookSnapshot {
    const normalizedId = id.toUpperCase();
    if (!isValidCellId(normalizedId)) return this.snapshot();
    if (this.raw.get(normalizedId) === raw) return this.snapshot();
    this.raw.set(normalizedId, raw);
    this.reparseCell(normalizedId);
    const affected = this.collectDependents(normalizedId, true);
    this.recalculate(affected);
    this.revision += 1;
    return this.snapshot();
  }

  getAncestors(id: string): Set<string> {
    const seen = new Set<string>();
    const visit = (current: string) => {
      for (const dependency of this.dependencies.get(current) ?? []) {
        if (seen.has(dependency)) continue;
        seen.add(dependency);
        visit(dependency);
      }
    };
    visit(id);
    seen.delete(id);
    return seen;
  }

  getDescendants(id: string): Set<string> {
    const seen = this.collectDependents(id, false);
    seen.delete(id);
    return seen;
  }

  snapshot(): WorkbookSnapshot {
    const cells: Record<string, CellSnapshot> = {};
    const rawCells: Record<string, string> = {};
    for (const id of allCellIds()) {
      const result = this.values.get(id) ?? { value: '' };
      const raw = this.raw.get(id) ?? '';
      if (raw !== '') rawCells[id] = raw;
      cells[id] = {
        id,
        raw,
        value: result.value,
        display: displayValue(result),
        error: result.error,
        dependencies: [...(this.dependencies.get(id) ?? [])],
        dependents: [...(this.dependents.get(id) ?? [])],
      };
    }
    return {
      cells,
      rawCells,
      recalculated: [...this.lastRecalculated],
      revision: this.revision,
    };
  }

  private reparseCell(id: string): void {
    const previous = this.dependencies.get(id) ?? new Set<string>();
    for (const dependency of previous) this.dependents.get(dependency)?.delete(id);

    const raw = this.raw.get(id) ?? '';
    const parsed = raw.startsWith('=') ? parseFormula(raw) : undefined;
    if (parsed) this.parsed.set(id, parsed);
    else this.parsed.delete(id);

    const next = parsed?.dependencies ?? new Set<string>();
    this.dependencies.set(id, next);
    for (const dependency of next) this.dependents.get(dependency)?.add(id);
  }

  private collectDependents(id: string, includeSelf: boolean): Set<string> {
    const seen = new Set<string>(includeSelf ? [id] : []);
    const queue = [id];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const dependent of this.dependents.get(current) ?? []) {
        if (seen.has(dependent)) continue;
        seen.add(dependent);
        queue.push(dependent);
      }
    }
    return seen;
  }

  private findCycleCells(): Set<string> {
    const indexes = new Map<string, number>();
    const lowLinks = new Map<string, number>();
    const stack: string[] = [];
    const onStack = new Set<string>();
    const cycles = new Set<string>();
    let index = 0;

    const connect = (id: string) => {
      indexes.set(id, index);
      lowLinks.set(id, index);
      index += 1;
      stack.push(id);
      onStack.add(id);

      for (const dependency of this.dependencies.get(id) ?? []) {
        if (!indexes.has(dependency)) {
          connect(dependency);
          lowLinks.set(id, Math.min(lowLinks.get(id)!, lowLinks.get(dependency)!));
        } else if (onStack.has(dependency)) {
          lowLinks.set(id, Math.min(lowLinks.get(id)!, indexes.get(dependency)!));
        }
      }

      if (lowLinks.get(id) !== indexes.get(id)) return;
      const component: string[] = [];
      let member: string;
      do {
        member = stack.pop()!;
        onStack.delete(member);
        component.push(member);
      } while (member !== id);

      if (
        component.length > 1 ||
        (component.length === 1 && (this.dependencies.get(id) ?? new Set()).has(id))
      ) {
        component.forEach((cell) => cycles.add(cell));
      }
    };

    for (const id of allCellIds()) if (!indexes.has(id)) connect(id);
    return cycles;
  }

  private recalculate(affected: Set<string>): void {
    const cycleCells = this.findCycleCells();
    const memo = new Map<string, CellValue>();
    const recalculated = new Set<string>();

    const evaluateCell = (id: string): CellValue => {
      if (memo.has(id)) return memo.get(id)!;
      if (!affected.has(id) && this.values.has(id)) return this.values.get(id)!;

      recalculated.add(id);
      if (cycleCells.has(id)) {
        const result: CellValue = { value: '', error: '#CYCLE!' };
        memo.set(id, result);
        return result;
      }

      const raw = this.raw.get(id) ?? '';
      let result: CellValue;
      if (!raw.startsWith('=')) {
        const trimmed = raw.trim();
        result = trimmed !== '' && /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)
          ? { value: Number(trimmed) }
          : { value: raw };
      } else {
        const parsed = this.parsed.get(id);
        result = !parsed || 'error' in parsed
          ? { value: '', error: parsed?.error ?? '#VALUE!' }
          : evaluateNode(parsed.ast);
      }
      memo.set(id, result);
      return result;
    };

    const evaluateNode = (node: AstNode): CellValue => {
      switch (node.type) {
        case 'number':
          return { value: node.value };
        case 'reference':
          return isValidCellId(node.id) ? evaluateCell(node.id) : { value: '', error: '#REF!' };
        case 'range':
          return { value: '', error: '#VALUE!' };
        case 'unary': {
          const operand = asNumber(evaluateNode(node.operand));
          if (operand.error) return operand;
          return { value: node.operator === '-' ? -(operand.value as number) : (operand.value as number) };
        }
        case 'binary': {
          const left = asNumber(evaluateNode(node.left));
          const right = asNumber(evaluateNode(node.right));
          const error = higherPriorityError(left.error, right.error);
          if (error) return { value: '', error };
          const a = left.value as number;
          const b = right.value as number;
          if (node.operator === '+') return { value: a + b };
          if (node.operator === '-') return { value: a - b };
          if (node.operator === '*') return { value: a * b };
          if (b === 0) return { value: '', error: '#DIV/0!' };
          return { value: a / b };
        }
        case 'function': {
          const values: CellValue[] = [];
          for (const argument of node.args) {
            if (argument.type === 'range') {
              const range = expandRange(argument.from, argument.to);
              if (!range) return { value: '', error: '#REF!' };
              range.forEach((id) => values.push(evaluateCell(id)));
            } else {
              values.push(evaluateNode(argument));
            }
          }
          const error = ERROR_PRIORITY.find((candidate) => values.some((value) => value.error === candidate));
          if (error) return { value: '', error };
          const numbers = values
            .filter((value) => typeof value.value === 'number')
            .map((value) => value.value as number);
          if (node.name === 'SUM') return { value: numbers.reduce((sum, value) => sum + value, 0) };
          if (numbers.length === 0) return { value: '', error: '#DIV/0!' };
          return { value: numbers.reduce((sum, value) => sum + value, 0) / numbers.length };
        }
      }
    };

    for (const id of affected) {
      const result = evaluateCell(id);
      this.values.set(id, result);
    }
    for (const [id, result] of memo) this.values.set(id, result);
    this.lastRecalculated = recalculated;
  }
}
