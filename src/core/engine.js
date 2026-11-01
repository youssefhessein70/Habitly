import {add,pd,diff,today,wkS,moS,moE} from './dates.js';
export const MAXD='9999-12-31';
export const isPaused=(h,d)=>h.pauses.some(p=>d>=p.from&&(!p.to||d<=p.to));

/* Builds every period (day / week / month / custom block) of every config version,
   each judged against the config that was active when it began. */
export function periods(h){
  const T=today(),out=[],V=h.versions,he=h.end||MAXD;
  V.forEach((v,i)=>{
    const f=v.cfg,a=v.from>h.start?v.from:h.start,nx=V[i+1];
    const segTo=nx?add(nx.from,-1):MAXD,lim=segTo<he?segTo:he,b=lim<T?lim:T;
    if(a>b)return;
    const mk=(s,e,len)=>{
      if(nx&&lim===segTo&&e>lim)return;           // period cut short by a type change: not judged
      const w0=s>a?s:a,w1=e<lim?e:lim;let act=0,cnt=0;
      for(let d=w0;d<=w1;d=add(d,1)){if(isPaused(h,d))continue;act++;if(h.log[d]>0)cnt++}
      if(!act)return;                              // fully paused / outside range
      const single=f.type==='daily'||f.type==='days';
      const target=single?1:Math.max(1,Math.min(f.target,Math.ceil(f.target*act/len)));
      const status=cnt>=target?'done':(e<T?'missed':'progress');
      out.push({s,e,target,count:cnt,status,type:f.type});
    };
    if(f.type==='daily'||f.type==='days'){
      for(let d=a;d<=b;d=add(d,1))if(f.type==='daily'||f.days.includes(pd(d).getDay()))mk(d,d,1);
    }else if(f.type==='weekly'){for(let s=wkS(a);s<=b;s=add(s,7))mk(s,add(s,6),7)}
    else if(f.type==='monthly'){for(let s=moS(a);s<=b;s=add(moE(s),1))mk(s,moE(s),diff(s,moE(s))+1)}
    else{for(let s=a;s<=b;s=add(s,f.every))mk(s,add(s,f.every-1),f.every)}
  });
  return out;
}
export function stats(h,ps){
  const T=today();let run=0,best=0;
  ps.forEach(p=>{if(p.status==='done'){run++;best=Math.max(best,run)}else if(p.status==='missed')run=0});
  const done=ps.filter(p=>p.status==='done').length,missed=ps.filter(p=>p.status==='missed').length;
  let dayStreak=0,d=h.log[T]>0?T:add(T,-1);   // separate from period streak
  while(d>=h.start){if(h.log[d]>0)dayStreak++;else if(!isPaused(h,d))break;d=add(d,-1)}
  const last=ps[ps.length-1];
  return{streak:run,best,done,missed,rate:done+missed?Math.round(100*done/(done+missed)):null,dayStreak,cur:last&&last.e>=T?last:null};
}
/* Target/schedule edits are versioned: history keeps its old rules. */
export function changeCfg(h,cfg){
  const last=h.versions[h.versions.length-1];
  if(JSON.stringify(last.cfg)===JSON.stringify(cfg))return;
  const T=today();
  let from=cfg.type===last.cfg.type?(cfg.type==='weekly'?wkS(T):cfg.type==='monthly'?moS(T):T):T;
  if(from<=last.from)last.cfg=cfg;else h.versions.push({from,cfg});
}
