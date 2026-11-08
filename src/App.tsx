import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Activity, ArrowRight, ArrowUp, ArrowUpRight, Bed, Boxes, CalendarDays, Check, ChevronDown, ClipboardPlus, Clock3, CreditCard, Database, FileText, LockKeyhole, Mail, Menu, MessageCircle, Pill, Plus, ReceiptText, Save, Settings2, ShieldCheck, Sparkles, Stethoscope, Users, X, Zap } from 'lucide-react';
import LogoOrbit from './LogoOrbit';
import doctorReviews from './data/doctor-reviews.json';

const LivingShowcase = lazy(() => import('./LivingShowcase'));

const features = [
  { icon: CalendarDays, title: 'A calmer OPD', copy: 'Run token queues, register patients quickly and capture vitals before each consultation.', tint: 'mint' },
  { icon: Save, title: 'Autosave as you work', copy: 'Keep patient details and consultation notes saved as your team enters them.', tint: 'blue' },
  { icon: Stethoscope, title: 'Treatment suggestions', copy: 'Find commonly used treatments and clinical templates faster with configurable suggestions.', tint: 'peach' },

  { icon: Boxes, title: 'Medicine inventory', copy: 'Track medicine stock, quantities and inventory movement alongside daily hospital work.', tint: 'mint' },
  { icon: FileText, title: 'Clear digital prescriptions', copy: 'Create legible prescriptions with reusable medicine templates and your hospital letterhead.', tint: 'blue' },
  { icon: CreditCard, title: 'Installment management', copy: 'Record partial payments, follow balances and keep payment history linked to the patient.', tint: 'peach' },
  { icon: Mail, title: 'Consultation updates by email and SMS', copy: 'Share consultation details and documents with patients through configured email and SMS workflows.', tint: 'lilac' },
  { icon: Database, title: 'A complete patient record', copy: 'Keep visits, prescriptions, billing and clinical history together in one patient profile.', tint: 'mint' },
  { icon: Bed, title: 'Every bed, in view', copy: 'Track admissions, wards, daily observations and discharge summaries in one workspace.', tint: 'blue' },
  { icon: ReceiptText, title: 'Billing without the back-and-forth', copy: 'Manage consultation fees, follow-ups, procedures, receipts and outstanding dues.', tint: 'peach' },
  { icon: Settings2, title: 'Configured around your hospital', copy: 'Choose the modules, fields, templates and workflows that fit your team and requirements.', tint: 'lilac' },
  { icon: LockKeyhole, title: 'Your own private workspace', copy: 'Keep hospital records in a dedicated workspace built for your team’s day-to-day work.', tint: 'mint' },
];
const faqs = [
  ['How quickly can we get started?', 'Your branded workspace can be ready within 24 hours after we receive your hospital name, doctor details, fees and logo.'],
  ['Is patient data shared with other hospitals?', 'No. Each hospital receives its own isolated cloud database for patient records and operations.'],
  ['Can prescriptions print on our existing letterheads?', 'Yes. Choose a complete print layout or print only the clinical content aligned to your pre-printed letterhead.'],
  ['Do we need to install a server?', 'No. Svaasth works in a modern browser on a desktop, laptop, tablet or phone. Hosting and updates are managed for you.'],
  ['Can the system fit our specialty?', 'Yes. We configure modules for your clinic and can tailor workflows, registers and templates to your needs.'],
];
const demos = [
  { id:'opd', name:'OPD Management', icon:CalendarDays, title:'Today at a glance', metric:'OPD queue', unit:'PATIENT CARE', summary:[['QUEUE STATUS','3 stages','Waiting · in consultation · completed'],['PATIENT RECORD','UHID linked','Vitals, visit and doctor details']], rows:[['01','Patient CRX••24','Vitals recorded · 10:30 AM','In consultation'],['02','Patient CRX••25','BP recorded · 10:45 AM','Waiting'],['03','Patient CRX••26','New registration · 11:00 AM','Next up']] },
  { id:'rx', name:'Prescriptions', icon:FileText, title:'Digital prescription', metric:'Prescription', unit:'CLINICAL WORKFLOW', summary:[['MEDICINE CATALOG','Search & select','Configured for your hospital'],['PRESCRIPTION','Print or email','Letterhead-ready output']], rows:[['01','Patient CRX••24','Diagnosis and findings','Saved'],['02','Medicine catalog','Dose · frequency · duration','Configured'],['03','Prescription output','Print or email to patient','Ready']] },
  { id:'ipd', name:'IPD Management', icon:Bed, title:'Inpatient care', metric:'Bed board', unit:'HOSPITAL OPERATIONS', summary:[['ADMISSION RECORD','Bed linked','Ward and patient details'],['CASE SHEET','Daily updates','Vitals and nursing notes']], rows:[['01','Ward / Bed 01','Admission and case details','Occupied'],['02','Ward / Bed 02','Bed allocation','Available'],['03','Discharge summary','Generated from admission','Ready']] },
  { id:'billing', name:'OPD & Hospital Billing', icon:ReceiptText, title:'Visit billing', metric:'Bill workflow', unit:'HOSPITAL BILLING', summary:[['CONSULTATION','₹400 first visit','₹200 follow-up · 10-day validity'],['PAYMENT MODES','Cash · UPI · card','Receipt linked to visit']], rows:[['01','Consultation fee','First visit · configured rate','₹400'],['02','Follow-up visit','Within 10-day validity','₹200'],['03','OPD bill & receipt','Generated from visit charges','Ready']] },
];
function App() {
  const [demo, setDemo] = useState('opd');
  const [patients, setPatients] = useState(40);
  const [ipd, setIpd] = useState(8);
  const [faq, setFaq] = useState<number | null>(0);
  const [modal, setModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [menu, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const cancelNavScroll = useRef<() => void>(() => {});
  const [form, setForm] = useState({ hospital: '', doctor: '', phone: '', city: '', specialty: 'Orthopaedics' });
  const hours = Math.round((patients * 5 * 26 + ipd * 30 * 4) / 60);
  const activeDemo = demos.find((item) => item.id === demo)!;
  const HeroDemoIcon = activeDemo.icon;
  const navItems = [{ label:'Platform', id:'features' }, { label:'Product tour', id:'preview' }, { label:'Specialties', id:'specialties' }, { label:'Pricing', id:'pricing' }, { label:'FAQ', id:'faq' }];
  useEffect(() => {
    const sections = navItems.map(({ id }) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 480);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);
  const navigateTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenu(false);
    const target = document.getElementById(id);
    if (!target) return;
    cancelNavScroll.current();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const scrollToTop = (event?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event?.preventDefault();
    cancelNavScroll.current();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }
    const distance = window.scrollY;
    const controls = animate(distance, 0, {
      duration: Math.min(2.4, Math.max(1.35, distance / 1100)),
      ease: [0.37, 0, 0.63, 1],
      onUpdate: (position) => window.scrollTo(0, position),
    });
    cancelNavScroll.current = () => controls.stop();
  };
  const openDemo = () => { setModal(true); setSubmitted(false); setSubmitError(''); };
  const submitDemo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true); setSubmitError('');
    try {
      const response = await fetch('https://formsubmit.co/ajax/nityomtikherr@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.hospital,
          _subject: `New Svaasth demo request — ${form.hospital}`,
          _template: 'table',
          'Hospital or clinic': form.hospital,
          'Doctor or contact person': form.doctor,
          'Phone / WhatsApp': form.phone,
          City: form.city,
          Specialty: form.specialty,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success === 'false' || result.success === false) throw new Error(result.message || 'Email delivery failed');
      setSubmitted(true);
    } catch {
      setSubmitError('We couldn’t send your request just now. Please try again, or contact us on WhatsApp.');
    } finally {
      setSending(false);
    }
  };
  const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .55 } } };

  return <div className="site-shell">
    <div className="announcement"><span className="live-dot" /> Your hospital, your name, your workflow <span className="announcement-sep">·</span> <b>100% white-label</b> <ArrowRight size={13}/></div>
    <header className="topbar">
      <a className="brand" href="#top" onClick={scrollToTop} aria-label="Svaasth HMS home"><img className="brand-lockup" src="/svaasth.png" alt="Svaasth HMS — Hospital Management System" /></a>
      <nav className={menu ? 'nav-links open' : 'nav-links'}>
        {navItems.map(({label,id}) => <motion.a key={id} href={`#${id}`} className={activeSection===id?'active':''} onClick={(event)=>navigateTo(event,id)} whileHover={{ y:-1 }} whileTap={{ scale:.97 }}>
          {label}{activeSection===id&&<motion.span className="nav-active-indicator" layoutId="nav-active-indicator" transition={{type:'spring',stiffness:420,damping:34}}/>}
        </motion.a>)}
      </nav>
      <div className="nav-actions"><a className="nav-phone" href="tel:+917796308778">+91 77963 08778</a><button className="button button-small" onClick={openDemo}><span className="nav-cta-label">Book a walkthrough</span><ArrowRight size={15}/></button><button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow-icon"><Sparkles size={13}/></span> MADE FOR THE RHYTHM OF CARE</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>Less admin.<br/><span>More care.</span></motion.h1>
          <motion.p className="hero-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }}>A beautifully simple operating system for hospitals and clinics. Move from the first token to the final bill with more clarity, less paper and time back for your patients.</motion.p>
          <motion.div className="hero-buttons" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }}><button className="button" onClick={openDemo}>See Svaasth in action <ArrowRight size={16}/></button><a className="text-link" href="#preview"><span className="play-icon">▶</span> Take the product tour</a></motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}><div className="avatar-stack">{[
            { name: 'Dr. Tarun Pandey', photo: '/doctors/doctor8.jpg' },
            { name: 'Dr. Sindhuja Pandey', photo: '/doctors/doctor9.jpg' },
            { name: 'Dr. Lalit Singh', photo: '/doctors/doctor10.jpg' },
            { name: 'Dr. Vipeen Raut', photo: '/doctors/doctor4.jpg' },
          ].map((doctor, index) => <motion.span key={doctor.name} title={doctor.name} whileHover={{ y: -2, scale: 1.06, zIndex: 4 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}><img src={doctor.photo} alt={doctor.name} loading="lazy" style={{ objectPosition: index === 3 ? '32% center' : 'center 30%', ...(index === 0 ? { transform: 'scale(1.14)', transformOrigin: 'center 24%' } : {}) }}/></motion.span>)}</div><div className="hero-proof-copy"><b>Thoughtfully built with clinicians</b><small>For independent practices and growing hospitals</small><strong className="clinic-proof">15+ clinics already using us</strong></div></motion.div>
    </div>
        <motion.div className="hero-art" initial={{opacity:0,scale:.93,rotate:2}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:.8,delay:.15,ease:'easeOut'}}>
          <div className="studio-glow"/><div className="studio-orbit studio-orbit-a"/><div className="studio-orbit studio-orbit-b"/><div className="studio-orbit studio-orbit-c"/>
          <motion.div className="studio-particle particle-one" animate={{y:[0,-12,0],x:[0,5,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}}/><motion.div className="studio-particle particle-two" animate={{y:[0,10,0],x:[0,-6,0]}} transition={{duration:5.5,repeat:Infinity,ease:'easeInOut'}}/>
          <div className="studio-heading"><span className="studio-heading-mark"><Sparkles size={13}/></span><span><b>Explore the workspace</b><small>Choose a workflow to preview</small></span><span className="studio-step">0{demos.findIndex(item=>item.id===demo)+1} <i>/ 04</i></span></div>
          <div className="studio-module-picker" aria-label="Choose a workflow">{demos.map(item=><motion.button type="button" key={item.id} aria-pressed={demo===item.id} className={demo===item.id?'active':''} onClick={()=>setDemo(item.id)} whileHover={{y:-3,scale:1.035}} whileTap={{scale:.97}}><span className="studio-module-icon"><item.icon size={16}/></span><span>{item.id==='billing'?'Billing':item.id==='ipd'?'Beds':item.id==='rx'?'Digital Rx':'OPD queue'}</span><ArrowUpRight size={12} className="studio-module-arrow"/></motion.button>)}</div>
          <AnimatePresence mode="wait"><motion.div className="studio-dashboard" key={demo} initial={{opacity:0,y:18,rotateX:5}} animate={{opacity:1,y:0,rotateX:0}} exit={{opacity:0,y:-10}} transition={{duration:.32,ease:'easeOut'}}>
            <div className="studio-dash-top"><div className="studio-brand"><img src="/Svaasth_logo.png" alt=""/><span><b>Svaasth HMS</b><small>HOSPITAL WORKSPACE</small></span></div><span className="studio-date">{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</span></div>
            <div className="studio-dash-title"><div><small>{activeDemo.unit}</small><h3>{activeDemo.title}</h3></div><span className="studio-avatar">DR</span></div>
            <div className="studio-summary">{activeDemo.summary.map((stat,i)=><div className="studio-summary-card" key={stat[0]}><span className={i?'summary-icon summary-icon-peach':'summary-icon'}>{i?<ClipboardPlus size={15}/>:<HeroDemoIcon size={15}/>}</span><small>{stat[0]}</small><b>{stat[1]}</b><em>{stat[2]}</em></div>)}</div>
            <div className="studio-list-heading"><b>{activeDemo.name}</b><a href="#preview">View workflow <ArrowRight size={12}/></a></div>
            <div className="studio-rows">{activeDemo.rows.slice(0,2).map((row,i)=><div className="studio-row" key={row[0]}><span className={`studio-row-icon row-icon-${i}`}>{demo==='opd'?`0${i+1}`:<HeroDemoIcon size={13}/>}</span><span><b>{row[1]}</b><small>{row[2]}</small></span><em className={row[3]==='Waiting'||row[3]==='Available'?'row-warning':''}><i/>{row[3]}</em></div>)}</div>
            <button type="button" className="studio-tour-link" onClick={()=>document.getElementById('preview')?.scrollIntoView({behavior:'smooth'})}>Explore this workflow in the product tour <ArrowRight size={14}/></button>
          </motion.div></AnimatePresence>
          <div className="studio-footnote"><span><i/> Interactive product preview</span><span>Patient details anonymized</span></div>
        </motion.div>
      </section>

      <section className="trust-strip"><div><span>ONE CONNECTED WORKFLOW</span><b>From first hello to follow-up.</b></div><div className="trust-items"><span><Check/> OPD &amp; reception</span><span><Check/> Clinical records</span><span><Check/> IPD &amp; billing</span><span><Check/> Patient communication</span></div></section>

      <section className="product-video-section" aria-labelledby="product-video-heading">
        <div className="product-video-copy">
          <span className="eyebrow">SEE SVAasth IN MOTION</span>
          <h2 id="product-video-heading">One calm workflow for <span>every busy day.</span></h2>
          <p>See how Svaasth brings appointments, prescriptions, patient history and billing together in one connected workspace.</p>
          <button className="button" onClick={openDemo}>Book a walkthrough <ArrowRight size={15}/></button>
        </div>
        <div className="product-video-frame">
          <video className="product-video" autoPlay muted loop playsInline preload="metadata" aria-label="Svaasth hospital management software product demo">
            <source src="/demo-video.mp4" type="video/mp4" />
            <source src="/demo-video.mov" type="video/quicktime" />
          </video>
        </div>
      </section>

      <Suspense fallback={<section className="living-section" aria-label="Product tour" />}>
        <LivingShowcase onBookDemo={openDemo}/>
      </Suspense>

      <section id="features" className="section features-section"><div className="section-heading centered"><span className="eyebrow">THE Svaasth DIFFERENCE</span><h2>Everyday care, <span>all connected.</span></h2><p>From the first patient entry to stock, payments and follow-up, configure Svaasth around the way your hospital works.</p></div><div className="feature-grid">{features.map((feature, i) => <motion.article className="feature-card" key={feature.title} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }} whileHover={{ y: -5 }} transition={{ duration: .2 }}><div className={`feature-icon ${feature.tint}`}><feature.icon size={19}/></div><span className="feature-index">{String(i + 1).padStart(2,'0')}</span><h3>{feature.title}</h3><p>{feature.copy}</p><a href="#preview">Explore workflow <ArrowRight size={13}/></a></motion.article>)}</div><p className="feature-setup-note">Modules, templates and workflows can be configured to your hospital’s requirements. Email and SMS availability depends on your setup.</p></section>

      <section className="specialty-band" id="specialties"><div className="specialty-inner"><div className="specialty-copy"><span className="eyebrow">BUILT AROUND YOUR PRACTICE</span><h2>Every specialty has its own rhythm.</h2><p>Choose the modules you need. We’ll shape the system around how your team cares for patients.</p><button className="text-link" onClick={openDemo}>Find your fit <ArrowRight size={15}/></button></div><div className="specialty-list"><div><span>🦴</span><b>Orthopaedics</b><small>Joint care, implants &amp; follow-ups</small><ArrowUpRight size={15}/></div><div><span>🌿</span><b>Women’s health</b><small>ANC visits, delivery &amp; records</small><ArrowUpRight size={15}/></div><div><span>🦷</span><b>Dental care</b><small>Treatment plans &amp; installments</small><ArrowUpRight size={15}/></div><div><span>🏥</span><b>Multi-specialty</b><small>Teams, OPD queues &amp; wards</small><ArrowUpRight size={15}/></div><div><span>🩺</span><b>Surgery &amp; daycare</b><small>Pre-op, OT &amp; discharge</small><ArrowUpRight size={15}/></div></div></div></section>

      <section className="quote-section"><div className="quote-mark">“</div><div className="quote-copy"><span className="eyebrow">MADE FOR REAL CLINICAL WORK</span><blockquote>“Our team learned it in one sitting. Now the whole visit—from vitals to prescription—feels like one connected conversation.”</blockquote><div className="quote-by"><img className="quote-avatar" src="/doctors/doctor4.jpg" alt="Dr. Vipeen Raut" loading="lazy"/><span><b>Dr. Vipeen Raut</b><small>Consulting Orthopaedic Surgeon · Cortex Hospital</small></span><div className="quote-stars">★★★★★</div></div></div><div className="quote-art"><div className="quote-orbit"/><div className="quote-heart"><img src="/Svaasth_logo.png" alt="Svaasth HMS"/><b>Svaasth HMS</b></div><span className="quote-pill qp1"><Check size={13}/> Patient-first</span><span className="quote-pill qp2"><Zap size={13}/> Less busywork</span></div></section>

      <section className="doctor-reviews-section" aria-labelledby="doctor-reviews-heading"><div className="doctor-reviews-heading"><span className="eyebrow">HEALTHCARE PROFESSIONALS</span><h2 id="doctor-reviews-heading">Reviews from our doctors.</h2><p>Draft wording for each doctor to review and approve.</p></div><div className="doctor-review-grid">{doctorReviews.map((doctor)=><article className="doctor-review-card" key={doctor.photo}><div className="doctor-review-person"><img src={doctor.photo} alt={doctor.name} loading="lazy"/><div><b>{doctor.name}</b><small>{doctor.role}</small></div></div><p className="doctor-review-placeholder">{doctor.review || 'Add an approved review in src/data/doctor-reviews.json.'}</p></article>)}</div></section>

      <section className="roi-section"><div className="roi-copy"><span className="eyebrow">A LITTLE TIME ADDS UP</span><h2>Give your team back the good part of the day.</h2><p>Adjust the sliders to estimate the time your hospital could reclaim from repetitive admin.</p><div className="range-control"><label>Daily OPD patients <b>{patients} <small>patients / day</small></b></label><input type="range" min="10" max="150" step="5" value={patients} onChange={e => setPatients(Number(e.target.value))}/><div className="range-scale"><span>10</span><span>150</span></div></div><div className="range-control"><label>Monthly IPD admissions <b>{ipd} <small>admissions / month</small></b></label><input type="range" min="0" max="50" step="2" value={ipd} onChange={e => setIpd(Number(e.target.value))}/><div className="range-scale"><span>0</span><span>50</span></div></div></div><motion.div className="roi-result" key={hours} initial={{ opacity: .7, scale: .98 }} animate={{ opacity: 1, scale: 1 }}><span className="roi-spark"><Sparkles size={17}/></span><small>ESTIMATED TIME RECLAIMED</small><strong>{hours}<em> hrs</em></strong><span className="roi-per">per month, for your team</span><div className="roi-divider"/><div className="roi-note"><span><Clock3 size={15}/></span><p>That’s more time for thoughtful care, clear communication and a calmer clinic.</p></div></motion.div></section>

      <section id="pricing" className="section pricing-section"><div className="section-heading centered"><span className="eyebrow">CLEAR, UPFRONT PRICING</span><h2>Find your <span>right-sized plan.</span></h2><p>One-time setup, simple monthly hosting. No per-patient fees or surprise charges.</p></div><div className="pricing-grid">{[
        {name:'Clinic OPD',desc:'For independent clinics and single-doctor practices.',price:'₹25,000',monthly:'₹2,499',items:['Custom branding & logo','OPD queue and token slips','Digital prescription pad','Letterhead-ready printing','OPD receipts','Private cloud database'],popular:false},
        {name:'Multi-doctor',desc:'For specialty clinics, maternity homes and growing teams.',price:'₹45,000',monthly:'₹4,499',items:['Everything in Clinic OPD','Multi-doctor roster & fees','Clinical template library','WhatsApp & email sharing','Medicine and procedure catalog','Patient dues & installments'],popular:true},
        {name:'Full hospital',desc:'For hospitals bringing inpatient care into one view.',price:'₹75,000',monthly:'₹7,999',items:['Everything in Multi-doctor','Full inpatient suite','Bed and ward occupancy','Nursing and case records','Discharge summaries','Dedicated enterprise cloud'],popular:false},
      ].map(plan=><article className={plan.popular?'price-card featured':'price-card'} key={plan.name}>{plan.popular&&<span className="popular-tag">MOST POPULAR</span>}<span className="plan-kicker">{plan.popular?'FOR GROWING TEAMS':'Svaasth HMS'}</span><h3>{plan.name}</h3><p>{plan.desc}</p><div className="price"><strong>{plan.price}</strong><small>one-time setup</small></div><div className="monthly">+ {plan.monthly}/mo <span>hosting &amp; updates</span></div><div className="plan-rule"/ ><ul>{plan.items.map(item=><li key={item}><span><Check size={12}/></span>{item}</li>)}</ul><button className={plan.popular?'button':'button button-outline'} onClick={openDemo}>Let’s talk <ArrowRight size={14}/></button></article>)}</div></section>

      <section id="faq" className="faq-section"><div className="faq-inner"><div className="faq-intro"><span className="eyebrow">GOOD QUESTIONS</span><h2>Clarity before you begin.</h2><p>Have a question we haven’t answered? Our team is happy to talk through your workflow.</p><a href="https://wa.me/917796308778" target="_blank" rel="noreferrer" className="text-link">Chat with our team <ArrowRight size={14}/></a></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={faq===i?'faq-item expanded':'faq-item'} key={q}><button onClick={()=>setFaq(faq===i?null:i)}><span className="faq-number">0{i+1}</span><b>{q}</b><span className="faq-plus"><Plus size={16}/></span></button><AnimatePresence initial={false}>{faq===i&&<motion.div className="faq-answer" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}}><p>{a}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>

      <section className="final-cta"><div className="cta-orb orb-a"/><div className="cta-orb orb-b"/><div className="cta-content"><span className="eyebrow">A BETTER DAY STARTS HERE</span><h2>Experience a smarter way<br/>to <span>manage healthcare.</span></h2><p>See how Svaasth fits your hospital. A friendly, no-pressure walkthrough, built around your specialty.</p><div className="cta-buttons"><a className="button button-light" href="#preview">Explore Svaasth <ArrowRight size={16}/></a><button className="button button-cta-outline" onClick={openDemo}>Book a demo <ArrowRight size={16}/></button></div><div className="cta-meta"><span><Check size={14}/> 15 minutes</span><span><Check size={14}/> Your workflow</span><span><Check size={14}/> No commitment</span></div></div><div className="cta-art"><div className="cta-ring ring1"/><div className="cta-ring ring2"/><LogoOrbit/><div className="cta-float cf1"><Activity size={16}/><span>Care, connected</span></div><div className="cta-float cf2"><Check size={16}/><span>Connect to explore</span></div></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><a className="brand" href="#top" onClick={scrollToTop} aria-label="Svaasth HMS home"><img className="brand-lockup" src="/svaasth.png" alt="Svaasth HMS — Hospital Management System" /></a><p>Thoughtful technology for<br/>the people who care for us.</p><div className="footer-links"><a href="#features">Platform</a><a href="#preview">Product tour</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div><a className="footer-contact" href="https://wa.me/917796308778" target="_blank" rel="noreferrer"><MessageCircle size={15}/> Talk to our team <ArrowUpRight size={13}/></a></div><nav className="footer-legal-links" aria-label="Company information"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy policy</a><a href="/terms">Terms of use</a><a href="/refund-policy">Refunds &amp; cancellations</a></nav><div className="footer-bottom"><span>© {new Date().getFullYear()} Svaasth HMS · Built for Indian healthcare</span><span><ShieldCheck size={14}/> Care, connected</span><a href="tel:+917796308778">+91 77963 08778</a></div></footer>

    <AnimatePresence>{modal&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>e.target===e.currentTarget&&setModal(false)}><motion.div className="demo-modal" initial={{opacity:0,y:20,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:.98}}><button className="modal-close" onClick={()=>setModal(false)} aria-label="Close"><X size={18}/></button>{!submitted?<><span className="eyebrow">A FRIENDLY 15-MINUTE WALKTHROUGH</span><h2>Let’s see what fits.</h2><p>Tell us a little about your hospital and we’ll tailor the product tour to your team.</p><form onSubmit={submitDemo}><label>Hospital or clinic name<input required value={form.hospital} placeholder="e.g. Apex Multispeciality Hospital" onChange={e=>setForm({...form,hospital:e.target.value})}/></label><label>Doctor or contact person<input required value={form.doctor} placeholder="e.g. Dr. Ramesh Patil" onChange={e=>setForm({...form,doctor:e.target.value})}/></label><div className="form-row"><label>Phone / WhatsApp<input required type="tel" value={form.phone} placeholder="Your phone number" onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>City<input required value={form.city} placeholder="Your city" onChange={e=>setForm({...form,city:e.target.value})}/></label></div><label>Your specialty<select value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})}><option>Orthopaedics</option><option>Obstetrics & Gynecology</option><option>Dental Clinic</option><option>Multi-Specialty Hospital</option><option>General Surgery / Daycare</option><option>Other</option></select></label>{submitError&&<p className="form-submit-error" role="alert">{submitError} <a href="https://wa.me/917796308778" target="_blank" rel="noreferrer">Open WhatsApp</a></p>}<button className="button form-submit" type="submit" disabled={sending}>{sending?'Sending request…':'Send request'} <ArrowRight size={15}/></button></form><small className="form-privacy"><LockKeyhole size={12}/> Your details are only used to arrange your walkthrough.</small></>:<div className="success-state"><span><Check size={24}/></span><h2>Request received</h2><p>Thanks for reaching out. The Svaasth team will be in touch soon.</p><button className="button button-outline" onClick={()=>setModal(false)}>Done</button></div>}</motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>
      {showBackToTop && <motion.button className="back-to-top" type="button" aria-label="Back to top" title="Back to top" initial={{ opacity: 0, y: 12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .92 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} onClick={scrollToTop}><ArrowUp size={19}/></motion.button>}
    </AnimatePresence>
  </div>;
}

export default App;
