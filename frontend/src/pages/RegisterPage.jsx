// Registration: POST /api/auth/register creates the account and logs the user in.
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import AlertMessage from '../components/AlertMessage';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import { validateRegister } from '../utils/validators';
import { getHomePath, ROLE_LABELS, ROLES } from '../utils/roles';

// Super Admin accounts are not self-registered.
const roleOptions = [ROLES.CLUB_ADMIN, ROLES.COACH, ROLES.PLAYER].map((r) => ({ value: r, label: ROLE_LABELS[r] }));

const INITIAL = { fullName: '', email: '', password: '', confirmPassword: '', role: '', agree: false };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(INITIAL, validateRegister);

  const onRegister = async (data) => {
    const user = await register({ name: data.fullName.trim(), email: data.email.trim(), password: data.password, role: data.role });
    navigate(getHomePath(user.role), { replace: true });
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="card auth-card" style={{ maxWidth: 560 }}>
          <div className="card-body p-4">
            <h1 className="h3 mb-1">Create your account</h1>
            <p className="text-muted-soft mb-4">Join your club on the portal.</p>

            <AlertMessage message={formError} type="danger" />

            <form onSubmit={handleSubmit(onRegister)} noValidate>
              {/* Server field errors use "name"; the form field is "fullName". */}
              <FormField label="Full name" name="fullName" value={values.fullName} onChange={handleChange} error={errors.fullName ?? errors.name} required />
              <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" required />
              <div className="row">
                <div className="col-sm-6">
                  <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} helpText="At least 8 characters with letters and numbers." autoComplete="new-password" required />
                </div>
                <div className="col-sm-6">
                  <FormField label="Confirm password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" required />
                </div>
              </div>
              <FormField label="I am a" name="role" value={values.role} onChange={handleChange} error={errors.role} placeholder="Select role" options={roleOptions} required />

              <div className="form-check mb-3">
                <input id="agree" name="agree" type="checkbox" className={`form-check-input ${errors.agree ? 'is-invalid' : ''}`} checked={values.agree} onChange={handleChange} />
                <label htmlFor="agree" className="form-check-label">I agree to the terms and privacy policy</label>
                {errors.agree && <div className="invalid-feedback">{errors.agree}</div>}
              </div>

              <button type="submit" className="btn btn-navy w-100" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
            </form>

            <p className="text-center small mt-4 mb-0">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
