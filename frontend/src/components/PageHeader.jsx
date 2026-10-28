// Title row used at the top of every dashboard page.
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header d-flex flex-wrap align-items-start justify-content-between gap-3">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="text-muted-soft mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
