import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app';
import type { AddressInfo } from 'node:net';

test('HTTP edits persist through server restart with values and errors restored', async () => {
 const dir=await mkdtemp(path.join(tmpdir(),'folio-test-')), file=path.join(dir,'workbook.json');
 let server: ReturnType<Awaited<ReturnType<typeof createApp>>['listen']> | undefined;
 const start=async()=>{ const app=await createApp(file); server=app.listen(0); await new Promise<void>(resolve=>server!.once('listening',resolve)); return `http://127.0.0.1:${(server.address() as AddressInfo).port}`; };
 const stop=()=>new Promise<void>((resolve,reject)=>server!.close(err=>err?reject(err):resolve()));
 try {
  let base=await start();
  const put=await fetch(base+'/api/workbook',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({cells:{J1:'4',J2:'=J1+1',J3:'=J2*2',J4:'=J3+1',K1:'=K2',K2:'=K1',L1:'=8%',L2:'=ROUND(255*L1,2)',L3:'=IF(L2>20,"yes","no")',L4:'=L3="yes"',L5:'=FOO(1)'}})});
  assert.equal(put.status,200);
  const saved=await put.json();
  assert.equal(saved.values.J4,11); assert.equal(saved.values.L2,20.4); assert.equal(saved.values.L3,'yes'); assert.equal(saved.values.L4,true); assert.deepEqual(saved.values.L5,{error:'#NAME?'});
  const bad=await fetch(base+'/api/workbook',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({cells:{Z99:'3'}})}); assert.equal(bad.status,400);
  await stop(); base=await start(); const data=await (await fetch(base+'/api/workbook')).json();
  assert.equal(data.cells.J3,'=J2*2'); assert.equal(data.values.J4,11); assert.deepEqual(data.values.K1,{error:'#CYCLE!'});
  assert.equal(data.cells.L3,'=IF(L2>20,"yes","no")');
  for (const id of ['L1','L2','L3','L4','L5']) assert.deepEqual(data.values[id],saved.values[id]);
 } finally { if(server?.listening)await stop(); await rm(dir,{recursive:true,force:true}); }
});
