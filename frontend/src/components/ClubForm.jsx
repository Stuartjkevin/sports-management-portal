import FormField from './FormField';
import AlertMessage from './AlertMessage';
import useForm from '../hooks/useForm';
import { validateClub } from '../utils/validators';
import { SPORTS } from '../data/sports';

const EMPTY_CLUB = { name: '', city: '', founded: '', contactEmail: '', sports: [], status: 'ACTIVE' };

// Add / edit club form. Pass initialValues to edit an existing club.
// onSubmit must return a Promise; server errors are shown on the form.
export default function ClubForm({ initialValues, onSubmit, onCancel }) {
  const { values, errors, formError, submitting, handleChange, setFieldValue, handleSubmit } = useForm(
    initialValues ? { ...initialValues, founded: String(initialValues.founded) } : EMPTY_CLUB,
    validateClub,
  );

  const toggleSport = (key) => {
    const next = values.sports.includes(key) ? values.sports.filter((s) => s !== key) : [...values.sports, key];
    setFieldValue('sports', next);
  };

  const submit = (data) => onSubmit({
    name: data.name.trim(), city: data.city.trim(), founded: Number(data.founded),
    contactEmail: data.contactEmail.trim(), sports: data.sports, status: data.status,
  });

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <AlertMessage message={formError} type="danger" />
      <div className="row">
        <div className="col-md-6">
          <FormField label="Club name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
        </div>
        <div className="col-md-6">
          <FormField label="City" name="city" value={values.city} onChange={handleChange} error={errors.city} required />
        </div>
        <div className="col-md-4">
          <FormField label="Founded year" name="founded" type="number" value={values.founded} onChange={handleChange} error={errors.founded} required />
        </div>
        <div className="col-md-5">
          <FormField label="Contact email" name="contactEmail" type="email" value={values.contactEmail} onChange={handleChange} error={errors.contactEmail} required />
        </div>
        <div className="col-md-3">
          <FormField
            label="Status" name="status" value={values.status} onChange={handleChange} error={errors.status}
            options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="form-label fw-medium">Sports offered <span className="text-danger">*</span></div>
        <div className="d-flex flex-wrap gap-3">
          {SPORTS.map((sport) => (
            <div className="form-check" key={sport.key}>
              <input
                id={`club-sport-${sport.key}`} type="checkbox"
                className={`form-check-input ${errors.sports ? 'is-invalid' : ''}`}
                checked={values.sports.includes(sport.key)} onChange={() => toggleSport(sport.key)}
              />
              <label className="form-check-label" htmlFor={`club-sport-${sport.key}`}>
                {sport.label}{!sport.active && <span className="text-muted-soft small"> (later)</span>}
              </label>
            </div>
          ))}
        </div>
        {errors.sports && <div className="text-danger small mt-1">{errors.sports}</div>}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-navy" disabled={submitting}>
          {submitting ? 'Saving...' : initialValues ? 'Save changes' : 'Add club'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
