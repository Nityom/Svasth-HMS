import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Activity, ArrowDown, ArrowRight, Bed, CalendarDays, Check, ChevronDown, ClipboardPlus, Clock3, FileText, LayoutDashboard, ReceiptText, ShieldCheck, Stethoscope, Users } from 'lucide-react';

const scenes = [
  { id: 'registration', number: '01', title: 'A patient arrives.', subtitle: 'Registration', icon: Users, copy: 'A new patient record takes shape, then joins the care team’s shared workspace.', points: ['Details captured once', 'Patient profile linked to a visit', 'Ready for the next step'] },
  { id: 'appointment', number: '02', title: 'A visit finds its time.', subtitle: 'Appointments', icon: CalendarDays, copy: 'The team picks a slot, assigns a doctor and places the visit into the day.', points: ['Availability at a glance', 'Doctor assigned', 'Booking confirmed'] },
  { id: 'prescription', number: '03', title: 'Care becomes a plan.', subtitle: 'Digital prescription', icon: FileText, copy: 'Consultation notes become a clear, letterhead-ready prescription.', points: ['Diagnosis and notes', 'Medicine instructions', 'Print or share securely'] },
  { id: 'analytics', number: '04', title: 'The whole day comes together.', subtitle: 'Hospital analytics', icon: Activity, copy: 'Live operational views bring visits, appointments and billing into focus.', points: ['Clinic activity at a glance', 'Trends update as work moves', 'One connected overview'] },
];

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 45, damping: 18, mass: .8 });
  const rounded = useTransform(spring, (current) => Math.round(current).toLocaleString('en-IN'));
  useEffect(() => { value.set(to); }, [to, value]);
  return <motion.span>{rounded}</motion.span>;
}

function RegistrationScene() {
  return <div className="living-registration">
    <div className="living-form-card">
      <div className="living-card-heading"><span className="living-icon mint"><Users size={17}/></span><span><b>New patient</b><small>Patient details · Step 1 of 2</small></span><span className="living-demo-tag">DEMO</span></div>
      <div className="living-form-grid">
        {[['Patient name','Anaya Deshmukh'],['Mobile number','+91 98••• 24 610'],['Date of birth','14 Aug 1988'],['Department','Orthopaedics']].map(([label,value],index)=><div className="living-input" key={label}><small>{label}</small><motion.b initial={{opacity:0,width:0}} animate={{opacity:1,width:'100%'}} transition={{delay:.3+index*.22,duration:.45}}>{value}</motion.b></div>)}
      </div>
      <div className="living-form-bottom"><span><ShieldCheck size={14}/> Private patient record</span><motion.span className="living-save-state" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:1.35}}><Check size={13}/> Profile saved</motion.span></div>
    </div>
    <motion.div className="living-patient-card" initial={{opacity:0,x:36,rotateY:-8}} animate={{opacity:1,x:0,rotateY:0}} transition={{delay:.8,type:'spring',stiffness:90,damping:15}}>
      <div className="living-patient-top"><span className="living-patient-avatar">AD</span><span><b>Anaya Deshmukh</b><small>UHID · DEMO-1042</small></span><span className="living-status"><i/> Registered</span></div>
      <div className="living-patient-meta"><span><small>VISIT TYPE</small><b>First consultation</b></span><span><small>DEPARTMENT</small><b>Orthopaedics</b></span></div>
      <div className="living-profile-link"><span>Patient profile created</span><ArrowRight size={14}/></div>
    </motion.div>
    <motion.div className="living-flow-chip" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.5}}><span className="flow-chip-icon"><Check size={12}/></span> Added to patient records</motion.div>
  </div>;
}

function AppointmentScene() {
  const days = ['MON','TUE','WED','THU','FRI','SAT'];
  const times = ['09:30','10:00','10:30','11:00'];
  return <div className="living-appointment">
    <div className="living-calendar-card">
      <div className="living-card-heading"><span className="living-icon blue"><CalendarDays size={17}/></span><span><b>Book an appointment</b><small>Orthopaedics · October 2026</small></span><button className="living-icon-button" aria-label="Next month"><ChevronDown size={15}/></button></div>
      <div className="living-calendar-grid">{days.map((day,index)=><div key={day} className={index===2?'selected-day':''}><small>{day}</small><b>{[26,27,28,29,30,31][index]}</b></div>)}</div>
      <div className="living-slot-title"><span>Available slots</span><small>Wednesday, 28 October</small></div>
      <div className="living-slots">{times.map((time,index)=><motion.span key={time} className={index===2?'selected-slot':''} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} transition={{delay:.35+index*.12}}>{time}</motion.span>)}</div>
    </div>
    <motion.div className="living-booking-card" initial={{opacity:0,x:35,rotateY:-7}} animate={{opacity:1,x:0,rotateY:0}} transition={{delay:.8,type:'spring',stiffness:90,damping:16}}>
      <span className="living-booking-label"><Check size={12}/> APPOINTMENT BOOKED</span><b className="living-booking-time">10:30 <small>AM</small></b><div className="living-booking-rule"/><div className="living-booking-person"><span className="living-patient-avatar">AD</span><span><b>Anaya Deshmukh</b><small>Dr. Vipeen Raut · Orthopaedics</small></span></div><div className="living-booking-footer"><span><Clock3 size={13}/> 20 min visit</span><span>OPD · Room 02</span></div>
    </motion.div>
    <motion.div className="living-flow-chip" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.45}}><span className="flow-chip-icon"><Check size={12}/></span> Slot reserved in the OPD calendar</motion.div>
  </div>;
}

function PrescriptionScene() {
  return <div className="living-prescription">
    <motion.div className="living-consult-card" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.15}}>
      <div className="living-card-heading"><span className="living-icon mint"><Stethoscope size={17}/></span><span><b>Consultation notes</b><small>Anaya Deshmukh · OPD-1042</small></span></div>
      <div className="living-note-field"><small>DIAGNOSIS</small><motion.b initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}>Knee pain · right side</motion.b></div>
      <div className="living-note-field"><small>CLINICAL NOTES</small><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}}>Pain on movement. No visible swelling. Follow-up advised in one week.</motion.p></div>
      <div className="living-note-status"><Check size={13}/> Notes saved to visit</div>
    </motion.div>
    <motion.div className="living-rx-document" initial={{opacity:0,y:25,rotate:2,scale:.96}} animate={{opacity:1,y:0,rotate:0,scale:1}} transition={{delay:.55,type:'spring',stiffness:75,damping:15}}>
      <div className="rx-doc-brand"><img src="/Svaasth_logo.png" alt=""/><span><b>Svaasth HMS</b><small>CARE THAT CONNECTS</small></span><span className="rx-doc-copy">PRESCRIPTION</span></div>
      <div className="rx-doc-patient"><b>Anaya Deshmukh</b><span>UHID DEMO-1042 · 28 Oct 2026</span><small>Diagnosis: Knee pain · right side</small></div>
      <div className="rx-doc-table"><div><b>MEDICINE</b><b>INSTRUCTIONS</b></div><div><span>Paracetamol 500 mg</span><span>1 tablet · after meals</span></div><div><span>Topical pain relief gel</span><span>Apply · twice daily</span></div></div>
      <div className="rx-doc-footer"><span>Review in 7 days</span><motion.span className="rx-generated" initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:1.3}}><Check size={12}/> PDF ready</motion.span></div>
    </motion.div>
    <motion.div className="living-flow-chip" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.55}}><span className="flow-chip-icon"><FileText size={12}/></span> Prescription generated from the visit</motion.div>
  </div>;
}

function AnalyticsScene() {
  return <div className="living-analytics">
    <div className="living-analytics-heading"><span><b>Clinic overview</b><small>Wednesday · 28 October 2026</small></span><button className="living-period">This week <ChevronDown size={13}/></button></div>
    <div className="living-kpi-grid">{[{label:'PATIENT VISITS',value:128,icon:Users,tint:'mint',change:'+12%'},{label:'APPOINTMENTS',value:46,icon:CalendarDays,tint:'blue',change:'+8%'},{label:'BILLS SETTLED',value:38,icon:ReceiptText,tint:'peach',change:'+16%'}].map((item,index)=><motion.div className="living-kpi" key={item.label} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.15+index*.16}}><span className={`living-icon ${item.tint}`}><item.icon size={16}/></span><small>{item.label}</small><b><CountUp to={item.value}/></b><em><ArrowRight size={11}/>{item.change} this week</em></motion.div>)}</div>
    <div className="living-chart-card"><div className="living-chart-heading"><span><b>Visits through the week</b><small>Patient activity · demo data</small></span><span className="chart-legend"><i/> This week</span></div>
      <div className="living-chart"><div className="chart-y-labels"><span>50</span><span>35</span><span>20</span><span>05</span></div><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Animated weekly patient visit chart"><defs><linearGradient id="visit-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#62ad83" stopOpacity=".22"/><stop offset="1" stopColor="#62ad83" stopOpacity="0"/></linearGradient></defs><path className="chart-grid-line" d="M0 20H600 M0 65H600 M0 110H600 M0 155H600"/><motion.path className="chart-area" d="M0 135 C40 125 60 110 100 119 S160 84 200 98 S270 45 310 70 S365 93 400 54 S470 75 500 43 S560 50 600 20 V180 H0Z" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}/><motion.path className="chart-line" d="M0 135 C40 125 60 110 100 119 S160 84 200 98 S270 45 310 70 S365 93 400 54 S470 75 500 43 S560 50 600 20" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.8,ease:'easeInOut',delay:.2}}/><motion.circle cx="600" cy="20" r="5" className="chart-end-dot" initial={{scale:0}} animate={{scale:1}} transition={{delay:1.8,type:'spring'}}/></svg></div><div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
    </div>
    <motion.div className="living-flow-chip" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.6}}><span className="flow-chip-icon"><Activity size={12}/></span> Numbers update as the day moves</motion.div>
  </div>;
}

function SceneContent({ index }: { index: number }) {
  if (index === 0) return <RegistrationScene/>;
  if (index === 1) return <AppointmentScene/>;
  if (index === 2) return <PrescriptionScene/>;
  return <AnalyticsScene/>;
}

export default function LivingShowcase({ onBookDemo }: { onBookDemo: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (progress) => setActive(Math.min(3, Math.floor(Math.min(progress, .9999) * 4))));
  const goToStep = (index: number) => stepRefs.current[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  const scene = scenes[active];
  const SceneIcon = scene.icon;

  return <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}><section className="living-section" id="preview" ref={sectionRef}>
    <div className="living-intro"><div><span className="eyebrow">THE CARE JOURNEY, CONNECTED</span><h2>Watch the work <span>flow.</span></h2></div><p>From a new patient to a clearer view of the day, see how each moment moves naturally into the next.</p></div>
    <div className="living-layout">
      <div className="living-sticky-column">
        <motion.div className="living-device" whileHover={reducedMotion ? undefined : { rotateX: 1.2, rotateY: -1.2, y: -3 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
          <div className="living-app-topbar"><div className="living-app-brand"><img src="/Svaasth_logo.png" alt=""/><b>Svaasth <span>HMS</span></b></div><span className="living-workspace-crumb">Workspace <i>/</i> {scene.subtitle}</span><span className="living-app-user">DR</span></div>
          <div className="living-app-body"><aside className="living-app-sidebar"><span className="sidebar-eyebrow">WORKSPACE</span>{[{label:'Overview',icon:LayoutDashboard},{label:'Patients',icon:Users},{label:'Appointments',icon:CalendarDays},{label:'Prescriptions',icon:FileText},{label:'Analytics',icon:Activity}].map((item,index)=><div key={item.label} className={index===(active===0?1:active+1)?'active':''}><item.icon size={14}/><span>{item.label}</span></div>)}<div className="sidebar-doctor"><span>VR</span><small>Dr. Vipeen Raut</small></div></aside>
            <div className="living-app-content"><div className="living-scene-title"><div><span className="living-scene-icon"><SceneIcon size={15}/></span><span><small>{scene.number} / 04 · {scene.subtitle.toUpperCase()}</small><b>{scene.title}</b></span></div><span className="demo-data-pill"><i/> DEMO DATA</span></div>
              <AnimatePresence mode="wait"><motion.div className="living-scene-panel" key={active} initial={reducedMotion?false:{opacity:0,y:15,filter:'blur(5px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={reducedMotion?undefined:{opacity:0,y:-10,filter:'blur(3px)'}} transition={{duration:reducedMotion?0:.42,ease:'easeOut'}}><SceneContent index={active}/></motion.div></AnimatePresence>
            </div>
          </div>
          <div className="living-progress"><motion.i animate={{width:`${(active+1)*25}%`}} transition={{duration:reducedMotion?0:.45}}/></div>
        </motion.div>
        <div className="living-screen-controls"><div className="living-scene-dots">{scenes.map((item,index)=><button key={item.id} className={index===active?'active':''} onClick={()=>goToStep(index)} aria-label={`Go to ${item.subtitle}`} aria-pressed={index===active}><span>{item.number}</span></button>)}</div><span>Scroll to explore <ArrowDown size={13}/></span></div>
      </div>
      <div className="living-story" ref={storyRef}>{scenes.map((item,index)=><article className={`living-story-step ${index===active?'is-active':''}`} key={item.id} ref={(node)=>{stepRefs.current[index]=node;}}>
        <span className="living-story-number">{item.number}<i/></span><div className="living-story-icon"><item.icon size={19}/></div><span className="living-story-kicker">{item.subtitle}</span><h3>{item.title}</h3><p>{item.copy}</p><ul>{item.points.map(point=><li key={point}><Check size={14}/>{point}</li>)}</ul>
        {index===3&&<div className="living-story-cta"><button className="button" onClick={onBookDemo}>Book a walkthrough <ArrowRight size={15}/></button></div>}
      </article>)}</div>
    </div>
    <p className="living-disclaimer">Fictional patient information and activity shown for demonstration.</p>
  </section></MotionConfig>;
}
