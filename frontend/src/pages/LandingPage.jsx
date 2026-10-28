import { Link } from 'react-router-dom';
import { SPORTS } from '../data/sports';

const FEATURES = [
  { icon: 'bi-building', title: 'Clubs & Teams', text: 'Manage multiple clubs, teams and age groups across sports in one place.' },
  { icon: 'bi-person-lines-fill', title: 'Player Profiles', text: 'Track jersey numbers, positions, ratings, form and attendance.' },
  { icon: 'bi-calendar-event', title: 'Matches & Tournaments', text: 'Schedule fixtures, record results and follow live standings.' },
  { icon: 'bi-clipboard-check', title: 'Training & Attendance', text: 'Plan sessions and mark players Present, Absent or Excused.' },
  { icon: 'bi-graph-up', title: 'Performance Analytics', text: 'Visual charts for team form, top performers and results.' },
  { icon: 'bi-stars', title: 'Smart Team Selection', text: 'Get a recommended lineup with a clear explanation for every pick.' },
];

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge text-bg-warning mb-3">Cricket · Football · more coming soon</span>
              <h1 className="mb-3">Run your sports club like a professional team.</h1>
              <p className="lead mb-4">
                One portal for admins, coaches and players to manage teams, matches, training and performance analytics.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/register" className="btn btn-warning btn-lg fw-semibold">Get started</Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">Try the demo</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-panel">
                <div className="small-caps text-white-50 mb-3">This season at a glance</div>
                <div className="row g-3 text-center">
                  {[['32', 'Players'], ['5', 'Teams'], ['10', 'Matches'], ['4', 'Tournaments']].map(([value, label]) => (
                    <div className="col-6" key={label}>
                      <div className="bg-navy rounded-3 py-3">
                        <div className="fs-3 fw-bold">{value}</div>
                        <div className="small text-white-50">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 border-bottom">
        <div className="container d-flex flex-wrap justify-content-center gap-3">
          {SPORTS.map((sport) => (
            <span key={sport.key} className={`badge badge-sport badge-sport-${sport.key.toLowerCase()} fs-6 px-3 py-2`}>
              <i className={`bi ${sport.icon} me-2`} />{sport.label}{!sport.active && ' (soon)'}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Everything your club needs</h2>
            <p className="text-muted-soft">Built for Super Admins, Club Admins, Coaches and Players.</p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="feature-icon mb-3"><i className={`bi ${f.icon}`} /></div>
                    <h5>{f.title}</h5>
                    <p className="text-muted-soft mb-0">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="cta-section d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h2 className="mb-1">Ready to organise your next season?</h2>
              <p className="mb-0 text-white-50">Create an account or explore the demo with any role.</p>
            </div>
            <Link to="/register" className="btn btn-warning btn-lg fw-semibold">Create free account</Link>
          </div>
        </div>
      </section>
    </>
  );
}
