import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mail, MessageCircle } from 'lucide-react';
import './legal-pages.css';

const email = 'nityomtikherr@gmail.com';
const phone = '+91 77963 08778';

type LegalSection = { title: string; body: string[] };

const documents: Record<string, { title: string; intro: string; sections: LegalSection[] }> = {
  '/terms': {
    title: 'Terms of Use',
    intro: 'These terms cover your use of the Svaasth HMS website and product information. A separate written proposal or service agreement will govern any hospital software subscription or implementation.',
    sections: [
      { title: 'Using this website', body: ['You may browse this website to learn about Svaasth HMS and contact us. Please provide accurate information in forms and do not misuse the website, interfere with its operation, or attempt to access systems or data without authorization.'] },
      { title: 'Product information and demonstrations', body: ['Screenshots, workflows, patient details, calculations and other examples on this website are illustrative. They may not reflect your configuration or a live hospital record. Confirm scope, availability, pricing, implementation dates and service levels in a written proposal before purchasing.', 'Svaasth HMS is operational software. It does not provide medical advice, make clinical decisions, or replace the professional judgment of healthcare providers.'] },
      { title: 'Software access and customer data', body: ['Access to the software, permitted users, fees, support, data responsibilities, retention and termination will be set out in the applicable proposal or service agreement. Do not submit patient or other sensitive health information through this marketing website or its demo request form.'] },
      { title: 'Intellectual property', body: ['Website text, design, brand assets and software materials are owned by or licensed to Svaasth HMS and may not be copied, modified, republished or commercially used without prior written permission, except where applicable law permits.'] },
      { title: 'Availability and liability', body: ['We aim to keep this website accurate and available, but do not guarantee uninterrupted access or that every item of information is current. To the extent permitted by applicable law, the website is provided without warranties and Svaasth HMS is not liable for indirect or consequential loss arising from website use. Nothing in these terms limits rights or liability that cannot legally be excluded.'] },
      { title: 'Changes and contact', body: ['We may update these terms by publishing a revised version here. These terms are governed by applicable laws of India. For questions, email ' + email + ' or call ' + phone + '.'] },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    intro: 'This policy explains how information is handled when you browse this marketing website or ask us about Svaasth HMS. It does not replace the data terms that apply when a hospital uses the software.',
    sections: [
      { title: 'Information you provide', body: ['If you request a walkthrough, we ask for your hospital or clinic name, contact person, phone number, city and specialty. If you contact us directly, we receive the information you choose to include in your message. Please do not send patient records, clinical notes or other sensitive health information through this website.'] },
      { title: 'How we use it', body: ['We use inquiry information to respond to you, arrange and tailor a product walkthrough, answer questions, and maintain basic business records. We do not use demo inquiries to make clinical decisions or sell personal information.'] },
      { title: 'Service providers and transfers', body: ['The demo request form is submitted through FormSubmit, a third-party form delivery service, to the contact email shown on this website. The site also loads typefaces from Google Fonts. These providers may process technical or submitted information as needed to provide their services and under their own terms and privacy notices.'] },
      { title: 'Retention and security', body: ['We keep inquiry information only as long as reasonably needed to respond, maintain business records, resolve disputes and meet legal obligations. We use reasonable safeguards, but no internet transmission or storage method can be guaranteed completely secure.'] },
      { title: 'Your choices and requests', body: ['You may ask us to access, correct or delete information you sent through the website, subject to applicable law and legitimate recordkeeping needs. Contact ' + email + ' with your request. We may need to verify your identity before acting.'] },
      { title: 'Children and policy updates', body: ['This website is intended for healthcare organizations and adults acting on their behalf; it is not directed to children. We may update this policy by posting a revised version here. For privacy questions, contact ' + email + ' or ' + phone + '.'] },
    ],
  },
  '/refund-policy': {
    title: 'Refunds & Cancellations',
    intro: 'Svaasth HMS is configurable software delivered as a digital service. There is no physical product to return. The written proposal, invoice and service agreement for your hospital set the final fees and service terms.',
    sections: [
      { title: 'Before you confirm an order', body: ['Please review the selected modules, setup scope, implementation timeline, one-time setup fee, recurring hosting fee and any optional services in your written proposal. Ask us to clarify any item before accepting the proposal or making payment.'] },
      { title: 'Cancellation requests', body: ['To request cancellation, email ' + email + ' from your registered business contact and include your hospital name and proposal or invoice reference. We will confirm the effective date and any outstanding obligations under your signed proposal or service agreement.'] },
      { title: 'Refund requests', body: ['Because setup may involve configuration and implementation work, refund eligibility depends on the stage of work, the amounts already paid, and the terms accepted in your written proposal or service agreement. Contact us promptly if you believe a charge is incorrect or the agreed service has not been delivered. We will review the request and explain the outcome. Any non-waivable rights under applicable law remain unaffected.'] },
      { title: 'Service issues', body: ['If you have trouble accessing an active service, contact us with your hospital name, a description of the issue and a way to reach you. We will work with you to investigate and address it under the applicable support terms.'] },
      { title: 'Contact', body: ['Email ' + email + ' or call ' + phone + ' for cancellation, billing or refund questions.'] },
    ],
  },
};

const knownPaths = new Set(['/terms', '/privacy', '/refund-policy', '/about', '/contact']);
export const isCompanyPage = (path: string) => path !== '/' && path !== '/index.html';

function PageHeader() {
  return <header className="info-header"><a href="/" aria-label="Svaasth HMS home"><img src="/svaasth.png" alt="Svaasth HMS — Hospital Management System"/></a><a className="info-home-link" href="/">Home <ArrowRight size={15}/></a></header>;
}

function PageFooter() {
  return <footer className="info-footer"><a href="/">Svaasth HMS</a><nav aria-label="Legal and company pages"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/refund-policy">Refunds &amp; cancellations</a></nav><small>© {new Date().getFullYear()} Svaasth HMS · Built for Indian healthcare</small></footer>;
}

function ContactCard() {
  return <div className="contact-cards"><a href={`mailto:${email}`}><Mail size={18}/><span><small>Email</small><b>{email}</b></span><ArrowRight size={16}/></a><a href="https://wa.me/917796308778" target="_blank" rel="noreferrer"><MessageCircle size={18}/><span><small>Call or WhatsApp</small><b>{phone}</b></span><ArrowRight size={16}/></a></div>;
}

export default function LegalPages({ path }: { path: string }) {
  const policyDoc = documents[path];
  const isNotFound = !policyDoc && !knownPaths.has(path);
  const title = policyDoc?.title ?? (path === '/about' ? 'Thoughtful technology for better care.' : path === '/contact' ? 'Talk with our team.' : 'Page not found');
  const intro = policyDoc?.intro ?? (path === '/about'
    ? 'Svaasth HMS helps hospitals and clinics bring everyday operational work into one connected workspace—from patient registration and appointments to prescriptions, billing and follow-up.'
    : path === '/contact'
      ? 'Tell us about your hospital and the way your team works. We’ll help you explore a setup that fits.'
      : 'We couldn’t find the page you were looking for. The link may have changed or the address may be incorrect.');
  useEffect(() => { globalThis.document.title = `${title} | Svaasth HMS`; }, [title]);

  return <div className="info-page"><PageHeader/><main className={`info-main${isNotFound ? ' info-not-found' : ''}`}>
   
    <span className="eyebrow">{policyDoc ? 'SVAASTH HMS · WEBSITE POLICIES' : path === '/about' ? 'ABOUT SVAASTH HMS' : path === '/contact' ? 'WE’RE HERE TO HELP' : '404 · PAGE NOT FOUND'}</span>
    <h1>{title}</h1><p className="info-intro">{intro}</p>
    {policyDoc && <>
      <p className="info-updated">Last updated: November 1, 2026</p>
      <div className="policy-content">{policyDoc.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>
    </>}
    {path === '/about' && <><div className="info-values"><article><b>Built around real workflows</b><p>Configurable modules, templates and processes help teams work in ways that fit their clinic or hospital.</p></article><article><b>Connected day-to-day operations</b><p>Patient records, appointments, prescriptions and billing can live together in one workspace.</p></article><article><b>Designed for care teams</b><p>Our aim is to reduce repetitive admin and give teams a clearer view of the work ahead.</p></article></div><a className="button" href="/#preview">Explore the product tour <ArrowRight size={16}/></a></>}
    {path === '/contact' && <ContactCard/>}
    {isNotFound && <a className="button" href="/">Go to homepage <ArrowRight size={16}/></a>}
  </main><PageFooter/></div>;
}
