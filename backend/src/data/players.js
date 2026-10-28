// Mock players. Replace with GET /api/players in a later phase.
// rating, form and attendanceRate are 0-100 scores used by analytics and team selection.
// stats differ by sport: cricket uses runs/wickets, football uses goals/assists.

function cricketer(id, name, teamId, position, jerseyNumber, age, rating, form, attendanceRate, matches, runs, wickets) {
  return { id, name, teamId, sport: 'CRICKET', position, jerseyNumber, age, rating, form, attendanceRate, stats: { matches, runs, wickets } };
}

function footballer(id, name, teamId, position, jerseyNumber, age, rating, form, attendanceRate, matches, goals, assists) {
  return { id, name, teamId, sport: 'FOOTBALL', position, jerseyNumber, age, rating, form, attendanceRate, stats: { matches, goals, assists } };
}

export const players = [
  // Karunya Kings (Cricket)
  cricketer('p1', 'Rohit Kumar', 't1', 'Batsman', 18, 22, 86, 88, 95, 22, 742, 2),
  cricketer('p2', 'Aditya Nair', 't1', 'Batsman', 7, 21, 78, 72, 90, 20, 515, 0),
  cricketer('p3', 'Siddharth Iyer', 't1', 'Wicket-keeper', 1, 23, 80, 76, 92, 22, 431, 0),
  cricketer('p4', 'Manoj Pillai', 't1', 'All-rounder', 10, 24, 84, 81, 88, 21, 388, 24),
  cricketer('p5', 'Kiran Das', 't1', 'Bowler', 33, 20, 82, 85, 97, 22, 96, 31),
  cricketer('p6', 'Farhan Ali', 't1', 'Bowler', 27, 22, 75, 64, 80, 18, 54, 19),
  cricketer('p7', 'Naveen Reddy', 't1', 'All-rounder', 45, 21, 77, 79, 85, 19, 290, 14),
  cricketer('p8', 'Joel Mathew', 't1', 'Batsman', 3, 19, 70, 83, 93, 12, 302, 1),
  cricketer('p9', 'Harish Babu', 't1', 'Bowler', 21, 23, 73, 70, 76, 17, 41, 17),
  cricketer('p10', 'Vignesh S', 't1', 'Batsman', 11, 20, 68, 61, 70, 10, 185, 0),
  cricketer('p11', 'Ashwin Raj', 't1', 'Bowler', 99, 24, 79, 74, 91, 20, 63, 22),
  cricketer('p12', 'Rahul Menon', 't1', 'All-rounder', 8, 22, 72, 68, 84, 15, 201, 9),
  cricketer('p13', 'Gokul Krishnan', 't1', 'Wicket-keeper', 77, 19, 66, 70, 88, 6, 98, 0),
  cricketer('p14', 'Sanjay Varma', 't1', 'Bowler', 14, 21, 71, 77, 82, 11, 30, 12),
  // Karunya FC (Football)
  footballer('p15', 'Alan Fernandes', 't2', 'Goalkeeper', 1, 24, 83, 80, 94, 22, 0, 1),
  footballer('p16', 'Bibin Joseph', 't2', 'Defender', 4, 22, 78, 74, 90, 21, 1, 2),
  footballer('p17', 'Clinton DSouza', 't2', 'Defender', 5, 23, 76, 71, 86, 20, 2, 1),
  footballer('p18', 'Deepak Raj', 't2', 'Defender', 2, 21, 72, 78, 92, 18, 0, 3),
  footballer('p19', 'Ebin Varghese', 't2', 'Defender', 3, 20, 70, 66, 79, 15, 1, 0),
  footballer('p20', 'Faisal Khan', 't2', 'Midfielder', 8, 22, 85, 87, 96, 22, 6, 11),
  footballer('p21', 'Gautham Suresh', 't2', 'Midfielder', 6, 23, 79, 73, 88, 21, 3, 7),
  footballer('p22', 'Hari Prasad', 't2', 'Midfielder', 10, 21, 81, 84, 91, 22, 8, 9),
  footballer('p23', 'Ivan Rodrigues', 't2', 'Midfielder', 14, 19, 68, 75, 85, 12, 2, 3),
  footballer('p24', 'Jerin Thomas', 't2', 'Forward', 9, 22, 87, 90, 93, 22, 17, 5),
  footballer('p25', 'Kevin Antony', 't2', 'Forward', 11, 20, 77, 69, 81, 19, 9, 4),
  footballer('p26', 'Liju Paul', 't2', 'Forward', 7, 21, 74, 80, 87, 16, 7, 6),
  footballer('p27', 'Mithun George', 't2', 'Goalkeeper', 23, 19, 69, 72, 89, 4, 0, 0),
  // Other clubs (smaller squads)
  cricketer('p28', 'Ravi Shankar', 't3', 'Batsman', 12, 18, 74, 77, 86, 14, 410, 1),
  cricketer('p29', 'Tarun Bose', 't3', 'Bowler', 19, 18, 71, 69, 80, 13, 35, 18),
  footballer('p30', 'Arun Prakash', 't4', 'Forward', 9, 18, 76, 82, 90, 15, 11, 3),
  footballer('p31', 'Benny Mathew', 't4', 'Goalkeeper', 1, 18, 72, 70, 85, 15, 0, 0),
  cricketer('p32', 'Dinesh Kumar', 't5', 'All-rounder', 5, 26, 83, 79, 88, 19, 455, 20),
];
