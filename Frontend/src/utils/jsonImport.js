/**
 * Validates a list of contact records parsed from JSON.
 * Returns { valid: boolean, errors: string[] }
 */
export function validateJsonContacts(parsed) {
  const errors = [];

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { valid: false, errors: ['Root value must be a non-empty array of contact objects.'] };
  }

  parsed.forEach((record, i) => {
    const row = i + 1;
    if (typeof record !== 'object' || record === null || Array.isArray(record)) {
      errors.push(`Row ${row}: Must be an object.`);
      return;
    }
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    const phone = typeof record.phone === 'string' ? record.phone.trim() : '';
    if (!name) errors.push(`Row ${row}: "name" is required and must be a non-empty string.`);
    if (!phone) errors.push(`Row ${row}: "phone" is required and must be a non-empty string.`);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Normalises parsed contacts: trims strings, strips unknown fields.
 */
export function normaliseContacts(parsed) {
  return parsed.map((r) => ({
    name: (r.name || '').trim(),
    phone: (r.phone || '').trim(),
    ...(r.email ? { email: r.email.trim() } : {}),
  }));
}

/**
 * Parses raw JSON text and returns { contacts, errors }.
 */
export function parseJsonInput(rawText) {
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { contacts: null, errors: ['Invalid JSON — please check the syntax.'] };
  }

  const { valid, errors } = validateJsonContacts(parsed);
  if (!valid) return { contacts: null, errors };

  return { contacts: normaliseContacts(parsed), errors: [] };
}
