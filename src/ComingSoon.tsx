import { ArrowUpRight, Check, Clock3, Mail, ShieldCheck } from 'lucide-react';

function ComingSoon() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-grid" aria-hidden="true" />
      <div className="coming-soon-orb coming-soon-orb-one" aria-hidden="true" />
      <div className="coming-soon-orb coming-soon-orb-two" aria-hidden="true" />

      <header className="coming-soon-header">
        <a className="coming-soon-brand" href="/" aria-label="Svaasth home">
          <span className="coming-soon-mark">
            <img src="/Svaasth_logo.png" alt="" />
          </span>
          <span>
            <strong>Svaasth<span>—</span></strong>
            <small>HOSPITAL MANAGEMENT SYSTEM</small>
          </span>
        </a>
        <span className="coming-soon-status">
          <i aria-hidden="true" />
          Launching soon
        </span>
      </header>

      <section className="coming-soon-content" aria-labelledby="coming-soon-title">
        <div className="coming-soon-copy">
          <span className="coming-soon-eyebrow">
            <Clock3 size={13} strokeWidth={2.2} />
            A better way to run healthcare
          </span>
          <h1 id="coming-soon-title">
            Care, connected.
            <span>Coming soon.</span>
          </h1>
          <p>
            Svaasth brings OPD, patient records, prescriptions, billing and
            inventory together in one calm, configurable workspace for
            healthcare teams.
          </p>
          <div className="coming-soon-points">
            <span><Check size={14} /> Built for your hospital</span>
            <span><Check size={14} /> Simple for every team</span>
          </div>
          <a className="coming-soon-button" href="mailto:hello@svaasth.in">
            Get in touch
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="coming-soon-panel" aria-label="Svaasth is preparing for launch">
          <div className="coming-soon-panel-glow" aria-hidden="true" />
          <div className="coming-soon-panel-top">
            <div className="coming-soon-panel-brand">
              <span className="coming-soon-panel-icon"><ShieldCheck size={17} /></span>
              <span><b>Svaasth HMS</b><small>YOUR CARE WORKSPACE</small></span>
            </div>
            <span className="coming-soon-live"><i /> Preparing</span>
          </div>
          <div className="coming-soon-panel-body">
            <small className="coming-soon-panel-label">THE NEXT STEP IN CARE</small>
            <h2>Everything your hospital needs, in one place.</h2>
            <div className="coming-soon-progress">
              <span><b>Getting things ready</b><em>Almost there</em></span>
              <i><strong /></i>
            </div>
            <div className="coming-soon-panel-footer">
              <span><Mail size={14} /> hello@svaasth.in</span>
              <span>India-first healthcare software</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="coming-soon-footer">
        <span>© {new Date().getFullYear()} Svaasth HMS</span>
        <span>Thoughtfully made for better care.</span>
      </footer>
    </main>
  );
}

export default ComingSoon;
