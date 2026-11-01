import assert from 'node:assert';
import { periods, stats } from '../src/core/engine.js';
import { today, add, wkS } from '../src/core/dates.js';
const w = add(wkS(today()), -7), s = add(w, -7);
const h = { id: 't', name: 'x', start: s, end: null, pauses: [], log: { [w]: 1, [add(w, 2)]: 1, [add(w, 4)]: 1 }, versions: [{ from: s, cfg: { type: 'weekly', target: 3 } }] };
const ps = periods(h);
assert.equal(ps[0].status, 'missed');   // week with 0/3 has ended
assert.equal(ps[1].status, 'done');     // 3/3 = 100%, other 4 days not missed
assert.equal(ps[2].status === 'progress' || ps[2].status === 'done', true); // current week never "missed"
assert.equal(stats(h, ps).best, 1);
// target change must not rewrite history
h.versions.push({ from: wkS(today()), cfg: { type: 'weekly', target: 5 } });
assert.equal(periods(h)[1].status, 'done');
console.log('engine tests passed');
