import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import MatchCard from '../components/MatchCard';
import SportFilter from '../components/SportFilter';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import useApi from '../hooks/useApi';
import { matchService, teamService } from '../services/resourceServices';
import { buildNameMap } from '../utils/lookups';

function MatchGrid({ list, teamNames, emptyText }) {
  if (list.length === 0) return <div className="card mb-4"><EmptyState icon="bi-calendar-x" title="No matches" message={emptyText} /></div>;
  return (
    <div className="row g-3 mb-4">
      {list.map((m) => (
        <div className="col-md-6 col-xl-4" key={m.id}><MatchCard match={m} teamName={teamNames[m.teamId]} /></div>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const [sport, setSport] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');
  // Filtering happens on the server: GET /api/matches?sport=...&teamId=...
  const matches = useApi(() => matchService.list({ sport, teamId }), [sport, teamId]);
  const teams = useApi(() => teamService.list(), []);
  const teamNames = buildNameMap(teams.data);

  const list = matches.data ?? [];
  const upcoming = list.filter((m) => m.status === 'UPCOMING');
  const completed = list.filter((m) => m.status === 'COMPLETED');

  return (
    <>
      <PageHeader title="Match Calendar" subtitle="Upcoming fixtures and recent results." />

      <div className="d-flex flex-wrap gap-2 mb-4">
        <SportFilter value={sport} onChange={(v) => { setSport(v); setTeamId('ALL'); }} />
        <select className="form-select form-select-sm w-auto" value={teamId} onChange={(e) => setTeamId(e.target.value)} aria-label="Filter by team">
          <option value="ALL">All teams</option>
          {(teams.data ?? []).filter((t) => sport === 'ALL' || t.sport === sport).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {matches.error ? (
        <ErrorState error={matches.error} onRetry={matches.reload} />
      ) : matches.loading ? (
        <LoadingPlaceholder count={4} />
      ) : (
        <>
          <h5 className="mb-3"><i className="bi bi-calendar-event me-2" />Upcoming ({upcoming.length})</h5>
          <MatchGrid list={upcoming} teamNames={teamNames} emptyText="No upcoming matches for these filters." />
          <h5 className="mb-3"><i className="bi bi-check2-circle me-2" />Completed ({completed.length})</h5>
          <MatchGrid list={completed} teamNames={teamNames} emptyText="No completed matches for these filters." />
        </>
      )}
    </>
  );
}
