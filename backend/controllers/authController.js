const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { InputError, bodyObject, text, email, exactEmail, password, sendError } = require('../utils/inputValidation');

function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}
function sessionFor(user) {
  if (!process.env.JWT_SECRET) throw new InputError(503, 'Authentication is not configured.');
  return {
    token: jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' }),
    user: publicUser(user),
  };
}

exports.register = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) throw new InputError(503, 'Authentication is not configured.');
    const body = bodyObject(req.body);
    const name = text(body.name, 'Name', 1, 100);
    const normalizedEmail = email(body.email);
    const rawPassword = password(body.password, true);
    const exists = await User.findOne({ email: exactEmail(normalizedEmail) });
    if (exists) throw new InputError(409, 'An account with this email already exists.');
    const hashed = await bcrypt.hash(rawPassword, 10);
    // Registration never accepts a role or other authorization fields from the client.
    const user = await User.create({ name, email: normalizedEmail, password: hashed, role: 'user' });
    res.status(201).json(sessionFor(user));
  } catch (error) { sendError(res, error); }
};

exports.login = async (req, res) => {
  try {
    const body = bodyObject(req.body);
    const normalizedEmail = email(body.email);
    const rawPassword = password(body.password);
    // Case-insensitive lookup preserves access to older mixed-case email accounts.
    const user = await User.findOne({ email: exactEmail(normalizedEmail) });
    if (!user || !(await bcrypt.compare(rawPassword, user.password))) throw new InputError(401, 'Invalid email or password.');
    res.json(sessionFor(user));
  } catch (error) { sendError(res, error); }
};

exports.getMe = (req, res) => res.json({ user: publicUser(req.account) });
