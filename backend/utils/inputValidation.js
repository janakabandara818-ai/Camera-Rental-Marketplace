class InputError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const isId = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
function bodyObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new InputError(400, 'Invalid request body.');
  return body;
}
function text(value, label, min, max) {
  if (typeof value !== 'string') throw new InputError(400, `${label} is required.`);
  const result = value.trim();
  if (result.length < min || result.length > max) throw new InputError(400, `${label} must contain ${min}–${max} characters.`);
  return result;
}
function email(value) {
  const result = text(value, 'Email', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new InputError(400, 'Enter a valid email address.');
  return result;
}
function exactEmail(value) {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
}
function password(value, registration = false) {
  if (typeof value !== 'string' || value.length < (registration ? 8 : 1) || Buffer.byteLength(value, 'utf8') > 72) {
    throw new InputError(400, registration ? 'Password must have at least 8 characters and at most 72 UTF-8 bytes.' : 'Enter a valid password.');
  }
  return value;
}
function sendError(res, error) {
  if (error instanceof InputError) return res.status(error.status).json({ message: error.message });
  if (error.code === 11000) return res.status(409).json({ message: 'This record already exists.' });
  if (error.name === 'CastError' || error.name === 'ValidationError') return res.status(400).json({ message: 'Invalid input data.' });
  console.error('API operation failed:', error.name || 'Error', error.code || '');
  return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
}
module.exports = { InputError, isId, bodyObject, text, email, exactEmail, password, sendError };
