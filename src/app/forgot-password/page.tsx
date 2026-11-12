'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/profile`,
      });
    } catch {}

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] text-[#F5EEDB] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-[#141414] border border-[#2E261B] rounded-sm p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="section-kicker">Security & Access</span>
          <h1 className="font-serif text-3xl text-[#F5EEDB] font-light">Password Reset</h1>
          <p className="text-xs text-[#9E9788]">
            Enter your account email to receive a password reset instructions link.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1A1812] border border-[#2E261B] text-[#C5A059] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#F5EEDB]">Reset Link Dispatched</h3>
            <p className="text-xs text-[#9E9788]">
              If an account exists for {email}, a password reset link has been dispatched.
            </p>
            <div className="pt-4">
              <Link href="/login" className="gold-button inline-flex py-3 px-6 text-xs">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#181818] border border-[#2E261B] text-xs pl-10 pr-4 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                />
                <Mail className="w-4 h-4 text-[#9E9788] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button py-3.5 text-xs tracking-[0.2em] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#2E261B] text-center text-xs text-[#9E9788]">
          Remembered your password?{' '}
          <Link href="/login" className="text-[#C5A059] font-medium hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
