import FormField from './FormField';
import AlertMessage from './AlertMessage';
import useForm from '../hooks/useForm';
import { validateTeam } from '../utils/validators';
import { ACTIVE_SPORTS, AGE_GROUPS } from '../data/sports';

const EMPTY_TEAM = { name: '', clubId: '', sport: '', coach: '', ageGroup: '' };

// clubs: list from the API, used for the "Club" dropdown.
export default function TeamForm({ clubs = [], onSubmit, onCancel }) {
  const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(EMPTY_TEAM, validateTeam);

  const submit = (data) => onSubmit({ ...data, name: data.name.trim(), coach: data.coach.trim() });

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <AlertMessage message={formError} type="danger" />
      <div className="row">
        <div className="col-md-4">
          <FormField label="Team name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
        </div>
        <div className="col-md-4">
          <FormField
            label="Club" name="clubId" value={values.clubId} onChange={handleChange} error={errors.clubId} required
            placeholder="Select club" options={clubs.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <div className="col-md-4">
          <FormField
            label="Sport" name="sport" value={values.sport} onChange={handleChange} error={errors.sport} required
            placeholder="Select sport" options={ACTIVE_SPORTS.map((s) => ({ value: s.key, label: s.label }))}
          />
        </div>
        <div className="col-md-6">
          <FormField label="Coach name" name="coach" value={values.coach} onChange={handleChange} error={errors.coach} required />
        </div>
        <div className="col-md-6">
          <FormField
            label="Age group" name="ageGroup" value={values.ageGroup} onChange={handleChange} error={errors.ageGroup} required
            placeholder="Select age group" options={AGE_GROUPS.map((a) => ({ value: a, label: a }))}
          />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-navy" disabled={submitting}>{submitting ? 'Saving...' : 'Add team'}</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
