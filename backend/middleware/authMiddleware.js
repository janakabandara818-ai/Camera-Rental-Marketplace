const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isId } = require('../utils/inputValidation');

exports.protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (typeof authorization !== 'string' || !/^Bearer\s+\S+$/i.test(authorization)) {
    return res.status(401).json({ code: 'SESSION_INVALID', message: 'Please sign in to continue.' });
  }
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Authentication is not configured.' });
  let decoded;
  try {
    decoded = jwt.verify(authorization.trim().split(/\s+/)[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!decoded || typeof decoded !== 'object' || !isId(decoded.id) || !Number.isFinite(decoded.exp)) throw new Error('Invalid token');
  } catch (error) {
    return res.status(401).json({
      code: error.name === 'TokenExpiredError' ? 'SESSION_EXPIRED' : 'SESSION_INVALID',
      message: 'Your session is invalid or expired. Please sign in again.',
    });
  }
  try {
    const account = await User.findById(decoded.id).select('_id name email role');
    if (!account) return res.status(401).json({ code: 'SESSION_INVALID', message: 'This account is no longer available. Please sign in again.' });
    // Permissions come from the current account, not the cached role in an old JWT.
    req.user = { id: String(account._id), role: account.role };
    req.account = account;
    next();
  } catch {
    res.status(503).json({ message: 'Unable to verify your account. Please try again.' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only.' });
  next();
};
