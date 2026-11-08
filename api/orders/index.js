import { randomBytes, randomUUID } from 'node:crypto';
import { getSessionUser } from '../../server/auth.js';
import { getPool } from '../../server/db.js';
import { handleApiError, handleCapacitorCors, methodNotAllowed, requireBody, requireSameOrigin, sendJson } from '../../server/http.js';
import { validateOrder } from '../../server/order-validation.js';
import { sendTelegramOrderNotification } from '../../server/telegram.js';

export default async function orders(req, res) {
  if (handleCapacitorCors(req, res)) return;
  try {
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Buyurtmalar uchun akkauntga kiring.' });

    if (req.method === 'GET') {
      const result = await getPool().query(
        `SELECT o.*,
                COALESCE(json_agg(json_build_object(
                  'id', i.item_key, 'name', i.name, 'price', i.unit_price,
                  'quantity', i.quantity, 'details', i.details
                )) FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS items
           FROM orders o
           LEFT JOIN order_items i ON i.order_id = o.id
          WHERE o.user_id = $1
          GROUP BY o.id
          ORDER BY o.created_at DESC
          LIMIT 50`,
        [user.id]
      );
      return sendJson(res, 200, { orders: result.rows });
    }

    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
    requireSameOrigin(req);
    const body = requireBody(req);
    const order = validateOrder(body, user);
    const orderId = randomUUID();
    const orderNumber = `MF-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO orders (
          id, order_number, user_id, customer_name, phone, district, address,
          delivery_date, delivery_time, is_surprise, recipient_name, recipient_phone,
          card_message, notes, payment_method, subtotal, delivery_fee, total_price
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )`,
        [
          orderId, orderNumber, user.id, order.customerName, order.phone, order.district,
          order.address, order.deliveryDate, order.deliveryTime, order.isSurprise,
          order.recipientName, order.recipientPhone, order.cardMessage, order.notes,
          order.paymentMethod, order.subtotal, order.deliveryFee, order.totalPrice,
        ]
      );

      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, item_key, name, unit_price, quantity, details)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
          [orderId, item.id, item.name, item.price, item.quantity, JSON.stringify(item.details)]
        );
      }

      await client.query('COMMIT');

      // Yangi buyurtma haqida Telegramga xabar yuborish
      await sendTelegramOrderNotification({
        ...order,
        orderNumber,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return sendJson(res, 201, {
      order: {
        id: orderId,
        orderId: orderNumber,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customDetails: item.details,
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalPrice: order.totalPrice,
        customerName: order.customerName,
        phone: order.phone,
        district: order.district,
        address: order.address,
        deliveryDate: order.deliveryDate,
        deliveryTime: order.deliveryTime,
        isSurprise: order.isSurprise,
        recipientName: order.recipientName,
        recipientPhone: order.recipientPhone,
        cardMessage: order.cardMessage,
        notes: order.notes,
        paymentMethod: order.paymentMethod,
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(res, error);
  }
}
