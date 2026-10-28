import { ACTIVE_SPORTS } from '../data/sports';

// "All / Cricket / Football" toggle buttons.
export default function SportFilter({ value, onChange, includeAll = true }) {
  const options = [...(includeAll ? [{ key: 'ALL', label: 'All sports' }] : []), ...ACTIVE_SPORTS];
  return (
    <div className="btn-group" role="group" aria-label="Filter by sport">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`btn btn-sm ${value === opt.key ? 'btn-navy' : 'btn-outline-secondary'}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
