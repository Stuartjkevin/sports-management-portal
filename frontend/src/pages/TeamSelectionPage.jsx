// Smart Team Selection Assistant. The lineup is calculated by the backend:
// POST /api/team-selection  { teamId, count, strategy }
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import AlertMessage from '../components/AlertMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import SportBadge from '../components/SportBadge';
import useForm from '../hooks/useForm';
import useApi from '../hooks/useApi';
import { selectionService, teamService } from '../services/resourceServices';
import { validateSelection } from '../utils/validators';
import { STRATEGIES } from '../utils/selectionOptions';

const lineupColumns = [
  { key: 'rank', label: '#', render: (_, i) => <span className="fw-bold">{i + 1}</span> },
  { key: 'name', label: 'Player', render: (p) => <><div className="fw-semibold">{p.name}</div><div className="small text-muted-soft">#{p.jerseyNumber} · {p.position}</div></> },
  { key: 'score', label: 'Score', render: (p) => <span className="badge text-bg-dark">{p.score}</span> },
  { key: 'explanation', label: 'Why selected', render: (p) => <span className="small">{p.explanation}</span> },
];

export default function TeamSelectionPage() {
  const teams = useApi(() => teamService.list(), []);
  const [result, setResult] = useState(null);

  // The squad size comes from the chosen team's roster (null while it loads).
  // useForm calls the validator from the latest render, so it always sees the current squadSize.
  let squadSize = null;
  const { values, errors, formError, submitting, handleChange, setFieldValue, handleSubmit } = useForm(
    { teamId: '', count: '11', strategy: 'BALANCED' },
    (v) => validateSelection(v, squadSize),
  );
  const roster = useApi(() => (values.teamId ? teamService.roster(values.teamId) : Promise.resolve([])), [values.teamId]);
  squadSize = values.teamId && !roster.loading && roster.data ? roster.data.length : null;

  const handleTeamChange = (event) => {
    handleChange(event);
    setFieldValue('count', '11');
    setResult(null);
  };

  const generate = async (data) => {
    setResult(await selectionService.recommend({ teamId: data.teamId, count: Number(data.count), strategy: data.strategy }));
  };

  if (teams.error) return <><PageHeader title="Smart Team Selection" /><ErrorState error={teams.error} onRetry={teams.reload} /></>;

  const strategyLabel = STRATEGIES.find((s) => s.value === result?.strategy)?.label;
  const teamOptions = (teams.data ?? []).map((t) => ({ value: t.id, label: `${t.name} (${t.sport === 'CRICKET' ? 'Cricket' : 'Football'})` }));

  return (
    <>
      <PageHeader title="Smart Team Selection" subtitle="Get a recommended lineup based on rating, form and attendance." />

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Selection settings</div>
            <div className="card-body">
              <AlertMessage message={formError} type="danger" />
              <form onSubmit={handleSubmit(generate)} noValidate>
                <FormField label="Team" name="teamId" value={values.teamId} onChange={handleTeamChange} error={errors.teamId} placeholder="Select team" options={teamOptions} />
                <FormField
                  label="Number of players" name="count" type="number" min="1" value={values.count} onChange={handleChange} error={errors.count}
                  helpText={values.teamId && squadSize !== null ? `Squad size: ${squadSize} players` : undefined}
                />
                <FormField label="Strategy" name="strategy" value={values.strategy} onChange={handleChange} error={errors.strategy} options={STRATEGIES} />
                <button type="submit" className="btn btn-navy w-100" disabled={submitting}>
                  <i className="bi bi-stars me-1" />{submitting ? 'Generating...' : 'Generate lineup'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {submitting ? (
            <LoadingPlaceholder variant="table" count={6} />
          ) : !result ? (
            <div className="card"><EmptyState icon="bi-stars" title="No lineup yet" message="Choose a team and click 'Generate lineup'." /></div>
          ) : (
            <>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <h5 className="mb-0">Recommended lineup - {result.team.name}</h5>
                    <SportBadge sport={result.team.sport} />
                  </div>
                  <p className="mb-0 text-muted-soft">
                    Using the <strong>{strategyLabel}</strong> strategy, the assistant picked the top {result.lineup.length} players
                    (average score <strong>{result.averageScore}</strong>). Required positions such as the
                    {result.team.sport === 'CRICKET' ? ' wicket-keeper' : ' goalkeeper'} are filled first, then remaining spots go to the highest scores.
                  </p>
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-header">Starting lineup</div>
                <DataTable columns={lineupColumns} rows={result.lineup} />
              </div>
              <div className="card">
                <div className="card-header">Bench ({result.bench.length})</div>
                <div className="card-body d-flex flex-wrap gap-2">
                  {result.bench.length === 0
                    ? <span className="text-muted-soft small">Every squad member is in the lineup.</span>
                    : result.bench.map((p) => <span key={p.id} className="badge text-bg-light border">#{p.jerseyNumber} {p.name} · {p.score}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
