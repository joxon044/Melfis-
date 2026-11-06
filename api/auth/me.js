import { getSessionUser, publicUser } from '../../server/auth.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, sendJson } from '../../server/http.js';

export default async function me(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const user = await getSessionUser(req);
    return sendJson(res, 200, { user: user ? publicUser(user) : null });
  } catch (error) {
    return handleApiError(res, error);
  }
}
