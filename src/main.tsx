import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LegalPages, { isCompanyPage } from './LegalPages';
import SeoLandingPage, { getSeoPage } from './SeoLandingPage';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const seoPage = getSeoPage(path);
const routeMeta: Record<string, { title: string; description: string }> = {
  '/hospital-management-software': {
    title: 'Hospital Management Software in India | Svaasth HMS',
    description: 'Manage OPD, IPD, patient records, prescriptions, billing and inventory with configurable hospital management software from Svaasth HMS.',
  },
  '/clinic-management-software': {
    title: 'Clinic Management Software in India | Svaasth HMS',
    description: 'Run registration, consultations, prescriptions, billing and follow-ups with simple clinic management software from Svaasth HMS.',
  },
  '/opd-management-software': {
    title: 'OPD Management Software for Hospitals and Clinics | Svaasth',
    description: 'Organize registration, token queues, vitals, consultations, prescriptions and OPD billing in one connected workflow.',
  },
  '/hospital-billing-software': {
    title: 'Hospital Billing Software in India | Svaasth HMS',
    description: 'Track hospital consultation fees, receipts, installments, procedures and outstanding dues with Svaasth HMS billing software.',
  },
  '/digital-prescription-software': {
    title: 'Digital Prescription Software for Clinics | Svaasth HMS',
    description: 'Create clear, reusable and letterhead-ready digital prescriptions with Svaasth HMS for hospitals and clinics.',
  },
  '/about': {
    title: 'About Svaasth HMS | Healthcare Software for India',
    description: 'Learn how Svaasth HMS helps Indian hospitals and clinics connect everyday care workflows.',
  },
  '/contact': {
    title: 'Contact Svaasth HMS | Book a Product Walkthrough',
    description: 'Talk to the Svaasth HMS team about hospital and clinic management software for your workflow.',
  },
  '/privacy': {
    title: 'Privacy Policy | Svaasth HMS',
    description: 'Read the Svaasth HMS privacy policy for this website and demo enquiries.',
  },
  '/terms': {
    title: 'Terms of Use | Svaasth HMS',
    description: 'Read the terms that apply to the Svaasth HMS website and product information.',
  },
  '/refund-policy': {
    title: 'Refunds and Cancellations | Svaasth HMS',
    description: 'Review Svaasth HMS refund and cancellation information for digital services.',
  },
};
const metadata = routeMeta[path];
if (metadata) {
  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://svaasth.in${path}/`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://svaasth.in${path}/`);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', metadata.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metadata.description);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {seoPage ? <SeoLandingPage page={seoPage} /> : isCompanyPage(path) ? <LegalPages path={path} /> : <App />}
  </React.StrictMode>,
);
