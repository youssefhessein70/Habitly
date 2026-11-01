
/* ================= ENGINE (portable: dates are 'YYYY-MM-DD' strings) ================= */
export const pad=n=>String(n).padStart(2,'0');
export const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
export const pd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c,12)};
export const add=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d)};
export const diff=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
export const today=()=>ds(new Date());
export const wkS=s=>add(s,-((pd(s).getDay()+6)%7));
export const moS=s=>s.slice(0,8)+'01';
export const moE=s=>{const d=pd(moS(s));d.setMonth(d.getMonth()+1);d.setDate(0);return ds(d)};
