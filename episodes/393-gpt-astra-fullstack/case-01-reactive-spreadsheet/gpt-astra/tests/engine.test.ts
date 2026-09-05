import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Spreadsheet, History, displayValue } from '../shared/engine';

test('precedence, unary operators, nested functions, rectangles and reversed ranges', () => {
 const s = new Spreadsheet({ A1:'2', A2:'4', B1:'8', B2:'text', C1:'=2+3*4', C2:'=-(2+3)*4', C3:'=SUM(B2:A1)+AVG(A1:A2)*2', C4:'=sum(A1:A2,AVG(A1:A2)*2)', C5:'=.5+1e2' });
 assert.equal(s.value('C1'),14); assert.equal(s.value('C2'),-20); assert.equal(s.value('C3'),20); assert.equal(s.value('C4'),12); assert.equal(s.value('C5'),100.5);
});
test('forward references, diamond dependency and only affected cells in correct order', () => {
 const s = new Spreadsheet({ D1:'=B1+C1', C1:'=B1*2', B1:'=A1+1', A1:'2', L40:'=10*10' });
 assert.equal(s.value('D1'),9); const order=s.apply({A1:'4'});
 assert.equal(s.value('D1'),15); assert.deepEqual(new Set(order),new Set(['A1','B1','C1','D1']));
 assert.ok(order.indexOf('B1')<order.indexOf('C1')); assert.ok(order.indexOf('C1')<order.indexOf('D1'));
 assert.equal(s.value('L40'),100);
});
test('all indirect cycle participants, dependent propagation and recovery', () => {
 const s = new Spreadsheet({A1:'1',B1:'=A1+1',C1:'=B1+1',D1:'=C1+1',E1:'=D1*2'});
 s.apply({A1:'=C1'});
 for (const id of ['A1','B1','C1','D1','E1']) assert.equal(displayValue(s.value(id)),'#CYCLE!');
 s.apply({B1:'4'}); assert.equal(s.value('A1'),5); assert.equal(s.value('E1'),12);
 s.apply({B1:'=B1'}); assert.equal(displayValue(s.value('B1')),'#CYCLE!');
});
test('cycles through rectangular ranges and disjoint cycles', () => {
 const s = new Spreadsheet({A1:'=SUM(B1:C2)', B1:'=A1', C2:'3', G1:'=H1', H1:'=G1'});
 for (const id of ['A1','B1','G1','H1']) assert.equal(displayValue(s.value(id)),'#CYCLE!');
 s.apply({B1:'2'}); assert.equal(s.value('A1'),5); assert.equal(displayValue(s.value('G1')),'#CYCLE!');
});
test('errors propagate; malformed expressions and references are safe', () => {
 const cases = {'=1/0':'#DIV/0!', '=Z1':'#REF!', '=A0':'#REF!', '=SUM(A1:Z5)':'#REF!', '=1+':'#VALUE!', '=FOO(A1)':'#NAME?', '=A2*2':'#VALUE!', '=AVG(B10:B12)':'#DIV/0!', '=A1:A3':'#VALUE!'};
 for(const [formula,expected] of Object.entries(cases)) {
  const s=new Spreadsheet({A1:'3',A2:'hello',C1:formula,D1:'=C1+1'});
  assert.equal(displayValue(s.value('C1')),expected,formula); assert.equal(displayValue(s.value('D1')),expected,formula);
 }
});
test('empty forward reference gains a value, removing obsolete edges', () => {
 const s=new Spreadsheet({C1:'=A1+2'}); assert.equal(s.value('C1'),2);
 s.apply({A1:'7'}); assert.equal(s.value('C1'),9); s.apply({C1:'=B1'});
 assert.deepEqual(s.apply({A1:'8'}),['A1']); s.apply({B1:'hello'}); assert.equal(s.value('C1'),'hello');
});
test('100-step undo/redo, atomic paste and cycle restoration', () => {
 const s = new Spreadsheet({A1:'1', B1:'=A1+1'}), h=new History(s);
 for(let i=2;i<=31;i++)h.edit({A1:String(i)});
 for(let i=0;i<30;i++)assert.equal(h.undo(),true);
 assert.equal(s.value('B1'),2); for(let i=0;i<30;i++)h.redo(); assert.equal(s.value('B1'),32);
 h.edit({A1:'=B1',C1:'hello'}); assert.equal(displayValue(s.value('B1')),'#CYCLE!');
 h.undo(); assert.equal(s.value('B1'),32); assert.equal(s.value('C1'),null); h.redo(); assert.equal(displayValue(s.value('A1')),'#CYCLE!');
 h.undo(); h.edit({A1:'5'}); assert.equal(h.canRedo,false);
});
test('raw serialization rebuilds identical computed values', () => {
 const s = new Spreadsheet({A1:'5',B1:'=A1+2',C1:'=B1*2',D1:'=C1/0',E1:'=F1',F1:'=E1'});
 const restored=new Spreadsheet(JSON.parse(JSON.stringify(s.raw)));
 assert.deepEqual(Object.fromEntries(restored.values),Object.fromEntries(s.values));
});
