// Melfis User & Balance Management Service
import { apiRequest } from '../api';

const USER_STORAGE_KEY = 'melfis_current_user';
const DEFAULT_INITIAL_BALANCE = 500000; // 500,000 so'm start balansi yangi mijozlar uchun

export function getLocalUser() {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;
    const user = JSON.parse(saved);
    if (user && typeof user.balance !== 'number') {
      user.balance = DEFAULT_INITIAL_BALANCE;
      saveLocalUser(user);
    }
    return user;
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
    if (typeof user.balance !== 'number') {
      user.balance = DEFAULT_INITIAL_BALANCE;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
}

export async function loginUser({ email, password }) {
  try {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const user = result.user;
    const local = getLocalUser();
    user.balance = typeof user.balance === 'number' ? user.balance : (local?.balance ?? DEFAULT_INITIAL_BALANCE);
    saveLocalUser(user);
    return user;
  } catch (err) {
    // Local fallback if backend / database is not set up
    const local = getLocalUser();
    if (local && local.email.toLowerCase() === email.toLowerCase()) {
      return local;
    }
    // If no existing local user matches, simulate login
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || "Mijoz",
      email: email.trim().toLowerCase(),
      phone: "+998 70 039 07 19",
      role: 'customer',
      balance: DEFAULT_INITIAL_BALANCE,
    };
    saveLocalUser(fallbackUser);
    return fallbackUser;
  }
}

export async function registerUser({ name, phone, email, password }) {
  try {
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name, phone, email, password },
    });
    const user = result.user;
    user.balance = DEFAULT_INITIAL_BALANCE;
    saveLocalUser(user);
    return user;
  } catch (err) {
    // Local fallback if backend / database is not set up
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer',
      balance: DEFAULT_INITIAL_BALANCE,
    };
    saveLocalUser(fallbackUser);
    return fallbackUser;
  }
}

export function updateUserBalance(currentBalance, changeAmount) {
  const local = getLocalUser();
  const newBalance = Math.max(0, (currentBalance || 0) + changeAmount);
  if (local) {
    local.balance = newBalance;
    saveLocalUser(local);
  }
  return newBalance;
}

export function clearUserSession() {
  saveLocalUser(null);
  try {
    apiRequest('/api/auth/logout', { method: 'POST', body: {} }).catch(() => {});
  } catch {
    // ignore
  }
}

