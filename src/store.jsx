import {createContext,useContext,useEffect,useState,useRef} from 'react'
export const SKILLS=['Python','Java','JavaScript','SQL','DSA','React','Communication']
export const CAT={Python:'Programming',Java:'Programming',JavaScript:'Web',SQL:'Data',DSA:'Core CS',React:'Web',Communication:'Soft skills'}
export const ROLES={
'Python Developer':{req:{Python:90,SQL:70,DSA:65,Java:45,JavaScript:40,React:30,Communication:65},proj:['REST API with Flask and PostgreSQL','Data pipeline with Pandas','CLI automation tool']},
'Full-Stack Developer':{req:{JavaScript:80,React:80,SQL:65,Python:60,Java:40,DSA:55,Communication:60},proj:['MERN-style task manager','E-commerce with payments','Real-time chat app']},
'Data Analyst':{req:{SQL:85,Python:75,Communication:70,DSA:40,JavaScript:20,React:10,Java:10},proj:['Sales dashboard from SQL data','Exploratory analysis on public dataset','A/B test report']},
'AI Engineer':{req:{Python:90,DSA:70,SQL:55,Communication:60,Java:30,JavaScript:25,React:15},proj:['Text classifier with scikit-learn','Recommendation engine','Model served via FastAPI']}}
const ACT={Python:'Build a Flask REST API with pytest coverage',Java:'Solve 15 OOP problems and build a console app',JavaScript:'Rebuild a small app with ES6 modules and async/await',SQL:'Complete 30 join and window-function exercises',DSA:'Solve 40 array, string and hash-map problems',React:'Add routing and state management to your portfolio',Communication:'Record two 3-minute project explanations and review them'}
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0
const today=()=>new Date().toLocaleDateString()
export const genPlan=(sk,goal)=>{const r=ROLES[goal].req;return SKILLS.map(s=>({s,gap:r[s]-(sk[s]||0)})).filter(x=>x.gap>0).sort((a,b)=>b.gap-a.gap).map(({s,gap})=>({id:goal+s,pri:gap>=30?'High':gap>=15?'Medium':'Low',skill:s,reason:`${s} is ${gap} points below the ${goal} benchmark (${sk[s]||0}% vs ${r[s]}%).`,activity:ACT[s],time:`${Math.max(1,Math.round(gap/10))} week(s)`,status:'todo'}))}
export const calc=d=>{const ac=Math.round(+d.profile.pct||0),tech=Math.round(avg(SKILLS.map(s=>d.skills[s]||0)))
const ev=new Set(d.projects.flatMap(p=>p.skills)),pr=Math.min(100,d.projects.reduce((a,p)=>a+(p.status==='Completed'?25:10),0)+ev.size*5)
const iv=Math.round(avg(d.interviews.map(i=>i.score))),req=ROLES[d.profile.goal].req
const al=Math.round(avg(Object.keys(req).map(s=>Math.min(1,(d.skills[s]||0)/req[s])*100)))
return{ac,tech,pr,iv,al,overall:Math.round((ac+tech+pr+iv+al)/5)}}
const demo=()=>{const skills={Python:85,Java:65,JavaScript:60,SQL:45,DSA:35,React:70,Communication:55}
const d={profile:{name:'Rahul Sharma',college:'Sample Institute of Technology',degree:'MCA',semester:2,pct:75,certs:'Python Essentials',goal:'Python Developer',interests:'Backend, Automation'},
subjects:[['Data Structures',66],['DBMS',74],['Python Programming',90],['Operating Systems',71],['Mathematics',64],['Web Technologies',85]].map(([n,m])=>({n,m})),
assess:[['Quiz 1',68],['Mid-term',72],['Quiz 2',74],['Lab exam',80],['Quiz 3',76],['Internal',78]].map(([n,m])=>({n,m})),
skills,base:{...skills},
projects:[{id:1,title:'Student Management System',desc:'CRUD app for student records with search and reports.',tech:'Python, Flask, SQLite',url:'https://github.com/rahul-demo/student-mgmt',skills:['Python','SQL'],status:'Completed'},
{id:2,title:'Portfolio Website',desc:'Responsive personal site with project showcase.',tech:'React, JavaScript, CSS',url:'https://github.com/rahul-demo/portfolio',skills:['React','JavaScript'],status:'Completed'}],
interviews:[{date:'01/10/2026',cat:'Technical',score:62},{date:'12/10/2026',cat:'HR',score:70},{date:'02/11/2026',cat:'Behavioral',score:58}],
history:[{label:'Sep',score:52},{label:'Oct',score:58},{label:'Nov',score:62}],
activity:['Completed Behavioral mock interview (58%)','Added project: Portfolio Website','Updated Python skill to 85%']}
d.plan=genPlan(skills,d.profile.goal);return d}
const C=createContext()
export const useS=()=>useContext(C)
export function Provider({children}){
const [d,setD]=useState(()=>{try{return JSON.parse(localStorage.getItem('sp'))||demo()}catch{return demo()}})
const [toast,setT]=useState(null);const tm=useRef()
useEffect(()=>{localStorage.setItem('sp',JSON.stringify(d))},[d])
const say=(msg,type='ok')=>{setT({msg,type});clearTimeout(tm.current);tm.current=setTimeout(()=>setT(null),2800)}
const upd=fn=>setD(p=>{const n=structuredClone(p);fn(n);return n})
const log=(n,t)=>n.activity.unshift(t)
const reset=()=>{setD(demo());say('Demo data restored')}
return <C.Provider value={{d,upd,say,toast,reset,m:calc(d),log,today,demo}}>{children}</C.Provider>}
