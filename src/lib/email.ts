import { Resend } from 'resend';
import type { OrderWithItems } from '@/lib/types';
import { ORDER_NOTIFICATION_EMAIL } from '@/lib/config';

const ORDER_TYPE_LABEL: Record<string, string> = {
  reserve: 'New Reservation',
  custom: 'New Custom Order Request',
  message: 'New Contact Message',
};

export async function sendOrderNotification(order: OrderWithItems) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = ORDER_NOTIFICATION_EMAIL;
  if (!apiKey) return; // Email not configured — order is still saved in the dashboard.

  const resend = new Resend(apiKey);
  const label = ORDER_TYPE_LABEL[order.order_type] ?? 'New Request';

  const itemsHtml = order.order_items.length
    ? `<ul>${order.order_items
        .map((i) => `<li>${i.quantity} × ${escapeHtml(i.product_name)} (${escapeHtml(i.price_label)})</li>`)
        .join('')}</ul>`
    : '';

  const html = `
    <h2>${label}</h2>
    <p><strong>From:</strong> ${escapeHtml(order.customer_name)} (${escapeHtml(order.customer_email)}${
      order.customer_phone ? `, ${escapeHtml(order.customer_phone)}` : ''
    })</p>
    ${order.subject ? `<p><strong>Subject:</strong> ${escapeHtml(order.subject)}</p>` : ''}
    ${itemsHtml}
    ${order.custom_request ? `<p><strong>Message:</strong><br>${escapeHtml(order.custom_request).replace(/\n/g, '<br>')}</p>` : ''}
    ${order.pickup_notes ? `<p><strong>Pickup notes:</strong> ${escapeHtml(order.pickup_notes)}</p>` : ''}
    <p style="color:#7A5C47;font-size:13px;">Manage this in your admin dashboard.</p>
  `;

  try {
    await resend.emails.send({
      from: 'Dean\'s Petals & Produce <onboarding@resend.dev>',
      to,
      replyTo: order.customer_email,
      subject: `${label} — ${order.customer_name}`,
      html,
    });
  } catch (err) {
    console.error('Failed to send order notification email', err);
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
