import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getHomePath } from '../utils/roles';

// /dashboard sends each role to its own home page.
export default function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePath(user.role)} replace />;
}
