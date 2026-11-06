import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getPool } from './db.js';

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'melfis_session';
const SESSION_DAYS = 30;
const CAPACITOR_ORIGIN = 'https://localhost';

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function validateRegistration({ name, email, phone, password }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw Object.assign(new Error('Ism 2–100 ta belgidan iborat bo‘lishi kerak.'), { statusCode: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email)) || email.length > 254) {
    throw Object.assign(new Error('Email manzilini to‘g‘ri kiriting.'), { statusCode: 400 });
  }
  if (typeof phone !== 'string' || phone.trim().length < 7 || phone.trim().length > 30) {
    throw Object.assign(new Error('Telefon raqamini to‘g‘ri kiriting.'), { statusCode: 400 });
  }
  if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
    throw Object.assign(new Error('Parol 10–128 belgidan iborat bo‘lishi kerak.'), { statusCode: 400 });
  }
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt.toString('base64url')}.${derivedKey.toString('base64url')}`;
}

export async function verifyPassword(password, encodedHash) {
  const [saltValue, keyValue] = encodedHash.split('.');
  if (!saltValue || !keyValue) return false;
  const salt = Buffer.from(saltValue, 'base64url');
  const expected = Buffer.from(keyValue, 'base64url');
  const actual = await scrypt(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(req, res, userId) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await getPool().query(
    'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hashToken(token), expiresAt]
  );
  const isCapacitor = req.headers.origin === CAPACITOR_ORIGIN;
  const secure = process.env.NODE_ENV === 'production' || isCapacitor;
  const sameSite = isCapacitor ? 'None' : 'Lax';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${SESSION_DAYS * 24 * 60 * 60}${secure ? '; Secure' : ''}`);
}

export function clearSessionCookie(req, res) {
  const isCapacitor = req.headers.origin === CAPACITOR_ORIGIN;
  const secure = process.env.NODE_ENV === 'production' || isCapacitor;
  const sameSite = isCapacitor ? 'None' : 'Lax';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${secure ? '; Secure' : ''}`);
}

export async function getSessionUser(req) {
  const cookieHeader = req.headers.cookie || '';
  const token = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!token || token.length > 128) return null;

  const result = await getPool().query(
    `SELECT u.id, u.email, u.name, u.phone, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)]
  );
  return result.rows[0] || null;
}

export function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}
