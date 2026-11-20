import { getSessionUser } from '../../../server/auth.js';
import { getPool } from '../../../server/db.js';
import {
  handleApiError,
  handleCapacitorCors,
  methodNotAllowed,
  requireBody,
  requireSameOrigin,
  sendJson,
} from '../../../server/http.js';

export default async function updateTopup(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (req.method !== 'PATCH') return methodNotAllowed(res, ['PATCH']);

  try {
    requireSameOrigin(req);
    const admin = await getSessionUser(req);
    if (!admin) return sendJson(res, 401, { error: 'Admin akkauntiga kiring.' });
    if (admin.role !== 'admin') return sendJson(res, 403, { error: 'Bu amal faqat adminlar uchun.' });

    const topupId = req.query.id;
    if (typeof topupId !== 'string' || !/^[0-9a-f-]{36}$/i.test(topupId)) {
      return sendJson(res, 400, { error: 'Balans so‘rovi ID noto‘g‘ri.' });
    }

    const { status } = requireBody(req);
    if (!['approved', 'rejected'].includes(status)) {
      return sendJson(res, 400, { error: 'So‘rov holati noto‘g‘ri.' });
    }

    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      const topupResult = await client.query(
        'SELECT id, user_id, amount, status FROM wallet_topups WHERE id = $1 FOR UPDATE',
        [topupId]
      );
      const topup = topupResult.rows[0];
      if (!topup) {
        await client.query('ROLLBACK');
        return sendJson(res, 404, { error: 'Balans so‘rovi topilmadi.' });
      }
      if (topup.status !== 'pending') {
        await client.query('ROLLBACK');
        return sendJson(res, 409, { error: 'Bu balans so‘rovi avval ko‘rib chiqilgan.' });
      }

      let balance = null;
      if (status === 'approved') {
        const balanceResult = await client.query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2 AND balance <= 9007199254740991 - $1 RETURNING balance',
          [topup.amount, topup.user_id]
        );
        if (!balanceResult.rowCount) {
          throw Object.assign(new Error('Balans xavfsiz chegaradan oshib ketadi.'), { statusCode: 409 });
        }
        balance = Number(balanceResult.rows[0].balance);
      }

      await client.query(
        `UPDATE wallet_topups
            SET status = $1, processed_by = $2, processed_at = NOW()
          WHERE id = $3`,
        [status, admin.id, topupId]
      );
      await client.query('COMMIT');

      return sendJson(res, 200, {
        topup: { id: topup.id, amount: Number(topup.amount), status, balance },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return handleApiError(res, error);
  }
}
