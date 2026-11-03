import { Resend } from 'resend';
import { Order } from '@/types/database';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes('demo') || apiKey.includes('re_demo')) {
    return null;
  }
  return new Resend(apiKey);
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export async function sendOrderConfirmationEmail(order: Order) {
  const resend = getResendClient();
  const fromEmail = process.env.EMAIL_FROM || 'THE FIFTH WALL <studio@thefifthwall.in>';

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eae3d8;">
          <strong style="color: #151515; font-size: 15px;">${item.product_name}</strong>
          ${item.variant_name ? `<br/><span style="color: #666; font-size: 13px;">${item.variant_name}</span>` : ''}
          <br/><span style="color: #888; font-size: 13px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eae3d8; text-align: right; color: #151515; font-size: 15px;">
          ${formatINR(item.total_price_in_paise)}
        </td>
      </tr>
    `
    )
    .join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Order Confirmation — THE FIFTH WALL</title>
    </head>
    <body style="margin:0; padding:0; background-color: #f6f3ed; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #242321;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 15px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eae3d8; padding: 40px; text-align: left;">
              <tr>
                <td style="border-bottom: 1px solid #eae3d8; padding-bottom: 25px; text-align: center;">
                  <h1 style="margin: 0; font-size: 26px; letter-spacing: 4px; font-weight: 400; color: #151515;">THE FIFTH WALL</h1>
                  <p style="margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #b69a69;">Lighting. Interiors. Beyond.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 0 20px 0;">
                  <h2 style="font-size: 20px; font-weight: 500; color: #151515; margin-bottom: 10px;">Thank you for your order, ${order.customer_name}.</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #555;">
                    Your bespoke illumination pieces have been reserved. Each piece undergoes white-glove inspection at our studio prior to dispatch.
                  </p>
                  <div style="background-color: #fbfaf8; border-left: 3px solid #b69a69; padding: 15px; margin: 20px 0;">
                    <strong style="color: #151515; font-size: 14px;">Order Number:</strong> ${order.order_number}<br/>
                    <strong style="color: #151515; font-size: 14px;">Payment Method:</strong> ${order.payment_method.toUpperCase()} (${order.payment_status.toUpperCase()})
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <h3 style="font-size: 16px; letter-spacing: 1px; text-transform: uppercase; color: #151515; border-bottom: 2px solid #b69a69; padding-bottom: 8px;">Order Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 10px 0; color: #666;">Subtotal</td>
                      <td style="padding: 10px 0; text-align: right; color: #151515;">${formatINR(order.subtotal_in_paise)}</td>
                    </tr>
                    ${
                      order.discount_in_paise > 0
                        ? `<tr><td style="padding: 10px 0; color: #16a34a;">Discount (${order.coupon_code || ''})</td><td style="padding: 10px 0; text-align: right; color: #16a34a;">-${formatINR(order.discount_in_paise)}</td></tr>`
                        : ''
                    }
                    <tr>
                      <td style="padding: 10px 0; color: #666;">White-Glove Shipping</td>
                      <td style="padding: 10px 0; text-align: right; color: #151515;">${order.shipping_in_paise === 0 ? 'Complimentary' : formatINR(order.shipping_in_paise)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 14px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #151515; color: #151515;">Total</td>
                      <td style="padding: 14px 0; font-size: 18px; font-weight: bold; border-top: 2px solid #151515; text-align: right; color: #b69a69;">${formatINR(order.total_in_paise)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 30px; border-top: 1px solid #eae3d8; margin-top: 30px;">
                  <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #151515; margin: 0 0 10px 0;">Delivery Address</h4>
                  <p style="font-size: 13px; line-height: 1.5; color: #666; margin: 0;">
                    ${order.shipping_address.full_name || order.shipping_address.fullName}<br/>
                    ${order.shipping_address.address_line1 || order.shipping_address.addressLine1}, ${order.shipping_address.address_line2 || order.shipping_address.addressLine2 || ''}<br/>
                    ${order.shipping_address.city}, ${order.shipping_address.state} — ${order.shipping_address.pincode}<br/>
                    Phone: ${order.shipping_address.phone}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 40px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eae3d8; margin-top: 30px;">
                  <p style="margin: 0 0 5px 0;">THE FIFTH WALL SHOWROOM</p>
                  <p style="margin: 0 0 5px 0;">1/803, Sector 1, Gomti Nagar Vistar, Lucknow</p>
                  <p style="margin: 0;">Mon – Sat, 10:30 am – 8:00 pm | studio@thefifthwall.in</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Resend Email Mock] Dispatched confirmation to ${order.customer_email} for order ${order.order_number}`);
    return { success: true, simulated: true };
  }

  return await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject: `Order Confirmation — ${order.order_number} | THE FIFTH WALL`,
    html: emailHtml,
  });
}
