import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center text-center p-4">
      <div>
        <div className="display-1 fw-bold text-navy">404</div>
        <h1 className="h4 mb-2">Page not found</h1>
        <p className="text-muted-soft mb-4">The page you are looking for does not exist or was moved.</p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-navy">Back to home</Link>
          <Link to="/dashboard" className="btn btn-outline-secondary">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
