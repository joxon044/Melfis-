import { createSession, normalizeEmail, publicUser, verifyPassword } from '../../server/auth.js';
import { getPool } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireBody, requireSameOrigin, sendJson } from '../../server/http.js';

export default async function login(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    requireSameOrigin(req);
    const body = requireBody(req);
    const email = normalizeEmail(body.email);
    if (!email || typeof body.password !== 'string' || body.password.length > 128) {
      return sendJson(res, 400, { error: 'Email va parolni kiriting.' });
    }

    const result = await getPool().query(
      'SELECT id, email, name, phone, role, password_hash FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return sendJson(res, 401, { error: 'Email yoki parol noto‘g‘ri.' });
    }

    await createSession(req, res, user.id);
    return sendJson(res, 200, { user: publicUser(user) });
  } catch (error) {
    return handleApiError(res, error);
  }
}
