import React from 'react';import {createRoot} from 'react-dom/client';import {HashRouter,Routes,Route} from 'react-router-dom'
import './index.css';import {Provider} from './store';import {Layout} from './ui'
import {Overview,Academics,Skills,Projects,Interview,Career,Plan,Progress,Onboarding} from './pages'
createRoot(document.getElementById('root')).render(<HashRouter><Provider><Routes><Route element={<Layout/>}>
<Route path="/" element={<Overview/>}/><Route path="/onboarding" element={<Onboarding/>}/><Route path="/academics" element={<Academics/>}/><Route path="/skills" element={<Skills/>}/>
<Route path="/projects" element={<Projects/>}/><Route path="/interview" element={<Interview/>}/><Route path="/career" element={<Career/>}/><Route path="/plan" element={<Plan/>}/><Route path="/progress" element={<Progress/>}/><Route path="*" element={<Overview/>}/>
</Route></Routes></Provider></HashRouter>)
