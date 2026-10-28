import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import AttendancePanel from '../components/AttendancePanel';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import useApi from '../hooks/useApi';
import { teamService, trainingService } from '../services/resourceServices';
import { buildNameMap } from '../utils/lookups';
import { formatDate, formatTime } from '../utils/format';

export default function TrainingPage() {
  const sessions = useApi(() => trainingService.list(), []);
  const teams = useApi(() => teamService.list(), []);
  const [selectedId, setSelectedId] = useState(null);

  const list = [...(sessions.data ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  const activeId = selectedId ?? list[0]?.id ?? null;
  const session = list.find((s) => s.id === activeId);
  const attendance = useApi(() => (activeId ? trainingService.attendance(activeId) : Promise.resolve(null)), [activeId]);
  const teamNames = buildNameMap(teams.data);

  if (sessions.error) return <><PageHeader title="Training & Attendance" /><ErrorState error={sessions.error} onRetry={sessions.reload} /></>;

  return (
    <>
      <PageHeader title="Training & Attendance" subtitle="Select a session, then mark each player Present, Absent or Excused." />

      {sessions.loading ? (
        <LoadingPlaceholder variant="table" />
      ) : list.length === 0 ? (
        <div className="card"><EmptyState icon="bi-clipboard-x" title="No training sessions yet" /></div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">Sessions</div>
              <div className="list-group list-group-flush">
                {list.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`list-group-item list-group-item-action py-3 ${s.id === activeId ? 'active' : ''}`}
                    onClick={() => setSelectedId(s.id)}
                  >
                    <div className="fw-semibold">{s.title}</div>
                    <div className="small opacity-75">{teamNames[s.teamId] ?? '...'} · {s.focus}</div>
                    <div className="small opacity-75"><i className="bi bi-calendar3 me-1" />{formatDate(s.date)} · {formatTime(s.time)} · {s.duration} min</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {attendance.loading || !attendance.data ? (
              attendance.error ? <ErrorState error={attendance.error} onRetry={attendance.reload} /> : <LoadingPlaceholder variant="table" count={6} />
            ) : (
              // key = session id, so the panel starts fresh for each session
              <AttendancePanel key={activeId} session={session} attendance={attendance.data} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
