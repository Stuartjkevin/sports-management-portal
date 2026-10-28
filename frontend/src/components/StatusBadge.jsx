// Maps a status value to a Bootstrap badge colour.
const STATUS_STYLES = {
  ACTIVE: 'text-bg-success',
  INACTIVE: 'text-bg-secondary',
  UPCOMING: 'text-bg-primary',
  ONGOING: 'text-bg-warning',
  COMPLETED: 'text-bg-secondary',
  WON: 'text-bg-success',
  LOST: 'text-bg-danger',
  DRAW: 'text-bg-warning',
  PRESENT: 'text-bg-success',
  ABSENT: 'text-bg-danger',
  EXCUSED: 'text-bg-warning',
};

export default function StatusBadge({ status }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`badge ${STATUS_STYLES[status] ?? 'text-bg-light'}`}>{label}</span>;
}
