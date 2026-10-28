// Mock notifications. Replace with GET /api/notifications in a later phase.
export const notifications = [
  { id: 'n1', type: 'MATCH', title: 'Match scheduled', message: 'Karunya Kings vs Chennai Chargers XI on 2 Nov at 9:30 AM.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'TRAINING', title: 'Training updated', message: 'Batting nets moved to 6:30 AM tomorrow at Karunya Nets Area.', time: '5 hours ago', read: false },
  { id: 'n3', type: 'SELECTION', title: 'Squad announced', message: 'The playing XI for the T20 League match has been published.', time: '1 day ago', read: false },
  { id: 'n4', type: 'TOURNAMENT', title: 'Standings updated', message: 'Karunya FC moved to 1st place in the South Zone Football Cup.', time: '2 days ago', read: true },
  { id: 'n5', type: 'SYSTEM', title: 'Welcome to the portal', message: 'Complete your profile to get personalised updates.', time: '1 week ago', read: true },
];
