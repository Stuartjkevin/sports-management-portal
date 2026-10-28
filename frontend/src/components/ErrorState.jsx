import EmptyState from './EmptyState';

// Shown when data could not be loaded from the API.
export default function ErrorState({ error, onRetry }) {
  const offline = error?.status === 0;
  return (
    <div className="card">
      <EmptyState
        icon={offline ? 'bi-wifi-off' : 'bi-exclamation-triangle'}
        title={offline ? 'Cannot reach the server' : 'Could not load data'}
        message={error?.message}
        action={onRetry && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onRetry}>Try again</button>}
      />
    </div>
  );
}
