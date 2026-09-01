export type TokenType = 'number' | 'string' | 'ident' | 'op' | 'eof';

export interface Token {
  type: TokenType;
  /** raw source text for the token (numbers/strings are decoded in `value`) */
  text: string;
  value: string;
  pos: number;
}

export class FormulaSyntaxError extends Error {
  constructor(message: string, public readonly pos: number) {
    super(message);
    this.name = 'FormulaSyntaxError';
  }
}

const TWO_CHAR_OPS = new Set(['<>', '<=', '>=']);
const ONE_CHAR_OPS = new Set(['+', '-', '*', '/', '^', '&', '=', '<', '>', '(', ')', ',', ':', '%']);

const isDigit = (c: string) => c >= '0' && c <= '9';
const isIdentStart = (c: string) => /[A-Za-z_$]/.test(c);
const isIdentPart = (c: string) => /[A-Za-z0-9_$.]/.test(c);

/** Convert a formula body (without the leading '=') into a token list. */
export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }
    const start = i;

    // Numbers: 12, 1.5, .5, 1e3
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1] ?? ''))) {
      while (i < src.length && isDigit(src[i])) i++;
      if (src[i] === '.') {
        i++;
        while (i < src.length && isDigit(src[i])) i++;
      }
      if ((src[i] === 'e' || src[i] === 'E') && /[0-9+-]/.test(src[i + 1] ?? '')) {
        i++;
        if (src[i] === '+' || src[i] === '-') i++;
        if (!isDigit(src[i] ?? '')) throw new FormulaSyntaxError('Malformed number', start);
        while (i < src.length && isDigit(src[i])) i++;
      }
      const text = src.slice(start, i);
      tokens.push({ type: 'number', text, value: text, pos: start });
      continue;
    }

    // Strings: "hello ""quoted"" world"
    if (c === '"') {
      i++;
      let out = '';
      let closed = false;
      while (i < src.length) {
        if (src[i] === '"') {
          if (src[i + 1] === '"') {
            out += '"';
            i += 2;
            continue;
          }
          closed = true;
          i++;
          break;
        }
        out += src[i++];
      }
      if (!closed) throw new FormulaSyntaxError('Unterminated string literal', start);
      tokens.push({ type: 'string', text: src.slice(start, i), value: out, pos: start });
      continue;
    }

    // Identifiers, cell references, function names, TRUE/FALSE
    if (isIdentStart(c)) {
      while (i < src.length && isIdentPart(src[i])) i++;
      const text = src.slice(start, i);
      tokens.push({ type: 'ident', text, value: text.toUpperCase(), pos: start });
      continue;
    }

    const two = src.slice(i, i + 2);
    if (TWO_CHAR_OPS.has(two)) {
      tokens.push({ type: 'op', text: two, value: two, pos: start });
      i += 2;
      continue;
    }
    if (ONE_CHAR_OPS.has(c)) {
      tokens.push({ type: 'op', text: c, value: c, pos: start });
      i++;
      continue;
    }
    throw new FormulaSyntaxError(`Unexpected character "${c}"`, start);
  }
  tokens.push({ type: 'eof', text: '', value: '', pos: src.length });
  return tokens;
}
