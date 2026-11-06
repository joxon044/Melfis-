import { getSessionUser } from '../../server/auth.js';
import { getPool } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, sendJson } from '../../server/http.js';

export default async function adminOrders(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Admin akkauntiga kiring.' });
    if (user.role !== 'admin') return sendJson(res, 403, { error: 'Bu bo‘lim faqat adminlar uchun.' });

    const result = await getPool().query(
      `SELECT o.*,
              u.email AS customer_email,
              COALESCE(json_agg(json_build_object(
                'id', i.item_key, 'name', i.name, 'price', i.unit_price,
                'quantity', i.quantity, 'details', i.details
              )) FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS items
         FROM orders o
         JOIN users u ON u.id = o.user_id
         LEFT JOIN order_items i ON i.order_id = o.id
        GROUP BY o.id, u.email
        ORDER BY o.created_at DESC
        LIMIT 200`
    );
    return sendJson(res, 200, { orders: result.rows });
  } catch (error) {
    return handleApiError(res, error);
  }
}
