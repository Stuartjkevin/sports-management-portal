import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import TeamCard from '../components/TeamCard';
import TeamForm from '../components/TeamForm';
import DataTable from '../components/DataTable';
import SportFilter from '../components/SportFilter';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import AlertMessage from '../components/AlertMessage';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import { clubService, playerService, teamService } from '../services/resourceServices';
import { buildNameMap } from '../utils/lookups';
import { ROLES } from '../utils/roles';

const rosterColumns = [
  { key: 'jerseyNumber', label: '#', render: (p) => <span className="fw-bold">{p.jerseyNumber}</span> },
  { key: 'name', label: 'Player', render: (p) => <span className="fw-semibold">{p.name}</span> },
  { key: 'position', label: 'Position' },
  { key: 'age', label: 'Age' },
  { key: 'rating', label: 'Rating' },
  { key: 'form', label: 'Form' },
  { key: 'attendanceRate', label: 'Attendance', render: (p) => `${p.attendanceRate}%` },
];

export default function TeamsPage() {
  const { user } = useAuth();
  // Only Super Admin and Club Admin may create or delete teams (the API enforces this too).
  const canManage = [ROLES.SUPER_ADMIN, ROLES.CLUB_ADMIN].includes(user.role);

  const teams = useApi(() => teamService.list(), []);
  const clubs = useApi(() => clubService.list(), []);
  const players = useApi(() => playerService.list(), []);

  const [sport, setSport] = useState('ALL');
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState(null);

  const allTeams = teams.data ?? [];
  const activeId = selectedId ?? allTeams[0]?.id ?? null;
  const roster = useApi(() => (activeId ? teamService.roster(activeId) : Promise.resolve([])), [activeId]);

  const clubNames = buildNameMap(clubs.data);
  const visibleTeams = allTeams.filter((t) => sport === 'ALL' || t.sport === sport);
  const selectedTeam = allTeams.find((t) => t.id === activeId);
  const playerCount = (teamId) => (players.data ?? []).filter((p) => p.teamId === teamId).length;

  const handleAdd = async (data) => {
    const team = await teamService.create(data);
    setSelectedId(team.id);
    setShowForm(false);
    setNotice({ type: 'success', text: `"${team.name}" was created.` });
    teams.reload();
  };

  const handleDelete = async (team) => {
    if (!window.confirm(`Delete ${team.name}?`)) return;
    try {
      await teamService.remove(team.id);
      if (selectedId === team.id) setSelectedId(null);
      setNotice({ type: 'success', text: `"${team.name}" was deleted.` });
      teams.reload();
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    }
  };

  return (
    <>
      <PageHeader
        title="Team Management"
        subtitle="Teams across all clubs. Select a team to view its roster."
        actions={canManage && <button type="button" className="btn btn-navy" onClick={() => setShowForm(true)}><i className="bi bi-plus-lg me-1" />Add team</button>}
      />

      <AlertMessage message={notice?.text} type={notice?.type} onClose={() => setNotice(null)} />

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">Create a team</div>
          <div className="card-body"><TeamForm clubs={clubs.data ?? []} onSubmit={handleAdd} onCancel={() => setShowForm(false)} /></div>
        </div>
      )}

      <div className="mb-3"><SportFilter value={sport} onChange={setSport} /></div>

      {teams.error ? (
        <ErrorState error={teams.error} onRetry={teams.reload} />
      ) : teams.loading && !teams.data ? (
        <LoadingPlaceholder count={3} />
      ) : visibleTeams.length === 0 ? (
        <div className="card mb-4"><EmptyState icon="bi-people" title="No teams for this sport" message="Add a team to get started." /></div>
      ) : (
        <div className="row g-3 mb-4">
          {visibleTeams.map((team) => (
            <div className="col-md-6 col-xl-4" key={team.id}>
              <TeamCard
                team={team}
                clubName={clubNames[team.clubId] ?? '...'}
                playerCount={playerCount(team.id)}
                selected={team.id === activeId}
                onSelect={(t) => setSelectedId(t.id)}
                onDelete={canManage ? handleDelete : undefined}
              />
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-header">{selectedTeam ? `${selectedTeam.name} roster` : 'Roster'}</div>
        {!selectedTeam ? (
          <EmptyState icon="bi-hand-index" title="No team selected" message="Click 'View roster' on a team card." />
        ) : roster.loading ? (
          <div className="p-3"><LoadingPlaceholder variant="table" count={3} /></div>
        ) : roster.error ? (
          <ErrorState error={roster.error} onRetry={roster.reload} />
        ) : (
          <DataTable columns={rosterColumns} rows={roster.data} emptyTitle="No players yet" emptyMessage="Players added to this team will appear here." />
        )}
      </div>
    </>
  );
}
