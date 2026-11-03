import { NextRequest, NextResponse } from 'next/server';
import { consultationSchema } from '@/lib/validation/schemas';
import { mockStore } from '@/lib/supabase/mockStore';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = consultationSchema.parse(body);

    const consultation = mockStore.createConsultation({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      room_type: validated.roomType,
      project_type: validated.projectType,
      budget: validated.budget,
      message: validated.message,
    });

    return NextResponse.json({
      success: true,
      message: 'Design consultation request submitted successfully. An architect will contact you within 24 hours.',
      data: consultation,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid consultation submission';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const items = mockStore.getConsultations();
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching consultations';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, adminNotes } = body;
    const updated = mockStore.updateConsultationStatus(id, status, adminNotes);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating consultation';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
