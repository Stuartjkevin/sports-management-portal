import SportBadge from './SportBadge';
import StatusBadge from './StatusBadge';
import { formatDate, formatTime } from '../utils/format';

// Card for one match. Completed matches also show the score and result.
export default function MatchCard({ match, teamName }) {
  const completed = match.status === 'COMPLETED';

  return (
    <div className={`card h-100 accent-${match.sport.toLowerCase()}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <SportBadge sport={match.sport} />
          <StatusBadge status={completed ? match.result : match.status} />
        </div>
        <div className="small text-muted-soft mb-2">{match.competition}</div>
        <h6 className="mb-1">{teamName ?? 'Our team'}</h6>
        <div className="small text-muted-soft mb-1">vs</div>
        <h6 className="mb-3">{match.opponent}</h6>
        {completed && <div className="fw-semibold text-navy mb-2"><i className="bi bi-clipboard-data me-1" />{match.score}</div>}
        <div className="small text-muted-soft">
          <div><i className="bi bi-calendar3 me-1" />{formatDate(match.date)} · {formatTime(match.time)}</div>
          <div><i className="bi bi-geo-alt me-1" />{match.venue}</div>
        </div>
      </div>
    </div>
  );
}
