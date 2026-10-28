// Card wrapper with a fixed-height area for a Chart.js chart.
export default function ChartCard({ title, subtitle, children, height = 280 }) {
  return (
    <div className="card h-100">
      <div className="card-header">
        {title}
        {subtitle && <div className="small text-muted-soft fw-normal">{subtitle}</div>}
      </div>
      <div className="card-body">
        <div className="chart-box" style={{ height }}>{children}</div>
      </div>
    </div>
  );
}
