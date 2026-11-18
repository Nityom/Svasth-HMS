import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  Menu,
  X,
  Bell,
  Building2,
  TrendingUp,
} from 'lucide-react';

/* ─────────────────────────── Data ─────────────────────────── */
type WorkflowStep = {
  number: string;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  role: string;
  icon: React.ElementType;
};

const workflowSteps: WorkflowStep[] = [
  {
    number: '01',
    tag: 'Patient outreach',
    title: 'Instant 24/7 patient discovery and chat start',
    description:
      'Patients initiate a conversation at any hour by scanning a reception QR code, tapping a link on Google Maps, or texting your verified clinic number. No app download required.',
    highlights: [
      'Custom QR standees for front-desk scanning',
      'One-click WhatsApp link on Google Business profile',
      'Instant automated greeting personalized to your clinic',
    ],
    role: 'Patient experience',
    icon: MessageCircle,
  },
  {
    number: '02',
    tag: 'Appointments and slots',
    title: 'Automated doctor booking and slot selection',
    description:
      'The assistant guides the patient through doctor profiles, clinical specialties, and open slots. The visit is confirmed in under 30 seconds.',
    highlights: [
      'Real-time doctor schedule and OPD timing sync',
      'Multi-doctor and specialty selection roster',
      'Zero double-booking or front-desk call queues',
    ],
    role: 'Automated scheduling',
    icon: Calendar,
  },
  {
    number: '03',
    tag: 'HMS sync and token',
    title: 'Instant Svaasth HMS sync and live OPD token',
    description:
      'Bookings push directly into your Svaasth HMS dashboard. If the patient is new, a UHID is created automatically and a digital token slip is delivered to WhatsApp.',
    highlights: [
      'Two-way real-time synchronization with Svaasth HMS',
      'Digital token slip with verification code',
      'Receptionist dashboard updates without manual data entry',
    ],
    role: 'Reception automation',
    icon: Zap,
  },
  {
    number: '04',
    tag: 'Queue updates',
    title: 'Real-time OPD queue alerts',
    description:
      'Keep patients informed about clinic delays or consult progress with automated notices: "Dr. Sharma is on Token #02. 2 patients ahead of you."',
    highlights: [
      'Reduces waiting room crowding and patient friction',
      'Patients wait comfortably in nearby areas',
      'Dynamic delay notices if emergency surgery occurs',
    ],
    role: 'Queue optimization',
    icon: Bell,
  },
  {
    number: '05',
    tag: 'Records delivery',
    title: 'Direct digital prescriptions and lab reports',
    description:
      'When the doctor finalizes consultation notes or tests are verified in Svaasth, letterhead-branded PDF documents are sent straight to the patient on WhatsApp.',
    highlights: [
      'Official letterhead PDF prescriptions sent automatically',
      'Diagnostic reports and lab results delivered instantly',
      'Encrypted and retained in the patient’s chat history',
    ],
    role: 'Clinical handover',
    icon: FileText,
  },
  {
    number: '06',
    tag: 'Post-care retention',
    title: 'Automated medication and follow-up reminders',
    description:
      'Keep follow-up adherence high. Svaasth Connect schedules automated check-ins based on the treatment plan with interactive confirmation buttons.',
    highlights: [
      '65% measured reduction in clinic no-show rates',
      'One-tap confirm, reschedule, or cancel actions',
      'Proactive care instructions and dosage notes',
    ],
    role: 'Patient retention',
    icon: TrendingUp,
  },
];

const connectFaqs = [
  {
    q: 'Can we use our existing clinic phone number for Svaasth Connect?',
    a: 'Yes. You can use an existing landline or mobile number provided it is not currently registered on a standard personal WhatsApp account. We assist with migration or allocating a dedicated business line.',
  },
  {
    q: 'Do patients need to install any new app?',
    a: 'No. Everything operates directly inside standard WhatsApp, which patients already use every day. No downloads, account setups, or password management required.',
  },
  {
    q: 'How does Svaasth Connect integrate with our clinic or hospital HMS?',
    a: 'Svaasth Connect is built natively for Svaasth HMS. Every booking, patient profile, token, and prescription syncs bidirectionally in real time with zero manual data entry.',
  },
  {
    q: 'What is included in the ₹15,000 setup fee?',
    a: 'The one-time setup fee covers Meta WhatsApp Business Cloud API registration, business verification guidance, dedicated webhook deployment, clinic bot workflow configuration, Svaasth HMS integration, and front-desk staff training.',
  },
  {
    q: 'What does the ₹10,000 annual charge cover?',
    a: 'The annual maintenance fee covers dedicated cloud server hosting for WhatsApp webhooks, 99.9% uptime SLA, ongoing Meta API version upgrades, clinical template updates, and priority technical support.',
  },
  {
    q: 'Are WhatsApp conversation charges included?',
    a: 'Meta charges standard per-conversation rates (a few paise per conversation in India) for WhatsApp Business API messages. These are billed directly by Meta at actual cost with zero markup.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Typically 2 to 4 business days once Meta business verification documents are submitted. We configure all technical webhooks and templates so clinic operations continue smoothly.',
  },
];

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function SvaasthConnect() {
  const [activeTab, setActiveTab] = useState<'booking' | 'queue' | 'prescription' | 'reminder'>('booking');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [modal, setModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({
    hospital: '',
    doctor: '',
    phone: '',
    city: '',
    specialty: 'Multispecialty Clinic',
  });

  const openDemo = () => {
    setModal(true);
    setSubmitted(false);
    setSubmitError('');
  };

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
          _subject: `New Svaasth Connect Demo Request — ${form.hospital}`,
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
      if (!response.ok || result.success === 'false' || result.success === false) {
        throw new Error(result.message || 'Email delivery failed');
      }
      setSubmitted(true);
    } catch {
      setSubmitError('We could not send your request just now. Please try again or message us on WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] text-[#16332a] min-h-screen flex flex-col font-sans antialiased selection:bg-[#e4ede8] selection:text-[#16332a]">
      {/* ── Top Announcement ── */}
      <div className="bg-[#eef3f0] border-b border-[#e1e9e4] text-[#2b4c40] px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16654b]" />
        <span>Official Meta WhatsApp Business Cloud API integration for Svaasth HMS</span>
        <span className="text-[#a4b8af]">·</span>
        <span className="font-medium text-[#16654b]">Zero manual data entry</span>
      </div>

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e4ede7] h-16 px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5" aria-label="Svaasth HMS home">
          <img className="h-8 w-auto object-contain" src="/svaasth.png" alt="Svaasth HMS" />
        </a>

        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#4a6358]">
          <a href="/" className="hover:text-[#16654b] transition-colors">
            Full platform
          </a>
          <a href="#workflow" className="hover:text-[#16654b] transition-colors">
            Workflow
          </a>
          <a href="#demo" className="hover:text-[#16654b] transition-colors">
            Preview
          </a>
          <a href="#pricing" className="hover:text-[#16654b] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#16654b] transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+917796308778"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-[#4a6358] hover:text-[#16654b] transition-colors"
          >
            <Phone size={14} className="text-[#768c82]" />
            <span>+91 77963 08778</span>
          </a>
          <button
            onClick={openDemo}
            className="inline-flex items-center gap-1.5 bg-[#16654b] hover:bg-[#12533d] text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <span>Get WhatsApp setup</span>
            <ArrowRight size={13} />
          </button>
          <button
            className="md:hidden p-2 text-[#2b4c40] rounded-lg hover:bg-[#f1f5f3]"
            aria-label="Toggle navigation menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#e4ede7] px-6 py-4 flex flex-col gap-3 text-xs font-medium text-[#4a6358]"
          >
            <a href="/" onClick={() => setMenu(false)} className="py-2 border-b border-[#f1f5f3]">
              Full platform
            </a>
            <a href="#workflow" onClick={() => setMenu(false)} className="py-2 border-b border-[#f1f5f3]">
              Workflow
            </a>
            <a href="#demo" onClick={() => setMenu(false)} className="py-2 border-b border-[#f1f5f3]">
              Preview
            </a>
            <a href="#pricing" onClick={() => setMenu(false)} className="py-2 border-b border-[#f1f5f3]">
              Pricing
            </a>
            <a href="#faq" onClick={() => setMenu(false)} className="py-2">
              FAQ
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle clinical surface pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
          style={{
            backgroundImage: 'radial-gradient(#16654b 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & Live Clinic Metrics */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf1ec] border border-[#d6e4dc] text-[#16654b] text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16654b]" />
              <span>Official WhatsApp Business Cloud API for Clinics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#16332a] leading-[1.08] mb-5 font-['Manrope']">
              Svaasth Connect for WhatsApp
            </h1>

            <p className="text-base md:text-[17px] text-[#4a6358] leading-relaxed max-w-xl mb-7">
              Turn WhatsApp into your clinic’s 24/7 automated front desk. Patients book visits in 30 seconds, receive
              live OPD token queue updates, get official letterhead prescriptions, and follow-up care reminders without
              downloading any new app.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8 w-full sm:w-auto">
              <button
                onClick={openDemo}
                className="inline-flex items-center justify-center gap-2 bg-[#16654b] hover:bg-[#12533d] text-white px-5 py-3 rounded-lg text-xs font-medium transition-colors shadow-xs"
              >
                <span>Request WhatsApp setup</span>
                <ArrowRight size={14} />
              </button>
              <a
                href="https://wa.me/917796308778?text=Hi%20Svaasth%20team,%20I%20am%20interested%20in%20Svaasth%20Connect%20for%20WhatsApp."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f1f5f3] border border-[#d6e2db] text-[#2b4c40] px-5 py-3 rounded-lg text-xs font-medium transition-colors"
              >
                <MessageCircle size={15} className="text-[#16654b]" />
                <span>Chat with our team</span>
              </a>
            </div>

            {/* In-hero operational impact grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg p-3.5 bg-white border border-[#e2ece5] rounded-xl mb-6">
              <div className="border-r border-[#edf3ef] pr-2">
                <span className="text-[11px] text-[#768c82] block">Booking time</span>
                <b className="text-base font-semibold text-[#16332a] font-['Manrope'] tabular-nums">&lt; 30s</b>
                <span className="text-[10px] text-[#5a7368] block mt-0.5">Automated triage</span>
              </div>
              <div className="border-r border-[#edf3ef] pr-2 pl-2">
                <span className="text-[11px] text-[#768c82] block">Queue crowding</span>
                <b className="text-base font-semibold text-[#16332a] font-['Manrope'] tabular-nums">-65%</b>
                <span className="text-[10px] text-[#5a7368] block mt-0.5">Live token notices</span>
              </div>
              <div className="pl-2">
                <span className="text-[11px] text-[#768c82] block">Manual data entry</span>
                <b className="text-base font-semibold text-[#16332a] font-['Manrope'] tabular-nums">0 hrs</b>
                <span className="text-[10px] text-[#5a7368] block mt-0.5">Direct HMS sync</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#5a7368]">
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-[#16654b]" />
                Meta Cloud API verified
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-[#16654b]" />
                Two-way Svaasth HMS sync
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-[#16654b]" />
                Zero patient app downloads
              </span>
            </div>
          </div>

          {/* Right Column: Connected Stage (WhatsApp + Svaasth HMS Reception Board) */}
          <div className="lg:col-span-7 flex flex-col xl:flex-row items-stretch gap-4 z-10">
            {/* Panel 1: Svaasth HMS Reception OPD Dashboard */}
            <div className="flex-1 bg-white border border-[#d6e2db] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
              {/* Dashboard Header */}
              <div className="bg-[#f8faf9] px-4 py-3 border-b border-[#e4ede7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16654b]" />
                  <b className="text-xs font-semibold text-[#16332a]">Svaasth HMS · OPD Reception</b>
                </div>
                <span className="text-[10px] font-mono text-[#16654b] bg-[#eaf1ec] border border-[#d6e4dc] px-2 py-0.5 rounded">
                  Live Webhook: Active
                </span>
              </div>

              {/* Clinic Doctor Roster Header */}
              <div className="p-3.5 bg-white border-b border-[#edf3ef]">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#16332a] block">Dr. Rajesh Sharma</span>
                    <span className="text-[11px] text-[#768c82]">Orthopaedics · OPD Floor 1, Room 02</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-[#16654b] bg-[#eaf1ec] px-2 py-0.5 rounded">
                      In Consultation
                    </span>
                    <span className="text-[10px] text-[#768c82] block mt-1 font-mono">Today: 14 visits</span>
                  </div>
                </div>
              </div>

              {/* Real-time Token Queue List */}
              <div className="p-3.5 space-y-2 text-xs flex-1 bg-[#fafcfa]">
                <div className="flex items-center justify-between text-[11px] text-[#768c82] pb-1 border-b border-[#eef4f0]">
                  <span>Live OPD Queue</span>
                  <span>Status &amp; Channel</span>
                </div>

                {/* Token #02 in room */}
                <div className="p-2.5 rounded-lg bg-white border border-[#e4ede7] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-semibold text-xs text-[#768c82] w-6">#02</span>
                    <div>
                      <span className="font-medium text-[#16332a] block">Ramesh Kulkarni</span>
                      <span className="text-[10px] text-[#768c82] font-mono">UHID: CRX-0982 · 11:10 AM</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#3c564c] bg-[#edf3ef] px-2 py-0.5 rounded font-medium">
                    In Room 02
                  </span>
                </div>

                {/* Token #03 waiting */}
                <div className="p-2.5 rounded-lg bg-white border border-[#e4ede7] flex items-center justify-between opacity-85">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-semibold text-xs text-[#768c82] w-6">#03</span>
                    <div>
                      <span className="font-medium text-[#16332a] block">Priya Patil</span>
                      <span className="text-[10px] text-[#768c82] font-mono">UHID: CRX-1015 · 11:20 AM</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#b45309] bg-[#fefce8] border border-[#fef08a] px-2 py-0.5 rounded font-medium">
                    Waiting Room
                  </span>
                </div>

                {/* Token #04 Just arrived via WhatsApp */}
                <div className="p-2.5 rounded-lg bg-[#f0f7f3] border-2 border-[#16654b] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-semibold text-xs text-[#16654b] w-6">#04</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#16332a]">Anaya Deshmukh</span>
                        <span className="text-[9px] bg-[#daf1e2] text-[#16654b] font-medium px-1.5 py-0.2 rounded">
                          WhatsApp
                        </span>
                      </div>
                      <span className="text-[10px] text-[#5a7368] font-mono">UHID: CRX-1042 · Today, 11:30 AM</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#16654b] bg-white border border-[#c6e4d0] px-2 py-0.5 rounded font-medium">
                    Auto-Confirmed
                  </span>
                </div>
              </div>

              {/* Bottom HMS Status Bar */}
              <div className="px-4 py-2.5 bg-white border-t border-[#edf3ef] flex items-center justify-between text-[11px] text-[#5a7368]">
                <span className="flex items-center gap-1.5">
                  <CheckCheck size={14} className="text-[#16654b]" />
                  Two-way sync: Token slip delivered to patient
                </span>
                <span className="font-mono text-[10px] text-[#768c82]">Latency: 0.4s</span>
              </div>
            </div>

            {/* Panel 2: Live WhatsApp Mobile Conversation */}
            <div className="w-full xl:w-[320px] bg-white border border-[#d6e2db] rounded-2xl shadow-xs overflow-hidden flex flex-col">
              {/* WhatsApp header */}
              <div className="bg-[#12533d] text-white px-3.5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Building2 size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">Apex Hospital</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[8px]">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-white/70 block">Official clinic assistant</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white/70">10:14 AM</span>
              </div>

              {/* Chat thread */}
              <div className="p-3 bg-[#f4f7f5] space-y-2.5 text-xs flex-1">
                {/* User msg */}
                <div className="flex justify-end">
                  <div className="bg-[#daf1e2] text-[#16332a] p-2 rounded-xl rounded-tr-xs max-w-[88%] border border-[#c6e4d0]">
                    <p className="leading-snug text-[11px]">Book consultation with Dr. Sharma for joint pain</p>
                    <span className="block text-[9px] text-[#6b8277] text-right mt-0.5 font-mono">10:14 AM</span>
                  </div>
                </div>

                {/* Bot options */}
                <div className="flex justify-start">
                  <div className="bg-white text-[#16332a] p-2.5 rounded-xl rounded-tl-xs max-w-[92%] border border-[#dce6e0] space-y-1.5">
                    <p className="text-[11px] text-[#4a6358] leading-tight">
                      Namaste. Dr. Rajesh Sharma has open slots today:
                    </p>
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div className="bg-[#f8faf9] border border-[#d6e2db] text-[#16654b] py-1 px-1.5 rounded text-[10px] text-center font-medium">
                        11:30 AM
                      </div>
                      <div className="bg-[#f8faf9] border border-[#d6e2db] text-[#16654b] py-1 px-1.5 rounded text-[10px] text-center font-medium">
                        04:00 PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* User selects */}
                <div className="flex justify-end">
                  <div className="bg-[#daf1e2] text-[#16332a] p-1.5 px-2.5 rounded-xl rounded-tr-xs border border-[#c6e4d0] text-[11px]">
                    Selected: Today, 11:30 AM
                  </div>
                </div>

                {/* Confirmation Slip */}
                <div className="flex justify-start">
                  <div className="bg-[#f0f6f2] text-[#16332a] p-2.5 rounded-xl rounded-tl-xs max-w-[92%] border border-[#cfe0d5] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#16654b] text-[11px] font-semibold pb-1 border-b border-[#dce7e0]">
                      <CheckCheck size={13} />
                      <span>Appointment confirmed</span>
                    </div>
                    <div className="text-[11px] text-[#3c564c] space-y-0.5 pt-0.5 leading-snug">
                      <div>
                        Token: <span className="font-semibold text-[#16332a]">#04</span> · Room 02
                      </div>
                      <div>
                        UHID: <span className="font-mono text-[10px]">CRX-1042</span>
                      </div>
                      <div>Patient: Anaya Deshmukh</div>
                      <div>Time: Today, 11:30 AM</div>
                    </div>
                    <span className="block text-[9px] text-[#6b8277] pt-0.5">Live OPD queue updates will follow</span>
                  </div>
                </div>
              </div>

              {/* Chat input placeholder */}
              <div className="bg-white p-2 flex items-center gap-2 border-t border-[#e4ede7]">
                <div className="flex-1 bg-[#f4f7f5] rounded-md px-2.5 py-1 text-[11px] text-[#768c82]">
                  Type a reply...
                </div>
                <div className="w-6 h-6 rounded-md bg-[#16654b] text-white flex items-center justify-center">
                  <Send size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics ── */}
      <section className="bg-[#eef4f0] border-y border-[#dce6df] py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#16332a] font-['Manrope'] tabular-nums">
              500M+
            </div>
            <div className="text-xs text-[#5a7368] mt-1">WhatsApp users in India</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#16332a] font-['Manrope'] tabular-nums">
              65%
            </div>
            <div className="text-xs text-[#5a7368] mt-1">Reduction in clinic no-shows</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#16332a] font-['Manrope'] tabular-nums">
              30s
            </div>
            <div className="text-xs text-[#5a7368] mt-1">Average booking completion</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#16332a] font-['Manrope'] tabular-nums">
              99.9%
            </div>
            <div className="text-xs text-[#5a7368] mt-1">Webhook uptime SLA</div>
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-medium text-[#16654b] block mb-2">Capabilities</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#16332a] tracking-tight font-['Manrope']">
            Built for everyday Indian clinical practice
          </h2>
          <p className="text-sm text-[#4a6358] mt-2">
            Over 95% of patients in India read WhatsApp messages within 3 minutes. Meet them where they already are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Calendar,
              title: '24/7 self-service booking',
              desc: 'Patients book, reschedule, or check availability outside clinic operating hours without burdening reception.',
            },
            {
              icon: Clock,
              title: 'Live OPD queue alerts',
              desc: 'Keep patients informed of token progression and consult delays, preventing crowded waiting areas.',
            },
            {
              icon: FileText,
              title: 'Letterhead prescription delivery',
              desc: 'Automatically send doctors’ PDF prescriptions and billing receipts directly to WhatsApp after the visit.',
            },
            {
              icon: RefreshCw,
              title: '65% fewer no-shows',
              desc: 'Automated 24-hour and 2-hour appointment reminders with one-tap confirm or reschedule actions.',
            },
            {
              icon: ShieldCheck,
              title: 'Official business verification',
              desc: 'Operate on your official clinic phone number with Meta green tick verification guidance.',
            },
            {
              icon: Zap,
              title: 'Bidirectional Svaasth sync',
              desc: 'Consultation records, tokens, patient profiles, and receipts flow directly between WhatsApp and Svaasth.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border border-[#e2ece5] bg-white hover:border-[#ccdcd1] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#edf3ef] text-[#16654b] flex items-center justify-center mb-4">
                <item.icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#16332a] mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#5a7368] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workflow Section ── */}
      <section id="workflow" className="py-20 px-4 md:px-8 bg-[#f3f7f4] border-t border-[#e2ebe5]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-medium text-[#16654b] block mb-2">Workflow</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#16332a] tracking-tight font-['Manrope']">
              How the Svaasth Connect workflow operates
            </h2>
            <p className="text-sm text-[#4a6358] mt-2">
              A continuous loop connecting patient convenience with your hospital front desk, consultation room, and pharmacy.
            </p>
          </div>

          <div className="space-y-4">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white border border-[#e2ebe5] rounded-xl p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
              >
                {/* Step meta */}
                <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between border-b lg:border-b-0 lg:border-r border-[#eef4f0] pb-3 lg:pb-0 lg:pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#16654b] bg-[#eaf1ec] px-2 py-0.5 rounded">
                      Step {step.number}
                    </span>
                    <span className="text-xs font-medium text-[#768c82] lg:hidden">{step.role}</span>
                  </div>
                  <div className="hidden lg:block mt-2">
                    <span className="text-xs font-medium text-[#768c82] block">{step.role}</span>
                  </div>
                </div>

                {/* Step description */}
                <div className="lg:col-span-5">
                  <h3 className="text-sm font-semibold text-[#16332a] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#5a7368] leading-relaxed">{step.description}</p>
                </div>

                {/* Step checklist */}
                <div className="lg:col-span-4 bg-[#f8faf9] border border-[#e8efe9] rounded-lg p-3.5">
                  <span className="text-[11px] font-medium text-[#3c564c] block mb-2">System actions</span>
                  <ul className="space-y-1.5 text-xs text-[#4a6358]">
                    {step.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <Check size={13} className="text-[#16654b] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Demo Preview ── */}
      <section id="demo" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-medium text-[#16654b] block mb-2">Interactive preview</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#16332a] tracking-tight font-['Manrope']">
            Patient conversation flows
          </h2>
          <p className="text-sm text-[#4a6358] mt-2">
            Select a scenario to view how patients and staff interact with Svaasth Connect on WhatsApp.
          </p>

          {/* Scenario tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
            {[
              { id: 'booking', label: '1. Appointment booking' },
              { id: 'queue', label: '2. Live OPD queue alert' },
              { id: 'prescription', label: '3. Digital prescription' },
              { id: 'reminder', label: '4. Follow-up reminder' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#16654b] text-white'
                    : 'bg-white text-[#4a6358] border border-[#d6e2db] hover:bg-[#f1f5f3]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp frame */}
        <div className="max-w-sm mx-auto bg-white border border-[#d6e2db] rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#12533d] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Building2 size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">Apex Hospital</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                </div>
                <span className="text-[10px] text-white/70 block">Official clinic assistant</span>
              </div>
            </div>
            <span className="text-xs text-white/70 font-mono">10:02 AM</span>
          </div>

          <div className="p-4 bg-[#f4f7f5] min-h-[340px] space-y-3 text-xs">
            {activeTab === 'booking' && (
              <>
                <div className="flex justify-end">
                  <div className="bg-[#daf1e2] text-[#16332a] p-2.5 rounded-xl rounded-tr-xs max-w-[85%] border border-[#c6e4d0]">
                    <p>I would like to book an appointment with Dr. Sharma</p>
                    <span className="block text-[9px] text-[#6b8277] text-right mt-1 font-mono">10:02 AM</span>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white text-[#16332a] p-3 rounded-xl rounded-tl-xs max-w-[90%] border border-[#dce6e0] space-y-2">
                    <p className="text-[11px] text-[#4a6358]">
                      Welcome to Apex Hospital. We found <b>Dr. Rajesh Sharma</b> (Orthopaedics). Select an open slot:
                    </p>
                    <div className="space-y-1 pt-0.5">
                      <div className="p-2 border border-[#d6e2db] rounded-md font-medium text-[#16654b] bg-[#f8faf9] text-center text-xs">
                        Today, 11:30 AM (Token #04)
                      </div>
                      <div className="p-2 border border-[#d6e2db] rounded-md font-medium text-[#16654b] bg-[#f8faf9] text-center text-xs">
                        Today, 04:30 PM (Token #12)
                      </div>
                    </div>
                    <span className="block text-[9px] text-[#768c82] font-mono">10:02 AM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#daf1e2] text-[#16332a] p-2 rounded-xl rounded-tr-xs max-w-[70%] border border-[#c6e4d0]">
                    <p>Selected: Today, 11:30 AM</p>
                    <span className="block text-[9px] text-[#6b8277] text-right mt-1 font-mono">10:03 AM</span>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#f0f6f2] text-[#16332a] p-3 rounded-xl rounded-tl-xs max-w-[90%] border border-[#cfe0d5] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#16654b] text-xs font-medium pb-1 border-b border-[#dce7e0]">
                      <CheckCheck size={14} />
                      <span>Booking confirmed</span>
                    </div>
                    <p className="text-[11px] text-[#3c564c] leading-relaxed pt-1">
                      Token: <span className="font-semibold text-[#16332a]">#04</span> (Room 02)
                      <br />
                      Patient: Anaya Deshmukh
                      <br />
                      UHID: <span className="font-mono text-[10px]">CRX-1042</span>
                      <br />
                      Consultation fee: ₹400
                    </p>
                    <span className="block text-[9px] text-[#6b8277] pt-1">Auto-synced to Svaasth HMS</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'queue' && (
              <>
                <div className="flex justify-start">
                  <div className="bg-white text-[#16332a] p-3 rounded-xl rounded-tl-xs max-w-[90%] border border-[#dce6e0] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#b45309] font-medium text-xs">
                      <Bell size={13} />
                      <span>Live OPD queue update</span>
                    </div>
                    <p className="text-[11px] text-[#4a6358] leading-relaxed">
                      Dr. Sharma is currently consulting Token #02. 1 patient is ahead of you.
                    </p>
                    <div className="p-2 bg-[#fefce8] border border-[#fef08a] rounded-md text-[#854d0e] text-xs">
                      Estimated consultation: <b>11:25 AM</b>. Please proceed to Floor 1, Room 02.
                    </div>
                    <span className="block text-[9px] text-[#768c82] font-mono">11:15 AM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#daf1e2] text-[#16332a] p-2 rounded-xl rounded-tr-xs max-w-[70%] border border-[#c6e4d0]">
                    <p>Thank you. Arrived outside Room 02.</p>
                    <span className="block text-[9px] text-[#6b8277] text-right mt-1 font-mono">11:18 AM</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'prescription' && (
              <div className="flex justify-start">
                <div className="bg-white text-[#16332a] p-3 rounded-xl rounded-tl-xs max-w-[90%] border border-[#dce6e0] space-y-2.5">
                  <p className="text-[11px] text-[#4a6358]">
                    Thank you for visiting Apex Hospital. Dr. Rajesh Sharma has issued your digital prescription:
                  </p>
                  <div className="p-2.5 bg-[#f4f7f5] border border-[#dce6df] rounded-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-[#be123c] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                        PDF
                      </div>
                      <div className="truncate">
                        <span className="block truncate text-xs font-medium text-[#16332a]">
                          Rx_Anaya_Deshmukh_28Oct.pdf
                        </span>
                        <span className="text-[10px] text-[#768c82] font-mono">2 pages · 142 KB</span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded bg-white border border-[#d6e2db] text-[#16654b]">
                      <Download size={13} />
                    </button>
                  </div>
                  <div className="text-[11px] text-[#4a6358] space-y-0.5 pt-1">
                    <div>Medicines prescribed: 3 items</div>
                    <div>Next follow-up: Wednesday, 4 Nov</div>
                  </div>
                  <span className="block text-[9px] text-[#768c82] font-mono">11:45 AM</span>
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div className="flex justify-start">
                <div className="bg-white text-[#16332a] p-3 rounded-xl rounded-tl-xs max-w-[90%] border border-[#dce6e0] space-y-2">
                  <p className="text-[11px] text-[#4a6358]">
                    Namaste Anaya ji. This is a follow-up reminder for your consultation with Dr. Rajesh Sharma on{' '}
                    <b>Wednesday, 4 Nov at 11:00 AM</b>.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <button className="w-full py-1.5 px-3 bg-[#eaf1ec] border border-[#cfe0d5] text-[#16654b] rounded-md font-medium text-center text-xs">
                      Confirm appointment
                    </button>
                    <button className="w-full py-1.5 px-3 bg-white border border-[#d6e2db] text-[#4a6358] rounded-md font-medium text-center text-xs">
                      Reschedule date
                    </button>
                  </div>
                  <span className="block text-[9px] text-[#768c82] font-mono">09:00 AM</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-2.5 flex items-center gap-2 border-t border-[#e4ede7]">
            <div className="flex-1 bg-[#f4f7f5] rounded-md px-3 py-1.5 text-[11px] text-[#768c82]">
              Type a reply...
            </div>
            <div className="w-7 h-7 rounded-md bg-[#16654b] text-white flex items-center justify-center">
              <Send size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-[#f3f7f4] border-t border-[#e2ebe5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-medium text-[#16654b] block mb-2">Pricing</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#16332a] tracking-tight font-['Manrope']">
              Simple and transparent pricing
            </h2>
            <p className="text-sm text-[#4a6358] mt-2">
              Turnkey setup with Meta verification, Svaasth HMS integration, and year-round support.
            </p>
          </div>

          <div className="bg-white border border-[#d6e2db] rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eef4f0] gap-4">
              <div>
                <span className="text-xs font-medium text-[#768c82] block">Healthcare integration plan</span>
                <h3 className="text-lg font-semibold text-[#16332a] mt-0.5">Svaasth Connect for WhatsApp</h3>
                <p className="text-xs text-[#5a7368] mt-1">
                  For single-doctor clinics, polyclinics, and hospitals using Svaasth HMS.
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-medium text-[#16654b] bg-[#eaf1ec] border border-[#d6e4dc] px-2.5 py-1 rounded">
                Official Meta Cloud API
              </span>
            </div>

            {/* Figures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#eef4f0]">
              <div>
                <span className="text-xs font-medium text-[#768c82] block">One-time setup fee</span>
                <div className="text-3xl md:text-4xl font-semibold text-[#16332a] font-['Manrope'] mt-1 tabular-nums">
                  ₹15,000
                </div>
                <p className="text-xs text-[#5a7368] mt-1">Full onboarding, verification and HMS sync</p>
              </div>
              <div className="sm:border-l sm:border-[#eef4f0] sm:pl-6">
                <span className="text-xs font-medium text-[#768c82] block">Annual maintenance charge</span>
                <div className="text-3xl md:text-4xl font-semibold text-[#16332a] font-['Manrope'] mt-1 tabular-nums">
                  ₹10,000<span className="text-sm text-[#768c82] font-normal"> / year</span>
                </div>
                <p className="text-xs text-[#5a7368] mt-1">Dedicated cloud hosting and API updates</p>
              </div>
            </div>

            {/* Features breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div>
                <h4 className="text-xs font-semibold text-[#16332a] uppercase tracking-wider mb-3">
                  Setup fee includes:
                </h4>
                <ul className="space-y-2.5 text-xs text-[#4a6358]">
                  {[
                    'Meta WhatsApp Business Cloud API account creation',
                    'Hospital green tick business verification guidance',
                    'Clinic phone number registration and porting',
                    'Bidirectional webhook sync with Svaasth HMS instance',
                    'Custom clinic message tree and template approval',
                    'Front-desk staff walkthrough and dry-run testing',
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-[#16654b] shrink-0 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#16332a] uppercase tracking-wider mb-3">
                  Annual charge includes:
                </h4>
                <ul className="space-y-2.5 text-xs text-[#4a6358]">
                  {[
                    'Dedicated cloud server hosting for WhatsApp webhooks',
                    'Meta WhatsApp API continuous version updates and compliance',
                    'Roster edits, timing modifications, and doctor changes',
                    '99.9% uptime SLA for appointment webhooks',
                    'Priority phone and WhatsApp technical support',
                    'Automatic compatibility with future Svaasth HMS features',
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-[#16654b] shrink-0 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* WhatsApp message charges notice */}
            <div className="p-3.5 bg-[#f8faf9] border border-[#e2ece5] rounded-lg text-xs text-[#5a7368] leading-relaxed mb-6">
              <b>Conversation rates:</b> Meta charges standard per-conversation rates (a few paise per conversation in India)
              directly to your Meta billing account. No surcharges or markups are added by Svaasth.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={openDemo}
                className="w-full sm:w-auto flex-1 bg-[#16654b] hover:bg-[#12533d] text-white py-2.5 px-6 rounded-lg text-xs font-medium transition-colors text-center"
              >
                Get started with Svaasth Connect
              </button>
              <a
                href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20Svaasth%20Connect%20for%20WhatsApp."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-[#d6e2db] bg-white hover:bg-[#f1f5f3] text-[#2b4c40] py-2.5 px-5 rounded-lg text-xs font-medium transition-colors"
              >
                <MessageCircle size={15} className="text-[#16654b]" />
                <span>Talk on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-medium text-[#16654b] block mb-2">Common questions</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#16332a] tracking-tight font-['Manrope']">
            Frequently asked questions
          </h2>
          <p className="text-sm text-[#4a6358] mt-2">
            Details on setup, technical integration, and day-to-day clinic operations.
          </p>
        </div>

        <div className="space-y-2.5">
          {connectFaqs.map((faq, index) => (
            <div key={faq.q} className="bg-white border border-[#e2ece5] rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 text-xs md:text-sm font-medium text-[#16332a] hover:text-[#16654b] transition-colors"
              >
                <span>{faq.q}</span>
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[#768c82] transition-transform ${
                    expandedFaq === index ? 'rotate-45' : ''
                  }`}
                >
                  <Plus size={15} />
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-4 md:px-5 pb-5 text-xs text-[#5a7368] leading-relaxed border-t border-[#f1f5f3] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="bg-[#16332a] text-white py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-medium text-[#a4c9b8] block mb-2">Ready to get started</span>
          <h2 className="text-2xl md:text-4xl font-semibold font-['Manrope'] tracking-tight mb-4 text-white">
            Connect your clinic with WhatsApp
          </h2>
          <p className="text-sm text-[#c6ded3] max-w-xl mx-auto mb-8 leading-relaxed">
            Setup takes 48 to 72 hours with end-to-end guidance from our healthcare technical team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openDemo}
              className="bg-white text-[#16332a] hover:bg-[#f1f5f3] text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Request WhatsApp setup
            </button>
            <a
              href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20get%20started%20with%20Svaasth%20Connect."
              target="_blank"
              rel="noreferrer"
              className="bg-transparent text-white border border-white/20 hover:bg-white/10 text-xs font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white py-8 px-4 md:px-8 border-t border-[#e4ede7] text-xs text-[#6b8277]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <a href="/" aria-label="Svaasth HMS">
              <img src="/svaasth.png" alt="Svaasth HMS" className="h-6 w-auto object-contain" />
            </a>
            <span className="text-[#d6e2db]">|</span>
            <span>Svaasth Connect for WhatsApp</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#4a6358]">
            <a href="/" className="hover:text-[#16654b] transition-colors">
              Home
            </a>
            <a href="/#features" className="hover:text-[#16654b] transition-colors">
              Platform
            </a>
            <a href="/#preview" className="hover:text-[#16654b] transition-colors">
              Product tour
            </a>
            <a href="/about" className="hover:text-[#16654b] transition-colors">
              About
            </a>
            <a href="/contact" className="hover:text-[#16654b] transition-colors">
              Contact
            </a>
            <a href="/privacy" className="hover:text-[#16654b] transition-colors">
              Privacy policy
            </a>
          </div>

          <div>© {new Date().getFullYear()} Svaasth HMS. Built for Indian healthcare.</div>
        </div>
      </footer>

      {/* ── Walkthrough Modal ── */}
      <AnimatePresence>
        {modal && (
          <div
            className="fixed inset-0 bg-[#16332a]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModal(false)}
          >
            <div className="bg-white border border-[#d6e2db] rounded-xl p-6 md:p-7 max-w-md w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-[#768c82] hover:text-[#16332a] transition-colors"
                onClick={() => setModal(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {!submitted ? (
                <>
                  <span className="text-xs font-medium text-[#16654b] block mb-1">Clinic walkthrough</span>
                  <h2 className="text-xl font-semibold text-[#16332a] font-['Manrope'] mb-1">
                    Get Svaasth Connect
                  </h2>
                  <p className="text-xs text-[#5a7368] mb-5">
                    Provide your clinic details to coordinate an automated WhatsApp workflow walkthrough.
                  </p>

                  <form onSubmit={submitDemo} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-xs font-medium text-[#2b4c40] mb-1">Hospital or clinic name</label>
                      <input
                        required
                        className="w-full border border-[#d6e2db] rounded-lg px-3 py-2 text-xs text-[#16332a] focus:outline-none focus:border-[#16654b]"
                        value={form.hospital}
                        placeholder="e.g. Apex Multispeciality Hospital"
                        onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2b4c40] mb-1">Doctor or contact person</label>
                      <input
                        required
                        className="w-full border border-[#d6e2db] rounded-lg px-3 py-2 text-xs text-[#16332a] focus:outline-none focus:border-[#16654b]"
                        value={form.doctor}
                        placeholder="e.g. Dr. Ramesh Patil"
                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#2b4c40] mb-1">WhatsApp phone number</label>
                        <input
                          required
                          type="tel"
                          className="w-full border border-[#d6e2db] rounded-lg px-3 py-2 text-xs text-[#16332a] focus:outline-none focus:border-[#16654b]"
                          value={form.phone}
                          placeholder="+91 98765 43210"
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#2b4c40] mb-1">City</label>
                        <input
                          required
                          className="w-full border border-[#d6e2db] rounded-lg px-3 py-2 text-xs text-[#16332a] focus:outline-none focus:border-[#16654b]"
                          value={form.city}
                          placeholder="e.g. Pune"
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#2b4c40] mb-1">Specialty or clinic type</label>
                      <select
                        className="w-full border border-[#d6e2db] rounded-lg px-3 py-2 text-xs text-[#16332a] focus:outline-none focus:border-[#16654b] bg-white"
                        value={form.specialty}
                        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      >
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

                    {submitError && (
                      <p className="text-xs text-[#be123c] bg-[#fff1f2] p-2.5 rounded-lg border border-[#fecdd3]">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-[#16654b] hover:bg-[#12533d] text-white py-2.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 mt-1"
                    >
                      {sending ? 'Sending request...' : 'Schedule walkthrough'}
                    </button>
                  </form>
                  <small className="flex items-center justify-center gap-1.5 text-[11px] text-[#768c82] mt-3">
                    <LockKeyhole size={11} />
                    Your contact details are used exclusively for arranging your demo.
                  </small>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-[#eaf1ec] text-[#16654b] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-[#16332a] mb-1 font-['Manrope']">
                    Walkthrough requested
                  </h3>
                  <p className="text-xs text-[#5a7368] max-w-xs mx-auto mb-5">
                    Our team will contact you shortly on WhatsApp to coordinate your setup.
                  </p>
                  <button
                    onClick={() => setModal(false)}
                    className="bg-[#16654b] text-white px-5 py-2 rounded-lg text-xs font-medium hover:bg-[#12533d] transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
