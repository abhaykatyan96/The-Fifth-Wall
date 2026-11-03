import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mockStore';
import { couponValidateSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotalInPaise } = couponValidateSchema.parse(body);

    const coupon = mockStore.getCoupon(code);
    if (!coupon || !coupon.is_active) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired promotional code' },
        { status: 400 }
      );
    }

    if (subtotalInPaise < coupon.minimum_order_in_paise) {
      const minInRupees = (coupon.minimum_order_in_paise / 100).toLocaleString('en-IN');
      return NextResponse.json(
        { success: false, error: `This code requires a minimum cart value of ₹${minInRupees}` },
        { status: 400 }
      );
    }

    let discountInPaise = 0;
    if (coupon.discount_type === 'percentage') {
      const rawDiscount = Math.round((subtotalInPaise * coupon.discount_value) / 100);
      discountInPaise = coupon.max_discount_in_paise
        ? Math.min(rawDiscount, coupon.max_discount_in_paise)
        : rawDiscount;
    } else {
      discountInPaise = coupon.discount_value;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountInPaise,
        message: `Promotion code ${coupon.code} successfully applied!`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid coupon request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
