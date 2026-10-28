import FormField from './FormField';
import AlertMessage from './AlertMessage';
import useForm from '../hooks/useForm';
import { validatePlayer } from '../utils/validators';
import { ACTIVE_SPORTS, POSITIONS } from '../data/sports';

const EMPTY_PLAYER = { name: '', sport: '', teamId: '', position: '', jerseyNumber: '', age: '' };

// Add / edit player form. teams = list from the API.
// Duplicate jersey numbers are checked by the server and shown on the field.
export default function PlayerForm({ initialValues, teams = [], onSubmit, onCancel }) {
  const start = initialValues
    ? { ...initialValues, jerseyNumber: String(initialValues.jerseyNumber), age: String(initialValues.age) }
    : EMPTY_PLAYER;

  const { values, errors, formError, submitting, handleChange, setFieldValue, handleSubmit } = useForm(start, validatePlayer);

  // When the sport changes, the team and position must be chosen again.
  const handleSportChange = (event) => {
    handleChange(event);
    setFieldValue('teamId', '');
    setFieldValue('position', '');
  };

  const teamOptions = teams.filter((t) => t.sport === values.sport).map((t) => ({ value: t.id, label: t.name }));
  const positionOptions = (POSITIONS[values.sport] ?? []).map((p) => ({ value: p, label: p }));

  const submit = (data) => onSubmit({
    name: data.name.trim(),
    sport: data.sport,
    teamId: data.teamId,
    position: data.position,
    jerseyNumber: Number(data.jerseyNumber),
    age: Number(data.age),
  });

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <AlertMessage message={formError} type="danger" />
      <div className="row">
        <div className="col-md-4">
          <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
        </div>
        <div className="col-md-4">
          <FormField
            label="Sport" name="sport" value={values.sport} onChange={handleSportChange} error={errors.sport} required
            placeholder="Select sport" options={ACTIVE_SPORTS.map((s) => ({ value: s.key, label: s.label }))}
          />
        </div>
        <div className="col-md-4">
          <FormField
            label="Team" name="teamId" value={values.teamId} onChange={handleChange} error={errors.teamId} required
            placeholder={values.sport ? 'Select team' : 'Choose a sport first'} options={teamOptions} disabled={!values.sport}
          />
        </div>
        <div className="col-md-4">
          <FormField
            label="Position" name="position" value={values.position} onChange={handleChange} error={errors.position} required
            placeholder={values.sport ? 'Select position' : 'Choose a sport first'} options={positionOptions} disabled={!values.sport}
          />
        </div>
        <div className="col-md-4">
          <FormField label="Jersey number" name="jerseyNumber" type="number" min="1" max="99" value={values.jerseyNumber} onChange={handleChange} error={errors.jerseyNumber} required />
        </div>
        <div className="col-md-4">
          <FormField label="Age" name="age" type="number" value={values.age} onChange={handleChange} error={errors.age} required />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-navy" disabled={submitting}>
          {submitting ? 'Saving...' : initialValues ? 'Save changes' : 'Add player'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
