import { getSport } from '../data/sports';

// Coloured pill showing the sport (green = cricket, blue = football, ...).
export default function SportBadge({ sport }) {
  const info = getSport(sport);
  return (
    <span className={`badge badge-sport badge-sport-${sport.toLowerCase()}`}>
      {info && <i className={`bi ${info.icon} me-1`} />}
      {info?.label ?? sport}
    </span>
  );
}
