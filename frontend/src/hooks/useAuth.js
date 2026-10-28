import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Use this hook in any component to read the current (demo) user.
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
