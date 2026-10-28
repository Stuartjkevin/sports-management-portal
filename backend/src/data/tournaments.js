// Mock tournaments and standings. Replace with GET /api/tournaments in a later phase.
export const tournaments = [
  { id: 'tr1', name: 'Inter-Club T20 League 2026', sport: 'CRICKET', startDate: '2026-09-01', endDate: '2026-12-15', teamsCount: 6, status: 'ONGOING' },
  { id: 'tr2', name: 'South Zone Football Cup', sport: 'FOOTBALL', startDate: '2026-10-01', endDate: '2026-12-20', teamsCount: 6, status: 'ONGOING' },
  { id: 'tr3', name: 'Winter Cricket Invitational', sport: 'CRICKET', startDate: '2027-01-10', endDate: '2027-02-05', teamsCount: 8, status: 'UPCOMING' },
  { id: 'tr4', name: 'Monsoon Football Sevens', sport: 'FOOTBALL', startDate: '2026-06-05', endDate: '2026-07-20', teamsCount: 8, status: 'COMPLETED' },
];

// Standings keyed by tournament id. Points: Cricket win = 2, Football win = 3, draw = 1.
export const standings = {
  tr1: [
    { team: 'Karunya Kings', played: 6, won: 5, drawn: 0, lost: 1, points: 10 },
    { team: 'Chennai Chargers XI', played: 6, won: 4, drawn: 0, lost: 2, points: 8 },
    { team: 'Nilgiri Hawks', played: 6, won: 3, drawn: 0, lost: 3, points: 6 },
    { team: 'Coimbatore Strikers', played: 6, won: 2, drawn: 0, lost: 4, points: 4 },
    { team: 'Salem Spartans', played: 6, won: 2, drawn: 0, lost: 4, points: 4 },
    { team: 'Trichy Titans', played: 6, won: 2, drawn: 0, lost: 4, points: 4 },
  ],
  tr2: [
    { team: 'Karunya FC', played: 4, won: 2, drawn: 2, lost: 0, points: 8 },
    { team: 'Chennai City FC', played: 4, won: 2, drawn: 1, lost: 1, points: 7 },
    { team: 'Nilgiri United', played: 4, won: 2, drawn: 0, lost: 2, points: 6 },
    { team: 'Madurai United', played: 4, won: 1, drawn: 1, lost: 2, points: 4 },
    { team: 'Erode Eagles', played: 4, won: 1, drawn: 0, lost: 3, points: 3 },
    { team: 'Vellore Rovers', played: 4, won: 0, drawn: 2, lost: 2, points: 2 },
  ],
  tr3: [],
  tr4: [
    { team: 'Nilgiri United', played: 7, won: 6, drawn: 1, lost: 0, points: 19 },
    { team: 'Karunya FC', played: 7, won: 5, drawn: 1, lost: 1, points: 16 },
    { team: 'Madurai United', played: 7, won: 3, drawn: 2, lost: 2, points: 11 },
    { team: 'Erode Eagles', played: 7, won: 1, drawn: 0, lost: 6, points: 3 },
  ],
};
