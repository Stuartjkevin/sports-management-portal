// Friendly message shown when a list has no items.
export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', message, action }) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`} />
      <h6 className="text-navy mb-1">{title}</h6>
      {message && <p className="small mb-3">{message}</p>}
      {action}
    </div>
  );
}
