import { useState } from 'react';
import EmptyState from './EmptyState';
import AlertMessage from './AlertMessage';
import { trainingService } from '../services/resourceServices';

const STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'];
const STATUS_BUTTON = { PRESENT: 'success', ABSENT: 'danger', EXCUSED: 'warning' };

// Attendance marking for one session. `attendance` is the GET /training/:id/attendance response.
// Changes stay local until "Save attendance" sends them with PUT.
export default function AttendancePanel({ session, attendance }) {
  const [records, setRecords] = useState(attendance.records);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const mark = (playerId, status) => setRecords((list) => list.map((r) => (r.playerId === playerId ? { ...r, status } : r)));
  const markAllPresent = () => setRecords((list) => list.map((r) => ({ ...r, status: 'PRESENT' })));

  const counts = Object.fromEntries(STATUSES.map((s) => [s, records.filter((r) => r.status === s).length]));
  const unmarked = records.filter((r) => !r.status).length;

  const save = async () => {
    setSaving(true);
    try {
      const marked = Object.fromEntries(records.filter((r) => r.status).map((r) => [r.playerId, r.status]));
      const saved = await trainingService.saveAttendance(session.id, marked);
      setRecords(saved.records);
      setNotice(unmarked > 0
        ? { type: 'warning', text: `Saved. ${unmarked} player(s) are still unmarked.` }
        : { type: 'success', text: 'Attendance saved.' });
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          {session.title}
          <div className="small text-muted-soft fw-normal"><i className="bi bi-geo-alt me-1" />{session.location}</div>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-sm btn-outline-success" onClick={markAllPresent}>Mark all present</button>
          <button type="button" className="btn btn-sm btn-navy" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save attendance'}</button>
        </div>
      </div>
      <div className="card-body border-bottom">
        <AlertMessage message={notice?.text} type={notice?.type} onClose={() => setNotice(null)} />
        <div className="d-flex flex-wrap gap-2">
          <span className="badge text-bg-success">Present {counts.PRESENT}</span>
          <span className="badge text-bg-danger">Absent {counts.ABSENT}</span>
          <span className="badge text-bg-warning">Excused {counts.EXCUSED}</span>
          <span className="badge text-bg-light border">Unmarked {unmarked}</span>
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState icon="bi-people" title="No players in this team" />
      ) : (
        <ul className="list-group list-group-flush">
          {records.map((r) => (
            <li key={r.playerId} className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
              <div>
                <span className="fw-semibold">#{r.jerseyNumber} {r.name}</span>
                <div className="small text-muted-soft">{r.position}</div>
              </div>
              <div className="btn-group btn-group-sm" role="group" aria-label={`Attendance for ${r.name}`}>
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn ${r.status === status ? `btn-${STATUS_BUTTON[status]}` : `btn-outline-${STATUS_BUTTON[status]}`}`}
                    onClick={() => mark(r.playerId, status)}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
