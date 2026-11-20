const CAPACITOR_ORIGINS = [
  'https://localhost',
  'http://localhost',
  'capacitor://localhost',
  'ionic://localhost'
];

export function sendJson(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

export function handleCapacitorCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return false;

  const isCapacitor = 
    CAPACITOR_ORIGINS.includes(origin) || 
    origin.startsWith('capacitor://') || 
    origin.startsWith('http://localhost') ||
    origin.startsWith('https://localhost');

  if (!isCapacitor) return false;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
  if (!origin) return; // Allow requests without Origin (same-origin browser GET/POST, mobile apps, curl)

  // Allow Capacitor / local mobile origins
  if (
    CAPACITOR_ORIGINS.includes(origin) || 
    origin.startsWith('capacitor://') || 
    origin.startsWith('http://localhost') ||
    origin.startsWith('https://localhost')
  ) {
    return;
  }

  // Allow Vercel preview and production domains
  try {
    const originHost = new URL(origin).host;
    const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
    if (originHost.endsWith('vercel.app') || (requestHost && originHost === requestHost)) {
      return;
    }
  } catch {
    // If URL parsing fails, allow
    return;
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
