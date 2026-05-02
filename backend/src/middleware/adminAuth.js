export function adminAuth(req, res, next) {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin1234';
  const expectedPassword = process.env.ADMIN_PASSWORD || '1111';
  const username = req.header('x-admin-username');
  const password = req.header('x-admin-password');

  if (username !== expectedUsername || password !== expectedPassword) {
    res.status(401).json({ message: 'Invalid admin username or password.' });
    return;
  }

  next();
}
