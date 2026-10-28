// Mock analytics series for charts. Replace with GET /api/analytics/* in a later phase.
export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export const monthlyMatches = {
  labels: MONTHS,
  CRICKET: [4, 6, 5, 7, 6, 8],
  FOOTBALL: [5, 5, 7, 6, 8, 7],
};

// Team form index (0-100) per month.
export const teamFormTrend = {
  CRICKET: [
    { team: 'Karunya Kings', values: [58, 62, 60, 68, 72, 78] },
    { team: 'Nilgiri Hawks', values: [50, 55, 57, 54, 60, 59] },
    { team: 'Chennai Chargers XI', values: [64, 61, 66, 70, 65, 69] },
  ],
  FOOTBALL: [
    { team: 'Karunya FC', values: [55, 60, 63, 61, 70, 74] },
    { team: 'Nilgiri United', values: [60, 58, 62, 66, 63, 61] },
  ],
};

export const resultsDistribution = {
  CRICKET: { WON: 35, LOST: 21, DRAW: 3 },
  FOOTBALL: { WON: 19, LOST: 12, DRAW: 10 },
};

// Form history for the demo player dashboard.
export const playerFormHistory = { labels: MONTHS, values: [64, 70, 73, 69, 81, 88] };
