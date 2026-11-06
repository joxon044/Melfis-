import { getSessionUser } from '../../../server/auth.js';
import { getPool } from '../../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireBody, requireSameOrigin, sendJson } from '../../../server/http.js';

const ORDER_STATUSES = new Set(['new', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled']);

export default async function updateOrder(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'PATCH') return methodNotAllowed(res, ['PATCH']);
  try {
    requireSameOrigin(req);
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Admin akkauntiga kiring.' });
    if (user.role !== 'admin') return sendJson(res, 403, { error: 'Bu amal faqat adminlar uchun.' });

    const orderId = req.query.id;
    if (typeof orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(orderId)) {
      return sendJson(res, 400, { error: 'Buyurtma ID noto‘g‘ri.' });
    }
    const { status } = requireBody(req);
    if (!ORDER_STATUSES.has(status)) {
      return sendJson(res, 400, { error: 'Buyurtma holati noto‘g‘ri.' });
    }

    const result = await getPool().query(
      `UPDATE orders SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, order_number, status, updated_at`,
      [status, orderId]
    );
    if (!result.rowCount) return sendJson(res, 404, { error: 'Buyurtma topilmadi.' });
    return sendJson(res, 200, { order: result.rows[0] });
  } catch (error) {
    return handleApiError(res, error);
  }
}
