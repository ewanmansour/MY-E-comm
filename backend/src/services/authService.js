import crypto from 'node:crypto';
import { pool } from '../db/pool.js';

const TOKEN_HEADER = { alg: 'HS256', typ: 'JWT' };

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(data) {
  return crypto
    .createHmac('sha256', process.env.AUTH_SECRET || 'dev-auth-secret')
    .update(data)
    .digest('base64url');
}

export function createToken(user) {
  const header = base64Url(JSON.stringify(TOKEN_HEADER));
  const payload = base64Url(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }));

  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

export function verifyToken(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = sign(`${header}.${payload}`);

    if (signature.length !== expectedSignature.length) return null;

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = passwordHash.split(':');
  if (!salt || !storedHash) return false;

  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  const stored = Buffer.from(storedHash, 'hex');

  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
}

export function validateAuthPayload({ name, email, password }, isSignup = false) {
  const errors = [];

  if (isSignup && !String(name || '').trim()) {
    errors.push('Name is required.');
  }

  if (!String(email || '').trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('A valid email is required.');
  }

  if (!String(password || '').trim() || String(password).length < 4) {
    errors.push('Password must be at least 4 characters.');
  }

  return errors;
}

export async function signup({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), normalizedEmail, hashPassword(password)],
  );

  const user = mapUser(rows[0]);
  return { user, token: createToken(user) };
}

export async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
    [normalizedEmail],
  );

  const row = rows[0];

  if (!row || !verifyPassword(password, row.password_hash)) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const user = mapUser(row);
  return { user, token: createToken(user) };
}
