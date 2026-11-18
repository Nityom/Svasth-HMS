import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Download,
  FileText,
  LockKeyhole,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
  Menu,
  Star,
  TrendingUp,
  Bell,
  Activity
} from 'lucide-react';

/* ─────────────────────────── Types & Data ─────────────────────────── */
type WorkflowStep = {
  number: string;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  role: string;
  icon: React.ElementType;
  color: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    number: '01', tag: 'PATIENT OUTREACH',
    title: 'Instant 24/7 Patient Discovery & Chat Start',
    description: 'Patients initiate a conversation at any hour—by scanning a QR code at your clinic reception, tapping a link on Google Maps, or texting your verified clinic WhatsApp number. No new app download required.',
    highlights: ['Custom QR code standees for front-desk scanning', 'One-click WhatsApp link on Google Business & website', 'Instant automated greeting personalized to your clinic'],
    role: 'Patient Experience', icon: MessageCircle, color: '#25d366',
  },
  {
    number: '02', tag: 'APPOINTMENTS & SLOTS',
    title: 'Smart Automated Doctor Booking & Slot Selection',
    description: 'The intelligent assistant guides the patient through doctor profiles, specialties, and real-time open slots. The patient picks their preferred time, and the visit is booked in under 30 seconds.',
    highlights: ['Real-time doctor schedule and OPD timing sync', 'Multi-doctor and multi-specialty selection menu', 'Zero double-booking or front-desk phone queues'],
    role: 'Automated Scheduling', icon: Calendar, color: '#3b82f6',
  },
  {
    number: '03', tag: 'HMS SYNC & TOKEN',
    title: 'Instant Svaasth HMS Sync & Live OPD Token',
    description: 'The booking is instantly pushed into your Svaasth HMS dashboard. If the patient is new, a unique UHID is automatically created. A digital token slip with date, time, and room number is sent to the patient.',
    highlights: ['Two-way real-time synchronization with Svaasth HMS', 'Digital token slip with QR verification', 'Receptionist dashboard updates immediately without manual data entry'],
    role: 'Reception Automation', icon: Zap, color: '#f59e0b',
  },
  {
    number: '04', tag: 'QUEUE UPDATES',
    title: 'Real-Time OPD Queue Alerts',
    description: 'Keep patients informed about clinic delays or live queue progress. Svaasth Connect sends proactive alerts: "Dr. Sharma is on Token #02. 2 patients ahead of you. Please reach Room 02 by 10:25 AM."',
    highlights: ['Cuts waiting room crowding and patient frustration', 'Patients can wait safely in their vehicle or nearby café', 'Dynamic delay notices if an emergency surgery occurs'],
    role: 'Queue Optimization', icon: Bell, color: '#8b5cf6',
  },
  {
    number: '05', tag: 'RECORDS DELIVERY',
    title: 'One-Tap Digital Prescriptions & Lab Reports',
    description: "As soon as the doctor finalizes consultation notes or the lab marks tests ready in Svaasth, high-resolution, letterhead-branded PDF documents are securely delivered to the patient's WhatsApp.",
    highlights: ['Official letterhead PDF prescriptions sent automatically', 'Diagnostic lab test results & blood reports delivered instantly', "Encrypted and stored permanently in patient's WhatsApp history"],
    role: 'Clinical Handover', icon: FileText, color: '#ec4899',
  },
  {
    number: '06', tag: 'POST-CARE RETENTION',
    title: 'Automated Medication & Follow-Up Reminders',
    description: "Never lose a patient to forgotten follow-ups. Svaasth Connect schedules automated reminders at 3 days, 7 days, or 1 month based on the doctor's treatment plan, with interactive confirmation buttons.",
    highlights: ['65% reduction in appointment no-show rates', 'Interactive confirmation, reschedule, or cancel buttons', 'Proactive care instructions & dosage reminders'],
    role: 'Patient Retention', icon: TrendingUp, color: '#14b8a6',
  },
];

const connectFaqs = [
  { q: 'Can we use our existing clinic phone number for Svaasth Connect?', a: 'Yes! You can use your existing landline or mobile number, provided it is not currently registered on a standard personal WhatsApp account. If it is already on WhatsApp, we assist you in safely migrating or allocating a dedicated official business number.' },
  { q: 'Do patients need to install any new app?', a: 'Not at all. Everything works directly inside standard WhatsApp, which over 500 million people in India already use daily. Patients do not need to download, update, or learn any separate mobile application.' },
  { q: 'How does Svaasth Connect integrate with our clinic or hospital HMS?', a: "Svaasth Connect is natively engineered for Svaasth HMS. Every appointment booked on WhatsApp instantly reflects on your receptionist's token board, doctor's consultation roster, and patient records with zero manual data entry." },
  { q: 'What is included in the ₹15,000 setup fee?', a: 'The one-time setup fee covers Meta WhatsApp Business Cloud API account registration, business verification guidance (for the official green tick), dedicated webhook deployment, clinic chatbot script customization, Svaasth HMS bidirectional integration, staff onboarding, and initial testing.' },
  { q: 'What does the ₹10,000 annual charge cover?', a: 'The ₹10,000 annual maintenance fee covers dedicated cloud server hosting for WhatsApp webhooks, 99.9% uptime SLA, ongoing Meta API version upgrades, template updates, and priority technical support throughout the year.' },
  { q: 'Are WhatsApp conversation charges included?', a: 'Meta charges nominal per-conversation fees for business-initiated and user-initiated messages under its standard WhatsApp Business API pricing (typically a few paise per conversation in India). These are passed through transparently at actuals directly to your Meta billing account.' },
  { q: 'How long does implementation take?', a: 'Typically 2 to 4 business days once Meta business verification documents are submitted. We handle all technical configuration so your clinic can start receiving automated WhatsApp bookings without disruption.' },
];

/* ─────────────────────────── Animated Counter ─────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─────────────────────────── Floating Particle ─────────────────────────── */
function FloatingParticle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(1px)' }}
      animate={{ y: [-8, 8, -8], opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function SvaasthConnect() {
  const [activeTab, setActiveTab] = useState<'booking' | 'queue' | 'prescription' | 'reminder'>('booking');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [modal, setModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({ hospital: '', doctor: '', phone: '', city: '', specialty: 'Multispecialty Clinic' });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const openDemo = () => { setModal(true); setSubmitted(false); setSubmitError(''); };

  const submitDemo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setSubmitError('');
    try {
      const response = await fetch('https://formsubmit.co/ajax/nityomtikherr@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.hospital,
          _subject: `New Svaasth Connect (WhatsApp) Demo Request — ${form.hospital}`,
          _template: 'table',
          Product: 'Svaasth Connect for WhatsApp',
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
      setSubmitError("We couldn't send your request just now. Please try again or chat directly on WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }),
  };

  return (
    <div className="bg-[#f8faf8] text-[#173d37] min-h-screen flex flex-col font-sans overflow-x-hidden">

      {/* ── Announcement Bar ── */}
      <div className="bg-gradient-to-r from-[#176e56] via-[#1a8463] to-[#176e56] text-white py-2 px-4 flex items-center justify-center gap-2 text-xs font-medium">
        <motion.span className="w-2 h-2 rounded-full bg-[#25d366] inline-block" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <span>Official Meta WhatsApp Business Cloud API Integration</span>
        <span className="opacity-50 mx-1">·</span>
        <b className="font-bold">Zero manual typing · 100% Svaasth HMS Sync</b>
        <ArrowRight size={12} className="ml-1 opacity-70" />
      </div>

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#e5ece6]/80 h-[70px] px-4 md:px-8 flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-2" aria-label="Svaasth HMS home">
          <img className="h-9 w-auto object-contain" src="/svaasth.png" alt="Svaasth HMS" />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-[12.5px] font-semibold text-[#5a6e64]">
          <a href="/" className="hover:text-[#187556] transition-colors">← Full Platform</a>
          <a href="#workflow" className="hover:text-[#187556] transition-colors">Workflow</a>
          <a href="#demo" className="hover:text-[#187556] transition-colors">Demo</a>
          <a href="#pricing" className="hover:text-[#187556] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#187556] transition-colors">FAQ</a>
         
        </nav>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="tel:+917796308778" className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-[#3b5c50] hover:text-[#176e56]">
            <Phone size={13} />+91 77963 08778
          </a>
          <motion.button onClick={openDemo} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 bg-[#176e56] hover:bg-[#115643] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#176e56]/30 transition-colors">
            <span>Get WhatsApp Setup</span><ArrowRight size={13} />
          </motion.button>
          <button className="md:hidden p-2 text-[#214b40] rounded-lg hover:bg-[#eef5f0]" onClick={() => setMenu(!menu)}>
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-[#e5ece6] px-5 py-4 flex flex-col gap-3 text-sm font-semibold text-[#445b50] shadow-lg z-30">
            {(['/', '#workflow', '#demo', '#pricing', '#faq'] as const).map((href, i) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="py-2 border-b border-[#eef3ef] last:border-0">
                {['Home / Full HMS', 'Connect Workflow', 'Interactive Demo', 'Pricing', 'FAQ'][i]}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-[#25d366]/15 to-[#176e56]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#176e56]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <FloatingParticle delay={0} x="10%" y="20%" size={8} color="#25d36660" />
        <FloatingParticle delay={1.5} x="85%" y="15%" size={6} color="#176e5660" />
        <FloatingParticle delay={3} x="70%" y="75%" size={10} color="#25d36640" />
        <FloatingParticle delay={2} x="20%" y="80%" size={5} color="#176e5650" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#e8f7ee] to-[#f0faf4] border border-[#cbead6] text-[#1c7855] text-xs font-bold tracking-wide mb-6">
              <motion.span className="w-2 h-2 rounded-full bg-[#25d366] inline-block" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              OFFICIAL WHATSAPP BUSINESS API FOR CLINICS &amp; HOSPITALS
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#163d35] leading-[1.05] mb-6 font-['Manrope']">
              Svaasth Connect
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#25a969] to-[#1db954] bg-clip-text text-transparent">for WhatsApp</span>
                <motion.svg className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 300 12"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <motion.path d="M 0 8 Q 75 2 150 8 Q 225 14 300 8" stroke="#25d366" strokeWidth="2.5" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base md:text-lg text-[#556c60] leading-relaxed max-w-xl mb-8">
              Turn WhatsApp into your clinic's <strong className="text-[#1a4a3a]">24/7 automated receptionist</strong>. Enable instant appointment bookings, live OPD token updates, digital prescriptions, lab reports, and personalized follow-up care directly inside the app your patients already use.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <motion.button onClick={openDemo} whileHover={{ scale: 1.03, y: -2, boxShadow: '0 20px 40px rgba(23,110,86,0.35)' }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#176e56] to-[#1a8463] text-white px-7 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-[#176e56]/25 transition-all">
                <span>Get Svaasth Connect Setup</span><ArrowRight size={16} />
              </motion.button>
              <motion.a href="https://wa.me/917796308778?text=Hi%20Svaasth%20team,%20I%20am%20interested%20in%20Svaasth%20Connect%20for%20WhatsApp." target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f1f7f3] border border-[#d2ded6] text-[#245b49] px-7 py-4 rounded-2xl text-sm font-bold shadow-sm transition-all">
                <MessageCircle size={17} className="text-[#25d366]" /><span>Chat With Our Team</span>
              </motion.a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-[#e2ece5] text-xs font-semibold text-[#486b5c]">
              {['Official Meta Cloud WhatsApp API', '24/7 Automated OPD Receptionist', 'Zero Patient App Downloads'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#e5f5ea] flex items-center justify-center"><Check className="text-[#176e56]" size={11} /></span>
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Hero Phone */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.88, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }} className="relative w-full max-w-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#25d366]/20 to-[#176e56]/20 rounded-[36px] blur-2xl scale-105" />
              <div className="relative bg-[#1a2320] rounded-[40px] p-3 shadow-2xl shadow-[#0a1f17]/40">
                <div className="relative h-7 flex items-center justify-center">
                  <div className="w-20 h-5 bg-[#0d1a14] rounded-full" />
                </div>
                <div className="bg-white rounded-[30px] overflow-hidden">
                  {/* WA Header */}
                  <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🏥</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <b className="text-sm font-bold">Apex Hospital</b>
                          <span className="w-4 h-4 rounded-full bg-[#25d366] flex items-center justify-center text-[9px] font-bold">✓</span>
                        </div>
                        <span className="text-[10px] text-emerald-200">Official Hospital Assistant · Online</span>
                      </div>
                    </div>
                    <div className="text-lg opacity-70">⋮</div>
                  </div>
                  {/* Chat */}
                  <div className="p-3 bg-[#efeae2] min-h-[300px] space-y-2.5 text-xs">
                    <div className="text-center"><span className="bg-white/70 text-[#697a70] text-[9px] px-2 py-0.5 rounded-md shadow-sm">Today</span></div>
                    <motion.div className="flex justify-end" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                      <div className="bg-[#d9fdd3] text-[#111] p-2.5 rounded-2xl rounded-tr-sm max-w-[82%] shadow-sm">
                        <p>Book with Dr. Sharma — joint pain</p>
                        <span className="block text-[9px] text-[#667781] text-right mt-1">10:14 AM ✓✓</span>
                      </div>
                    </motion.div>
                    <motion.div className="flex justify-start" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                      <div className="bg-white text-[#111] p-3 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm space-y-2">
                        <p className="font-semibold text-[#186047] text-[11px]">Dr. Rajesh Sharma (Orthopaedics) — slots today:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="bg-[#f0fdf4] border border-[#86efac] text-[#166534] py-1.5 px-2 rounded-lg font-bold text-[10px] text-center">📅 11:30 AM</div>
                          <div className="bg-[#f0fdf4] border border-[#86efac] text-[#166534] py-1.5 px-2 rounded-lg font-bold text-[10px] text-center">📅 4:00 PM</div>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div className="flex justify-start" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
                      <div className="bg-[#eaf4ee] text-[#1b4a39] p-3 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm border border-[#bbf7d0]">
                        <div className="flex items-center gap-1.5 text-[#15803d] font-bold text-[10px] mb-1.5"><CheckCheck size={13} />APPOINTMENT CONFIRMED</div>
                        <p className="text-[10px] leading-relaxed">Token: <b>#04</b> · UHID: <b>CRX-1042</b><br />Patient: <b>Anaya Deshmukh</b><br />Time: <b>Today, 11:30 AM — Room 02</b></p>
                        <div className="mt-2 flex items-center gap-1 text-[9px] text-[#15803d]"><Activity size={9} />Auto-synced to Svaasth HMS</div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="bg-[#f0f2f5] p-2.5 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-[#8696a0]">Type a message...</div>
                    <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center"><Send size={13} /></div>
                  </div>
                </div>
                <div className="h-5 flex items-center justify-center mt-1"><div className="w-20 h-1 bg-white/25 rounded-full" /></div>
              </div>

              {/* Floating chips */}
              <motion.div className="absolute -right-8 top-20 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-[#e5ece6] flex items-center gap-2 z-10"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} whileHover={{ scale: 1.05 }}>
                <span className="w-8 h-8 bg-[#e5f5ea] rounded-xl flex items-center justify-center text-[#176e56]"><ShieldCheck size={16} /></span>
                <div><b className="block text-[10px] text-[#1a4a3a]">End-to-End</b><span className="text-[9px] text-[#6b8075]">Encrypted</span></div>
              </motion.div>
              <motion.div className="absolute -left-10 bottom-24 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-[#e5ece6] flex items-center gap-2 z-10"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }} whileHover={{ scale: 1.05 }}>
                <span className="w-8 h-8 bg-[#fef3c7] rounded-xl flex items-center justify-center text-[#d97706]"><Zap size={16} /></span>
                <div><b className="block text-[10px] text-[#1a4a3a]">30 Seconds</b><span className="text-[9px] text-[#6b8075]">to book</span></div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ STATS STRIP ══════════════════ */}
      <section className="bg-gradient-to-r from-[#176e56] via-[#1a8463] to-[#176e56] py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {[
            { value: 500, suffix: 'M+', label: 'WhatsApp users in India' },
            { value: 65, suffix: '%', label: 'Reduction in no-shows' },
            { value: 30, suffix: 's', label: 'Booking time' },
            { value: 99, suffix: '%+', label: 'Uptime SLA' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl md:text-4xl font-black font-['Manrope'] text-white mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs font-medium text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ FEATURES GRID ══════════════════ */}
      <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#2ca26c] uppercase bg-[#e8f7ee] border border-[#cbead6] px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} />Why WhatsApp Automation
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] mt-2 mb-4 font-['Manrope'] tracking-tight">
            Why Indian hospitals choose{' '}
            <span className="bg-gradient-to-r from-[#25a969] to-[#176e56] bg-clip-text text-transparent">Svaasth Connect</span>
          </h2>
          <p className="text-sm md:text-base text-[#657d71] max-w-xl mx-auto leading-relaxed">Over 95% of Indians read WhatsApp messages within 3 minutes. Turn that habit into booked appointments.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: '24/7 Self-Service Booking', desc: 'Patients can book, reschedule, or check doctor availability even after clinic hours without calling reception staff.', color: '#3b82f6', bg: '#eff6ff', delay: 0 },
            { icon: Clock, title: 'Live OPD Queue & Token Alerts', desc: 'Keep patients informed of their exact token position and estimated consult time to prevent crowded waiting rooms.', color: '#8b5cf6', bg: '#f5f3ff', delay: 0.1 },
            { icon: FileText, title: 'Instant Letterhead Rx Delivery', desc: "Automatically send doctors' digital prescriptions and billing receipts in official hospital PDF format right after the visit.", color: '#ec4899', bg: '#fdf2f8', delay: 0.2 },
            { icon: RefreshCw, title: '65% Reduction in No-Shows', desc: 'Automated 24h & 2h appointment reminders with one-tap confirm/cancel buttons drastically decrease empty clinic slots.', color: '#14b8a6', bg: '#f0fdfa', delay: 0.3 },
            { icon: ShieldCheck, title: 'Official Green Tick Verification', desc: 'Operate on your official clinic landline or mobile with Meta Business verification, building patient trust and legitimacy.', color: '#25d366', bg: '#f0fdf4', delay: 0.4 },
            { icon: Zap, title: 'Bidirectional Svaasth HMS Sync', desc: 'Appointments, patient profiles, consultation records, and billing receipts flow effortlessly between WhatsApp and Svaasth.', color: '#f59e0b', bg: '#fffbeb', delay: 0.5 },
          ].map((feature) => (
            <motion.div key={feature.title}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(23,61,55,0.12)' }}
              className="p-6 rounded-2xl border border-[#e4ece5] bg-white hover:border-transparent transition-all duration-300 cursor-default group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: feature.bg, color: feature.color }}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-base font-bold text-[#1d463a] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#667d71] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ WORKFLOW ══════════════════ */}
      <section id="workflow" className="py-20 md:py-28 bg-gradient-to-b from-[#f4f8f5] to-white border-t border-[#e5ede6]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div className="text-center max-w-3xl mx-auto mb-20" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f6ed] text-[#227956] text-xs font-bold tracking-wider uppercase mb-4 border border-[#cbead6]">
              <Sparkles size={12} />END-TO-END AUTOMATION FLOW
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#173d35] tracking-tight font-['Manrope'] mb-4">
              How the Svaasth Connect{' '}
              <span className="bg-gradient-to-r from-[#176e56] to-[#25a969] bg-clip-text text-transparent">workflow operates</span>
            </h2>
            <p className="text-sm md:text-base text-[#61776c]">A seamless journey connecting patient convenience with your hospital's front desk, doctor consultation room, and pharmacy.</p>
          </motion.div>

          <div className="space-y-8">
            {workflowSteps.map((step, idx) => (
              <motion.div key={step.number}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}>
                <motion.div whileHover={{ y: -4, boxShadow: '0 24px 48px rgba(23,61,55,0.12)' }}
                  className="bg-white border border-[#e2ebe4] rounded-3xl p-7 shadow-sm transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Number & role */}
                  <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-[#edf3ee] pb-4 lg:pb-0 lg:pr-6">
                    <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: step.color + '18', color: step.color }}>
                        <step.icon size={22} />
                      </div>
                      <span className="text-5xl font-black font-['Manrope'] leading-none opacity-15 text-[#173d35] hidden lg:block select-none">{step.number}</span>
                    </div>
                    <div className="text-right lg:text-left mt-0 lg:mt-2">
                      <span className="block text-[10px] font-black tracking-widest uppercase" style={{ color: step.color }}>{step.tag}</span>
                      <span className="inline-block mt-1 text-xs font-bold text-[#1f664b] bg-[#eaf6ee] px-2.5 py-0.5 rounded-full">{step.role}</span>
                    </div>
                  </div>

                  {/* Title & desc */}
                  <div className="lg:col-span-5">
                    <h3 className="text-lg md:text-xl font-bold text-[#1a4237] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#61776c] leading-relaxed">{step.description}</p>
                  </div>

                  {/* Highlights */}
                  <div className="lg:col-span-4 bg-[#f8faf8] border border-[#e7efe9] rounded-2xl p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#738a7e] mb-3">System Actions</span>
                    <ul className="space-y-2">
                      {step.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-[#416254]">
                          <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: step.color + '20', color: step.color }}>
                            <Check size={10} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ INTERACTIVE DEMO ══════════════════ */}
      <section id="demo" className="py-20 md:py-28 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#edf5f0] to-[#f8faf8]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#25d366]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#176e56]/8 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#24895b] uppercase bg-white border border-[#cbead6] px-3 py-1 rounded-full mb-4">
              <Activity size={12} />Interactive Experience
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] mt-2 mb-3 font-['Manrope'] tracking-tight">Try the patient conversation flow</h2>
            <p className="text-sm md:text-base text-[#61786c]">Select a scenario below to preview exactly what your patients experience on WhatsApp.</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'booking', label: 'Appointment Booking', icon: Calendar },
                { id: 'queue', label: 'OPD Token Alert', icon: Bell },
                { id: 'prescription', label: 'Digital Prescription', icon: FileText },
                { id: 'reminder', label: 'Follow-Up Reminder', icon: Clock },
              ].map((tab) => (
                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-[#176e56] to-[#1a8463] text-white shadow-lg shadow-[#176e56]/25' : 'bg-white text-[#466657] border border-[#d2ded6] hover:bg-[#f6faf7]'}`}>
                  <tab.icon size={13} />{tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="max-w-sm mx-auto">
            <motion.div className="bg-[#1a2320] rounded-[40px] p-3 shadow-2xl shadow-[#0a1f17]/50" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative h-7 flex items-center justify-center">
                <div className="w-24 h-5 bg-[#0d1a14] rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              </div>
              <div className="bg-white rounded-[30px] overflow-hidden">
                <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">🏥</div>
                    <div>
                      <div className="flex items-center gap-1"><b className="text-xs font-bold">Apex Multispeciality Hospital</b><span className="w-3.5 h-3.5 rounded-full bg-[#25d366] flex items-center justify-center text-[8px]">✓</span></div>
                      <span className="text-[10px] text-emerald-200">Official Hospital Assistant</span>
                    </div>
                  </div>
                  <div className="text-sm opacity-70">⋮</div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    className="p-3 bg-[#efeae2] min-h-[380px] space-y-2.5 text-xs overflow-y-auto">
                    <div className="text-center my-1"><span className="bg-white/70 text-[#697a70] text-[9px] px-2 py-0.5 rounded-md">Today</span></div>

                    {activeTab === 'booking' && (
                      <>
                        <div className="flex justify-end"><div className="bg-[#d9fdd3] text-[#111] p-2.5 rounded-lg rounded-tr-none max-w-[80%] shadow-sm"><p>Hi, I want to book an appointment with Dr. Sharma for joint pain</p><span className="block text-[9px] text-[#667781] text-right mt-1">10:02 AM ✓✓</span></div></div>
                        <div className="flex justify-start"><div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[90%] shadow-sm space-y-2"><p>Hello! Welcome to Apex Hospital. Found <b>Dr. Rajesh Sharma</b> (Orthopaedics). Choose your slot:</p><div className="space-y-1 pt-1"><div className="p-2 border border-[#d2ded6] rounded-md font-semibold text-[#176e56] bg-[#f8faf8] text-center text-[10px]">📅 Today, 11:30 AM (Token #04)</div><div className="p-2 border border-[#d2ded6] rounded-md font-semibold text-[#176e56] bg-[#f8faf8] text-center text-[10px]">📅 Today, 04:30 PM (Token #12)</div></div><span className="block text-[9px] text-[#667781]">10:02 AM</span></div></div>
                        <div className="flex justify-end"><div className="bg-[#d9fdd3] text-[#111] p-2 rounded-lg rounded-tr-none max-w-[70%] shadow-sm"><p className="font-medium">Selected: Today, 11:30 AM</p><span className="block text-[9px] text-[#667781] text-right mt-1">10:03 AM ✓✓</span></div></div>
                        <div className="flex justify-start"><div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[90%] shadow-sm"><div className="flex items-center gap-1.5 text-[#176e56] font-bold text-[11px] mb-1"><span>✅</span> Booking Confirmed!</div><p className="leading-relaxed text-[10px]"><b>UHID:</b> CRX-1042<br /><b>Patient:</b> Anaya Deshmukh<br /><b>OPD Token:</b> #04 (Room 02)<br /><b>Fee:</b> ₹400</p><div className="mt-2 p-1.5 bg-[#f4f7f5] rounded text-[9px] text-[#426154]">ℹ️ Live updates will be sent when your turn approaches.</div><span className="block text-[9px] text-[#667781] text-right mt-1">10:03 AM</span></div></div>
                      </>
                    )}
                    {activeTab === 'queue' && (
                      <>
                        <div className="flex justify-start"><div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[90%] shadow-sm space-y-2"><div className="flex items-center gap-1 text-[#ea580c] font-bold text-[10px]"><span>🔔</span> LIVE OPD QUEUE NOTIFICATION</div><p className="leading-relaxed">Dr. Sharma is currently examining <b>Token #02</b>.<br />There is <b>1 patient</b> ahead of you.</p><div className="p-2 bg-[#fff7ed] border border-[#ffedd5] rounded-lg text-[#9a3412] text-[10px]">⏱️ Estimated consultation: <b>11:25 AM</b>. Please proceed to <b>OPD Floor 1, Room 02</b>.</div><span className="block text-[9px] text-[#667781]">11:15 AM</span></div></div>
                        <div className="flex justify-end"><div className="bg-[#d9fdd3] text-[#111] p-2 rounded-lg rounded-tr-none max-w-[70%] shadow-sm"><p>Thank you! Waiting outside Room 02 now.</p><span className="block text-[9px] text-[#667781] text-right mt-1">11:18 AM ✓✓</span></div></div>
                      </>
                    )}
                    {activeTab === 'prescription' && (
                      <div className="flex justify-start"><div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[90%] shadow-sm space-y-2.5"><p>Thank you for visiting Apex Hospital. Dr. Rajesh Sharma has issued your digital prescription:</p><div className="p-2.5 bg-[#f1f5f2] border border-[#dce6df] rounded-xl flex items-center justify-between gap-3"><div className="flex items-center gap-2 min-w-0"><div className="w-9 h-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-[10px] shrink-0">PDF</div><div className="truncate"><b className="block truncate text-[11px] text-[#1f3d32]">Rx_Anaya_Deshmukh_28Oct.pdf</b><span className="text-[9px] text-[#788e82]">2 pages · 142 KB</span></div></div><button className="p-1.5 rounded-full bg-white shadow-sm text-[#176e56]"><Download size={13} /></button></div><div className="text-[10px] text-[#4c695b] space-y-0.5 pt-1"><div>💊 <b>Medicines:</b> 3 prescribed</div><div>🗓️ <b>Next Follow-up:</b> Wednesday, 4 Nov</div></div><span className="block text-[9px] text-[#667781]">11:45 AM</span></div></div>
                    )}
                    {activeTab === 'reminder' && (
                      <div className="flex justify-start"><div className="bg-white text-[#111] p-3.5 rounded-lg rounded-tl-none max-w-[90%] shadow-sm space-y-2.5"><p>Namaste Anaya ji! Hope you are recovering well from your knee treatment.</p><p>This is a reminder for your <b>7-day follow-up</b> with Dr. Rajesh Sharma on <b>Wednesday, 4 Nov at 11:00 AM</b>.</p><div className="space-y-1.5 pt-1"><button className="w-full py-2 px-3 bg-[#e8f7ee] border border-[#c4e9d2] text-[#187556] rounded-lg font-bold text-center text-[10px]">✅ Confirm Appointment</button><button className="w-full py-2 px-3 bg-white border border-[#d2ded6] text-[#4d6a5c] rounded-lg font-medium text-center text-[10px]">🔄 Reschedule Date</button></div><span className="block text-[9px] text-[#667781]">09:00 AM</span></div></div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="bg-[#f0f2f5] p-2.5 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-[#8696a0]">Type a message...</div>
                  <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center"><Send size={13} /></div>
                </div>
              </div>
              <div className="h-5 flex items-center justify-center mt-1"><div className="w-20 h-1 bg-white/25 rounded-full" /></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section id="pricing" className="py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#24895b] uppercase bg-[#e8f7ee] border border-[#cbead6] px-3 py-1 rounded-full mb-4">
              <Star size={12} />Transparent &amp; Predictable
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] tracking-tight mt-2 mb-3 font-['Manrope']">
              Svaasth Connect{' '}
              <span className="bg-gradient-to-r from-[#176e56] to-[#25a969] bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-sm md:text-base text-[#61796d]">Complete turnkey implementation with zero hidden surcharges.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-white border-2 border-[#176e56]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#176e56]/10">
            <div className="h-1.5 bg-gradient-to-r from-[#25d366] via-[#176e56] to-[#25d366]" />
            <div className="p-8 md:p-12">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1.5 bg-[#eaf7ee] text-[#1c7855] border border-[#c3ebd0] text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  <Star size={11} />Official Healthcare Plan
                </span>
              </div>

              <div className="max-w-lg mb-10">
                <span className="text-xs font-bold text-[#718b7f] tracking-wider uppercase">COMPLETE INTEGRATION</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#163d35] font-['Manrope'] mt-1">Svaasth Connect for WhatsApp</h3>
                <p className="text-sm text-[#667e72] mt-2">For single-doctor clinics, polyclinics, nursing homes, and growing hospitals.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-br from-[#f6f9f7] to-[#eef5f1] border border-[#e2ede6] mb-10">
                <motion.div whileHover={{ scale: 1.02 }} className="transition-transform">
                  <span className="block text-xs font-bold text-[#758e82] uppercase tracking-wider mb-2">Setup Fee</span>
                  <div className="text-5xl md:text-6xl font-black text-[#174e3e] font-['Manrope'] tracking-tight">₹15,000</div>
                  <p className="text-xs text-[#527062] mt-2 font-medium">One-time setup &amp; onboarding</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="sm:border-l sm:border-[#e2ede6] sm:pl-6 transition-transform">
                  <span className="block text-xs font-bold text-[#758e82] uppercase tracking-wider mb-2">Annual Charge</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black text-[#174e3e] font-['Manrope'] tracking-tight">₹10,000</span>
                    <span className="text-sm text-[#758e82]">/yr</span>
                  </div>
                  <p className="text-xs text-[#527062] mt-2 font-medium">Cloud hosting &amp; updates</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {[
                  { title: "What's in the ₹15,000 Setup:", items: ['Official Meta WhatsApp Business Cloud API account creation', 'Hospital green tick verification assistance', 'Clinic phone number registration & porting guidance', 'Bidirectional webhook sync with your Svaasth HMS instance', 'Custom clinical templates & interactive chat tree setup', 'Staff walkthrough, reception training & test dry-run'] },
                  { title: "What's in the ₹10,000 Annual Charge:", items: ['Dedicated high-speed cloud webhook hosting & server maintenance', 'Meta WhatsApp API continuous version upgrades & policy compliance', 'Template edits, timing modifications & doctor roster adjustments', '99.9% uptime SLA for patient appointment webhooks', 'Priority phone & WhatsApp technical support for your team', 'Seamless automatic updates alongside Svaasth HMS features'] },
                ].map((section) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-extrabold text-[#1c4d3d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e7efe9]">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#456355]">
                          <span className="w-5 h-5 rounded-full bg-[#eaf6ee] flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-[#25a969]" /></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#fffbeb] border border-[#fde68a] rounded-2xl text-sm text-[#78624a] mb-8 leading-relaxed">
                <b>Note on WhatsApp conversation charges:</b> Standard Meta Business Platform conversation rates (billed directly by Meta at actuals, typically a few paise per conversation in India) apply. No markups added by Svaasth.
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <motion.button onClick={openDemo} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#176e56] to-[#1a8463] text-white py-4 px-8 rounded-2xl font-bold text-sm shadow-xl shadow-[#176e56]/25 transition-all text-center">
                  Get Started with Svaasth Connect <ArrowRight size={16} className="ml-2 inline" />
                </motion.button>
                <motion.a href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20Svaasth%20Connect%20for%20WhatsApp." target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#d2ded6] bg-white hover:bg-[#f1f7f3] text-[#245b49] py-4 px-6 rounded-2xl font-bold text-sm transition-all">
                  <MessageCircle size={16} className="text-[#25d366]" />Talk on WhatsApp
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-[#f4f7f4] to-[#f8faf8] border-t border-[#e2ebe4]">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#24895b] uppercase bg-[#e8f7ee] border border-[#cbead6] px-3 py-1 rounded-full mb-4">Got Questions?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] mt-2 mb-3 font-['Manrope'] tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm md:text-base text-[#61786c]">Everything you need to know about setting up Svaasth Connect.</p>
          </motion.div>

          <div className="space-y-3">
            {connectFaqs.map((faq, index) => (
              <motion.div key={faq.q} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}
                className="bg-white border border-[#e3eae4] rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md hover:border-[#c5e4d0]">
                <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#1b4337] hover:text-[#176e56] transition-colors">
                  <span>{faq.q}</span>
                  <motion.span animate={{ rotate: expandedFaq === index ? 45 : 0 }} transition={{ duration: 0.2 }}
                    className="w-7 h-7 rounded-full bg-[#eef5f0] text-[#1c7855] flex items-center justify-center shrink-0">
                    <Plus size={15} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as any }} className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm text-[#5a7366] leading-relaxed border-t border-[#f1f5f2] pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section className="relative overflow-hidden py-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f3d2d] via-[#1b5e48] to-[#0d2e21]" />
        <motion.div className="absolute w-96 h-96 rounded-full bg-[#25d366]/10 blur-3xl" style={{ top: '-10%', right: '-5%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute w-80 h-80 rounded-full bg-[#176e56]/20 blur-3xl" style={{ bottom: '-10%', left: '10%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="inline-block text-xs font-bold tracking-widest text-[#9ed6b0] uppercase mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
              UPGRADE YOUR PATIENT COMMUNICATION
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold font-['Manrope'] tracking-tight mb-6 text-white leading-tight">
              Ready to connect your clinic
              <br />
              <span className="bg-gradient-to-r from-[#25d366] to-[#86efac] bg-clip-text text-transparent">with WhatsApp?</span>
            </h2>
            <p className="text-sm md:text-lg text-[#c4dfcd] max-w-2xl mx-auto mb-10 leading-relaxed">
              Join forward-thinking healthcare providers in India using Svaasth Connect. Setup takes just 48–72 hours with complete guidance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {[{ icon: ShieldCheck, label: 'Official Meta API' }, { icon: Zap, label: '48hr Setup' }, { icon: Users, label: '99.9% Uptime SLA' }].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[#9fd6b0] text-sm"><item.icon size={16} /><span className="font-semibold">{item.label}</span></div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button onClick={openDemo} whileHover={{ scale: 1.04, y: -3, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.97 }}
                className="bg-white text-[#175c46] hover:bg-[#f6faf7] font-bold text-sm px-10 py-4 rounded-2xl shadow-xl transition-all">
                Get Svaasth Connect Setup <ArrowRight size={16} className="ml-2 inline" />
              </motion.button>
              <motion.a href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20get%20started%20with%20Svaasth%20Connect." target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2 backdrop-blur-sm">
                <MessageCircle size={17} className="text-[#25d366]" />Chat on WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#fbfcfa] py-8 px-4 md:px-8 border-t border-[#e5ece6]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6e8578]">
          <div className="flex items-center gap-3">
            <a href="/"><img src="/svaasth.png" alt="Svaasth HMS" className="h-7 w-auto object-contain" /></a>
            <span className="text-[#a4b4ab]">|</span>
            <span>Svaasth Connect for WhatsApp</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            {[['/', 'Home'], ['/#features', 'Platform'], ['/#preview', 'Product Tour'], ['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy Policy']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#176e56] transition-colors">{label}</a>
            ))}
          </div>
          <div>© {new Date().getFullYear()} Svaasth HMS · Built for Indian healthcare</div>
        </div>
      </footer>

      {/* ══════════════════ DEMO MODAL ══════════════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 bg-[#173d35]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="bg-white border border-[#e4ece5] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 32, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#25d366] via-[#176e56] to-[#25d366] rounded-t-3xl" />
              <button className="absolute top-5 right-5 w-8 h-8 bg-[#f6f9f6] border border-[#e7eee8] rounded-xl text-[#6c8276] hover:text-[#173d35] flex items-center justify-center transition-colors"
                onClick={() => setModal(false)} aria-label="Close"><X size={16} /></button>

              {!submitted ? (
                <>
                  <span className="text-xs font-bold text-[#238558] tracking-wider uppercase">SVAASTH CONNECT WALKTHROUGH</span>
                  <h2 className="text-2xl font-extrabold text-[#1a4235] mt-1 mb-2 font-['Manrope']">Get Svaasth Connect</h2>
                  <p className="text-sm text-[#667e72] mb-6">Tell us about your clinic to schedule a personalized WhatsApp automation walkthrough.</p>

                  <form onSubmit={submitDemo} className="space-y-4">
                    {[
                      { label: 'Hospital or Clinic Name', key: 'hospital', placeholder: 'e.g. Apex Multispeciality Hospital' },
                      { label: 'Doctor or Contact Person', key: 'doctor', placeholder: 'e.g. Dr. Ramesh Patil' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-[#355245] mb-1">{f.label}</label>
                        <input required className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56] focus:ring-2 focus:ring-[#176e56]/20 transition-all"
                          value={form[f.key as keyof typeof form]} placeholder={f.placeholder}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                      </div>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#355245] mb-1">WhatsApp Phone Number</label>
                        <input required type="tel" className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56] focus:ring-2 focus:ring-[#176e56]/20 transition-all"
                          value={form.phone} placeholder="+91 98765 43210" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#355245] mb-1">City</label>
                        <input required className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56] focus:ring-2 focus:ring-[#176e56]/20 transition-all"
                          value={form.city} placeholder="e.g. Pune" onChange={(e) => setForm({ ...form, city: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#355245] mb-1">Specialty / Clinic Type</label>
                      <select className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56] focus:ring-2 focus:ring-[#176e56]/20 bg-white transition-all"
                        value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}>
                        <option>Multispecialty Hospital</option>
                        <option>Orthopaedics</option>
                        <option>Obstetrics &amp; Gynecology</option>
                        <option>Dental Clinic</option>
                        <option>General Surgery / Daycare</option>
                        <option>Single-Doctor Clinic</option>
                        <option>Diagnostic &amp; Pathology Lab</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {submitError && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl font-medium border border-red-100">{submitError}</p>}

                    <motion.button type="submit" disabled={sending} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#176e56] to-[#1a8463] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#176e56]/25 transition-all mt-2 disabled:opacity-60">
                      {sending ? 'Sending Request…' : 'Schedule My Walkthrough →'}
                    </motion.button>
                  </form>
                  <small className="flex items-center justify-center gap-1.5 text-[11px] text-[#7d9387] mt-4">
                    <LockKeyhole size={11} />Your contact details are used exclusively for arranging your demo.
                  </small>
                </>
              ) : (
                <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <motion.div className="w-16 h-16 bg-gradient-to-br from-[#e5f7ed] to-[#d1f0de] text-[#1a7a58] rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
                    <Check size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#184234] mb-2 font-['Manrope']">Walkthrough Requested!</h3>
                  <p className="text-sm text-[#637d70] max-w-xs mx-auto mb-6">Our WhatsApp automation specialist will contact you shortly on WhatsApp to coordinate your walkthrough.</p>
                  <button onClick={() => setModal(false)} className="bg-[#176e56] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-[#115643] transition-colors">Done</button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
