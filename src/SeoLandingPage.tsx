import { ArrowRight, Check } from 'lucide-react';
import './legal-pages.css';

type SeoPage = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; copy: string; items: string[] }>;
};

const pages: Record<string, SeoPage> = {
  '/hospital-management-software': {
    path: '/hospital-management-software',
    eyebrow: 'HOSPITAL MANAGEMENT SOFTWARE',
    title: 'Hospital management software for connected care',
    intro: 'Svaasth HMS gives hospitals across India one configurable workspace for OPD, IPD, patient records, prescriptions, billing, inventory and follow-up.',
    sections: [
      { title: 'Manage the whole hospital workflow', copy: 'Bring reception, doctors, nursing teams, billing and administration into a clearer daily workflow without forcing every department into the same process.', items: ['OPD registration, token queues and vitals', 'IPD admissions, wards, beds and discharge summaries', 'Patient history, prescriptions, billing and dues', 'Medicine inventory and configurable hospital templates'] },
      { title: 'Built for Indian hospitals', copy: 'Configure fees, letterheads, workflows and communication around your hospital. Svaasth works in a modern browser without requiring you to manage a local server.', items: ['Private hospital workspace', 'Browser-based access for desktop, tablet and phone', 'Email and SMS workflows where configured', 'Support for growing single-location teams'] },
    ],
  },
  '/clinic-management-software': {
    path: '/clinic-management-software',
    eyebrow: 'CLINIC MANAGEMENT SOFTWARE',
    title: 'Clinic management software that keeps visits moving',
    intro: 'Run registration, appointments, consultation notes, digital prescriptions, billing and follow-ups from one simple clinic workspace.',
    sections: [
      { title: 'A calmer day for clinics', copy: 'Svaasth helps independent doctors and multi-doctor clinics reduce repetitive admin while keeping patient information connected from arrival to follow-up.', items: ['Quick patient registration and OPD queues', 'Reusable clinical templates and digital prescriptions', 'Consultation fees, receipts and installments', 'Patient history and follow-up details in one record'] },
      { title: 'Configure it around your specialty', copy: 'Use the modules and templates that fit your practice, whether you run an orthopaedic, dental, women’s health, surgical or multi-specialty clinic.', items: ['Custom branding and hospital letterhead', 'Doctor rosters and configured fees', 'Specialty-specific workflows and templates', 'WhatsApp, email and document sharing options'] },
    ],
  },
  '/opd-management-software': {
    path: '/opd-management-software',
    eyebrow: 'OPD MANAGEMENT SOFTWARE',
    title: 'OPD management software for smoother patient flow',
    intro: 'Organize registration, token queues, vitals, consultation notes, prescriptions and OPD billing in a connected workflow.',
    sections: [
      { title: 'From token to consultation', copy: 'Give reception and clinical teams a shared view of the day so patients move through the OPD with less paper and fewer handoffs.', items: ['Token queues and registration', 'Vitals before consultation', 'Doctor-wise patient flow', 'Visit-linked prescriptions and receipts'] },
      { title: 'Keep every visit connected', copy: 'A patient’s visits, notes, prescriptions and payments can stay together, making it easier for the team to understand what needs attention next.', items: ['Searchable patient records', 'Configurable consultation templates', 'Follow-up and payment history', 'Print-ready patient documents'] },
    ],
  },
  '/hospital-billing-software': {
    path: '/hospital-billing-software',
    eyebrow: 'HOSPITAL BILLING SOFTWARE',
    title: 'Hospital billing software with clearer payment workflows',
    intro: 'Track consultation fees, follow-ups, procedures, receipts, installments and outstanding dues alongside the patient visit.',
    sections: [
      { title: 'Make billing part of the visit', copy: 'Link charges and payments to the patient record so your team can see what was billed, what was paid and what remains due.', items: ['Consultation and follow-up fees', 'OPD bills and receipts', 'Cash, UPI and card payment records', 'Installments and outstanding balances'] },
      { title: 'Configure charges around your hospital', copy: 'Set up the fees, validity windows, services and documents your hospital actually uses, with a workflow that can grow beyond OPD.', items: ['Procedure and service catalogues', 'Patient-linked billing history', 'Letterhead-ready print outputs', 'Hospital-specific configuration and support'] },
    ],
  },
  '/digital-prescription-software': {
    path: '/digital-prescription-software',
    eyebrow: 'DIGITAL PRESCRIPTION SOFTWARE',
    title: 'Digital prescription software for clearer clinical communication',
    intro: 'Create legible, reusable prescriptions with configurable medicine templates and output that fits your hospital letterhead.',
    sections: [
      { title: 'Prescribe with less repetition', copy: 'Save commonly used medicines and treatment patterns so doctors can spend more time on the consultation and less time re-entering routine details.', items: ['Searchable medicine catalogue', 'Reusable medicine and treatment templates', 'Diagnosis and findings linked to the visit', 'Print or email-ready prescription output'] },
      { title: 'Keep prescriptions connected', copy: 'A prescription can remain part of the patient’s visit and history, making it easier for the care team to find the context when the patient returns.', items: ['Patient-linked consultation history', 'Hospital branding and letterhead options', 'Clear dosage, frequency and duration fields', 'Configurable workflows for different specialties'] },
    ],
  },
};

export const seoPagePaths = Object.keys(pages);
export const getSeoPage = (path: string) => pages[path];

export default function SeoLandingPage({ page }: { page: SeoPage }) {
  return (
    <div className="info-page">
      <header className="info-header">
        <a href="/" aria-label="Svaasth HMS home"><img src="/svaasth.png" alt="Svaasth HMS — Hospital Management System" /></a>
        <a className="info-home-link" href="/">Home <ArrowRight size={15} /></a>
      </header>
      <main className="info-main">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p className="info-intro">{page.intro}</p>
        <div className="policy-content">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
              <ul className="seo-benefit-list">
                {section.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
        <a className="button" href="/#preview">See Svaasth in action <ArrowRight size={16} /></a>
      </main>
      <footer className="info-footer"><a href="/">Svaasth HMS</a><nav aria-label="Site pages"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>© {new Date().getFullYear()} Svaasth HMS · Built for Indian healthcare</small></footer>
    </div>
  );
}
