import {
  createSession,
  hashPassword,
  normalizeEmail,
  publicUser,
  validateRegistration,
} from '../../server/auth.js';
import { getPool, ensureDbInitialized } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireBody, requireSameOrigin, sendJson } from '../../server/http.js';

export default async function register(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    requireSameOrigin(req);
    const body = requireBody(req);
    validateRegistration(body);
    await ensureDbInitialized();
    const email = normalizeEmail(body.email);
    const passwordHash = await hashPassword(body.password);
    const result = await getPool().query(
      `INSERT INTO users (email, password_hash, name, phone, balance)
       VALUES ($1, $2, $3, $4, 500000)
       RETURNING id, email, name, phone, role, balance`,
      [email, passwordHash, body.name.trim(), body.phone.trim()]
    );
    const user = result.rows[0];
    await createSession(req, res, user.id);
    return sendJson(res, 201, { user: publicUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      error.statusCode = 409;
      error.message = 'Bu email bilan akkaunt allaqachon mavjud.';
    }
    return handleApiError(res, error);
  }
}
