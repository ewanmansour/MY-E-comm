import { verifyToken } from '../services/authService.js';

export function userAuth(req, res, next) {
  const header = req.header('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ message: 'Please login first.' });
    return;
  }

  req.user = {
    id: Number(payload.sub),
    name: payload.name,
    email: payload.email,
  };

  next();
}
