// Mock training sessions and attendance. Replace with /api/training endpoints later.
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'];

export const trainingSessions = [
  { id: 's1', teamId: 't1', title: 'Batting nets & power hitting', date: '2026-10-29', time: '06:30', duration: 90, location: 'Karunya Nets Area', focus: 'Batting' },
  { id: 's2', teamId: 't2', title: 'High-press drills', date: '2026-10-29', time: '17:00', duration: 75, location: 'Karunya Football Arena', focus: 'Tactics' },
  { id: 's3', teamId: 't1', title: 'Death-over bowling', date: '2026-10-27', time: '06:30', duration: 90, location: 'Karunya Main Ground', focus: 'Bowling' },
  { id: 's4', teamId: 't2', title: 'Fitness & recovery', date: '2026-10-26', time: '07:00', duration: 60, location: 'Campus Gym', focus: 'Fitness' },
];

// attendance[sessionId][playerId] = status. Missing players default to no status.
export const initialAttendance = {
  s3: { p1: 'PRESENT', p2: 'PRESENT', p3: 'PRESENT', p4: 'EXCUSED', p5: 'PRESENT', p6: 'ABSENT', p7: 'PRESENT', p8: 'PRESENT', p9: 'ABSENT', p10: 'PRESENT', p11: 'PRESENT', p12: 'PRESENT', p13: 'PRESENT', p14: 'PRESENT' },
  s4: { p15: 'PRESENT', p16: 'PRESENT', p17: 'ABSENT', p18: 'PRESENT', p19: 'EXCUSED', p20: 'PRESENT', p21: 'PRESENT', p22: 'PRESENT', p23: 'PRESENT', p24: 'PRESENT', p25: 'ABSENT', p26: 'PRESENT', p27: 'PRESENT' },
};

// Recent attendance history for the player dashboard (demo player p1).
export const playerAttendanceHistory = [
  { date: '2026-10-27', session: 'Death-over bowling', status: 'PRESENT' },
  { date: '2026-10-24', session: 'Fielding drills', status: 'PRESENT' },
  { date: '2026-10-22', session: 'Match simulation', status: 'EXCUSED' },
  { date: '2026-10-20', session: 'Batting nets', status: 'PRESENT' },
  { date: '2026-10-17', session: 'Fitness circuit', status: 'PRESENT' },
];
