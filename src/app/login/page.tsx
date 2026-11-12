'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account/profile');
    } else {
      setError(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen flex items-center justify-center text-[#F5EEDB]">
      <div className="max-w-md w-full mx-4 bg-[#141414] border border-[#2E261B] rounded-sm p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="section-kicker">Client Portal</span>
          <h1 className="font-serif text-3xl text-[#F5EEDB] font-light">Welcome Back</h1>
          <p className="text-xs text-[#9E9788]">
            Sign in to view your bespoke orders, saved addresses, and wishlist.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#1f1212] text-[#fca5a5] text-xs rounded-sm border border-[#f87171]/40 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#f87171]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1.5">
              Email Address
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
              <Mail className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#F5EEDB] font-semibold">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-[#C5A059] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-[#2E261B] text-xs pl-10 pr-4 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
              />
              <Lock className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3.5" />
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
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#2E261B] text-center space-y-2 text-xs text-[#9E9788]">
          <p>
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-[#C5A059] font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <p>
            Are you a showroom manager?{' '}
            <Link href="/admin/dashboard" className="text-[#F5EEDB] font-semibold hover:text-[#C5A059] hover:underline">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
