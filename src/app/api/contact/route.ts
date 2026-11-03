import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/schemas';
import { mockStore } from '@/lib/supabase/mockStore';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const message = mockStore.createContactMessage({
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      subject: validated.subject,
      message: validated.message,
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. Our concierge team will reply within 1 business day.',
      data: message,
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Invalid message submission';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function GET() {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const messages = mockStore.getContactMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error fetching messages';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
