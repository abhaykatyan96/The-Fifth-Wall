'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Global Razorpay declaration for TypeScript
declare global {
  interface Window {
    Razorpay?: unknown;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalInPaise, discountInPaise, shippingInPaise, totalInPaise, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Shipping form state
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    deliveryInstructions: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.full_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
        <div className="max-w-xl mx-auto px-4 text-center py-20 bg-[#141414] border border-[#2E261B] rounded-sm shadow-2xl space-y-4">
          <h2 className="font-serif text-2xl text-[#F5EEDB]">Your bag is empty</h2>
          <p className="text-xs text-[#9E9788]">Please add pieces to your bag prior to checkout.</p>
          <Link href="/shop" className="gold-button inline-flex py-3 px-6 text-xs mt-2">
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Valid phone number is required';
    if (!formData.addressLine1.trim()) return 'Street address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.pincode.trim() || !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      return 'Please enter a valid 6-digit Indian PIN code';
    }
    return null;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep1();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  // Execute payment / place order
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cartPayload = items.map((it) => ({
        productId: it.product.id,
        variantId: it.variant?.id || null,
        quantity: it.quantity,
      }));

      if (formData.paymentMethod === 'cod') {
        // Place Cash on Delivery Order
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: cartPayload,
            shippingAddress: formData,
            couponCode,
            paymentMethod: 'cod',
          }),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          router.push(`/order-confirmation/${data.data.id}`);
        } else {
          setErrorMessage(data.error || 'Failed to place order.');
          setIsProcessing(false);
        }
        return;
      }

      // Online Razorpay Payment Workflow
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartPayload,
          shippingAddress: formData,
          couponCode,
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) {
        setErrorMessage(createData.error || 'Could not initiate Razorpay order.');
        setIsProcessing(false);
        return;
      }

      const { razorpayOrderId, amountInPaise, currency, keyId, orderId } = createData.data;

      // Check if Razorpay script is present
      if (typeof window.Razorpay === 'function') {
        // Construct Razorpay options
        const RazorpayClass = window.Razorpay as {
          new (options: unknown): { open: () => void; on: (event: string, handler: (resp: unknown) => void) => void };
        };

        const rzp = new RazorpayClass({
          key: keyId,
          amount: amountInPaise,
          currency: currency || 'INR',
          name: 'THE FIFTH WALL',
          description: 'Luxury Illumination & Bespoke Interiors',
          image: '/images/logo-icon.png',
          order_id: razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#C5A059',
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setErrorMessage('Payment process was cancelled by client.');
            },
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Cryptographic server signature verification
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                clearCart();
                router.push(`/order-confirmation/${orderId}`);
              } else {
                setErrorMessage(verifyData.error || 'Payment signature verification failed.');
                setIsProcessing(false);
              }
            } catch {
              setErrorMessage('Error communicating with verification gateway.');
              setIsProcessing(false);
            }
          },
        });

        rzp.on('payment.failed', (resp: unknown) => {
          console.error('Payment failed', resp);
          setErrorMessage('Payment failed. Please try another card or UPI.');
          setIsProcessing(false);
        });

        rzp.open();
      } else {
        // Fallback for demo environments when Razorpay CDN is restricted or test simulation
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            razorpayOrderId: razorpayOrderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: 'test_simulation_signature',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          router.push(`/order-confirmation/${orderId}`);
        } else {
          setErrorMessage(verifyData.error || 'Payment process failed.');
          setIsProcessing(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout encountered an error';
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayScriptLoaded(true)}
      />

      <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5EEDB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-8 border-b border-[#2E261B] mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="section-kicker">Secure Luxury Concierge</span>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EEDB] font-light mt-1">
                Bespoke <em className="text-[#C5A059]">Checkout.</em>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#86efac]">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted & PCI Compliant</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest font-medium">
              <span className={currentStep >= 1 ? 'text-[#C5A059] font-bold' : 'text-[#666]'}>
                1. Delivery Details
              </span>
              <span className="text-[#2E261B]">———</span>
              <span className={currentStep >= 2 ? 'text-[#C5A059] font-bold' : 'text-[#666]'}>
                2. Order Review
              </span>
              <span className="text-[#2E261B]">———</span>
              <span className={currentStep >= 3 ? 'text-[#C5A059] font-bold' : 'text-[#666]'}>
                3. Payment
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-8 p-4 bg-[#1f1212] border border-[#f87171]/40 text-[#fca5a5] text-xs rounded-sm flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#f87171]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Steps (7 cols) */}
            <div className="lg:col-span-7 bg-[#141414] p-6 sm:p-10 border border-[#2E261B] rounded-sm shadow-2xl">
              {/* STEP 1: Customer Information & Shipping */}
              {currentStep === 1 && (
                <form onSubmit={handleProceedToReview} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#F5EEDB] mb-1">Shipping & Contact</h3>
                    <p className="text-xs text-[#9E9788]">
                      Please provide accurate residential details for crated white-glove delivery.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. vikram@example.com"
                        className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Phone Number (For Delivery Coordination) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      House / Villa / Apartment & Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="e.g. Penthouse 42, Oberoi Sky Heights, Worli Sea Face"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Locality / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      placeholder="e.g. Near Sea Link Promenade"
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="400018"
                        className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.deliveryInstructions}
                      onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                      placeholder="e.g. Service elevator available, call before dispatch..."
                      className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-2.5 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="gold-button py-4 px-8 text-xs tracking-[0.2em] flex items-center gap-2"
                    >
                      <span>Continue to Order Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Review Order Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#F5EEDB] mb-1">Verify Delivery & Items</h3>
                    <p className="text-xs text-[#9E9788]">
                      Please confirm your delivery address and purchased architectural fixtures.
                    </p>
                  </div>

                  {/* Address Summary Box */}
                  <div className="bg-[#181818] p-5 rounded-sm border border-[#2E261B] text-xs space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-[#F5EEDB] uppercase tracking-wider">Delivery Destination:</strong>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#C5A059] hover:underline uppercase text-[10px] font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-medium text-[#F5EEDB]">{formData.fullName} ({formData.phone})</p>
                    <p className="text-[#9E9788]">{formData.addressLine1}, {formData.addressLine2}</p>
                    <p className="text-[#9E9788]">{formData.city}, {formData.state} — {formData.pincode}</p>
                    {formData.deliveryInstructions && (
                      <p className="text-[#C5A059] italic pt-1">Note: {formData.deliveryInstructions}</p>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#2E261B] border border-[#2E261B] rounded-sm bg-[#161616]">
                    {items.map((it) => (
                      <div key={it.product.id} className="p-4 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img
                            src={it.product.primary_image_url}
                            alt={it.product.name}
                            className="w-12 h-14 object-cover rounded-sm border border-[#2E261B]"
                          />
                          <div>
                            <span className="font-serif text-sm font-medium text-[#F5EEDB] block">
                              {it.product.name}
                            </span>
                            <span className="text-[#9E9788]">Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-medium text-[#F5EEDB]">
                          {formatINR((it.variant ? it.variant.price_in_paise : it.product.price_in_paise) * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs uppercase tracking-wider text-[#9E9788] hover:text-[#F5EEDB] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Address</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="gold-button py-4 px-8 text-xs tracking-[0.2em] flex items-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Method Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#F5EEDB] mb-1">Select Payment Mode</h3>
                    <p className="text-xs text-[#9E9788]">
                      All online payments are verified through Razorpay’s secured cryptographic gateway.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Razorpay Online */}
                    <label
                      className={`flex items-start p-4 border rounded-sm cursor-pointer transition ${
                        formData.paymentMethod === 'razorpay'
                          ? 'border-[#C5A059] bg-[#1A1812] ring-1 ring-[#C5A059]'
                          : 'border-[#2E261B] bg-[#181818] hover:border-[#C5A059]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                        className="mt-1 accent-[#C5A059]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-base text-[#F5EEDB] font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#C5A059]" />
                            <span>Razorpay Payment Gateway</span>
                          </span>
                          <span className="text-[10px] text-[#86efac] font-bold uppercase tracking-wider">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-[#9E9788] mt-1 leading-relaxed">
                          Instant checkout via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and EMI.
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-start p-4 border rounded-sm cursor-pointer transition ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#C5A059] bg-[#1A1812] ring-1 ring-[#C5A059]'
                          : 'border-[#2E261B] bg-[#181818] hover:border-[#C5A059]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="mt-1 accent-[#C5A059]"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-serif text-base text-[#F5EEDB] font-medium flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#C5A059]" />
                          <span>Cash on Delivery (White-Glove Courier Verification)</span>
                        </span>
                        <p className="text-xs text-[#9E9788] mt-1 leading-relaxed">
                          Pay upon delivery inspection. Our studio will call your phone to verify the consignment.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs uppercase tracking-wider text-[#9E9788] hover:text-[#F5EEDB] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Review</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePlaceOrder}
                      className="gold-button py-4 px-10 text-xs tracking-[0.2em] flex items-center gap-2 shadow-xl"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Securing Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            {formData.paymentMethod === 'cod'
                              ? 'Confirm COD Order'
                              : `Pay ${formatINR(totalInPaise)}`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#141414] p-6 sm:p-8 border border-[#2E261B] rounded-sm shadow-2xl space-y-5">
                <h3 className="font-serif text-xl text-[#F5EEDB] border-b border-[#2E261B] pb-4">
                  Summary ({items.reduce((a, b) => a + b.quantity, 0)} Items)
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                  {items.map((it) => (
                    <div key={it.product.id} className="flex justify-between items-center">
                      <span className="text-[#9E9788] truncate max-w-[200px]">
                        {it.product.name} × {it.quantity}
                      </span>
                      <span className="font-medium text-[#F5EEDB]">
                        {formatINR((it.variant ? it.variant.price_in_paise : it.product.price_in_paise) * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-[#9E9788] border-t border-[#2E261B] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F5EEDB] font-medium">{formatINR(subtotalInPaise)}</span>
                  </div>
                  {discountInPaise > 0 && (
                    <div className="flex justify-between text-[#86efac]">
                      <span>Promotion ({couponCode})</span>
                      <span>-{formatINR(discountInPaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>White-Glove Shipping</span>
                    <span className="text-[#F5EEDB]">
                      {shippingInPaise === 0 ? 'Complimentary' : formatINR(shippingInPaise)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#2E261B] text-lg font-serif font-medium text-[#F5EEDB]">
                    <span>Total Payable</span>
                    <span className="text-[#C5A059]">{formatINR(totalInPaise)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2E261B] space-y-2 text-[11px] text-[#9E9788]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>2-Year Comprehensive Guarantee included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C5A059]" />
                    <span>Crated damage-free arrival guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
