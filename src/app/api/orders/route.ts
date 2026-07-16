import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendOrderNotification } from '@/lib/email';
import type { OrderWithItems } from '@/lib/types';

type IncomingItem = {
  product_id: string;
  product_name: string;
  price_label: string;
  quantity: number;
};

type IncomingOrder = {
  order_type: 'reserve' | 'custom' | 'message';
  subject?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  pickup_notes?: string;
  custom_request?: string;
  items?: IncomingItem[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as IncomingOrder;

  if (!body.customer_name?.trim() || !body.customer_email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!['reserve', 'custom', 'message'].includes(body.order_type)) {
    return NextResponse.json({ error: 'Invalid order type.' }, { status: 400 });
  }
  if (body.order_type === 'reserve' && !(body.items && body.items.length > 0)) {
    return NextResponse.json({ error: 'Select at least one item to reserve.' }, { status: 400 });
  }

  const supabase = await createClient();

  // RLS restricts SELECT on orders/order_items to admins, so anonymous inserts
  // can't be read back via `.select()`. Generate IDs client-side instead.
  const orderId = crypto.randomUUID();
  const now = new Date().toISOString();

  const orderRow = {
    id: orderId,
    order_type: body.order_type,
    subject: body.subject?.trim() ?? '',
    customer_name: body.customer_name.trim(),
    customer_email: body.customer_email.trim(),
    customer_phone: body.customer_phone?.trim() ?? '',
    pickup_notes: body.pickup_notes?.trim() ?? '',
    custom_request: body.custom_request?.trim() ?? '',
  };

  const { error: orderError } = await supabase.from('orders').insert(orderRow);
  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  let orderItems: OrderWithItems['order_items'] = [];
  if (body.items?.length) {
    const rows = body.items.map((item) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: item.product_id || null,
      product_name: item.product_name,
      price_label: item.price_label,
      quantity: item.quantity || 1,
      created_at: now,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(rows);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
    orderItems = rows;
  }

  await sendOrderNotification({
    ...orderRow,
    status: 'new',
    created_at: now,
    updated_at: now,
    order_items: orderItems,
  } as OrderWithItems);

  return NextResponse.json({ success: true, id: orderId });
}
