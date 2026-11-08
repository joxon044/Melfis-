import { PRODUCTS, CATEGORIES, SHOP_INFO } from '../../src/data/flowers.js';
import { handleCapacitorCors, methodNotAllowed, sendJson } from '../../server/http.js';

const VALID_API_KEY = process.env.MELFIS_BOT_API_KEY || 'melfis_live_key_9f8e7d6c5b4a3210';

function checkAuth(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey || apiKey !== VALID_API_KEY) {
    sendJson(res, 401, { error: 'Yaroqsiz yoki kiritilmagan API kalit. X-API-KEY headerini tekshiring.' });
    return false;
  }
  return true;
}

export default function botProducts(req, res) {
  if (handleCapacitorCors(req, res)) return;
  if (!checkAuth(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  return sendJson(res, 200, {
    success: true,
    shop: SHOP_INFO,
    categories: CATEGORIES,
    count: PRODUCTS.length,
    products: PRODUCTS,
  });
}

