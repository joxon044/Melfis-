import { getSessionUser } from '../../server/auth.js';
import { getPool } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, sendJson } from '../../server/http.js';

export default async function adminTopups(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Admin akkauntiga kiring.' });
    if (user.role !== 'admin') return sendJson(res, 403, { error: 'Bu bo‘lim faqat adminlar uchun.' });

    const result = await getPool().query(
      `SELECT t.id, t.amount, t.status, t.created_at, t.processed_at,
              u.id AS user_id, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
         FROM wallet_topups t
         JOIN users u ON u.id = t.user_id
        ORDER BY CASE WHEN t.status = 'pending' THEN 0 ELSE 1 END, t.created_at DESC
        LIMIT 200`
    );
    return sendJson(res, 200, { topups: result.rows });
  } catch (error) {
    return handleApiError(res, error);
  }
}
