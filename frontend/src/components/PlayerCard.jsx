import SportBadge from './SportBadge';

// Profile card for one player: jersey number, position, sport and key scores.
export default function PlayerCard({ player, teamName, onEdit, onDelete }) {
  const mainStat = player.sport === 'CRICKET'
    ? `${player.stats.runs} runs · ${player.stats.wickets} wkts`
    : `${player.stats.goals} goals · ${player.stats.assists} assists`;

  return (
    <div className={`card h-100 accent-${player.sport.toLowerCase()}`}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className={`jersey jersey-${player.sport.toLowerCase()}`} title="Jersey number">{player.jerseyNumber}</div>
          <div className="flex-grow-1 min-w-0">
            <h6 className="mb-1 text-truncate">{player.name}</h6>
            <div className="small text-muted-soft">{player.position} · Age {player.age}</div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <SportBadge sport={player.sport} />
          <span className="badge text-bg-light border">{teamName}</span>
        </div>
        <div className="row text-center g-0 border rounded py-2 mb-3">
          <div className="col"><div className="small-caps">Rating</div><strong>{player.rating}</strong></div>
          <div className="col border-start"><div className="small-caps">Form</div><strong>{player.form}</strong></div>
          <div className="col border-start"><div className="small-caps">Attend.</div><strong>{player.attendanceRate}%</strong></div>
        </div>
        <div className="small text-muted-soft mb-3">{player.stats.matches} matches · {mainStat}</div>
        {(onEdit || onDelete) && (
          <div className="d-flex gap-2">
            {onEdit && <button type="button" className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(player)}><i className="bi bi-pencil me-1" />Edit</button>}
            {onDelete && <button type="button" className="btn btn-sm btn-outline-danger flex-fill" onClick={() => onDelete(player)}><i className="bi bi-trash me-1" />Delete</button>}
          </div>
        )}
      </div>
    </div>
  );
}
