// Strategy choices for the Smart Team Selection form.
// The actual scoring now runs on the backend (backend/src/services/teamSelection.js).
export const STRATEGIES = [
  { value: 'BALANCED', label: 'Balanced (rating + form + attendance)' },
  { value: 'FORM', label: 'Current form first' },
  { value: 'DISCIPLINE', label: 'Attendance & discipline first' },
];
