// Grey "skeleton" blocks shown while data is loading (uses Bootstrap placeholders).
export default function LoadingPlaceholder({ count = 4, variant = 'cards' }) {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="card">
        <div className="card-body placeholder-glow">
          {items.map((_, i) => (
            <span key={i} className="placeholder col-12 rounded mb-3" style={{ height: 22 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {items.map((_, i) => (
        <div key={i} className="col-sm-6 col-xl-3">
          <div className="card">
            <div className="card-body placeholder-glow">
              <span className="placeholder col-5 mb-2" />
              <span className="placeholder placeholder-lg col-4 d-block mb-2" />
              <span className="placeholder col-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
