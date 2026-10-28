import { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import PageHeader from '../components/PageHeader';
import ChartCard from '../components/ChartCard';
import SportFilter from '../components/SportFilter';
import StatCard from '../components/StatCard';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import useApi from '../hooks/useApi';
import { analyticsService } from '../services/resourceServices';
import { getSportColor, getSportLabel } from '../data/sports';
import { axisChartOptions, baseChartOptions } from '../utils/chartSetup';

const LINE_COLORS = ['#0f1f3d', '#16a34a', '#2563eb', '#ea580c'];

export default function AnalyticsPage() {
  const [sport, setSport] = useState('CRICKET');
  const { data, loading, error, reload } = useApi(() => analyticsService.sport(sport), [sport]);

  const header = (
    <PageHeader
      title="Performance Analytics"
      subtitle={`${getSportLabel(sport)} performance for the last 6 months.`}
      actions={<SportFilter value={sport} onChange={setSport} includeAll={false} />}
    />
  );

  if (error) return <>{header}<ErrorState error={error} onRetry={reload} /></>;
  if (loading || !data) return <>{header}<LoadingPlaceholder count={4} /></>;

  const statLabel = data.topPerformers.stat === 'runs' ? 'Runs' : 'Goals';

  const lineData = {
    labels: data.teamFormTrend.labels,
    datasets: data.teamFormTrend.teams.map((t, i) => ({
      label: t.team, data: t.values, borderColor: LINE_COLORS[i % LINE_COLORS.length], backgroundColor: LINE_COLORS[i % LINE_COLORS.length], tension: 0.35, pointRadius: 3,
    })),
  };

  const barData = {
    labels: data.topPerformers.players.map((p) => p.name.split(' ')[0]),
    datasets: [{ label: statLabel, data: data.topPerformers.players.map((p) => p.value), backgroundColor: getSportColor(sport), borderRadius: 6, maxBarThickness: 36 }],
  };

  const r = data.resultsDistribution;
  const doughnutData = {
    labels: ['Won', 'Lost', 'Draw'],
    datasets: [{ data: [r.WON, r.LOST, r.DRAW], backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'], borderWidth: 0 }],
  };

  return (
    <>
      {header}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-controller" label="Matches" value={data.totalMatches} /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-trophy" label="Win rate" value={`${data.winRate}%`} color="#16a34a" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-lightning-charge" label="Avg. player form" value={data.averageForm} color="#ea580c" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon="bi-clipboard-check" label="Avg. attendance" value={`${data.averageAttendance}%`} color="#2563eb" /></div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <ChartCard title="Team form index" subtitle="0-100 score combining results and player form (sample trend data)">
            <Line data={lineData} options={{ ...axisChartOptions, scales: { ...axisChartOptions.scales, y: { ...axisChartOptions.scales.y, beginAtZero: false, suggestedMin: 40, max: 100 } } }} />
          </ChartCard>
        </div>
        <div className="col-lg-7">
          <ChartCard title={`Top performers - ${statLabel}`}>
            <Bar data={barData} options={{ ...axisChartOptions, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </div>
        <div className="col-lg-5">
          <ChartCard title="Results distribution">
            <Doughnut data={doughnutData} options={{ ...baseChartOptions, cutout: '62%' }} />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
