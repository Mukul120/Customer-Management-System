export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export const isValidEmail = (email) =>
  !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPhone = (phone) =>
  phone && String(phone).trim().length >= 7;

/**
 * Validates a contact form payload.
 * Returns { valid: boolean, fieldErrors: { name?, phone?, email? } }
 */
export function validateContactForm({ name, phone, email }) {
  const fieldErrors = {};
  if (!isRequired(name)) fieldErrors.name = 'Name is required.';
  if (!isRequired(phone)) fieldErrors.phone = 'Phone is required.';
  else if (!isValidPhone(phone)) fieldErrors.phone = 'Phone must be at least 7 characters.';
  if (email && !isValidEmail(email)) fieldErrors.email = 'Enter a valid email address.';
  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}

/**
 * Validates a list form payload.
 */
export function validateListForm({ name }) {
  const fieldErrors = {};
  if (!isRequired(name)) fieldErrors.name = 'List name is required.';
  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}
