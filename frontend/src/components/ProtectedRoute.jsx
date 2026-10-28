// Route guard.
// - Not logged in -> redirect to /login (and remember where the user wanted to go).
// - Wrong role    -> show an "access denied" message.
// Hiding pages here is only for user experience; the backend also blocks
// every API call the role is not allowed to make.
import { Link, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import EmptyState from './EmptyState';
import { getHomePath, ROLE_LABELS } from '../utils/roles';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="card">
        <EmptyState
          icon="bi-shield-lock"
          title="Access denied"
          message={`The ${ROLE_LABELS[user.role]} role cannot open this page.`}
          action={<Link to={getHomePath(user.role)} className="btn btn-navy">Go to my dashboard</Link>}
        />
      </div>
    );
  }

  return children;
}
