import SportBadge from './SportBadge';

// Summary card for a team with win/draw/loss record.
export default function TeamCard({ team, clubName, playerCount, selected, onSelect, onDelete }) {
  return (
    <div className={`card h-100 accent-${team.sport.toLowerCase()} ${selected ? 'border-primary' : ''}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="mb-0">{team.name}</h6>
          <SportBadge sport={team.sport} />
        </div>
        <div className="small text-muted-soft mb-3">
          <div><i className="bi bi-building me-1" />{clubName}</div>
          <div><i className="bi bi-person-video3 me-1" />Coach: {team.coach}</div>
          <div><i className="bi bi-people me-1" />{playerCount} players · {team.ageGroup}</div>
        </div>
        <div className="d-flex gap-2 mb-3">
          <span className="badge text-bg-success">W {team.wins}</span>
          <span className="badge text-bg-warning">D {team.draws}</span>
          <span className="badge text-bg-danger">L {team.losses}</span>
        </div>
        <div className="d-flex gap-2 mt-auto">
          <button type="button" className={`btn btn-sm flex-fill ${selected ? 'btn-navy' : 'btn-outline-secondary'}`} onClick={() => onSelect(team)}>
            <i className="bi bi-list-ul me-1" />{selected ? 'Viewing roster' : 'View roster'}
          </button>
          {onDelete && (
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(team)} aria-label={`Delete ${team.name}`}>
              <i className="bi bi-trash" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
