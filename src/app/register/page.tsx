'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register(fullName, email, phone, password);
    setLoading(false);

    if (res.success) {
      router.push('/account/profile');
    } else {
      setError(res.error || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white border border-[#EAE3D8] rounded-sm p-8 sm:p-10 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <span className="section-kicker">Join The Circle</span>
          <h1 className="font-serif text-3xl text-[#151515] font-light">Create Account</h1>
          <p className="text-xs text-[#78746D]">
            Access personalized design plans, save favorite pieces, and manage orders.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#fef2f2] text-[#b91c1c] text-xs rounded-sm border border-[#fecaca] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Radhika Singhania"
                className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs pl-10 pr-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
              />
              <User className="w-4 h-4 text-[#78746D] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="radhika@example.com"
                className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs pl-10 pr-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
              />
              <Mail className="w-4 h-4 text-[#78746D] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs pl-10 pr-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
              />
              <Phone className="w-4 h-4 text-[#78746D] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#151515] font-semibold mb-1.5">
              Create Password (Min 8 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F6F3ED] border border-[#D9CFC0] text-xs pl-10 pr-4 py-3 text-[#151515] focus:outline-none focus:border-[#B69A69] rounded-sm"
              />
              <Lock className="w-4 h-4 text-[#78746D] absolute left-3.5 top-3.5" />
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
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#EAE3D8] text-center text-xs text-[#78746D]">
          Already registered?{' '}
          <Link href="/login" className="text-[#B69A69] font-medium hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
