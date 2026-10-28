// Copies only the allowed fields from the request body.
// This stops clients from setting fields like "id" or "role" themselves.
// numberFields are converted from strings ("18") to numbers (18).
export function pickFields(body = {}, fields, numberFields = []) {
  const result = {};
  fields.forEach((field) => {
    if (body[field] === undefined) return;
    result[field] = numberFields.includes(field) && body[field] !== '' ? Number(body[field]) : body[field];
    if (typeof result[field] === 'string') result[field] = result[field].trim();
  });
  return result;
}
