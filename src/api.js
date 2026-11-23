import { Capacitor } from '@capacitor/core';

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  (Capacitor.isNativePlatform() ? 'https://melfis.vercel.app' : '')
).replace(/\/+$/, '');

export async function apiRequest(path, { method = 'GET', body } = {}) {
  if (Capacitor.isNativePlatform() && !apiBaseUrl) {
    throw new Error('Mobil ilova backendiga ulanish sozlanmagan. VITE_API_BASE_URL manzilini kiriting.');
  }

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Server bilan aloqa o‘rnatilmadi.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend javob bermadi.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'So‘rov bajarilmadi.');
  }
  return result;
}
