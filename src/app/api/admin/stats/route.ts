import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/supabase/admin';
import { mockStore } from '@/lib/supabase/mockStore';

export async function GET() {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const orders = mockStore.getOrders();
    const products = mockStore.getAllProducts();
    const consultations = mockStore.getConsultations();
    const subscribers = mockStore.getNewsletterSubscribers();

    // Calculate revenue from paid/confirmed/shipped/delivered orders
    const validOrders = orders.filter((o) => o.payment_status === 'paid' || o.status !== 'cancelled');
    const totalRevenueInPaise = validOrders.reduce((sum, o) => sum + o.total_in_paise, 0);

    const lowStockProducts = products.filter((p) => p.stock_quantity < 8);

    // Unique customer emails
    const customerEmails = new Set(orders.map((o) => o.customer_email.toLowerCase()));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenueInPaise,
        totalRevenueInRupees: totalRevenueInPaise / 100,
        totalOrders: orders.length,
        totalCustomers: Math.max(customerEmails.size, 1),
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        pendingConsultations: consultations.filter((c) => c.status === 'pending').length,
        totalSubscribers: subscribers.length,
        recentOrders: orders.slice(0, 5),
        lowStockItems: lowStockProducts.slice(0, 5),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching stats';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
