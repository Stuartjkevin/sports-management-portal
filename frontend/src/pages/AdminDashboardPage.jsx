import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import MatchCard from '../components/MatchCard';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import { analyticsService, matchService, teamService } from '../services/resourceServices';
import { ACTIVE_SPORTS } from '../data/sports';
import { axisChartOptions, baseChartOptions } from '../utils/chartSetup';
import { buildNameMap } from '../utils/lookups';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const overview = useApi(() => analyticsService.overview(), []);
  const upcoming = useApi(() => matchService.list({ status: 'UPCOMING' }), []);
  const teams = useApi(() => teamService.list(), []);
  const teamNames = buildNameMap(teams.data);

  const header = (
    <PageHeader
      title={`Welcome, ${user.name.split(' ')[0]}`}
      subtitle="Here is what is happening across your clubs this season."
      actions={<Link to="/dashboard/matches" className="btn btn-navy"><i className="bi bi-calendar-plus me-1" />View fixtures</Link>}
    />
  );

  if (overview.error) return <>{header}<ErrorState error={overview.error} onRetry={overview.reload} /></>;
  if (overview.loading || !overview.data) return <>{header}<LoadingPlaceholder count={4} /></>;

  const o = overview.data;
  const matchesChart = {
    labels: o.monthlyMatches.labels,
    datasets: ACTIVE_SPORTS.map((s) => ({ label: s.label, data: o.monthlyMatches[s.key], backgroundColor: s.color, borderRadius: 6, maxBarThickness: 28 })),
  };
  const playersBySport = {
    labels: ACTIVE_SPORTS.map((s) => s.label),
    datasets: [{ data: ACTIVE_SPORTS.map((s) => o.playersBySport[s.key] ?? 0), backgroundColor: ACTIVE_SPORTS.map((s) => s.color), borderWidth: 0 }],
  };

  return (
    <>
      {header}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-building" label="Clubs" value={o.clubs} hint={`${o.activeClubs} active`} /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-people" label="Teams" value={o.teams} color="#16a34a" hint="Cricket & Football" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-person-lines-fill" label="Players" value={o.players} color="#2563eb" hint="Registered this season" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-calendar-event" label="Upcoming matches" value={o.upcomingMatches} color="#ea580c" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <ChartCard title="Matches played per month" subtitle="Sample data · last 6 months">
            <Bar data={matchesChart} options={axisChartOptions} />
          </ChartCard>
        </div>
        <div className="col-lg-4">
          <ChartCard title="Players by sport">
            <Doughnut data={playersBySport} options={{ ...baseChartOptions, cutout: '65%' }} />
          </ChartCard>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Upcoming matches</h5>
        <Link to="/dashboard/matches" className="small">See all</Link>
      </div>
      {upcoming.loading ? (
        <LoadingPlaceholder count={3} />
      ) : upcoming.error ? (
        <ErrorState error={upcoming.error} onRetry={upcoming.reload} />
      ) : upcoming.data.length === 0 ? (
        <div className="card"><EmptyState icon="bi-calendar-x" title="No upcoming matches" /></div>
      ) : (
        <div className="row g-3">
          {upcoming.data.slice(0, 3).map((m) => (
            <div className="col-md-6 col-xl-4" key={m.id}><MatchCard match={m} teamName={teamNames[m.teamId]} /></div>
          ))}
        </div>
      )}
    </>
  );
}
