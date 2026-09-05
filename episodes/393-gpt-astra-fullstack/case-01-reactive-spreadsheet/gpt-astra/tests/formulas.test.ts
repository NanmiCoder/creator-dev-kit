import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Spreadsheet, History, displayValue, type Value, type ErrorCode } from '../shared/engine';

function expectFormula(formula: string, expected: Value) {
  assert.deepEqual(new Spreadsheet({ A1: formula }).value('A1'), expected, formula);
}

test('Fable invoice uses the original percent, ROUND and IF formulas and recalculates downstream', () => {
  const sheet = new Spreadsheet({
    B2: '4', C2: '25', D2: '=B2*C2', B3: '2', C3: '60', D3: '=B3*C3',
    B4: '10', C4: '3.5', D4: '=B4*C4', D6: '=SUM(D2:D4)',
    B7: '=8%', D7: '=ROUND(D6*B7, 2)', D8: '=D6+D7',
    D9: '=AVG(D2:D4)', D10: '=IF(D8>200,"yes","no")', L40: '=1+2',
  });
  assert.equal(sheet.value('B7'), 0.08);
  assert.equal(sheet.value('D7'), 20.4);
  assert.equal(sheet.value('D8'), 275.4);
  assert.equal(sheet.value('D10'), 'yes');
  const order = sheet.apply({ B2: '0' });
  assert.equal(sheet.value('D7'), 12.4);
  assert.equal(sheet.value('D8'), 167.4);
  assert.equal(sheet.value('D10'), 'no');
  assert.deepEqual(new Set(order), new Set(['B2', 'D2', 'D6', 'D7', 'D8', 'D9', 'D10']));
  assert.ok(order.indexOf('D8') < order.indexOf('D10'));
  assert.equal(sheet.value('L40'), 3);
});

test('postfix percentages compose with negation, parentheses, references, functions and arithmetic', () => {
  for (const [formula, expected] of [
    ['=8%', 0.08], ['=-8%', -0.08], ['=200*8%+2', 18],
    ['=(10+10)%', 0.2], ['=50%%', 0.005], ['=SUM(10,10)%', 0.2],
    ['=1/0%', { error: '#DIV/0!' }], ['=%8', { error: '#VALUE!' }],
    ['="hello"%', { error: '#VALUE!' }],
  ] as [string, Value][]) expectFormula(formula, expected);
  const s = new Spreadsheet({ A1: '8', B1: '=A1%', C1: '=200*B1' });
  s.apply({ A1: '10' });
  assert.equal(s.value('C1'), 20);
});

test('ROUND handles decimal ties away from zero, negative digits and large/small magnitudes', () => {
  for (const [formula, expected] of [
    ['=ROUND(20.400000000000002,2)', 20.4], ['=ROUND(1.005,2)', 1.01],
    ['=ROUND(-1.005,2)', -1.01], ['=ROUND(2.675,2)', 2.68],
    ['=ROUND(-2.675,2)', -2.68], ['=ROUND(2.5,0)', 3], ['=ROUND(-2.5,0)', -3],
    ['=ROUND(125,-1)', 130], ['=ROUND(-125,-1)', -130], ['=ROUND(1234,-2)', 1200],
    ['=ROUND(1.234,2.9)', 1.23], ['=ROUND(1e300,1000)', 1e300],
    ['=ROUND(1e300,-1000)', 0], ['=ROUND(5e-324,323)', 1e-323],
    ['=ROUND(1.7e308,-308)', { error: '#NUM!' }],
  ] as [string, Value][]) expectFormula(formula, expected);
});

test('ROUND accepts expression arguments and propagates errors with strict arity', () => {
  const s = new Spreadsheet({ A1: '255', A2: '=8%', B1: '=ROUND(SUM(A1:A1)*A2,1+1)' });
  assert.equal(s.value('B1'), 20.4);
  for (const [formula, code] of [
    ['=ROUND(1)', '#VALUE!'], ['=ROUND(1,2,3)', '#VALUE!'], ['=ROUND("text",2)', '#VALUE!'],
    ['=ROUND(1/0,2)', '#DIV/0!'], ['=ROUND(1,Z1)', '#REF!'],
    ['=ROUND(1,FOO(1))', '#NAME?'], ['=ROUND(1e999,2)', '#NUM!'],
  ] as [string, ErrorCode][]) expectFormula(formula, { error: code });
});

test('six comparisons have lower precedence than arithmetic and return logical values', () => {
  for (const [formula, expected] of [
    ['=1+2*3=7', true], ['=2<>3', true], ['=2<3', true], ['=2>3', false],
    ['=2<=2', true], ['=2>=3', false], ['=(1+2)>2', true], ['=8%<0.1', true],
    ['="Yes"="yes"', true], ['="2"=2', false], ['=TRUE=FALSE', false],
    ['=TRUE+FALSE', 1], ['=B1=0', true], ['=B1=""', true], ['=1/0>0', { error: '#DIV/0!' }],
  ] as [string, Value][]) expectFormula(formula, expected);
  assert.equal(displayValue(true), 'TRUE');
  assert.equal(displayValue(false), 'FALSE');
});

test('strings preserve case, Unicode, punctuation and doubled quotes without phantom references', () => {
  expectFormula('="Hello, 世界: (A1) 8%"', 'Hello, 世界: (A1) 8%');
  expectFormula('="He said ""Yes"""', 'He said "Yes"');
  expectFormula('=""', '');
  expectFormula('="unclosed', { error: '#VALUE!' });
  const s = new Spreadsheet({ A1: '=IF(TRUE,"B1",C1)', C1: '3' });
  assert.deepEqual(s.dependencies.get('A1'), new Set(['C1']));
  assert.equal(s.value('A1'), 'B1');
});

test('IF supports nested conditions and evaluates only the selected branch', () => {
  for (const [formula, expected] of [
    ['=IF(TRUE,"yes",1/0)', 'yes'], ['=IF(FALSE,Z1,"no")', 'no'],
    ['=IF(1,ROUND(2.675,2),FOO(1))', 2.68], ['=IF(0,1)', false],
    ['=IF(-1,IF(2>=2,"通过","未通过"),"未通过")', '通过'],
    ['=IF("false",1,2)', 2], ['=IF(B1,1,2)', 2],
    ['=IF("hello",1,2)', { error: '#VALUE!' }], ['=IF(TRUE)', { error: '#VALUE!' }],
    ['=IF(TRUE,1,2,3)', { error: '#VALUE!' }], ['=IF(1/0,1,2)', { error: '#DIV/0!' }],
    ['=IF(TRUE,Z1,2)', { error: '#REF!' }], ['=IF(TRUE,FOO(1),2)', { error: '#NAME?' }],
  ] as [string, Value][]) expectFormula(formula, expected);
});

test('both IF branches are tracked; switching a branch uses current values and supports forward references', () => {
  const s = new Spreadsheet({ D1: '=IF(A1>0,B1,C1)', E1: '=D1*2', A1: '1', B1: '10', C1: '20', L40: '5' });
  assert.equal(s.value('E1'), 20);
  assert.deepEqual(s.dependencies.get('D1'), new Set(['A1', 'B1', 'C1']));
  assert.deepEqual(new Set(s.apply({ C1: '30' })), new Set(['C1', 'D1', 'E1']));
  assert.equal(s.value('E1'), 20);
  s.apply({ A1: '0' }); assert.equal(s.value('E1'), 60);
  s.apply({ C1: '=1/0' }); assert.deepEqual(s.value('E1'), { error: '#DIV/0!' });
  s.apply({ A1: '1' }); assert.equal(s.value('E1'), 20);
});

test('IF references participate in cycle detection and recover through undo/redo', () => {
  const s = new Spreadsheet({ A1: '1', B1: '=IF(A1>0,C1,0)', C1: '5', D1: '=ROUND(B1*8%,2)' });
  const h = new History(s);
  h.edit({ C1: '=B1' });
  for (const id of ['B1', 'C1', 'D1']) assert.deepEqual(s.value(id), { error: '#CYCLE!' });
  h.undo(); assert.equal(s.value('D1'), 0.4);
  h.redo(); assert.deepEqual(s.value('D1'), { error: '#CYCLE!' });
  // The graph deliberately tracks every written reference, including an unused IF branch.
  expectFormula('=IF(FALSE,A1,1)', { error: '#CYCLE!' });
});

test('unknown functions and names return NAME errors while invalid syntax stays VALUE', () => {
  expectFormula('=FOO(1)', { error: '#NAME?' });
  expectFormula('=missing_name', { error: '#NAME?' });
  expectFormula('=FOO(', { error: '#VALUE!' });
  const s = new Spreadsheet({ A1: '=FOO(1)', B1: '=A1+1', C1: '=A1>0' });
  assert.deepEqual(s.value('B1'), { error: '#NAME?' });
  assert.deepEqual(s.value('C1'), { error: '#NAME?' });
  s.apply({ A1: '=ROUND(1.25,1)' });
  assert.equal(s.value('B1'), 2.3);
  assert.equal(s.value('C1'), true);
});
