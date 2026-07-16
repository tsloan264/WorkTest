'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { OrderStatus, OrderWithItems } from '@/lib/types';

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: 'bg-gold-light text-warm-brown',
  ready: 'bg-sage-light text-sage-dark',
  completed: 'bg-cream-dark text-ink-muted',
  cancelled: 'bg-blush-light text-rose',
};

const TYPE_LABEL: Record<string, string> = {
  reserve: 'Reservation',
  custom: 'Custom Order',
  message: 'Message',
};

const FILTERS: Array<'all' | OrderStatus> = ['all', 'new', 'ready', 'completed', 'cancelled'];

export default function OrdersClient({ initialOrders }: { initialOrders: OrderWithItems[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const supabase = createClient();

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from('orders').update({ status }).eq('id', id);
  }

  async function deleteOrder(id: string) {
    if (!confirm('Delete this order permanently?')) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await supabase.from('order_items').delete().eq('order_id', id);
    await supabase.from('orders').delete().eq('id', id);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === f ? 'border-sage bg-sage text-white' : 'border-cream-dark text-ink-muted hover:border-sage'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-ink-muted">No orders here yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {visible.map((order) => (
            <div key={order.id} className="rounded-2xl border border-cream-dark bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-cream-mid px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
                    {TYPE_LABEL[order.order_type]}
                  </span>
                  {order.subject && <span className="ml-2 text-sm font-semibold">{order.subject}</span>}
                  <p className="mt-1 font-display text-lg">{order.customer_name}</p>
                  <p className="text-sm text-ink-muted">
                    {order.customer_email}
                    {order.customer_phone ? ` · ${order.customer_phone}` : ''}
                  </p>
                  <p className="text-xs text-ink-muted">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              {order.order_items?.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1 border-t border-cream-dark pt-3 text-sm">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.product_name} <span className="text-ink-muted">({item.price_label})</span>
                    </li>
                  ))}
                </ul>
              )}

              {order.custom_request && (
                <p className="mt-3 border-t border-cream-dark pt-3 text-sm text-ink-muted">{order.custom_request}</p>
              )}
              {order.pickup_notes && (
                <p className="mt-2 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">Pickup notes:</span> {order.pickup_notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-cream-dark pt-3">
                {(['new', 'ready', 'completed', 'cancelled'] as OrderStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(order.id, s)}
                    disabled={order.status === s}
                    className="rounded-full border border-cream-dark px-3 py-1 text-xs font-semibold text-ink-muted transition hover:border-sage hover:text-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark {STATUS_LABEL[s]}
                  </button>
                ))}
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="ml-auto text-xs font-semibold text-rose underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
