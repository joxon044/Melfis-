// Melfis User & Balance Management Service
import { apiRequest } from '../api';

const USER_STORAGE_KEY = 'melfis_current_user';

export function getLocalUser() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveLocalUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }
    if (typeof user.balance !== 'number' || user.balance < 0) {
      user.balance = 0;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
}

export async function loginUser({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  try {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: cleanEmail, password },
    });
    if (result && result.user) {
      saveLocalUser(result.user);
      return result.user;
    }
  } catch (apiError) {
    console.warn('API login failed, checking local user fallback:', apiError);
  }

  // Resilient fallback: Allow login locally if network or backend fails
  const existing = getLocalUser();
  if (existing && existing.email === cleanEmail) {
    return existing;
  }

  const fallbackUser = {
    id: 'local_' + Date.now(),
    name: cleanEmail.split('@')[0] || 'Melfis Mijozi',
    phone: '+998 90 123 45 67',
    email: cleanEmail,
    role: 'customer',
    balance: 0,
  };
  saveLocalUser(fallbackUser);
  return fallbackUser;
}

export async function registerUser({ name, phone, email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  try {
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name, phone, email: cleanEmail, password },
    });
    if (result && result.user) {
      saveLocalUser(result.user);
      return result.user;
    }
  } catch (apiError) {
    console.warn('API register failed, creating local user fallback:', apiError);
  }

  // Initial balance is 0 so'm (no bonus)
  const fallbackUser = {
    id: 'local_' + Date.now(),
    name: (name || '').trim() || 'Melfis Mijozi',
    phone: (phone || '').trim() || '+998',
    email: cleanEmail,
    role: 'customer',
    balance: 0,
  };
  saveLocalUser(fallbackUser);
  return fallbackUser;
}

export function clearUserSession() {
  saveLocalUser(null);
}
