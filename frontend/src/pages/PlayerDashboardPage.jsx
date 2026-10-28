import { Line } from 'react-chartjs-2';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import MatchCard from '../components/MatchCard';
import StatusBadge from '../components/StatusBadge';
import SportBadge from '../components/SportBadge';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import { matchService, playerService, teamService, trainingService } from '../services/resourceServices';
import { buildNameMap } from '../utils/lookups';
import { formatDate } from '../utils/format';
import { axisChartOptions } from '../utils/chartSetup';

export default function PlayerDashboardPage() {
  const { user } = useAuth();
  const me = useApi(() => playerService.me(), []);
  const attendance = useApi(() => trainingService.myAttendance(), []);
  const upcoming = useApi(() => matchService.list({ status: 'UPCOMING' }), []);
  const teams = useApi(() => teamService.list(), []);

  const header = <PageHeader title={`Hi, ${user.name.split(' ')[0]}`} subtitle="Your stats, attendance and upcoming matches." />;

  // A newly registered player has no linked profile yet (404).
  if (me.error?.status === 404) {
    return <>{header}<div className="card"><EmptyState icon="bi-person-badge" title="No player profile linked yet" message="Ask your coach or club admin to add you to a team." /></div></>;
  }
  if (me.error) return <>{header}<ErrorState error={me.error} onRetry={me.reload} /></>;
  if (me.loading || !me.data) return <>{header}<LoadingPlaceholder count={4} /></>;

  const player = me.data;
  const isCricket = player.sport === 'CRICKET';
  const teamNames = buildNameMap(teams.data);
  const myTeamName = teamNames[player.teamId];
  const myMatches = (upcoming.data ?? []).filter((m) => m.teamId === player.teamId || m.opponent === myTeamName);

  const formChart = {
    labels: player.formHistory.labels,
    datasets: [{ label: 'Form', data: player.formHistory.values, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.12)', fill: true, tension: 0.35 }],
  };

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name.split(' ')[0]}`}
        subtitle={<span>#{player.jerseyNumber} · {player.position} · {myTeamName ?? '...'} <SportBadge sport={player.sport} /></span>}
      />

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-controller" label="Matches" value={player.stats.matches} /></div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={isCricket ? 'bi-bar-chart' : 'bi-bullseye'} label={isCricket ? 'Runs' : 'Goals'} value={isCricket ? player.stats.runs : player.stats.goals} color="#16a34a" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon="bi-award" label={isCricket ? 'Wickets' : 'Assists'} value={isCricket ? player.stats.wickets : player.stats.assists} color="#2563eb" />
        </div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-clipboard-check" label="Attendance" value={`${player.attendanceRate}%`} color="#ea580c" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <ChartCard title="My form trend" subtitle="Sample data · last 6 months" height={240}>
            <Line data={formChart} options={{ ...axisChartOptions, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </div>
        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-header">Recent attendance</div>
            <div className="card-body">
              <div className="d-flex justify-content-between small mb-1"><span>Overall</span><span>{player.attendanceRate}%</span></div>
              <div className="progress mb-3" role="progressbar" aria-valuenow={player.attendanceRate} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar bg-success" style={{ width: `${player.attendanceRate}%` }} />
              </div>
              {attendance.error ? (
                <div className="small text-danger">{attendance.error.message}</div>
              ) : (attendance.data?.history ?? []).length === 0 ? (
                <div className="small text-muted-soft">{attendance.loading ? 'Loading...' : 'No sessions marked yet.'}</div>
              ) : (
                <ul className="list-unstyled mb-0">
                  {attendance.data.history.slice(0, 5).map((a) => (
                    <li key={a.sessionId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div><div className="small fw-semibold">{a.session}</div><div className="small text-muted-soft">{formatDate(a.date)}</div></div>
                      <StatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3">My upcoming matches</h5>
      {upcoming.loading ? (
        <LoadingPlaceholder count={3} />
      ) : myMatches.length === 0 ? (
        <div className="card"><EmptyState icon="bi-calendar-x" title="No upcoming matches" /></div>
      ) : (
        <div className="row g-3">
          {myMatches.map((m) => <div className="col-md-6 col-xl-4" key={m.id}><MatchCard match={m} teamName={teamNames[m.teamId]} /></div>)}
        </div>
      )}
    </>
  );
}
