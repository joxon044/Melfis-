const CAPACITOR_ORIGIN = 'https://localhost';

export function sendJson(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

export function handleCapacitorCors(req, res) {
  if (req.headers.origin !== CAPACITOR_ORIGIN) return false;

  res.setHeader('Access-Control-Allow-Origin', CAPACITOR_ORIGIN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
    return true;
  }
  return false;
}

export function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  return sendJson(res, 405, { error: 'Ushbu so‘rov usuli qo‘llab-quvvatlanmaydi.' });
}

export function handleApiError(res, error) {
  if (error.statusCode) {
    return sendJson(res, error.statusCode, { error: error.message });
  }

  console.error('API request failed:', error);
  return sendJson(res, 500, { error: 'Serverda xatolik yuz berdi. Keyinroq qayta urinib ko‘ring.' });
}

export function requireSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return;
  if (origin === CAPACITOR_ORIGIN) return;

  const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    const error = new Error('So‘rov manbasi yaroqsiz.');
    error.statusCode = 403;
    throw error;
  }

  if (!requestHost || originHost !== requestHost) {
    const error = new Error('So‘rov manbasi ruxsat etilmagan.');
    error.statusCode = 403;
    throw error;
  }
}

export function requireBody(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    const error = new Error('So‘rov ma’lumotlari noto‘g‘ri.');
    error.statusCode = 400;
    throw error;
  }
  return req.body;
}
