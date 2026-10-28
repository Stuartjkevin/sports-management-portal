// Real login: POST /api/auth/login returns a JWT token, stored by AuthContext.
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import AlertMessage from '../components/AlertMessage';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import { validateLogin } from '../utils/validators';
import { getHomePath, ROLE_LABELS } from '../utils/roles';

// Seeded demo accounts on the backend (backend/src/data/users.js).
const DEMO_ACCOUNTS = [
  { role: 'SUPER_ADMIN', email: 'superadmin@stp.demo' },
  { role: 'CLUB_ADMIN', email: 'clubadmin@stp.demo' },
  { role: 'COACH', email: 'coach@stp.demo' },
  { role: 'PLAYER', email: 'player@stp.demo' },
];
const DEMO_PASSWORD = 'Demo@123';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, errors, formError, submitting, handleChange, handleSubmit, reset } = useForm({ email: '', password: '' }, validateLogin);

  const onLogin = async (data) => {
    const user = await login(data.email.trim(), data.password);
    // Go back to the page the user tried to open, or to the role's home page.
    navigate(location.state?.from ?? getHomePath(user.role), { replace: true });
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="card auth-card">
          <div className="card-body p-4">
            <h1 className="h3 mb-1">Welcome back</h1>
            <p className="text-muted-soft mb-4">Sign in to your portal account.</p>

            <AlertMessage message={formError} type="danger" />

            <form onSubmit={handleSubmit(onLogin)} noValidate>
              <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" required />
              <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="current-password" required />
              <button type="submit" className="btn btn-navy w-100" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
            </form>

            <div className="small-caps text-center mt-4 mb-2">Demo accounts (password {DEMO_PASSWORD})</div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.role} type="button" className="btn btn-sm btn-outline-secondary" onClick={() => reset({ email: a.email, password: DEMO_PASSWORD })}>
                  {ROLE_LABELS[a.role]}
                </button>
              ))}
            </div>

            <p className="text-center small mt-4 mb-0">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
