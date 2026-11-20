import { randomUUID } from 'node:crypto';
import { getSessionUser } from '../../server/auth.js';
import { getPool } from '../../server/db.js';
import {
  handleApiError,
  handleCapacitorCors,
  methodNotAllowed,
  requireBody,
  requireSameOrigin,
  sendJson,
} from '../../server/http.js';

const TOP_UP_AMOUNTS = new Set([100000, 200000, 500000, 1000000]);

export default async function topups(req, res) {
  if (handleCapacitorCors(req, res)) return;

  try {
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Balansni to‘ldirish uchun akkauntga kiring.' });

    if (req.method === 'GET') {
      const result = await getPool().query(
        `SELECT id, amount, status, created_at, processed_at
           FROM wallet_topups
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 20`,
        [user.id]
      );
      return sendJson(res, 200, { topups: result.rows });
    }

    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);
    requireSameOrigin(req);
    const { amount } = requireBody(req);
    if (!Number.isSafeInteger(amount) || !TOP_UP_AMOUNTS.has(amount)) {
      return sendJson(res, 400, { error: 'To‘ldirish summasini berilgan variantlardan tanlang.' });
    }

    const result = await getPool().query(
      `INSERT INTO wallet_topups (id, user_id, amount)
       VALUES ($1, $2, $3)
       RETURNING id, amount, status, created_at, processed_at`,
      [randomUUID(), user.id, amount]
    );
    return sendJson(res, 201, { topup: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      error.statusCode = 409;
      error.message = 'Avvalgi balans to‘ldirish so‘rovingiz ko‘rib chiqilmoqda.';
    }
    return handleApiError(res, error);
  }
}
