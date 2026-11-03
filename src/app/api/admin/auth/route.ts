import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/supabase/admin';

export async function GET() {
  const auth = await verifyAdminSession();
  return NextResponse.json({ authenticated: auth.isAdmin, user: auth });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, secretKey } = body;

    const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'fifthwall_admin_pass_2026';

    // Allow bootstrap access with matching secret key or admin credentials
    const isSecretValid = secretKey === bootstrapSecret;
    const isCredentialsValid =
      email === 'admin@thefifthwall.in' && (password === 'admin123' || password === bootstrapSecret);

    if (isSecretValid || isCredentialsValid) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authorization granted',
        user: { email: 'admin@thefifthwall.in', role: 'admin' },
      });

      response.cookies.set('tfw_admin_auth', bootstrapSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('tfw_admin_auth');
  return response;
}
