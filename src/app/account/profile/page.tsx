'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types/database';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setOrders(json.data);
        })
        .catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="pt-32 pb-24 bg-[#F6F3ED] min-h-screen text-center text-xs text-[#78746D]">
        Verifying client session...
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F6F3ED] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-[#EAE3D8] mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Client Residence Portal</span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#151515] font-light mt-1">
              Account <em>Dashboard.</em>
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider text-[#b91c1c] hover:underline flex items-center gap-1.5 self-start sm:self-end font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (4 cols) */}
          <aside className="lg:col-span-4 bg-white p-6 border border-[#EAE3D8] rounded-sm shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-6 border-b border-[#EAE3D8]">
              <div className="w-12 h-12 rounded-full bg-[#B69A69] text-white flex items-center justify-center font-serif text-xl">
                {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif text-lg text-[#151515] truncate font-medium">
                  {user.full_name || 'Valued Client'}
                </h3>
                <p className="text-xs text-[#78746D] truncate">{user.email}</p>
                <span className="inline-block bg-[#F6F3ED] text-[#B69A69] text-[10px] uppercase font-semibold px-2 py-0.5 mt-1 border border-[#EAE3D8]">
                  {user.role === 'admin' ? 'Curator / Admin' : 'Private Client'}
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition text-left font-medium ${
                  activeTab === 'profile'
                    ? 'bg-[#F6F3ED] text-[#B69A69] font-bold border-l-2 border-[#B69A69]'
                    : 'text-[#555] hover:bg-[#F6F3ED] hover:text-[#151515]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-sm transition text-left font-medium ${
                  activeTab === 'orders'
                    ? 'bg-[#F6F3ED] text-[#B69A69] font-bold border-l-2 border-[#B69A69]'
                    : 'text-[#555] hover:bg-[#F6F3ED] hover:text-[#151515]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Order Consignments</span>
                </div>
                <span className="bg-[#EAE3D8] text-[#151515] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition text-left font-medium ${
                  activeTab === 'addresses'
                    ? 'bg-[#F6F3ED] text-[#B69A69] font-bold border-l-2 border-[#B69A69]'
                    : 'text-[#555] hover:bg-[#F6F3ED] hover:text-[#151515]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Residences</span>
              </button>

              {user.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[#B69A69] hover:bg-[#F6F3ED] font-bold border-t border-[#EAE3D8] mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Portal</span>
                </Link>
              )}
            </nav>
          </aside>

          {/* Tab Content (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 border border-[#EAE3D8] rounded-sm shadow-sm">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#151515] mb-1">Personal Portfolio</h3>
                  <p className="text-xs text-[#78746D]">
                    Manage your identity and authentication credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F6F3ED] border border-[#D9CFC0] rounded-sm">
                    <span className="text-[#78746D] block uppercase tracking-wider text-[10px]">Client Name</span>
                    <span className="text-[#151515] font-semibold text-sm mt-0.5 block">
                      {user.full_name || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 bg-[#F6F3ED] border border-[#D9CFC0] rounded-sm">
                    <span className="text-[#78746D] block uppercase tracking-wider text-[10px]">Email Address</span>
                    <span className="text-[#151515] font-semibold text-sm mt-0.5 block">{user.email}</span>
                  </div>

                  <div className="p-4 bg-[#F6F3ED] border border-[#D9CFC0] rounded-sm">
                    <span className="text-[#78746D] block uppercase tracking-wider text-[10px]">Phone Number</span>
                    <span className="text-[#151515] font-semibold text-sm mt-0.5 block">
                      {user.phone || '+91 98200 12345'}
                    </span>
                  </div>

                  <div className="p-4 bg-[#F6F3ED] border border-[#D9CFC0] rounded-sm">
                    <span className="text-[#78746D] block uppercase tracking-wider text-[10px]">Account Tier</span>
                    <span className="text-[#B69A69] font-semibold text-sm mt-0.5 block uppercase">
                      Private Collector
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE3D8] flex items-center justify-between text-xs">
                  <span className="text-[#78746D]">Need to modify your registered details?</span>
                  <Link href="/contact" className="text-[#B69A69] hover:underline font-medium">
                    Contact Concierge
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#151515] mb-1">Your Order Consignments</h3>
                  <p className="text-xs text-[#78746D]">
                    Track deliveries, download invoices, and inspect order histories.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#78746D] space-y-3">
                    <Package className="w-10 h-10 text-[#B69A69] mx-auto opacity-70" />
                    <p>You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="gold-button inline-flex py-2.5 px-6 text-xs">
                      Discover Collection
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 border border-[#EAE3D8] rounded-sm hover:border-[#B69A69] transition space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE3D8] gap-2">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#151515]">
                              {ord.order_number}
                            </span>
                            <span className="text-[#78746D] ml-3">
                              {new Date(ord.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="bg-[#ecfdf5] text-[#16a34a] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]">
                              {ord.status.replace('_', ' ')}
                            </span>
                            <span className="font-serif font-bold text-sm text-[#151515]">
                              {formatINR(ord.total_in_paise)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[#78746D]">
                            Destination: {ord.shipping_address.city}, {ord.shipping_address.state}
                          </span>
                          <Link
                            href={`/track-order?orderNumber=${ord.order_number}`}
                            className="text-[#B69A69] font-medium hover:underline flex items-center gap-1"
                          >
                            <span>Track Consignment</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#151515] mb-1">Saved Residences</h3>
                  <p className="text-xs text-[#78746D]">
                    Default addresses for white-glove architectural deliveries.
                  </p>
                </div>

                <div className="p-5 border border-[#B69A69] bg-[#F6F3ED] rounded-sm text-xs space-y-1 relative">
                  <span className="absolute top-4 right-4 bg-[#B69A69] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                    Default
                  </span>
                  <h4 className="font-serif text-base font-medium text-[#151515]">Primary Residence</h4>
                  <p className="text-[#151515] font-medium">{user.full_name || 'Aditya Birla'}</p>
                  <p className="text-[#555]">Penthouse 42, Oberoi Sky Heights, Worli Sea Face</p>
                  <p className="text-[#555]">Mumbai, Maharashtra — 400018</p>
                  <p className="text-[#78746D]">Phone: {user.phone || '+91 98200 12345'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
