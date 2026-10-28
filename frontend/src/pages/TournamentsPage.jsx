import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import SportBadge from '../components/SportBadge';
import StatusBadge from '../components/StatusBadge';
import SportFilter from '../components/SportFilter';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import useApi from '../hooks/useApi';
import { tournamentService } from '../services/resourceServices';
import { formatDate } from '../utils/format';

const tournamentColumns = [
  { key: 'name', label: 'Tournament', render: (t) => <span className="fw-semibold">{t.name}</span> },
  { key: 'sport', label: 'Sport', render: (t) => <SportBadge sport={t.sport} /> },
  { key: 'dates', label: 'Dates', render: (t) => `${formatDate(t.startDate)} - ${formatDate(t.endDate)}` },
  { key: 'teamsCount', label: 'Teams' },
  { key: 'status', label: 'Status', render: (t) => <StatusBadge status={t.status} /> },
];

const standingsColumns = [
  { key: 'position', label: 'Pos', render: (r) => <span className="fw-bold">{r.position}</span> },
  { key: 'team', label: 'Team', render: (r) => <span className="fw-semibold">{r.team}</span> },
  { key: 'played', label: 'P' },
  { key: 'won', label: 'W' },
  { key: 'drawn', label: 'D' },
  { key: 'lost', label: 'L' },
  { key: 'points', label: 'Pts', render: (r) => <span className="badge text-bg-dark">{r.points}</span> },
];

export default function TournamentsPage() {
  const [sport, setSport] = useState('ALL');
  const [selectedId, setSelectedId] = useState(null);
  const tournaments = useApi(() => tournamentService.list({ sport }), [sport]);

  const list = tournaments.data ?? [];
  const activeId = list.some((t) => t.id === selectedId) ? selectedId : list[0]?.id ?? null;
  const standings = useApi(() => (activeId ? tournamentService.standings(activeId) : Promise.resolve(null)), [activeId]);

  return (
    <>
      <PageHeader title="Tournament Management" subtitle="Click a tournament to see its standings." />
      <div className="mb-3"><SportFilter value={sport} onChange={setSport} /></div>

      {tournaments.error ? (
        <ErrorState error={tournaments.error} onRetry={tournaments.reload} />
      ) : (
        <div className="row g-3">
          <div className="col-xl-7">
            <div className="card h-100">
              <div className="card-header">Tournaments ({list.length})</div>
              {tournaments.loading ? (
                <div className="p-3"><LoadingPlaceholder variant="table" count={4} /></div>
              ) : (
                <DataTable columns={tournamentColumns} rows={list} onRowClick={(t) => setSelectedId(t.id)} activeKey={activeId} emptyTitle="No tournaments" />
              )}
            </div>
          </div>
          <div className="col-xl-5">
            <div className="card h-100">
              <div className="card-header">{standings.data ? `${standings.data.name} - Standings` : 'Standings'}</div>
              {standings.loading ? (
                <div className="p-3"><LoadingPlaceholder variant="table" count={4} /></div>
              ) : standings.error ? (
                <ErrorState error={standings.error} onRetry={standings.reload} />
              ) : (
                <DataTable
                  columns={standingsColumns}
                  rows={standings.data?.standings ?? []}
                  rowKey="team"
                  emptyTitle="No standings yet"
                  emptyMessage="Standings appear once the first match is played."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
