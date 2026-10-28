import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import PlayerCard from '../components/PlayerCard';
import PlayerForm from '../components/PlayerForm';
import SportFilter from '../components/SportFilter';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import AlertMessage from '../components/AlertMessage';
import useApi from '../hooks/useApi';
import { playerService, teamService } from '../services/resourceServices';
import { buildNameMap } from '../utils/lookups';

export default function PlayersPage() {
  const players = useApi(() => playerService.list(), []);
  const teams = useApi(() => teamService.list(), []);
  const [sport, setSport] = useState('ALL');
  const [teamId, setTeamId] = useState('ALL');
  const [search, setSearch] = useState('');
  const [formMode, setFormMode] = useState(null); // null | 'add' | player object
  const [notice, setNotice] = useState(null);

  const editing = formMode && formMode !== 'add' ? formMode : null;
  const allTeams = teams.data ?? [];
  const teamNames = buildNameMap(allTeams);

  const filtered = (players.data ?? []).filter((p) =>
    (sport === 'ALL' || p.sport === sport) &&
    (teamId === 'ALL' || p.teamId === teamId) &&
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSportChange = (value) => {
    setSport(value);
    setTeamId('ALL');
  };

  const handleSave = async (data) => {
    if (editing) await playerService.update(editing.id, data);
    else await playerService.create(data);
    setNotice({ type: 'success', text: editing ? `${data.name}'s profile was updated.` : `${data.name} was added.` });
    setFormMode(null);
    players.reload();
  };

  const handleDelete = async (player) => {
    if (!window.confirm(`Remove ${player.name}?`)) return;
    try {
      await playerService.remove(player.id);
      setNotice({ type: 'success', text: `${player.name} was removed.` });
      players.reload();
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    }
  };

  return (
    <>
      <PageHeader
        title="Player Management"
        subtitle="Player profiles with jersey number, position and sport."
        actions={<button type="button" className="btn btn-navy" onClick={() => setFormMode('add')}><i className="bi bi-person-plus me-1" />Add player</button>}
      />

      <AlertMessage message={notice?.text} type={notice?.type} onClose={() => setNotice(null)} />

      {formMode && (
        <div className="card mb-4">
          <div className="card-header">{editing ? `Edit ${editing.name}` : 'Add a new player'}</div>
          <div className="card-body">
            <PlayerForm key={editing?.id ?? 'new'} initialValues={editing} teams={allTeams} onSubmit={handleSave} onCancel={() => setFormMode(null)} />
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        <SportFilter value={sport} onChange={handleSportChange} />
        <select className="form-select form-select-sm w-auto" value={teamId} onChange={(e) => setTeamId(e.target.value)} aria-label="Filter by team">
          <option value="ALL">All teams</option>
          {allTeams.filter((t) => sport === 'ALL' || t.sport === sport).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type="search" className="form-control form-control-sm" style={{ maxWidth: 220 }} placeholder="Search players" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {players.error ? (
        <ErrorState error={players.error} onRetry={players.reload} />
      ) : players.loading && !players.data ? (
        <LoadingPlaceholder count={8} />
      ) : filtered.length === 0 ? (
        <div className="card"><EmptyState icon="bi-person-x" title="No players match your filters" message="Clear the filters or add a new player." /></div>
      ) : (
        <div className="row g-3">
          {filtered.map((p) => (
            <div className="col-sm-6 col-lg-4 col-xxl-3" key={p.id}>
              <PlayerCard player={p} teamName={teamNames[p.teamId] ?? '...'} onEdit={setFormMode} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
