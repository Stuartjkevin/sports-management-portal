// Supported sports. Cricket and Football are active in this version;
// Basketball and Volleyball are listed so the UI is ready for them later.
export const SPORTS = [
  { key: 'CRICKET', label: 'Cricket', icon: 'bi-record-circle', color: '#16a34a', active: true },
  { key: 'FOOTBALL', label: 'Football', icon: 'bi-dribbble', color: '#2563eb', active: true },
  { key: 'BASKETBALL', label: 'Basketball', icon: 'bi-circle-half', color: '#ea580c', active: false },
  { key: 'VOLLEYBALL', label: 'Volleyball', icon: 'bi-circle', color: '#ca8a04', active: false },
];

export const ACTIVE_SPORTS = SPORTS.filter((s) => s.active);

export const POSITIONS = {
  CRICKET: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
  FOOTBALL: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
};

export const AGE_GROUPS = ['U-15', 'U-17', 'U-19', 'Senior'];

export const getSport = (key) => SPORTS.find((s) => s.key === key);
export const getSportLabel = (key) => getSport(key)?.label ?? key;
export const getSportColor = (key) => getSport(key)?.color ?? '#0f1f3d';
