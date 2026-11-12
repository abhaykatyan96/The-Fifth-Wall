'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, KeyRound, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@thefifthwall.in');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [useSecretMode, setUseSecretMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = useSecretMode ? { secretKey } : { email, password };
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Access denied. Valid administrative credentials required.');
      }
    } catch {
      setError('Communication error with authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5EEDB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#141414] border border-[#2E261B] rounded-sm p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="THE FIFTH WALL"
              className="h-11 w-auto object-contain mx-auto"
            />
          </Link>
          <p className="text-[11px] text-[#C5A059] tracking-widest uppercase font-medium">
            Restricted Admin Console
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#2A1215] border border-[#7F1D1D] text-[#F87171] text-xs rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!useSecretMode ? (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123 or bootstrap pass"
                  className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F5EEDB] font-semibold mb-1">
                Admin Bootstrap Secret Key
              </label>
              <input
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="fifthwall_admin_pass_2026"
                className="w-full bg-[#181818] border border-[#2E261B] text-xs px-3.5 py-3 text-[#F5EEDB] placeholder-[#6E6759] focus:outline-none focus:border-[#C5A059] rounded-sm font-mono"
              />
            </div>
          )}

          <div className="flex justify-between items-center text-[11px] pt-1">
            <button
              type="button"
              onClick={() => {
                setUseSecretMode(!useSecretMode);
                setError('');
              }}
              className="text-[#C5A059] hover:underline flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>{useSecretMode ? 'Use Email / Password' : 'Use Bootstrap Key'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-button py-3.5 text-xs tracking-[0.2em] flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#2E261B] text-center text-[10px] text-[#9E9788]">
          Protected by server-side role verification & RLS policies. Unauthorized access logged.
        </div>
      </div>
    </div>
  );
}
