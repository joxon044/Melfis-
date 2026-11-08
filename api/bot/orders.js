import { getPool } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireBody, sendJson } from '../../server/http.js';

// Standart API kaliti (Vercel Environment Variables orqali o'zgartirish ham mumkin)
const VALID_API_KEY = process.env.MELFIS_BOT_API_KEY || 'melfis_live_key_9f8e7d6c5b4a3210';

function checkAuth(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey || apiKey !== VALID_API_KEY) {
    sendJson(res, 401, { error: 'Yaroqsiz yoki kiritilmagan API kalit. X-API-KEY headerini tekshiring.' });
    return false;
  }
  return true;
}

export default async function botOrders(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (!checkAuth(req, res)) return;

  try {
    const pool = getPool();

    // 1. GET: Barcha buyurtmalarni olish
    if (req.method === 'GET') {
      const result = await pool.query(
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
          LIMIT 100`
      );
      return sendJson(res, 200, { success: true, count: result.rows.length, orders: result.rows });
    }

    // 2. PATCH: Buyurtma holatini yangilash (masalan: qabul qilindi, yetkazildi)
    if (req.method === 'PATCH') {
      const body = requireBody(req);
      const { orderId, status } = body;

      if (!orderId || !status) {
        return sendJson(res, 400, { error: 'orderId va status kiritilishi shart.' });
      }

      const validStatuses = ['new', 'accepted', 'in_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return sendJson(res, 400, { error: `Noto'g'ri status. Mumkin bo'lgan statuslar: ${validStatuses.join(', ')}` });
      }

      const updateResult = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 OR order_number = $2 RETURNING *`,
        [status, orderId]
      );

      if (updateResult.rowCount === 0) {
        return sendJson(res, 404, { error: 'Buyurtma topilmadi.' });
      }

      return sendJson(res, 200, { success: true, message: 'Status yangilandi', order: updateResult.rows[0] });
    }

    return methodNotAllowed(res, ['GET', 'PATCH']);
  } catch (error) {
    return handleApiError(res, error);
  }
}

