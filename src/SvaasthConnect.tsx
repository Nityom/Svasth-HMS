import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Download,
  FileText,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
  Zap
} from 'lucide-react';

type WorkflowStep = {
  number: string;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  role: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    number: '01',
    tag: 'PATIENT OUTREACH',
    title: 'Instant 24/7 Patient Discovery & Chat Start',
    description:
      'Patients initiate a conversation at any hour—by scanning a QR code at your clinic reception, tapping a link on Google Maps, or texting your verified clinic WhatsApp number. No new app download required.',
    highlights: [
      'Custom QR code standees for front-desk scanning',
      'One-click WhatsApp link on Google Business & website',
      'Instant automated greeting personalized to your clinic',
    ],
    role: 'Patient Experience',
  },
  {
    number: '02',
    tag: 'APPOINTMENTS & SLOTS',
    title: 'Smart Automated Doctor Booking & Slot Selection',
    description:
      'The intelligent assistant guides the patient through doctor profiles, specialties, and real-time open slots. The patient picks their preferred time, and the visit is booked in under 30 seconds.',
    highlights: [
      'Real-time doctor schedule and OPD timing sync',
      'Multi-doctor and multi-specialty selection menu',
      'Zero double-booking or front-desk phone queues',
    ],
    role: 'Automated Scheduling',
  },
  {
    number: '03',
    tag: 'HMS SYNC & TOKEN',
    title: 'Instant Svaasth HMS Sync & Live OPD Token',
    description:
      'The booking is instantly pushed into your Svaasth HMS dashboard. If the patient is new, a unique UHID is automatically created. A digital token slip with date, time, and room number is sent to the patient.',
    highlights: [
      'Two-way real-time synchronization with Svaasth HMS',
      'Digital token slip with QR verification',
      'Receptionist dashboard updates immediately without manual data entry',
    ],
    role: 'Reception Automation',
  },
  {
    number: '04',
    tag: 'QUEUE UPDATES',
    title: 'Real-Time OPD Queue Alerts (Reduce Waiting Room Crowds)',
    description:
      'Keep patients informed about clinic delays or live queue progress. Svaasth Connect sends proactive alerts: "Dr. Raut is on Token #02. 2 patients ahead of you. Please reach Room 02 by 10:25 AM."',
    highlights: [
      'Cuts waiting room crowding and patient frustration',
      'Patients can wait safely in their vehicle or nearby café',
      'Dynamic delay notices if an emergency surgery occurs',
    ],
    role: 'Queue Optimization',
  },
  {
    number: '05',
    tag: 'RECORDS DELIVERY',
    title: 'One-Tap Digital Prescriptions & Lab Reports',
    description:
      'As soon as the doctor finalizes consultation notes or the lab marks tests ready in Svaasth, high-resolution, letterhead-branded PDF documents are securely delivered to the patient’s WhatsApp.',
    highlights: [
      'Official letterhead PDF prescriptions sent automatically',
      'Diagnostic lab test results & blood reports delivered instantly',
      'Encrypted and stored permanently in patient’s WhatsApp history',
    ],
    role: 'Clinical Handover',
  },
  {
    number: '06',
    tag: 'POST-CARE RETENTION',
    title: 'Automated Medication & Follow-Up Reminders',
    description:
      'Never lose a patient to forgotten follow-ups. Svaasth Connect schedules automated reminders at 3 days, 7 days, or 1 month based on the doctor’s treatment plan, with interactive confirmation buttons.',
    highlights: [
      '65% reduction in appointment no-show rates',
      'Interactive confirmation, reschedule, or cancel buttons',
      'Proactive care instructions & dosage reminders',
    ],
    role: 'Patient Retention',
  },
];

const connectFaqs = [
  {
    q: 'Can we use our existing clinic phone number for Svaasth Connect?',
    a: 'Yes! You can use your existing landline or mobile number, provided it is not currently registered on a standard personal WhatsApp account. If it is already on WhatsApp, we assist you in safely migrating or allocating a dedicated official business number.',
  },
  {
    q: 'Do patients need to install any new app?',
    a: 'Not at all. Everything works directly inside standard WhatsApp, which over 500 million people in India already use daily. Patients do not need to download, update, or learn any separate mobile application.',
  },
  {
    q: 'How does Svaasth Connect integrate with our clinic or hospital HMS?',
    a: 'Svaasth Connect is natively engineered for Svaasth HMS. Every appointment booked on WhatsApp instantly reflects on your receptionist’s token board, doctor’s consultation roster, and patient records with zero manual data entry.',
  },
  {
    q: 'What is included in the ₹15,000 setup fee?',
    a: 'The one-time setup fee covers Meta WhatsApp Business Cloud API account registration, business verification guidance (for the official green tick), dedicated webhook deployment, clinic chatbot script customization, Svaasth HMS bidirectional integration, staff onboarding, and initial testing.',
  },
  {
    q: 'What does the ₹10,000 annual charge cover?',
    a: 'The ₹10,000 annual maintenance fee covers dedicated cloud server hosting for WhatsApp webhooks, 99.9% uptime SLA, ongoing Meta API version upgrades, template updates, and priority technical support throughout the year.',
  },
  {
    q: 'Are WhatsApp conversation charges included?',
    a: 'Meta charges nominal per-conversation fees for business-initiated and user-initiated messages under its standard WhatsApp Business API pricing (typically a few paise per conversation in India). These are passed through transparently at actuals directly to your Meta billing account.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Typically 2 to 4 business days once Meta business verification documents are submitted. We handle all technical configuration so your clinic can start receiving automated WhatsApp bookings without disruption.',
  },
];

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
      if (!response.ok || result.success === 'false' || result.success === false) {
        throw new Error(result.message || 'Email delivery failed');
      }
      setSubmitted(true);
    } catch {
      setSubmitError('We couldn’t send your request just now. Please try again or chat directly on WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="site-shell bg-[#f8faf8] text-[#173d37] min-h-screen flex flex-col font-sans">
      {/* Top Notification Announcement */}
      <div className="announcement bg-[#e5f5ea] text-[#245846] py-2 px-4 flex items-center justify-center gap-2 text-xs font-medium border-b border-[#d2edd9]">
        <span className="live-dot" />
        <span>Official Meta WhatsApp Business Cloud API Integration</span>
        <span className="announcement-sep opacity-50">·</span>
        <b className="font-bold">Zero manual typing · 100% Svaasth HMS Sync</b>
        <ArrowRight size={13} className="ml-1" />
      </div>

      {/* Main Topbar */}
      <header className="topbar sticky top-0 z-40 bg-[#fbfcfa]/95 backdrop-blur-md border-b border-[#e5ece6] h-[74px] px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="brand flex items-center gap-2" aria-label="Svaasth HMS home">
          <img className="h-9 w-auto object-contain" src="/svaasth.png" alt="Svaasth HMS" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#5a6e64]">
          <a href="/" className="hover:text-[#187556] transition-colors">
            Overview
          </a>
          <a href="#workflow" className="hover:text-[#187556] transition-colors">
            Workflow
          </a>
          <a href="#demo" className="hover:text-[#187556] transition-colors">
            Live Demo
          </a>
          <a href="#pricing" className="hover:text-[#187556] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#187556] transition-colors">
            FAQ
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e7f7ed] border border-[#c4ebd1] text-[#1e7a57] rounded-full text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span>
            WhatsApp API
          </span>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+917796308778"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-[#446255] hover:text-[#176e56]"
          >
            <Phone size={13} />
            +91 77963 08778
          </a>
          <button
            onClick={openDemo}
            className="button button-small inline-flex items-center gap-1.5 bg-[#176e56] hover:bg-[#115643] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <span>Get Svaasth Connect</span>
            <ArrowRight size={14} />
          </button>
          <button
            className="md:hidden p-2 text-[#214b40] rounded-lg hover:bg-[#eef5f0]"
            aria-label="Toggle navigation menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menu && (
        <div className="md:hidden bg-[#fbfcfa] border-b border-[#e5ece6] px-5 py-4 flex flex-col gap-3 text-sm font-semibold text-[#445b50] shadow-lg animate-in slide-in-from-top-2">
          <a href="/" onClick={() => setMenu(false)} className="py-2 border-b border-[#eef3ef]">
            Home / Full HMS
          </a>
          <a href="#workflow" onClick={() => setMenu(false)} className="py-2 border-b border-[#eef3ef]">
            Connect Workflow
          </a>
          <a href="#demo" onClick={() => setMenu(false)} className="py-2 border-b border-[#eef3ef]">
            Interactive WhatsApp Demo
          </a>
          <a href="#pricing" onClick={() => setMenu(false)} className="py-2 border-b border-[#eef3ef]">
            Pricing (₹15,000 Setup + ₹10,000/yr)
          </a>
          <a href="#faq" onClick={() => setMenu(false)} className="py-2">
            Frequently Asked Questions
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Ambient gradient blobs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#25d366]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#176e56]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f7ee] border border-[#cbead6] text-[#1c7855] text-xs font-bold tracking-wide mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-[#25d366]" />
              OFFICIAL WHATSAPP BUSINESS API FOR CLINICS &amp; HOSPITALS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#163d35] leading-[1.08] mb-5 font-['Manrope']"
            >
              Svaasth Connect <br />
              <span className="text-[#25a969]">for WhatsApp</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-base md:text-lg text-[#556c60] leading-relaxed max-w-2xl mb-8"
            >
              Turn WhatsApp into your clinic’s 24/7 automated receptionist. Enable instant appointment bookings, live
              OPD token updates, digital prescriptions, lab test reports, and personalized follow-up care directly inside
              the app your patients already use every single day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <button
                onClick={openDemo}
                className="button inline-flex items-center justify-center gap-2 bg-[#176e56] hover:bg-[#115643] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#176e56]/20 transition-all"
              >
                <span>Get Svaasth Connect Setup</span>
                <ArrowRight size={16} />
              </button>
              <a
                href="https://wa.me/917796308778?text=Hi%20Svaasth%20team,%20I%20am%20interested%20in%20Svaasth%20Connect%20for%20WhatsApp."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f1f7f3] border border-[#d2ded6] text-[#245b49] px-6 py-3.5 rounded-xl text-sm font-bold shadow-xs transition-all"
              >
                <MessageCircle size={17} className="text-[#25d366]" />
                <span>Chat With Our Team</span>
              </a>
            </motion.div>

            {/* Quick Pricing Badge in Hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="p-4 bg-white/90 border border-[#e1ece4] rounded-2xl shadow-sm flex flex-wrap items-center gap-6 w-full max-w-xl"
            >
              <div>
                <span className="block text-[11px] font-bold text-[#81968b] tracking-wider uppercase">Setup Fee</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-2xl font-black text-[#1b4e3f] font-['Manrope']">₹15,000</strong>
                  <span className="text-xs text-[#70877c]">one-time setup</span>
                </div>
              </div>
              <div className="h-8 w-px bg-[#e1ece4]" />
              <div>
                <span className="block text-[11px] font-bold text-[#81968b] tracking-wider uppercase">Annual Charge</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-2xl font-black text-[#1b4e3f] font-['Manrope']">₹10,000</strong>
                  <span className="text-xs text-[#70877c]">/year hosting &amp; updates</span>
                </div>
              </div>
              <div className="ml-auto">
                <a
                  href="#pricing"
                  className="text-xs font-bold text-[#1a7756] hover:underline inline-flex items-center gap-1"
                >
                  View Details <ChevronDown size={14} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Graphic / Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative w-full max-w-[390px] bg-white border border-[#e0eae3] rounded-3xl p-6 shadow-xl shadow-[#20513f]/10"
            >
              {/* WhatsApp green header bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#edf3ee]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#e6f7ec] border border-[#c4e8cf] flex items-center justify-center text-[#25d366] shadow-xs">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <b className="block text-sm font-extrabold text-[#194035]">Svaasth Connect</b>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#2ea66c] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                      Official WhatsApp Cloud API
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#eef6f0] text-[#2c6e52] font-bold px-2 py-1 rounded-md">
                  VERIFIED
                </span>
              </div>

              {/* Sample WhatsApp Bubbles */}
              <div className="space-y-3 py-5 text-xs">
                {/* Incoming User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#e7f8ec] text-[#1c483a] p-3 rounded-2xl rounded-tr-xs max-w-[85%] border border-[#cdecd6] shadow-xs">
                    <p className="font-medium">Book consultation with Dr. Raut for joint pain please</p>
                    <span className="block text-[9px] text-[#719684] text-right mt-1">10:14 AM</span>
                  </div>
                </div>

                {/* Bot Response with Buttons */}
                <div className="flex justify-start">
                  <div className="bg-[#f7faf8] text-[#24463a] p-3.5 rounded-2xl rounded-tl-xs max-w-[92%] border border-[#e2ece5] shadow-xs space-y-2">
                    <p className="font-semibold text-[#186047]">
                      Namaste! Dr. Vipeen Raut (Orthopaedics) has slots today:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button className="bg-white border border-[#cbe4d4] hover:bg-[#ebf8f0] text-[#1e6f50] py-1.5 px-2 rounded-lg font-bold text-[11px] text-center transition-colors">
                        Today 11:30 AM
                      </button>
                      <button className="bg-white border border-[#cbe4d4] hover:bg-[#ebf8f0] text-[#1e6f50] py-1.5 px-2 rounded-lg font-bold text-[11px] text-center transition-colors">
                        Today 04:00 PM
                      </button>
                    </div>
                    <span className="block text-[9px] text-[#8aa195] mt-1">10:14 AM</span>
                  </div>
                </div>

                {/* Instant Confirmed Ticket */}
                <div className="flex justify-start">
                  <div className="bg-[#eaf4ee] text-[#1b4a39] p-3.5 rounded-2xl rounded-tl-xs max-w-[92%] border border-[#cae5d3] shadow-xs">
                    <div className="flex items-center gap-2 text-[#24895a] font-bold pb-1 border-b border-[#c8e2d1]">
                      <CheckCheck size={15} />
                      <span>APPOINTMENT CONFIRMED</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed">
                      Token: <b>#04</b> · UHID: <b>CRX-1042</b>
                      <br />
                      Patient: <b>Anaya Deshmukh</b>
                      <br />
                      Time: <b>Today, 11:30 AM (Room 02)</b>
                    </p>
                    <span className="block text-[9px] text-[#699380] mt-1.5">Auto-synced to Svaasth HMS</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Feature Strip */}
              <div className="pt-3 border-t border-[#edf3ee] flex items-center justify-between text-[11px] text-[#637d70]">
                <span className="flex items-center gap-1 font-semibold text-[#276e51]">
                  <ShieldCheck size={14} /> End-to-end Encrypted
                </span>
                <span>Meta Cloud API SLA</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-white py-16 border-y border-[#e5ede6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#2ca26c] uppercase">Why WhatsApp Automation</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#173d35] mt-2 mb-4 font-['Manrope']">
              Why Indian hospitals &amp; clinics choose Svaasth Connect
            </h2>
            <p className="text-sm md:text-base text-[#657d71]">
              Indian patients don’t download clunky patient portals or open marketing emails. Over 95% read WhatsApp
              messages within 3 minutes of delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: '24/7 Self-Service Booking',
                desc: 'Patients can book, reschedule, or check doctor availability even after clinic hours without calling reception staff.',
              },
              {
                icon: Clock,
                title: 'Live OPD Queue & Token Alerts',
                desc: 'Keep patients informed of their exact token position and estimated consult time to prevent crowded waiting rooms.',
              },
              {
                icon: FileText,
                title: 'Instant Letterhead Rx Delivery',
                desc: 'Automatically send doctors’ digital prescriptions and billing receipts in official hospital PDF format right after the visit.',
              },
              {
                icon: RefreshCw,
                title: '65% Reduction in No-Shows',
                desc: 'Automated 24h & 2h appointment reminders with one-tap confirm/cancel buttons drastically decrease empty clinic slots.',
              },
              {
                icon: ShieldCheck,
                title: 'Official Green Tick Verification',
                desc: 'Operate on your official clinic landline or mobile with Meta Business verification, building patient trust and legitimacy.',
              },
              {
                icon: Zap,
                title: 'Bidirectional Svaasth HMS Sync',
                desc: 'Appointments, patient profiles, consultation records, and billing receipts flow effortlessly between WhatsApp and Svaasth.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-[#e4ece5] bg-[#fafcfb] hover:bg-white hover:border-[#c5e4d0] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e5f5ea] text-[#1c7855] flex items-center justify-center mb-4">
                  <feature.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-[#1d463a] mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-[#667d71] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Workflow Section (Explicitly requested by user) */}
      <section id="workflow" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f6ed] text-[#227956] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles size={13} />
            END-TO-END AUTOMATION FLOW
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] tracking-tight font-['Manrope']">
            How the Svaasth Connect <span>workflow operates</span>
          </h2>
          <p className="text-sm md:text-base text-[#61776c] mt-3">
            A seamless journey connecting patient convenience with your hospital’s front desk, doctor consultation room,
            and pharmacy.
          </p>
        </div>

        {/* Workflow Steps Cards */}
        <div className="space-y-6">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white border border-[#e2ebe4] rounded-2xl p-6 md:p-8 shadow-xs hover:border-[#bde0ca] transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Step Number & Role */}
              <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-[#edf3ee] pb-4 lg:pb-0 lg:pr-6">
                <span className="text-4xl md:text-5xl font-black text-[#26895b] font-['Manrope'] opacity-90">
                  {step.number}
                </span>
                <div className="mt-2 text-right lg:text-left">
                  <span className="block text-[11px] font-bold text-[#869b90] tracking-wider uppercase">
                    {step.tag}
                  </span>
                  <span className="inline-block mt-1 text-xs font-bold text-[#1f664b] bg-[#eaf6ee] px-2.5 py-0.5 rounded-full">
                    {step.role}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="lg:col-span-5">
                <h3 className="text-lg md:text-xl font-bold text-[#1a4237] mb-2">{step.title}</h3>
                <p className="text-xs md:text-sm text-[#61776c] leading-relaxed">{step.description}</p>
              </div>

              {/* Checklist Highlights */}
              <div className="lg:col-span-4 bg-[#f8faf8] border border-[#e7efe9] rounded-xl p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#738a7e] mb-2">
                  System Actions
                </span>
                <ul className="space-y-2 text-xs text-[#416254]">
                  {step.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check size={14} className="text-[#25a969] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive WhatsApp Live Demo Simulator */}
      <section id="demo" className="py-20 bg-[#edf5f0] border-t border-[#d8e8dc]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#24895b] uppercase">Interactive Experience</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#173d35] mt-2 mb-3 font-['Manrope']">
              Try the patient conversation flow
            </h2>
            <p className="text-xs md:text-sm text-[#61786c]">
              Select a scenario below to preview exactly what your patients and doctors experience on WhatsApp.
            </p>

            {/* Scenario Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'booking', label: '1. Appointment Booking' },
                { id: 'queue', label: '2. Live OPD Token Alert' },
                { id: 'prescription', label: '3. Digital Prescription' },
                { id: 'reminder', label: '4. Follow-Up Reminder' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#176e56] text-white shadow-sm'
                      : 'bg-white text-[#466657] border border-[#d2ded6] hover:bg-[#f6faf7]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Phone Mockup Container */}
          <div className="max-w-md mx-auto bg-white rounded-[36px] border-8 border-[#1f2924] shadow-2xl overflow-hidden">
            {/* Phone Top Speaker & Camera Notch */}
            <div className="bg-[#1f2924] h-6 flex items-center justify-center">
              <div className="w-16 h-3 bg-[#111614] rounded-full"></div>
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  🏥
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <b className="text-xs font-bold">Apex Multispeciality Hospital</b>
                    <span className="w-3 h-3 rounded-full bg-[#25d366] flex items-center justify-center text-[8px]">
                      ✓
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-200">Official Hospital Assistant</span>
                </div>
              </div>
              <div className="text-sm">⋮</div>
            </div>

            {/* Chat Body (WhatsApp Wallpaper aesthetic) */}
            <div className="p-4 bg-[#efeae2] min-h-[380px] space-y-3 text-xs overflow-y-auto">
              <div className="text-center my-1">
                <span className="bg-[#ffffffcc] text-[#697a70] text-[9px] px-2.5 py-0.5 rounded-md shadow-2xs">
                  Today
                </span>
              </div>

              {activeTab === 'booking' && (
                <>
                  <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] text-[#111] p-2.5 rounded-lg rounded-tr-none max-w-[80%] shadow-2xs">
                      <p>Hi, I want to book an appointment with Dr. Raut for joint pain</p>
                      <span className="block text-[9px] text-[#667781] text-right mt-1">10:02 AM ✓✓</span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-2xs space-y-2">
                      <p>
                        Hello! Welcome to Apex Multispeciality Hospital. We found <b>Dr. Vipeen Raut</b> (Orthopaedics).
                        Please choose your preferred consultation slot:
                      </p>
                      <div className="space-y-1 pt-1">
                        <div className="p-2 border border-[#d2ded6] rounded-md font-semibold text-[#176e56] bg-[#f8faf8] text-center">
                          📅 Today, 11:30 AM (Token #04)
                        </div>
                        <div className="p-2 border border-[#d2ded6] rounded-md font-semibold text-[#176e56] bg-[#f8faf8] text-center">
                          📅 Today, 04:30 PM (Token #12)
                        </div>
                      </div>
                      <span className="block text-[9px] text-[#667781] text-right">10:02 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] text-[#111] p-2 rounded-lg rounded-tr-none max-w-[70%] shadow-2xs">
                      <p className="font-medium">Selected: Today, 11:30 AM</p>
                      <span className="block text-[9px] text-[#667781] text-right mt-1">10:03 AM ✓✓</span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[#176e56] font-bold text-[11px] mb-1">
                        <span>✅</span> Booking Confirmed!
                      </div>
                      <p className="leading-relaxed">
                        <b>UHID:</b> CRX-1042
                        <br />
                        <b>Patient:</b> Anaya Deshmukh
                        <br />
                        <b>OPD Token:</b> #04 (Room 02)
                        <br />
                        <b>Consultation Fee:</b> ₹400
                      </p>
                      <div className="mt-2 p-1.5 bg-[#f4f7f5] rounded text-[10px] text-[#426154]">
                        ℹ️ Live updates will be sent when your turn approaches.
                      </div>
                      <span className="block text-[9px] text-[#667781] text-right mt-1">10:03 AM</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'queue' && (
                <>
                  <div className="flex justify-start">
                    <div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[88%] shadow-2xs space-y-2">
                      <div className="flex items-center gap-1 text-[#ea580c] font-bold">
                        <span>🔔</span> LIVE OPD QUEUE NOTIFICATION
                      </div>
                      <p className="leading-relaxed">
                        Dr. Raut is currently examining <b>Token #02</b>.
                        <br />
                        There is <b>1 patient</b> ahead of you.
                      </p>
                      <div className="p-2 bg-[#fff7ed] border border-[#ffedd5] rounded-lg text-[#9a3412]">
                        ⏱️ Estimated consultation: <b>11:25 AM</b>. Please proceed to <b>OPD Floor 1, Room 02</b>.
                      </div>
                      <span className="block text-[9px] text-[#667781] text-right">11:15 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-[#d9fdd3] text-[#111] p-2 rounded-lg rounded-tr-none max-w-[70%] shadow-2xs">
                      <p>Thank you! Waiting outside Room 02 now.</p>
                      <span className="block text-[9px] text-[#667781] text-right mt-1">11:18 AM ✓✓</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'prescription' && (
                <>
                  <div className="flex justify-start">
                    <div className="bg-white text-[#111] p-3 rounded-lg rounded-tl-none max-w-[88%] shadow-2xs space-y-2.5">
                      <p>
                        Thank you for visiting Apex Multispeciality Hospital today. Dr. Vipeen Raut has issued your
                        digital prescription:
                      </p>

                      {/* PDF Attachment Box */}
                      <div className="p-2.5 bg-[#f1f5f2] border border-[#dce6df] rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            PDF
                          </div>
                          <div className="truncate">
                            <b className="block truncate text-[11px] text-[#1f3d32]">Rx_Anaya_Deshmukh_28Oct.pdf</b>
                            <span className="text-[9px] text-[#788e82]">2 pages · 142 KB</span>
                          </div>
                        </div>
                        <button className="p-1.5 rounded-full bg-white shadow-xs text-[#176e56] hover:bg-[#e6f4ec]">
                          <Download size={14} />
                        </button>
                      </div>

                      <div className="text-[10px] text-[#4c695b] space-y-0.5 pt-1">
                        <div>
                          💊 <b>Medicines:</b> 3 prescribed
                        </div>
                        <div>
                          🗓️ <b>Next Follow-up:</b> Wednesday, 4 Nov
                        </div>
                      </div>
                      <span className="block text-[9px] text-[#667781] text-right">11:45 AM</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'reminder' && (
                <>
                  <div className="flex justify-start">
                    <div className="bg-white text-[#111] p-3.5 rounded-lg rounded-tl-none max-w-[88%] shadow-2xs space-y-2.5">
                      <p>
                        Namaste Anaya ji! Hope you are recovering well from your knee treatment.
                      </p>
                      <p>
                        This is a gentle reminder for your scheduled <b>7-day follow-up consultation</b> with Dr. Vipeen
                        Raut on <b>Wednesday, 4 Nov at 11:00 AM</b>.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <button className="w-full py-1.5 px-3 bg-[#e8f7ee] border border-[#c4e9d2] text-[#187556] rounded-lg font-bold text-center">
                          ✅ Confirm Appointment
                        </button>
                        <button className="w-full py-1.5 px-3 bg-white border border-[#d2ded6] text-[#4d6a5c] rounded-lg font-medium text-center">
                          🔄 Reschedule Date
                        </button>
                      </div>
                      <span className="block text-[9px] text-[#667781] text-right">09:00 AM</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Chat Input Mockup */}
            <div className="bg-[#f0f2f5] p-2.5 flex items-center gap-2 border-t border-[#e2e8f0]">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-[#8696a0]">Type a message...</div>
              <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                <Send size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Explicitly requested: 15,000 setup fee and 10,000 annually charge) */}
      <section id="pricing" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#24895b] uppercase">Transparent &amp; Predictable</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#173d35] tracking-tight mt-2 mb-3 font-['Manrope']">
            Svaasth Connect <span>Pricing</span>
          </h2>
          <p className="text-sm md:text-base text-[#61796d]">
            Complete turnkey implementation with zero hidden surcharges. Includes your official Meta WhatsApp Business API
            setup, Svaasth HMS integration, and year-round support.
          </p>
        </div>

        {/* Highlighted Pricing Card */}
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#8dc4a2] rounded-3xl p-8 md:p-12 shadow-xl shadow-[#176e56]/10 relative overflow-hidden">
          {/* Popular Tag */}
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center gap-1.5 bg-[#eaf7ee] text-[#1c7855] border border-[#c3ebd0] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
              Official Healthcare Plan
            </span>
          </div>

          <div className="max-w-lg mb-8">
            <span className="text-xs font-bold text-[#718b7f] tracking-wider uppercase">COMPLETE INTEGRATION</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#163d35] font-['Manrope'] mt-1">
              Svaasth Connect for WhatsApp
            </h3>
            <p className="text-xs md:text-sm text-[#667e72] mt-2">
              For single-doctor clinics, polyclinics, nursing homes, and growing hospitals looking to automate patient
              communication on WhatsApp.
            </p>
          </div>

          {/* Pricing Grid Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#f6f9f7] border border-[#e2ede6] mb-8">
            <div>
              <span className="block text-xs font-bold text-[#758e82] uppercase tracking-wider">Setup Fee</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl md:text-5xl font-black text-[#174e3e] font-['Manrope']">₹15,000</span>
              </div>
              <p className="text-xs text-[#527062] mt-1 font-medium">One-time setup &amp; onboarding</p>
            </div>

            <div className="sm:border-l sm:border-[#e2ede6] sm:pl-6">
              <span className="block text-xs font-bold text-[#758e82] uppercase tracking-wider">Annual Charge</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl md:text-5xl font-black text-[#174e3e] font-['Manrope']">₹10,000</span>
                <span className="text-xs text-[#758e82]">/year</span>
              </div>
              <p className="text-xs text-[#527062] mt-1 font-medium">Cloud webhook hosting &amp; updates</p>
            </div>
          </div>

          {/* What is Included Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h4 className="text-xs font-extrabold text-[#1c4d3d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e7efe9]">
                What’s in the ₹15,000 Setup:
              </h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#456355]">
                {[
                  'Official Meta WhatsApp Business Cloud API account creation',
                  'Hospital green tick verification assistance',
                  'Clinic phone number registration & porting guidance',
                  'Bidirectional webhook sync with your Svaasth HMS instance',
                  'Custom clinical templates & interactive chat tree setup',
                  'Staff walkthrough, reception training & test dry-run',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#25a969] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#1c4d3d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e7efe9]">
                What’s in the ₹10,000 Annual Charge:
              </h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#456355]">
                {[
                  'Dedicated high-speed cloud webhook hosting & server maintenance',
                  'Meta WhatsApp API continuous version upgrades & policy compliance',
                  'Template edits, timing modifications & doctor roster adjustments',
                  '99.9% uptime SLA for patient appointment webhooks',
                  'Priority phone & WhatsApp technical support for your team',
                  'Seamless automatic updates alongside Svaasth HMS features',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#25a969] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transparent Meta Usage Note */}
          <div className="p-4 bg-[#f8faf8] border border-[#e4ece6] rounded-xl text-xs text-[#627a6e] mb-8 leading-relaxed">
            <b>Note on WhatsApp conversation charges:</b> Standard Meta Business Platform conversation rates (billed
            directly by Meta at actuals, typically a few paise per conversation in India) apply to outbound marketing or
            service chats. No markups or surcharges are added by Svaasth.
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={openDemo}
              className="w-full sm:w-auto button flex-1 bg-[#176e56] hover:bg-[#115643] text-white py-3.5 px-8 rounded-xl font-bold text-sm shadow-md transition-all text-center justify-center"
            >
              Get Started with Svaasth Connect
              <ArrowRight size={16} className="ml-2 inline" />
            </button>
            <a
              href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20Svaasth%20Connect%20for%20WhatsApp."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#d2ded6] bg-white hover:bg-[#f1f7f3] text-[#245b49] py-3.5 px-6 rounded-xl font-bold text-sm transition-all"
            >
              <MessageCircle size={16} className="text-[#25d366]" />
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-[#f4f7f4] border-t border-[#e2ebe4]">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#24895b] uppercase">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#173d35] mt-2 mb-3 font-['Manrope']">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-[#61786c]">
              Everything you need to know about setting up Svaasth Connect for your hospital or clinic.
            </p>
          </div>

          <div className="space-y-3">
            {connectFaqs.map((faq, index) => (
              <div
                key={faq.q}
                className="bg-white border border-[#e3eae4] rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm md:text-base text-[#1b4337]"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-[#eef5f0] text-[#1c7855] flex items-center justify-center shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-45' : ''
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs md:text-sm text-[#5a7366] leading-relaxed border-t border-[#f1f5f2] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#1b5e48] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block text-xs font-bold tracking-widest text-[#9ed6b0] uppercase mb-3">
            UPGRADE YOUR PATIENT COMMUNICATION
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-['Manrope'] tracking-tight mb-4 text-white">
            Ready to connect your clinic with WhatsApp?
          </h2>
          <p className="text-sm md:text-base text-[#c4dfcd] max-w-2xl mx-auto mb-8 leading-relaxed">
            Join forward-thinking healthcare providers in India using Svaasth Connect. Setup takes just 48–72 hours with
            complete guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openDemo}
              className="bg-white text-[#175c46] hover:bg-[#f6faf7] font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              Get Svaasth Connect Setup
            </button>
            <a
              href="https://wa.me/917796308778?text=Hello,%20I%20would%20like%20to%20get%20started%20with%20Svaasth%20Connect."
              target="_blank"
              rel="noreferrer"
              className="bg-[#164837] text-white border border-[#2d795b] hover:bg-[#123d2e] font-bold text-sm px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <MessageCircle size={17} className="text-[#25d366]" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-[#fbfcfa] py-8 px-4 md:px-8 border-t border-[#e5ece6] text-xs text-[#6e8578]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Svaasth HMS">
              <img src="/svaasth.png" alt="Svaasth HMS" className="h-7 w-auto object-contain" />
            </a>
            <span className="text-[#a4b4ab]">|</span>
            <span>Svaasth Connect for WhatsApp</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a href="/" className="hover:text-[#176e56]">
              Home
            </a>
            <a href="/#features" className="hover:text-[#176e56]">
              Platform
            </a>
            <a href="/#preview" className="hover:text-[#176e56]">
              Product Tour
            </a>
            <a href="/about" className="hover:text-[#176e56]">
              About
            </a>
            <a href="/contact" className="hover:text-[#176e56]">
              Contact
            </a>
            <a href="/privacy" className="hover:text-[#176e56]">
              Privacy Policy
            </a>
          </div>

          <div>© {new Date().getFullYear()} Svaasth HMS · Built for Indian healthcare</div>
        </div>
      </footer>

      {/* Demo Walkthrough Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-backdrop fixed inset-0 bg-[#173d35]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setModal(false)}
          >
            <motion.div
              className="demo-modal bg-white border border-[#e4ece5] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <button
                className="modal-close absolute top-5 right-5 text-[#6c8276] hover:text-[#173d35]"
                onClick={() => setModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <span className="eyebrow text-xs font-bold text-[#238558] tracking-wider uppercase">
                    SVAASTH CONNECT WALKTHROUGH
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#1a4235] mt-1 mb-2 font-['Manrope']">
                    Get Svaasth Connect
                  </h2>
                  <p className="text-xs text-[#667e72] mb-6">
                    Tell us about your clinic or hospital to schedule a personalized WhatsApp automation walkthrough.
                  </p>

                  <form onSubmit={submitDemo} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#355245] mb-1">Hospital or Clinic Name</label>
                      <input
                        required
                        className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56]"
                        value={form.hospital}
                        placeholder="e.g. Apex Multispeciality Hospital"
                        onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#355245] mb-1">Doctor or Contact Person</label>
                      <input
                        required
                        className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56]"
                        value={form.doctor}
                        placeholder="e.g. Dr. Ramesh Patil"
                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#355245] mb-1">WhatsApp Phone Number</label>
                        <input
                          required
                          type="tel"
                          className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56]"
                          value={form.phone}
                          placeholder="+91 98765 43210"
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#355245] mb-1">City</label>
                        <input
                          required
                          className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56]"
                          value={form.city}
                          placeholder="e.g. Pune"
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#355245] mb-1">Specialty / Clinic Type</label>
                      <select
                        className="w-full border border-[#dce6df] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#176e56] bg-white"
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
                      <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg font-medium">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full button bg-[#176e56] hover:bg-[#115643] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all mt-2"
                    >
                      {sending ? 'Sending Request…' : 'Schedule My Walkthrough'}
                      <ArrowRight size={15} className="ml-1 inline" />
                    </button>
                  </form>
                  <small className="flex items-center justify-center gap-1.5 text-[11px] text-[#7d9387] mt-3">
                    <LockKeyhole size={12} />
                    Your contact details are used exclusively for arranging your demo.
                  </small>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-[#e5f7ed] text-[#1a7a58] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#184234] mb-2 font-['Manrope']">Walkthrough Requested!</h3>
                  <p className="text-xs text-[#637d70] max-w-xs mx-auto mb-6">
                    Thank you! Our WhatsApp automation specialist will contact you shortly on WhatsApp to coordinate your
                    walkthrough.
                  </p>
                  <button
                    onClick={() => setModal(false)}
                    className="button bg-[#176e56] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
