// /js/pages/_helpers.js — Shared utilities
export function fmt(n){
  if(n>=1000000) return (n/1000000).toFixed(1)+'M';
  if(n>=1000)    return (n/1000).toFixed(0)+'K';
  return Math.round(n||0).toLocaleString();
}
export function timeAgo(iso){
  const d=(Date.now()-new Date(iso))/1000;
  if(d<60)   return 'just now';
  if(d<3600) return Math.floor(d/60)+'m ago';
  if(d<86400)return Math.floor(d/3600)+'h ago';
  return Math.floor(d/86400)+'d ago';
}
export function stageBadge(s){
  const m={lead:'badge-slate',prospect:'badge-indigo',customer:'badge-success',retention:'badge-cyan',churn:'badge-danger','closed-won':'badge-success','closed-lost':'badge-danger',qualified:'badge-indigo',proposal:'badge-cyan',negotiation:'badge-warning'};
  return m[s]||'badge-slate';
}
