import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import AlertMessage from '../components/AlertMessage';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import { authService } from '../services/authService';
import { validatePasswordChange, validateProfile } from '../utils/validators';
import { ROLE_BADGE_CLASS, ROLE_LABELS } from '../utils/roles';
import { getInitials } from '../utils/format';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [notice, setNotice] = useState(null);

  const profile = useForm({ name: user.name, email: user.email, phone: user.phone ?? '', bio: user.bio ?? '' }, validateProfile);
  const password = useForm({ currentPassword: '', newPassword: '', confirmPassword: '' }, validatePasswordChange);

  // PUT /api/auth/me
  const saveProfile = async (data) => {
    await updateProfile({ ...data, name: data.name.trim() });
    setNotice('Profile updated.');
  };

  // PUT /api/auth/me/password
  const savePassword = async (data) => {
    await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
    password.reset();
    setNotice('Password changed. Use the new password next time you log in.');
  };

  return (
    <>
      <PageHeader title="Profile Settings" subtitle="Update your personal details and password." />
      <AlertMessage message={notice} onClose={() => setNotice(null)} />

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card text-center">
            <div className="card-body">
              <div className="jersey mx-auto mb-3" style={{ width: 80, height: 80, fontSize: '1.6rem' }}>{getInitials(user.name)}</div>
              <h5 className="mb-1">{user.name}</h5>
              <div className="small text-muted-soft mb-2">{user.email}</div>
              <span className={`badge ${ROLE_BADGE_CLASS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-header">Personal details</div>
            <div className="card-body">
              <AlertMessage message={profile.formError} type="danger" />
              <form onSubmit={profile.handleSubmit(saveProfile)} noValidate>
                <div className="row">
                  <div className="col-md-6"><FormField label="Full name" name="name" value={profile.values.name} onChange={profile.handleChange} error={profile.errors.name} required /></div>
                  <div className="col-md-6"><FormField label="Email" name="email" type="email" value={profile.values.email} onChange={profile.handleChange} error={profile.errors.email} required /></div>
                  <div className="col-md-6"><FormField label="Phone" name="phone" value={profile.values.phone} onChange={profile.handleChange} error={profile.errors.phone} placeholder="+91 98765 43210" /></div>
                  <div className="col-12">
                    <FormField label="Bio" name="bio" as="textarea" value={profile.values.bio} onChange={profile.handleChange} error={profile.errors.bio} helpText={`${profile.values.bio.length}/200 characters`} />
                  </div>
                </div>
                <button type="submit" className="btn btn-navy" disabled={profile.submitting}>{profile.submitting ? 'Saving...' : 'Save profile'}</button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Change password</div>
            <div className="card-body">
              <AlertMessage message={password.formError} type="danger" />
              <form onSubmit={password.handleSubmit(savePassword)} noValidate>
                <div className="row">
                  <div className="col-md-4"><FormField label="Current password" name="currentPassword" type="password" value={password.values.currentPassword} onChange={password.handleChange} error={password.errors.currentPassword} autoComplete="current-password" /></div>
                  <div className="col-md-4"><FormField label="New password" name="newPassword" type="password" value={password.values.newPassword} onChange={password.handleChange} error={password.errors.newPassword} autoComplete="new-password" /></div>
                  <div className="col-md-4"><FormField label="Confirm new password" name="confirmPassword" type="password" value={password.values.confirmPassword} onChange={password.handleChange} error={password.errors.confirmPassword} autoComplete="new-password" /></div>
                </div>
                <button type="submit" className="btn btn-outline-secondary" disabled={password.submitting}>{password.submitting ? 'Updating...' : 'Update password'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
