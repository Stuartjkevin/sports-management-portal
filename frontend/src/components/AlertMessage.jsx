const ICONS = { success: 'bi-check-circle', danger: 'bi-exclamation-triangle', warning: 'bi-exclamation-circle', info: 'bi-info-circle' };

// Dismissible message shown after an action (or a form error from the server).
export default function AlertMessage({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} d-flex justify-content-between align-items-center py-2`} role="alert">
      <span><i className={`bi ${ICONS[type] ?? ICONS.info} me-2`} />{message}</span>
      {onClose && <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />}
    </div>
  );
}
