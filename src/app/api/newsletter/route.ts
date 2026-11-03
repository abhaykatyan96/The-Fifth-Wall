import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validation/schemas';
import { mockStore } from '@/lib/supabase/mockStore';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = newsletterSchema.parse(body);

    const subscriber = mockStore.subscribeNewsletter(email, body.source || 'footer');

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to THE FIFTH WALL private gazette.',
      data: subscriber,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid subscription request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const subscribers = mockStore.getNewsletterSubscribers();
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch subscribers';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
