import dotenv from 'dotenv';

dotenv.config();

export interface OrderNotificationData {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  note?: string | null;
  created_at: Date | string;
}

/**
 * Send order notification to admin / business owner
 */
export async function sendOrderNotificationEmail(order: OrderNotificationData): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'orders@zigwills.com';

  if (!resendApiKey) {
    console.log(`[Email Mock] New order notification for #${order.id} (${order.customer_name}) sent to ${adminEmail}`);
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Zigwills Orders <orders@zigwills.com>',
        to: [adminEmail],
        subject: `New Water Order #${order.id} from ${order.customer_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
            <h2 style="color: #0284c7; margin-top: 0;">💧 New Zigwills Order #${order.id}</h2>
            <p>A new order has just been submitted on the website!</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <tr><th style="padding: 8px 0; color: #64748b;">Customer Name:</th><td style="padding: 8px 0; font-weight: bold;">${order.customer_name}</td></tr>
              <tr><th style="padding: 8px 0; color: #64748b;">Phone Number:</th><td style="padding: 8px 0; font-weight: bold;"><a href="tel:${order.phone}" style="color: #0284c7;">${order.phone}</a></td></tr>
              <tr><th style="padding: 8px 0; color: #64748b;">Delivery Address:</th><td style="padding: 8px 0;">${order.address}</td></tr>
              <tr><th style="padding: 8px 0; color: #64748b;">Product:</th><td style="padding: 8px 0; font-weight: bold; text-transform: capitalize;">${order.product}</td></tr>
              <tr><th style="padding: 8px 0; color: #64748b;">Quantity:</th><td style="padding: 8px 0; font-weight: bold;">${order.quantity}</td></tr>
              ${order.note ? `<tr><th style="padding: 8px 0; color: #64748b;">Delivery Note:</th><td style="padding: 8px 0;">${order.note}</td></tr>` : ''}
            </table>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8;">Sent automatically from Zigwills Table Water Order System.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Resend email:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending order email:', error);
    return false;
  }
}

/**
 * Send order status update notification to customer/admin (Confirmed, Delivered, Cancelled)
 */
export async function sendStatusUpdateNotification(
  order: OrderNotificationData,
  newStatus: string
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'orders@zigwills.com';

  const statusTitle =
    newStatus === 'confirmed'
      ? 'Order Confirmed 🚚'
      : newStatus === 'delivered'
      ? 'Order Delivered ✅'
      : 'Order Cancelled ❌';

  console.log(`[Notification Alert] Order #${order.id} for ${order.customer_name} marked as ${newStatus.toUpperCase()}`);

  if (!resendApiKey) return true;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Zigwills Water <orders@zigwills.com>',
        to: [adminEmail],
        subject: `Zigwills Order #${order.id} — ${statusTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #1e293b;">
            <h2 style="color: #0284c7; margin-top: 0;">💧 Zigwills Water Status Update</h2>
            <p>Order <strong>#${order.id}</strong> for <strong>${order.customer_name}</strong> has been updated to <span style="font-weight: bold; text-transform: uppercase; color: #0284c7;">${newStatus}</span>.</p>
            <table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 16px;">
              <tr><th style="padding: 6px 0; color: #64748b;">Customer:</th><td style="padding: 6px 0;">${order.customer_name} (${order.phone})</td></tr>
              <tr><th style="padding: 6px 0; color: #64748b;">Address:</th><td style="padding: 6px 0;">${order.address}</td></tr>
              <tr><th style="padding: 6px 0; color: #64748b;">Product:</th><td style="padding: 6px 0;">${order.quantity}x ${order.product}</td></tr>
            </table>
          </div>
        `,
      }),
    });
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
}
