import { type Address, parseAddress } from './types';
import { FormulaSyntaxError, tokenize, type Token } from './tokenizer';

export type BinaryOp = '+' | '-' | '*' | '/' | '^' | '&' | '=' | '<>' | '<' | '>' | '<=' | '>=';

export type AstNode =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'ref'; addr: Address; text: string }
  | { type: 'range'; start: Address; end: Address; text: string }
  | { type: 'call'; name: string; args: AstNode[] }
  | { type: 'binary'; op: BinaryOp; left: AstNode; right: AstNode }
  | { type: 'unary'; op: '-' | '+'; operand: AstNode }
  | { type: 'percent'; operand: AstNode };

/**
 * Recursive-descent parser for formulas. Grammar (lowest precedence first):
 *
 *   comparison := concat (('=' | '<>' | '<' | '>' | '<=' | '>=') concat)*
 *   concat     := additive ('&' additive)*
 *   additive   := term (('+' | '-') term)*
 *   term       := power (('*' | '/') power)*
 *   power      := signed ('^' power)?            (right associative)
 *   signed     := ('-' | '+') signed | postfix   (unary minus binds tighter than ^, like Excel)
 *   postfix    := primary ('%')*
 *   primary    := number | string | TRUE | FALSE | ref (':' ref)? | ident '(' args ')' | '(' comparison ')'
 */
export function parseFormula(src: string): AstNode {
  const tokens = tokenize(src);
  let idx = 0;
  const peek = (): Token => tokens[idx];
  const next = (): Token => tokens[idx++];
  const isOp = (v: string) => peek().type === 'op' && peek().value === v;
  const expect = (v: string): Token => {
    if (!isOp(v)) throw new FormulaSyntaxError(`Expected "${v}"`, peek().pos);
    return next();
  };

  function comparison(): AstNode {
    let left = concat();
    while (peek().type === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(peek().value)) {
      const op = next().value as BinaryOp;
      left = { type: 'binary', op, left, right: concat() };
    }
    return left;
  }
  function concat(): AstNode {
    let left = additive();
    while (isOp('&')) {
      next();
      left = { type: 'binary', op: '&', left, right: additive() };
    }
    return left;
  }
  function additive(): AstNode {
    let left = term();
    while (isOp('+') || isOp('-')) {
      const op = next().value as BinaryOp;
      left = { type: 'binary', op, left, right: term() };
    }
    return left;
  }
  function term(): AstNode {
    let left = power();
    while (isOp('*') || isOp('/')) {
      const op = next().value as BinaryOp;
      left = { type: 'binary', op, left, right: power() };
    }
    return left;
  }
  function power(): AstNode {
    const base = signed();
    if (isOp('^')) {
      next();
      return { type: 'binary', op: '^', left: base, right: power() };
    }
    return base;
  }
  function signed(): AstNode {
    if (isOp('-') || isOp('+')) {
      const op = next().value as '-' | '+';
      return { type: 'unary', op, operand: signed() };
    }
    return postfix();
  }
  function postfix(): AstNode {
    let node = primary();
    while (isOp('%')) {
      next();
      node = { type: 'percent', operand: node };
    }
    return node;
  }
  function primary(): AstNode {
    const tok = peek();
    if (tok.type === 'number') {
      next();
      return { type: 'number', value: Number(tok.value) };
    }
    if (tok.type === 'string') {
      next();
      return { type: 'string', value: tok.value };
    }
    if (tok.type === 'ident') {
      next();
      if (tok.value === 'TRUE') return { type: 'boolean', value: true };
      if (tok.value === 'FALSE') return { type: 'boolean', value: false };
      if (isOp('(')) {
        next();
        const args: AstNode[] = [];
        if (!isOp(')')) {
          args.push(comparison());
          while (isOp(',')) {
            next();
            args.push(comparison());
          }
        }
        expect(')');
        return { type: 'call', name: tok.value, args };
      }
      const addr = parseAddress(tok.text);
      if (!addr) throw new FormulaSyntaxError(`Unknown name "${tok.text}"`, tok.pos);
      if (isOp(':')) {
        next();
        const endTok = next();
        const end = endTok.type === 'ident' ? parseAddress(endTok.text) : null;
        if (!end) throw new FormulaSyntaxError('Expected cell reference after ":"', endTok.pos);
        return {
          type: 'range',
          start: { col: Math.min(addr.col, end.col), row: Math.min(addr.row, end.row) },
          end: { col: Math.max(addr.col, end.col), row: Math.max(addr.row, end.row) },
          text: `${tok.text}:${endTok.text}`.toUpperCase().replace(/\$/g, ''),
        };
      }
      return { type: 'ref', addr, text: tok.text.toUpperCase().replace(/\$/g, '') };
    }
    if (tok.type === 'op' && tok.value === '(') {
      next();
      const inner = comparison();
      expect(')');
      return inner;
    }
    if (tok.type === 'eof') throw new FormulaSyntaxError('Unexpected end of formula', tok.pos);
    throw new FormulaSyntaxError(`Unexpected token "${tok.text}"`, tok.pos);
  }

  const ast = comparison();
  if (peek().type !== 'eof') throw new FormulaSyntaxError(`Unexpected token "${peek().text}"`, peek().pos);
  return ast;
}

/** Walk the AST and report every reference / range in it. */
export function collectReferences(node: AstNode, out: { refs: Address[]; ranges: { start: Address; end: Address }[] }): void {
  switch (node.type) {
    case 'ref':
      out.refs.push(node.addr);
      break;
    case 'range':
      out.ranges.push({ start: node.start, end: node.end });
      break;
    case 'call':
      node.args.forEach((a) => collectReferences(a, out));
      break;
    case 'binary':
      collectReferences(node.left, out);
      collectReferences(node.right, out);
      break;
    case 'unary':
    case 'percent':
      collectReferences(node.operand, out);
      break;
    default:
      break;
  }
}
