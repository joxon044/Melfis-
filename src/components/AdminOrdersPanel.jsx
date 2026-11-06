import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../api';
import { formatPrice } from '../utils/formatters';

const ORDER_STATUSES = [
  ['new', 'Yangi'],
  ['confirmed', 'Tasdiqlandi'],
  ['preparing', 'Tayyorlanmoqda'],
  ['delivering', 'Yetkazilmoqda'],
  ['completed', 'Yakunlandi'],
  ['cancelled', 'Bekor qilindi'],
];

async function fetchOrders() {
  const result = await apiRequest('/api/admin/orders');
  return result.orders;
}

export default function AdminOrdersPanel({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchOrders()
      .then((result) => {
        if (isActive) setOrders(result);
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const updateStatus = async (order, status) => {
    setUpdatingId(order.id);
    setError('');
    try {
      await apiRequest(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: 'PATCH',
        body: { status },
      });
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#FAF7F2]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-600 hover:bg-stone-100" aria-label="Orqaga">
            <ArrowLeft size={20} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-stone-900">Admin buyurtmalar</h1>
            <p className="text-xs text-stone-500">{orders.length} ta buyurtma</p>
          </div>
        </div>
        <button type="button" onClick={loadOrders} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          Yangilash
        </button>
      </header>

      <main className="mx-auto max-w-5xl space-y-4 p-4 sm:p-8">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {isLoading && <p className="py-12 text-center text-sm text-stone-500">Buyurtmalar yuklanmoqda...</p>}
        {!isLoading && !error && orders.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Hozircha buyurtmalar yo‘q.</p>
        )}

        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">{order.order_number}</h2>
                <p className="mt-1 text-xs text-stone-500">{new Date(order.created_at).toLocaleString('uz-UZ')}</p>
              </div>
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(event) => updateStatus(order, event.target.value)}
                aria-label={`${order.order_number} holati`}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700"
              >
                {ORDER_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>

            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="font-semibold text-stone-800">{order.customer_name} · {order.phone}</p>
                <p className="text-stone-500">{order.customer_email}</p>
                <p className="text-stone-600">{order.district}{order.address ? `, ${order.address}` : ''}</p>
                <p className="text-stone-500">{order.delivery_date} · {order.delivery_time}</p>
              </div>
              <div className="space-y-1.5">
                {(order.items || []).map((item) => (
                  <p key={`${order.id}-${item.id}`} className="text-stone-700">
                    {item.name} × {item.quantity} — {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                ))}
                <p className="border-t border-stone-100 pt-2 font-bold text-emerald-900">
                  Jami: {formatPrice(Number(order.total_price))} · {order.payment_method}
                </p>
              </div>
            </div>

            {order.is_surprise && (
              <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
                Surpriz: {order.recipient_name} · {order.recipient_phone}
              </p>
            )}
            {order.card_message && <p className="mt-2 text-xs text-stone-500">Tabriknoma: {order.card_message}</p>}
            {order.notes && <p className="mt-2 text-xs text-stone-500">Izoh: {order.notes}</p>}
          </article>
        ))}
      </main>
    </div>
  );
}
