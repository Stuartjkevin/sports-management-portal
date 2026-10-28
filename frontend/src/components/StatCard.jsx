// Summary number card, e.g. "Total Players 32".
export default function StatCard({ icon, label, value, hint, color = '#0f1f3d' }) {
  return (
    <div className="card stat-card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="stat-icon" style={{ background: `${color}1a`, color }}>
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="small-caps">{label}</div>
          <div className="stat-value">{value}</div>
          {hint && <div className="small text-muted-soft">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
