import { clearSessionCookie } from '../../server/auth.js';
import { deleteSession } from '../../server/session.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireSameOrigin, sendJson } from '../../server/http.js';

export default async function logout(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  try {
    requireSameOrigin(req);
    await deleteSession(req);
    clearSessionCookie(req, res);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return handleApiError(res, error);
  }
}
