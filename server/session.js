import { createHash } from 'node:crypto';
import { getPool } from './db.js';

const SESSION_COOKIE = 'melfis_session';

export function getSessionToken(req) {
  const cookieHeader = req.headers.cookie || '';
  const token = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return token && token.length <= 128 ? token : null;
}

export async function deleteSession(req) {
  const token = getSessionToken(req);
  if (!token) return;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await getPool().query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
}
