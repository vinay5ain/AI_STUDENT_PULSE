import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ResponsiveContainer,RadarChart,PolarGrid,PolarAngleAxis,Radar,BarChart,Bar as RB,XAxis,YAxis,Tooltip,Legend,LineChart,Line,CartesianGrid} from 'recharts'
import {Loader2,Trash2,Plus,Lightbulb,Send} from 'lucide-react'
import {useS,SKILLS,CAT,ROLES,genPlan,calc} from './store'
import {Card,Head,Prog,Empty,Skel,useLoad,col} from './ui'
const IND='#4F46E5',BLU='#2563EB',GR='#98A2B3'
const Stat=({l,v,s})=><Card><p className="text-sm text-sub">{l}</p><p className="text-2xl font-semibold mt-1">{v}{typeof v==='number'&&'%'}</p><div className="mt-3"><Prog v={typeof v==='number'?v:0}/></div>{s&&<p className="text-xs text-sub mt-2">{s}</p>}</Card>
const Chart=({h=280,children})=><div style={{height:h}}><ResponsiveContainer>{children}</ResponsiveContainer></div>

export function Overview(){const{d,m}=useS();const ld=useLoad();if(ld)return <Skel/>
const sorted=[...SKILLS].sort((a,b)=>d.skills[b]-d.skills[a]),req=ROLES[d.profile.goal].req
const gaps=SKILLS.map(s=>({s,g:req[s]-d.skills[s]})).sort((a,b)=>b.g-a.g)
const radar=[['Academics',m.ac],['Technical Skills',m.tech],['Projects',m.pr],['Interview Skills',m.iv],['Career Alignment',m.al]].map(([k,v])=>({k,v}))
return <div><Head t={`Welcome back, ${d.profile.name.split(' ')[0]}`} s={`${d.profile.degree}, semester ${d.profile.semester} · Target role: ${d.profile.goal}`}/>
<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
<Card className="col-span-2 lg:col-span-1 bg-navy !border-navy text-white"><p className="text-sm text-slate-300">Career readiness</p><p className="text-4xl font-semibold mt-1">{m.overall}%</p><p className="text-xs text-slate-400 mt-2">Average of five dimensions</p></Card>
<Stat l="Academics" v={m.ac}/><Stat l="Technical skills" v={m.tech}/><Stat l="Project readiness" v={m.pr}/><Stat l="Interview readiness" v={m.iv}/></div>
<div className="grid lg:grid-cols-2 gap-4 mt-4">
<Card><h3 className="font-semibold mb-2">Readiness profile</h3><Chart><RadarChart data={radar}><PolarGrid/><PolarAngleAxis dataKey="k" tick={{fontSize:12}}/><Radar dataKey="v" stroke={IND} fill={IND} fillOpacity={.2}/><Tooltip/></RadarChart></Chart></Card>
<div className="space-y-4"><Card className="bg-soft !border-indigo-100"><div className="flex gap-3"><Lightbulb className="text-brand shrink-0" size={20}/><div><h3 className="font-semibold">AI insight <span className="chip ml-1">Simulated</span></h3>
<p className="text-sm mt-1">Your largest gap for {d.profile.goal} is <b>{gaps[0].s}</b> ({d.skills[gaps[0].s]}% vs {req[gaps[0].s]}% expected). Closing it would lift your alignment score the most. Your {sorted[0]} and academic base are strong enough to support a focused 4-week plan.</p></div></div></Card>
<div className="grid sm:grid-cols-2 gap-4"><Card><h3 className="font-semibold mb-2">Strengths</h3>{sorted.slice(0,3).map(s=><p key={s} className="text-sm flex justify-between py-1"><span>{s}</span><span className="text-ok font-medium">{d.skills[s]}%</span></p>)}</Card>
<Card><h3 className="font-semibold mb-2">Improvement areas</h3>{gaps.slice(0,3).map(({s})=><p key={s} className="text-sm flex justify-between py-1"><span>{s}</span><span className="text-bad font-medium">{d.skills[s]}%</span></p>)}</Card></div>
<Card><h3 className="font-semibold mb-2">Recent activity</h3>{d.activity.slice(0,4).map((a,i)=><p key={i} className="text-sm text-sub py-1 border-b last:border-0 border-line">{a}</p>)}</Card></div></div></div>}

export function Academics(){const{d,upd,say}=useS();const[marks,setM]=useState(d.subjects.map(s=>s.m));const[a,setA]=useState({n:'',m:''})
const sub=d.subjects.map((s,i)=>({...s,m:+marks[i]||0})),avg=Math.round(sub.reduce((x,y)=>x+y.m,0)/sub.length)
const save=()=>{if(marks.some(v=>v===''||+v<0||+v>100))return say('Marks must be between 0 and 100','err')
upd(n=>{n.subjects.forEach((s,i)=>s.m=+marks[i]);n.profile.pct=avg;n.activity.unshift('Updated subject marks (average '+avg+'%)')});say('Marks saved')}
const add=e=>{e.preventDefault();if(!a.n.trim()||a.m===''||+a.m<0||+a.m>100)return say('Enter a name and a score from 0 to 100','err');upd(n=>n.assess.push({n:a.n.trim(),m:+a.m}));setA({n:'',m:''});say('Assessment added')}
const sorted=[...sub].sort((x,y)=>y.m-x.m)
return <div><Head t="Academic Performance" s="Edit marks to update your readiness score"><button className="btn btn-p" onClick={save}>Save marks</button></Head>
<div className="grid lg:grid-cols-3 gap-4"><Stat l="Average percentage" v={avg}/><Card><p className="text-sm text-sub">Strongest subject</p><p className="font-semibold mt-1">{sorted[0].n} · {sorted[0].m}%</p></Card><Card><p className="text-sm text-sub">Needs attention</p><p className="font-semibold mt-1">{sorted.at(-1).n} · {sorted.at(-1).m}%</p></Card></div>
<div className="grid lg:grid-cols-2 gap-4 mt-4"><Card><h3 className="font-semibold mb-3">Subject-wise marks</h3><Chart><BarChart data={sub} layout="vertical" margin={{left:30}}><CartesianGrid horizontal={false} stroke="#EAECF0"/><XAxis type="number" domain={[0,100]}/><YAxis type="category" dataKey="n" width={110} tick={{fontSize:12}}/><Tooltip/><RB dataKey="m" fill={IND} radius={4}/></BarChart></Chart></Card>
<Card><h3 className="font-semibold mb-3">Assessment trend</h3><Chart><LineChart data={d.assess}><CartesianGrid stroke="#EAECF0"/><XAxis dataKey="n" tick={{fontSize:12}}/><YAxis domain={[40,100]}/><Tooltip/><Line dataKey="m" stroke={BLU} strokeWidth={2}/></LineChart></Chart></Card></div>
<div className="grid lg:grid-cols-2 gap-4 mt-4"><Card><h3 className="font-semibold mb-3">Update marks</h3><div className="grid sm:grid-cols-2 gap-3">{d.subjects.map((s,i)=><div key={s.n}><label className="lbl" htmlFor={'m'+i}>{s.n}</label><input id={'m'+i} type="number" className="inp" value={marks[i]} onChange={e=>setM(marks.map((v,j)=>j===i?e.target.value:v))}/></div>)}</div></Card>
<Card><h3 className="font-semibold mb-3">Add assessment result</h3><form onSubmit={add} className="flex flex-wrap gap-2"><input className="inp flex-1" placeholder="e.g. Quiz 4" value={a.n} onChange={e=>setA({...a,n:e.target.value})} aria-label="Assessment name"/><input className="inp w-24" type="number" placeholder="Score" value={a.m} onChange={e=>setA({...a,m:e.target.value})} aria-label="Score"/><button className="btn btn-p"><Plus size={16}/>Add</button></form></Card></div></div>}

export function Skills(){const{d,upd,say}=useS();const req=ROLES[d.profile.goal].req
const ev=s=>d.projects.filter(p=>p.skills.includes(s)).length
const cmp=SKILLS.map(s=>({s,Current:d.skills[s],Required:req[s]}))
return <div><Head t="Skill Intelligence" s={`Current skills compared with ${d.profile.goal} expectations`}/>
<div className="grid lg:grid-cols-2 gap-4"><Card><h3 className="font-semibold mb-4">Proficiency</h3><div className="space-y-4">{SKILLS.map(s=><div key={s}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{s} <span className="chip ml-1">{CAT[s]}</span> <span className="text-xs text-sub ml-1">{ev(s)} project(s)</span></span><span>{d.skills[s]}%</span></div>
<input type="range" min="0" max="100" value={d.skills[s]} aria-label={s} className="w-full accent-[#4F46E5]" onChange={e=>upd(n=>{n.skills[s]=+e.target.value})} onMouseUp={()=>{upd(n=>n.activity.unshift(`Updated ${s} skill to ${n.skills[s]}%`));say(s+' updated')}}/></div>)}</div></Card>
<Card><h3 className="font-semibold mb-3">Current vs required</h3><Chart h={340}><BarChart data={cmp}><CartesianGrid vertical={false} stroke="#EAECF0"/><XAxis dataKey="s" tick={{fontSize:11}}/><YAxis domain={[0,100]}/><Tooltip/><Legend/><RB dataKey="Current" fill={IND} radius={[4,4,0,0]}/><RB dataKey="Required" fill={GR} radius={[4,4,0,0]}/></BarChart></Chart></Card></div>
<Card className="mt-4"><h3 className="font-semibold mb-3">Gap analysis</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{SKILLS.map(s=>{const g=req[s]-d.skills[s];return <div key={s} className="border border-line rounded-lg p-3"><p className="text-sm font-medium">{s}</p><p className={'text-sm '+(g>0?'text-bad':'text-ok')}>{g>0?`${g} points below target`:'Meets target'}</p></div>})}</div></Card></div>}

export function Projects(){const{d,upd,say}=useS();const blank={title:'',desc:'',tech:'',url:'',skills:[],status:'Completed'};const[f,setF]=useState(blank);const[e,setE]=useState({})
const submit=ev=>{ev.preventDefault();const x={};if(!f.title.trim())x.title='Title is required';if(f.desc.trim().length<10)x.desc='Describe the project in at least 10 characters';if(f.url&&!/^https:\/\/github\.com\/.+/.test(f.url))x.url='Use a URL like https://github.com/user/repo';if(!f.skills.length)x.skills='Select at least one skill';setE(x);if(Object.keys(x).length)return
upd(n=>{n.projects.push({...f,id:Date.now()});if(f.status==='Completed')f.skills.forEach(s=>n.skills[s]=Math.min(100,n.skills[s]+2));n.activity.unshift('Added project: '+f.title)});setF(blank);say('Project added. Evidence raised linked skills by 2 points')}
const del=id=>{upd(n=>{n.projects=n.projects.filter(p=>p.id!==id)});say('Project removed')}
const tog=s=>setF({...f,skills:f.skills.includes(s)?f.skills.filter(k=>k!==s):[...f.skills,s]})
return <div><Head t="Projects & Evidence" s="Completed projects add evidence to the skills they demonstrate"/>
<div className="grid lg:grid-cols-5 gap-4"><div className="lg:col-span-3 space-y-3">{d.projects.length?d.projects.map(p=><Card key={p.id}><div className="flex justify-between gap-2"><div><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-sub mt-1">{p.desc}</p></div><button className="btn px-2 h-9" aria-label={'Delete '+p.title} onClick={()=>del(p.id)}><Trash2 size={15}/></button></div>
<div className="flex flex-wrap gap-1 mt-3"><span className={'chip '+(p.status==='Completed'?'!bg-green-50 !text-ok':'!bg-amber-50 !text-warn')}>{p.status}</span>{p.skills.map(s=><span key={s} className="chip">{s}</span>)}</div><p className="text-xs text-sub mt-2">{p.tech}{p.url&&<> · <a className="text-brand underline" href={p.url} target="_blank" rel="noreferrer">GitHub</a></>}</p></Card>):<Card><Empty t="No projects yet" s="Add your first project to start building skill evidence."/></Card>}
<Card><h3 className="font-semibold mb-3">Evidence by skill</h3>{SKILLS.map(s=>{const c=d.projects.filter(p=>p.skills.includes(s)).length;return <div key={s} className="flex items-center gap-3 text-sm py-1"><span className="w-28">{s}</span><div className="flex-1"><Prog v={Math.min(100,c*50)} c="bg-brand"/></div><span className="w-20 text-right text-sub">{c?c+' project(s)':'No evidence'}</span></div>})}</Card></div>
<Card className="lg:col-span-2 h-fit"><h3 className="font-semibold mb-3">Add project</h3><form onSubmit={submit} className="space-y-3" noValidate>
<div><label className="lbl" htmlFor="t">Title</label><input id="t" className="inp" value={f.title} onChange={x=>setF({...f,title:x.target.value})}/>{e.title&&<p className="err">{e.title}</p>}</div>
<div><label className="lbl" htmlFor="d">Description</label><textarea id="d" rows="3" className="inp" value={f.desc} onChange={x=>setF({...f,desc:x.target.value})}/>{e.desc&&<p className="err">{e.desc}</p>}</div>
<div><label className="lbl" htmlFor="te">Technologies</label><input id="te" className="inp" placeholder="Python, Flask" value={f.tech} onChange={x=>setF({...f,tech:x.target.value})}/></div>
<div><label className="lbl" htmlFor="u">GitHub URL</label><input id="u" className="inp" value={f.url} onChange={x=>setF({...f,url:x.target.value})}/>{e.url&&<p className="err">{e.url}</p>}</div>
<div><span className="lbl">Skills demonstrated</span><div className="flex flex-wrap gap-2">{SKILLS.map(s=><button type="button" key={s} onClick={()=>tog(s)} className={'rounded-full border px-3 py-1 text-xs '+(f.skills.includes(s)?'bg-brand text-white border-brand':'border-line')}>{s}</button>)}</div>{e.skills&&<p className="err">{e.skills}</p>}</div>
<div><label className="lbl" htmlFor="s">Status</label><select id="s" className="inp" value={f.status} onChange={x=>setF({...f,status:x.target.value})}><option>Completed</option><option>In progress</option></select></div>
<button className="btn btn-p w-full">Add project</button></form></Card></div></div>}

const QS={Technical:['Explain the difference between a list and a tuple in Python.','How does a hash map work and what is its average lookup complexity?','What is an SQL index and when can it hurt performance?','How would you design a REST API for a student records service?','Explain how you would test a Python function that calls a database.'],
HR:['Tell me about yourself.','Why do you want to become a '+'developer in this field?','Where do you see yourself in three years?','What are your greatest strengths and one area to improve?','Why should we hire you over other candidates?'],
Behavioral:['Describe a time you worked in a team to meet a tight deadline.','Tell me about a technical challenge you overcame.','Describe a time you received critical feedback.','Tell me about a project that did not go as planned.','Describe a time you had to learn something quickly.']}
const KW={Technical:['python','list','dictionary','complexity','sql','index','api','test','class','function','database','algorithm','time','memory'],HR:['team','learn','goal','strength','growth','role','company','project','improve'],Behavioral:['situation','task','action','result','team','challenge','learned','deadline','outcome']}
const fb=(cat,a)=>{const w=a.trim().split(/\s+/).length,t=a.toLowerCase(),h=KW[cat].filter(k=>t.includes(k)),sc=Math.min(95,Math.round(25+Math.min(w,100)*.4+h.length*6)),good=[],bad=[]
w>=50?good.push(`Good depth (${w} words).`):bad.push('Expand the answer; aim for 50 to 100 words.')
h.length>=3?good.push('Relevant terms used: '+h.slice(0,4).join(', ')+'.'):bad.push('Use more role-specific vocabulary.')
;/\d/.test(a)?good.push('Includes concrete numbers.'):bad.push('Add a measurable result or specific example.')
if(cat==='Behavioral'&&!['situation','action','result'].every(k=>t.includes(k)))bad.push('Structure with Situation, Task, Action, Result.')
return{sc,good,bad}}
export function Interview(){const{d,upd,say}=useS();const[cat,setCat]=useState('Technical');const[i,setI]=useState(0);const[a,setA]=useState('');const[r,setR]=useState(null);const[busy,setB]=useState(false)
const pick=c=>{setCat(c);setI(0);setA('');setR(null)}
const submit=()=>{if(a.trim().split(/\s+/).length<5)return say('Write at least 5 words before submitting','err');setB(true);setTimeout(()=>{const x=fb(cat,a);setR(x);setB(false);upd(n=>{n.interviews.push({date:new Date().toLocaleDateString(),cat,score:x.sc});n.activity.unshift(`Completed ${cat} mock question (${x.sc}%)`)});say('Answer evaluated. Interview readiness updated')},900)}
return <div><Head t="Interview Studio" s="Practice one question at a time"/>
<div className="grid lg:grid-cols-3 gap-4"><Card className="lg:col-span-2"><div className="flex gap-2 mb-4">{Object.keys(QS).map(c=><button key={c} onClick={()=>pick(c)} className={'btn '+(c===cat?'btn-p':'')}>{c}</button>)}</div>
<p className="text-xs text-sub">Question {i+1} of {QS[cat].length}</p><p className="font-semibold text-lg mt-1">{QS[cat][i]}</p>
<textarea rows="6" className="inp mt-4" placeholder="Type your answer" aria-label="Your answer" value={a} onChange={e=>setA(e.target.value)} disabled={busy||!!r}/>
<div className="flex gap-2 mt-3">{!r?<button className="btn btn-p" onClick={submit} disabled={busy}>{busy?<Loader2 className="animate-spin" size={16}/>:<Send size={16}/>}{busy?'Evaluating':'Submit answer'}</button>:<button className="btn btn-p" onClick={()=>{setI((i+1)%QS[cat].length);setA('');setR(null)}}>Next question</button>}</div>
{r&&<div className="mt-5 border-t border-line pt-4"><p className="text-xs text-sub mb-2">Simulated rule-based feedback. This is not a live AI response.</p><p className="font-semibold">Score: {r.sc}%</p>
<p className="text-sm font-medium mt-3 text-ok">Strengths</p>{r.good.length?r.good.map((g,k)=><p key={k} className="text-sm">• {g}</p>):<p className="text-sm text-sub">None detected yet.</p>}
<p className="text-sm font-medium mt-3 text-warn">Improve</p>{r.bad.length?r.bad.map((g,k)=><p key={k} className="text-sm">• {g}</p>):<p className="text-sm text-sub">Nothing major.</p>}</div>}</Card>
<Card><h3 className="font-semibold mb-3">Practice history</h3>{d.interviews.length?[...d.interviews].reverse().slice(0,8).map((x,k)=><div key={k} className="flex justify-between text-sm py-2 border-b last:border-0 border-line"><span>{x.cat}<span className="text-sub text-xs block">{x.date}</span></span><span className="font-medium">{x.score}%</span></div>):<Empty t="No sessions yet" s="Answer a question to begin."/>}</Card></div></div>}

export function Career(){const{d,upd,say}=useS();const[role,setRole]=useState(d.profile.goal);const R=ROLES[role],busy=useLoad(300)
const rows=SKILLS.map(s=>({s,cur:d.skills[s],req:R.req[s],g:R.req[s]-d.skills[s]})).sort((a,b)=>b.g-a.g)
const set=()=>{upd(n=>{n.profile.goal=role;n.plan=genPlan(n.skills,role);n.activity.unshift('Career goal set to '+role)});say('Career goal updated and plan regenerated')}
return <div><Head t="Career Planner" s="Explore roles and compare them with your skills"><button className="btn btn-p" disabled={role===d.profile.goal} onClick={set}>{role===d.profile.goal?'Current goal':'Set as my goal'}</button></Head>
<div className="flex flex-wrap gap-2 mb-4">{Object.keys(ROLES).map(r=><button key={r} onClick={()=>setRole(r)} className={'btn '+(r===role?'btn-p':'')}>{r}</button>)}</div>
<div className="grid lg:grid-cols-3 gap-4"><Card className="lg:col-span-2"><h3 className="font-semibold mb-3">Required vs current</h3><div className="space-y-3">{rows.map(r=><div key={r.s}><div className="flex justify-between text-sm"><span>{r.s}</span><span className={r.g>0?'text-bad':'text-ok'}>{r.cur}% / {r.req}%</span></div><Prog v={Math.min(100,r.cur/r.req*100)}/></div>)}</div></Card>
<div className="space-y-4"><Card><h3 className="font-semibold mb-2">Missing competencies</h3>{rows.filter(r=>r.g>0).length?rows.filter(r=>r.g>0).map(r=><p key={r.s} className="text-sm py-0.5">{r.s}: <span className="text-bad">-{r.g} pts</span></p>):<p className="text-sm text-ok">You meet every benchmark.</p>}</Card>
<Card><h3 className="font-semibold mb-2">Suggested projects</h3>{R.proj.map(p=><p key={p} className="text-sm py-0.5">• {p}</p>)}</Card>
<Card><h3 className="font-semibold mb-2">Learning priorities</h3>{rows.filter(r=>r.g>0).slice(0,3).map((r,i)=><p key={r.s} className="text-sm py-0.5">{i+1}. {r.s}</p>)}</Card></div></div></div>}

export function Plan(){const{d,upd,say,log}=useS();const[busy,setB]=useState(false)
const setSt=(id,st)=>upd(n=>{const it=n.plan.find(x=>x.id===id),was=it.status;it.status=st
if(st==='done'&&was!=='done'){n.skills[it.skill]=Math.min(100,n.skills[it.skill]+4);log(n,'Completed: '+it.activity);n.history.push({label:new Date().toLocaleDateString(),score:calc(n).overall})}
if(was==='done'&&st!=='done')n.skills[it.skill]=Math.max(0,n.skills[it.skill]-4)});
const regen=()=>{setB(true);setTimeout(()=>{upd(n=>{n.plan=genPlan(n.skills,n.profile.goal);log(n,'Regenerated action plan')});setB(false);say('Plan regenerated from current skills')},1000)}
const done=d.plan.filter(p=>p.status==='done').length
return <div><Head t="AI Action Plan" s={`Simulated recommendations from your skill gaps for ${d.profile.goal} · ${done}/${d.plan.length} done`}><button className="btn" onClick={regen} disabled={busy}>{busy&&<Loader2 className="animate-spin" size={16}/>}Regenerate plan</button></Head>
{busy?<Skel/>:!d.plan.length?<Card><Empty t="No gaps found" s="You meet every benchmark for this role."/></Card>:['High','Medium','Low'].map(p=>{const items=d.plan.filter(x=>x.pri===p);return items.length>0&&<div key={p} className="mb-6"><h2 className={'font-semibold mb-2 '+(p==='High'?'text-bad':p==='Medium'?'text-warn':'text-ok')}>{p} priority</h2>
<div className="grid md:grid-cols-2 gap-3">{items.map(x=><Card key={x.id} className={x.status==='done'?'opacity-70':''}><div className="flex justify-between"><h3 className="font-semibold">{x.skill}</h3><span className="text-xs text-sub">{x.time}</span></div><p className="text-sm text-sub mt-1">{x.reason}</p><p className="text-sm mt-2"><b>Do:</b> {x.activity}</p>
<div className="flex items-center gap-3 mt-3"><select className="inp !w-auto" aria-label="Status" value={x.status} onChange={e=>{setSt(x.id,e.target.value);say('Progress saved')}}><option value="todo">Not started</option><option value="doing">In progress</option><option value="done">Completed</option></select>
{x.status!=='done'&&<button className="btn btn-p" onClick={()=>{setSt(x.id,'done');say('Marked complete. '+x.skill+' +4 points')}}>Mark complete</button>}</div></Card>)}</div></div>})}</div>}

export function Progress(){const{d,m}=useS();const hist=[...d.history,{label:'Now',score:m.overall}],prev=d.history.at(-1)?.score??m.overall
const cmp=SKILLS.map(s=>({s,Baseline:d.base[s],Current:d.skills[s]})),done=d.plan.filter(p=>p.status==='done'),pc=d.projects.filter(p=>p.status==='Completed').length
return <div><Head t="Progress Tracking" s="How your readiness has changed over time"/>
<div className="grid sm:grid-cols-3 gap-4"><Card><p className="text-sm text-sub">Previous score</p><p className="text-2xl font-semibold">{prev}%</p></Card><Card><p className="text-sm text-sub">Current score</p><p className="text-2xl font-semibold">{m.overall}% <span className={'text-sm '+(m.overall>=prev?'text-ok':'text-bad')}>{m.overall>=prev?'+':''}{m.overall-prev}</span></p></Card><Card><p className="text-sm text-sub">Projects completed</p><p className="text-2xl font-semibold">{pc}/{d.projects.length}</p><div className="mt-2"><Prog v={d.projects.length?pc/d.projects.length*100:0}/></div></Card></div>
<div className="grid lg:grid-cols-2 gap-4 mt-4"><Card><h3 className="font-semibold mb-3">Readiness over time</h3><Chart><LineChart data={hist}><CartesianGrid stroke="#EAECF0"/><XAxis dataKey="label" tick={{fontSize:11}}/><YAxis domain={[0,100]}/><Tooltip/><Line dataKey="score" stroke={IND} strokeWidth={2}/></LineChart></Chart></Card>
<Card><h3 className="font-semibold mb-3">Skill improvement</h3><Chart><BarChart data={cmp}><CartesianGrid vertical={false} stroke="#EAECF0"/><XAxis dataKey="s" tick={{fontSize:11}}/><YAxis domain={[0,100]}/><Tooltip/><Legend/><RB dataKey="Baseline" fill={GR} radius={[4,4,0,0]}/><RB dataKey="Current" fill={IND} radius={[4,4,0,0]}/></BarChart></Chart></Card>
<Card><h3 className="font-semibold mb-3">Completed learning activities</h3>{done.length?done.map(x=><p key={x.id} className="text-sm py-1 border-b last:border-0 border-line">{x.activity}</p>):<Empty t="Nothing completed yet" s="Finish an item in your AI Action Plan."/>}</Card>
<Card><h3 className="font-semibold mb-3">Interview practice</h3><Chart h={200}><LineChart data={d.interviews.map((x,i)=>({n:i+1,score:x.score}))}><CartesianGrid stroke="#EAECF0"/><XAxis dataKey="n"/><YAxis domain={[0,100]}/><Tooltip/><Line dataKey="score" stroke={BLU} strokeWidth={2}/></LineChart></Chart></Card></div></div>}

export function Onboarding(){const{d,upd,say,demo}=useS();const nav=useNavigate();const p=d.profile
const[f,setF]=useState({...p,projects:d.projects.map(x=>x.title).join(', '),sk:SKILLS.filter(s=>d.skills[s]>0)});const[e,setE]=useState({});const[busy,setB]=useState(false)
const set=k=>x=>setF({...f,[k]:x.target.value})
const go=ev=>{ev.preventDefault();const x={};if(!f.name.trim())x.name='Enter your name';if(!f.college.trim())x.college='Enter your college';if(f.pct===''||+f.pct<0||+f.pct>100)x.pct='Enter a percentage from 0 to 100';if(+f.semester<1||+f.semester>10)x.semester='Semester must be 1 to 10';if(!f.sk.length)x.sk='Select at least one skill';setE(x);if(Object.keys(x).length)return
setB(true);setTimeout(()=>{upd(n=>{Object.assign(n.profile,{name:f.name.trim(),college:f.college.trim(),degree:f.degree,semester:+f.semester,pct:+f.pct,certs:f.certs,goal:f.goal,interests:f.interests})
SKILLS.forEach(s=>{n.skills[s]=f.sk.includes(s)?(n.skills[s]||50):0;n.base[s]=Math.min(n.base[s],n.skills[s])||n.skills[s]})
f.projects.split(',').map(t=>t.trim()).filter(t=>t&&!n.projects.some(q=>q.title===t)).forEach(t=>n.projects.push({id:Date.now()+Math.random(),title:t,desc:'Added during onboarding.',tech:'',url:'',skills:[],status:'Completed'}))
n.plan=genPlan(n.skills,f.goal);n.activity.unshift('Profile analysed for '+f.goal)});setB(false);say('Analysis complete');nav('/')},1400)}
const E=k=>e[k]&&<p className="err">{e[k]}</p>
return <div className="max-w-3xl"><Head t="Student onboarding" s="Tell us about yourself and we will build your readiness analysis"><button className="btn" type="button" onClick={()=>{upd(n=>Object.assign(n,demo()));say('Sample student loaded');nav('/')}}>Use sample student</button></Head>
<Card><form onSubmit={go} noValidate className="grid sm:grid-cols-2 gap-4">
<div><label className="lbl" htmlFor="n">Name</label><input id="n" className="inp" value={f.name} onChange={set('name')}/>{E('name')}</div>
<div><label className="lbl" htmlFor="c">College</label><input id="c" className="inp" value={f.college} onChange={set('college')}/>{E('college')}</div>
<div><label className="lbl" htmlFor="dg">Degree</label><input id="dg" className="inp" value={f.degree} onChange={set('degree')}/></div>
<div><label className="lbl" htmlFor="sm">Semester</label><input id="sm" type="number" className="inp" value={f.semester} onChange={set('semester')}/>{E('semester')}</div>
<div><label className="lbl" htmlFor="pc">Academic percentage</label><input id="pc" type="number" className="inp" value={f.pct} onChange={set('pct')}/>{E('pct')}</div>
<div><label className="lbl" htmlFor="g">Target career role</label><select id="g" className="inp" value={f.goal} onChange={set('goal')}>{Object.keys(ROLES).map(r=><option key={r}>{r}</option>)}</select></div>
<div className="sm:col-span-2"><span className="lbl">Technical skills</span><div className="flex flex-wrap gap-2">{SKILLS.map(s=><button type="button" key={s} onClick={()=>setF({...f,sk:f.sk.includes(s)?f.sk.filter(k=>k!==s):[...f.sk,s]})} className={'rounded-full border px-3 py-1 text-sm '+(f.sk.includes(s)?'bg-brand text-white border-brand':'border-line')}>{s}</button>)}</div>{E('sk')}</div>
<div className="sm:col-span-2"><label className="lbl" htmlFor="pr">Completed projects (comma separated)</label><input id="pr" className="inp" value={f.projects} onChange={set('projects')}/></div>
<div><label className="lbl" htmlFor="ce">Certifications</label><input id="ce" className="inp" value={f.certs} onChange={set('certs')}/></div>
<div><label className="lbl" htmlFor="in">Career interests</label><input id="in" className="inp" value={f.interests} onChange={set('interests')}/></div>
<div className="sm:col-span-2"><button className="btn btn-p" disabled={busy}>{busy&&<Loader2 className="animate-spin" size={16}/>}{busy?'Analysing your profile':'Start analysis'}</button></div></form></Card></div>}
