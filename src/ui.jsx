import {useState,useEffect} from 'react'
import {NavLink,Outlet,useNavigate} from 'react-router-dom'
import {LayoutDashboard,GraduationCap,Brain,FolderGit2,MessagesSquare,Compass,Sparkles,TrendingUp,Search,Bell,Menu,RotateCcw,Target,CheckCircle2,AlertCircle,UserPen} from 'lucide-react'
import {useS} from './store'
export const NAV=[['/','Overview',LayoutDashboard],['/academics','Academic Performance',GraduationCap],['/skills','Skill Intelligence',Brain],['/projects','Projects & Evidence',FolderGit2],['/interview','Interview Studio',MessagesSquare],['/career','Career Planner',Compass],['/plan','AI Action Plan',Sparkles],['/progress','Progress Tracking',TrendingUp]]
export const Card=({className='',children})=><div className={'card '+className}>{children}</div>
export const Head=({t,s,children})=><div className="flex flex-wrap items-end justify-between gap-3 mb-6"><div><h1 className="text-xl font-semibold">{t}</h1>{s&&<p className="text-sm text-sub mt-1">{s}</p>}</div><div className="flex gap-2">{children}</div></div>
export const col=v=>v>=70?'bg-ok':v>=50?'bg-warn':'bg-bad'
export const Prog=({v,c})=><div className="h-2 rounded-full bg-slate-100" role="progressbar" aria-valuenow={v}><div className={'h-2 rounded-full '+(c||col(v))} style={{width:Math.min(100,v)+'%'}}/></div>
export const Empty=({t,s})=><div className="text-center py-10"><div className="mx-auto w-10 h-10 rounded-full bg-soft text-brand grid place-items-center mb-3"><Sparkles size={18}/></div><p className="font-medium text-sm">{t}</p><p className="text-sm text-sub mt-1">{s}</p></div>
export const Skel=()=><div className="animate-pulse space-y-4"><div className="h-8 w-56 bg-slate-200 rounded"/><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-28 bg-slate-200 rounded-xl"/>)}</div><div className="grid lg:grid-cols-2 gap-4"><div className="h-72 bg-slate-200 rounded-xl"/><div className="h-72 bg-slate-200 rounded-xl"/></div></div>
export const useLoad=(ms=500)=>{const[l,s]=useState(true);useEffect(()=>{const t=setTimeout(()=>s(false),ms);return()=>clearTimeout(t)},[ms]);return l}
export function Layout(){
const{d,toast,reset}=useS();const nav=useNavigate();const[open,setOpen]=useState(false);const[q,setQ]=useState('');const[bell,setBell]=useState(false)
const res=q.trim()?[...NAV.filter(n=>n[1].toLowerCase().includes(q.toLowerCase())).map(n=>[n[1],n[0]]),...d.projects.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())).map(p=>[p.title+' (project)','/projects'])]:[]
const go=p=>{nav(p);setQ('');setOpen(false)}
return <div className="min-h-screen">
<aside className={'fixed inset-y-0 left-0 z-40 w-64 bg-navy text-slate-300 flex flex-col transition-transform '+(open?'':'-translate-x-full lg:translate-x-0')}>
<div className="px-5 py-5 flex items-center gap-2 text-white font-semibold"><div className="w-8 h-8 rounded-lg bg-brand grid place-items-center"><TrendingUp size={16}/></div>StudentPulse AI</div>
<nav className="px-3 flex-1 space-y-1">{NAV.map(([to,l,I])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>'flex items-center gap-3 rounded-lg px-3 py-2 text-sm '+(isActive?'bg-brand/20 text-white':'hover:bg-white/5')}><I size={17}/>{l}</NavLink>)}</nav>
<div className="p-3 space-y-1"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={()=>go('/onboarding')}><UserPen size={17}/>Edit profile</button>
<button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/5" onClick={()=>{if(confirm('Reset all data to the sample student?')){reset();nav('/')}}}><RotateCcw size={17}/>Reset demo data</button></div></aside>
{open&&<div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={()=>setOpen(false)}/>}
<div className="lg:pl-64"><header className="sticky top-0 z-20 bg-white/95 border-b border-line px-4 lg:px-8 h-16 flex items-center gap-3">
<button className="lg:hidden btn px-2" aria-label="Menu" onClick={()=>setOpen(true)}><Menu size={18}/></button>
<div className="relative flex-1 max-w-sm"><Search size={16} className="absolute left-3 top-2.5 text-sub"/><input className="inp pl-9" placeholder="Search pages and projects" value={q} onChange={e=>setQ(e.target.value)}/>
{q&&<div className="absolute mt-1 w-full bg-white border border-line rounded-lg shadow-lg p-1">{res.length?res.map(([l,p],i)=><button key={i} onClick={()=>go(p)} className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-soft">{l}</button>):<p className="text-sm text-sub px-3 py-2">No matches</p>}</div>}</div>
<span className="chip hidden md:inline-flex gap-1"><Target size={12}/>{d.profile.goal}</span>
<div className="relative"><button className="btn px-2" aria-label="Notifications" onClick={()=>setBell(!bell)}><Bell size={18}/></button>
{bell&&<div className="absolute right-0 mt-2 w-72 card p-2 shadow-lg">{d.activity.slice(0,5).map((a,i)=><p key={i} className="text-sm px-3 py-2 border-b last:border-0 border-line">{a}</p>)}</div>}</div>
<div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full bg-brand text-white grid place-items-center text-sm font-semibold">{d.profile.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><span className="text-sm font-medium hidden sm:block">{d.profile.name}</span></div></header>
<main className="p-4 lg:p-8 max-w-7xl"><Outlet/></main></div>
{toast&&<div role="status" className={'fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg '+(toast.type==='ok'?'bg-ok':'bg-bad')}>{toast.type==='ok'?<CheckCircle2 size={16}/>:<AlertCircle size={16}/>}{toast.msg}</div>}</div>}
