'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Product, Order, Category, ConsultationRequest, NewsletterSubscriber } from '@/types/database';

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'enquiries' | 'coupons' | 'newsletter' | 'settings'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Dashboard Data
  const [stats, setStats] = useState<{
    totalRevenueInPaise: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockCount: number;
    pendingConsultations: number;
  }>({
    totalRevenueInPaise: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
    pendingConsultations: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Add Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    priceInRupees: 25000,
    compareAtPriceInRupees: 30000,
    material: 'Cast Solid Brass, Optical Acrylic',
    dimensions: 'Diameter: 80 cm, Height: 25 cm',
    finish: 'Satin Champagne Brass',
    color: 'Champagne Gold',
    style: 'Contemporary Minimalist',
    stockQuantity: 10,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    primaryImageUrl: '/images/products/infinity-brass-chandelier.jpg',
  });
  const [productActionLoading, setProductActionLoading] = useState(false);

  // Order Status Update State
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('confirmed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('BlueDart Luxury Express');

  // Verify Admin Session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setAuthorized(true);
          loadAllData();
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const loadAllData = async () => {
    try {
      const [statsRes, prodRes, ordRes, catRes, consRes, subRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/consultations').then((r) => r.json()),
        fetch('/api/newsletter').then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (prodRes.success) setProducts(prodRes.data);
      if (ordRes.success) setOrders(ordRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setNewProduct((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }
      if (consRes.success) setConsultations(consRes.data);
      if (subRes.success) setSubscribers(subRes.data);
    } catch (e) {
      console.error('Error fetching admin data', e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductActionLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddProduct(false);
        loadAllData();
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch {
      alert('Error creating product');
    } finally {
      setProductActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the active portfolio?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch {
      alert('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          courierPartner: courierPartner || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUpdatingOrderId(null);
        setTrackingNumber('');
        loadAllData();
      }
    } catch {
      alert('Error updating order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5EEDB] flex items-center justify-center text-xs tracking-widest uppercase">
        <Loader2 className="w-6 h-6 text-[#C5A059] animate-spin mr-3" />
        <span>Authenticating Admin Environment...</span>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5EEDB] flex">
      {/* Admin Sidebar Navigation */}
      <aside className="w-64 bg-[#0D0D0D] border-r border-[#2E261B] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo / Title */}
          <div className="p-6 border-b border-[#2E261B]">
            <Link href="/" target="_blank" className="block group space-y-1">
              <img
                src="/images/logo.png"
                alt="THE FIFTH WALL"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#C5A059] font-medium flex items-center gap-1 mt-1">
                <span>Studio Admin</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products & Inventory', icon: Package },
              { id: 'orders', label: 'Order Consignments', icon: ShoppingBag },
              { id: 'categories', label: 'Collections / Categories', icon: Layers },
              { id: 'enquiries', label: 'Design Enquiries', icon: MessageSquare },
              { id: 'coupons', label: 'Promotional Coupons', icon: Tag },
              { id: 'newsletter', label: 'Newsletter Subscribers', icon: Mail },
              { id: 'settings', label: 'Brand & Showroom Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-sm transition text-left font-medium ${
                    isActive
                      ? 'bg-[#1C1812] text-[#C5A059] font-semibold border-l-2 border-[#C5A059]'
                      : 'text-[#9E9788] hover:bg-[#181818] hover:text-[#F5EEDB]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Bar */}
        <div className="p-4 border-t border-[#2E261B]">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#F5EEDB] block font-medium">Administrator</span>
              <span className="text-[10px] text-[#9E9788]">admin@thefifthwall.in</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#f87171] hover:text-white transition p-1.5"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Executive Portal
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Performance Analytics
              </h2>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Total Revenue</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">
                    {formatINR(stats.totalRevenueInPaise)}
                  </span>
                  <TrendingUp className="w-5 h-5 text-[#34D399]" />
                </div>
                <p className="text-[11px] text-[#34D399]">From confirmed and completed orders</p>
              </div>

              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Total Orders</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">{stats.totalOrders}</span>
                  <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#9E9788]">Across all luxury collections</p>
              </div>

              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Architectural Portfolio</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">{stats.totalProducts} Pieces</span>
                  <Package className="w-5 h-5 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#9E9788]">
                  {stats.lowStockCount > 0 ? (
                    <span className="text-[#F59E0B] font-medium">⚠ {stats.lowStockCount} items low in stock</span>
                  ) : (
                    'All items well stocked'
                  )}
                </p>
              </div>

              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Design Inquiries</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">{stats.pendingConsultations} Pending</span>
                  <MessageSquare className="w-5 h-5 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#9E9788]">Architectural consultations requiring response</p>
              </div>

              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Private Journal</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">{subscribers.length} Subscribers</span>
                  <Mail className="w-5 h-5 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#9E9788]">Active newsletter recipients</p>
              </div>

              <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm shadow-xl space-y-2">
                <span className="text-xs text-[#9E9788] uppercase tracking-wider block">Payment Verification</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-medium text-[#F5EEDB]">Razorpay 100%</span>
                  <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                </div>
                <p className="text-[11px] text-[#34D399]">Cryptographic signature verification active</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#141414] border border-[#2E261B] rounded-sm p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2E261B] pb-4">
                <h3 className="font-serif text-xl text-[#F5EEDB]">Recent Consignments</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#C5A059] hover:underline uppercase tracking-wider"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-[#2E261B] text-xs">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-[#F5EEDB] mr-3">{ord.order_number}</span>
                      <span className="text-[#9E9788]">{ord.customer_name} ({ord.customer_email})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="capitalize bg-[#181818] border border-[#2E261B] text-[#E5C378] px-2 py-0.5 rounded-sm">
                        {ord.status.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-[#F5EEDB]">{formatINR(ord.total_in_paise)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                  Catalogue Administration
                </span>
                <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                  Products & Inventory ({products.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="gold-button py-3 px-6 text-xs tracking-wider flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddProduct ? 'Cancel' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Add Product Modal/Form */}
            {showAddProduct && (
              <form onSubmit={handleCreateProduct} className="bg-[#141414] border border-[#C5A059] p-6 rounded-sm space-y-4 text-xs shadow-2xl">
                <h3 className="font-serif text-xl text-[#F5EEDB] mb-2">Publish New Illumination Piece</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        })
                      }
                      placeholder="e.g. Solis Pendant"
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Category *</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.priceInRupees}
                      onChange={(e) => setNewProduct({ ...newProduct, priceInRupees: parseFloat(e.target.value) })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Compare-At Price (₹ INR)</label>
                    <input
                      type="number"
                      value={newProduct.compareAtPriceInRupees}
                      onChange={(e) => setNewProduct({ ...newProduct, compareAtPriceInRupees: parseFloat(e.target.value) })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Inventory Stock *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value, 10) })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Material</label>
                    <input
                      type="text"
                      value={newProduct.material}
                      onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Finish</label>
                    <input
                      type="text"
                      value={newProduct.finish}
                      onChange={(e) => setNewProduct({ ...newProduct, finish: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={newProduct.dimensions}
                      onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Primary Image URL *</label>
                  <input
                    type="url"
                    required
                    value={newProduct.primaryImageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, primaryImageUrl: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#9E9788] mb-1">Full Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Rich description of craftsmanship, lighting characteristics, and finishes..."
                    className="w-full bg-[#181818] border border-[#2E261B] p-2.5 text-[#F5EEDB] rounded-sm focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[#F5EEDB]">
                    <input
                      type="checkbox"
                      checked={newProduct.isFeatured}
                      onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span>Featured Piece</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#F5EEDB]">
                    <input
                      type="checkbox"
                      checked={newProduct.isBestseller}
                      onChange={(e) => setNewProduct({ ...newProduct, isBestseller: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span>Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#F5EEDB]">
                    <input
                      type="checkbox"
                      checked={newProduct.isNewArrival}
                      onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })}
                      className="accent-[#C5A059]"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={productActionLoading}
                    className="gold-button py-3 px-8 text-xs tracking-wider"
                  >
                    {productActionLoading ? 'Saving...' : 'Publish Product to Live Catalogue'}
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-[#141414] border border-[#2E261B] rounded-sm overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#101010] text-[#9E9788] uppercase tracking-wider text-[10px] border-b border-[#2E261B]">
                  <tr>
                    <th className="p-4">Piece</th>
                    <th className="p-4">Finish / Material</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E261B]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1A1812] transition">
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={p.primary_image_url}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded-sm border border-[#2E261B]"
                        />
                        <div>
                          <span className="font-serif font-medium text-[#F5EEDB] block">{p.name}</span>
                          <span className="text-[10px] text-[#9E9788] font-mono">{p.slug}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#9E9788]">
                        {p.finish} <br /><span className="text-[10px] text-[#9E9788]">{p.material}</span>
                      </td>
                      <td className="p-4 font-medium text-[#F5EEDB]">{formatINR(p.price_in_paise)}</td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            p.stock_quantity < 5 ? 'text-[#F59E0B]' : 'text-[#34D399]'
                          }`}
                        >
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {p.is_featured && <span className="bg-[#181818] border border-[#2E261B] text-[#C5A059] text-[9px] px-1.5 py-0.5 rounded">Featured</span>}
                          {p.is_bestseller && <span className="bg-[#181818] border border-[#2E261B] text-[#34D399] text-[9px] px-1.5 py-0.5 rounded">Bestseller</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="text-[#C5A059] hover:underline"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="text-[#F87171] hover:underline ml-3"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Fulfillment Management
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Order Consignments ({orders.length})
              </h2>
            </div>

            <div className="bg-[#141414] border border-[#2E261B] rounded-sm overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#101010] text-[#9E9788] uppercase tracking-wider text-[10px] border-b border-[#2E261B]">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E261B]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1A1812] transition">
                      <td className="p-4 font-mono font-bold text-[#F5EEDB]">{ord.order_number}</td>
                      <td className="p-4">
                        <span className="text-[#F5EEDB] block font-medium">{ord.customer_name}</span>
                        <span className="text-[10px] text-[#9E9788]">{ord.customer_email}</span>
                      </td>
                      <td className="p-4 text-[#9E9788]">
                        {ord.shipping_address.city}, {ord.shipping_address.state}
                      </td>
                      <td className="p-4 font-serif font-bold text-[#F5EEDB]">{formatINR(ord.total_in_paise)}</td>
                      <td className="p-4">
                        <span className="text-[#34D399] uppercase text-[10px] font-bold">
                          {ord.payment_method} · {ord.payment_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#181818] border border-[#2E261B] text-[#E5C378] px-2.5 py-1 rounded-sm uppercase text-[10px] font-semibold">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {updatingOrderId === ord.id ? (
                          <div className="inline-flex flex-col gap-2 p-2 bg-[#181818] border border-[#C5A059] rounded-sm">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="bg-[#141414] text-[#F5EEDB] p-1 text-xs border border-[#2E261B]"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Tracking No (e.g. BLUEDART-123)"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              className="bg-[#141414] text-[#F5EEDB] p-1 text-xs border border-[#2E261B]"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => handleUpdateOrderStatus(ord.id)}
                                className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A0A0A] px-2 py-1 text-[10px] font-bold rounded"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setUpdatingOrderId(null)}
                                className="text-[#9E9788] px-2 py-1 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setUpdatingOrderId(ord.id);
                              setNewStatus(ord.status);
                            }}
                            className="text-[#C5A059] hover:underline uppercase text-[10px] font-semibold"
                          >
                            Update Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Category Taxonomies
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Luxury Categories ({categories.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="bg-[#141414] border border-[#2E261B] rounded-sm overflow-hidden flex flex-col shadow-xl">
                  <div className="aspect-[16/9] bg-[#101010]">
                    <img src={c.image_url || ''} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-serif text-lg font-medium text-[#F5EEDB]">{c.name}</h4>
                      <p className="text-xs text-[#9E9788] line-clamp-2 mt-1">{c.description}</p>
                    </div>
                    <div className="pt-2 border-t border-[#2E261B] flex justify-between text-[11px] text-[#C5A059]">
                      <span className="font-mono">/collections/{c.slug}</span>
                      <Link href={`/collections/${c.slug}`} target="_blank" className="hover:underline">
                        Open →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Architectural Advisory
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Design Consultations ({consultations.length})
              </h2>
            </div>

            <div className="space-y-4">
              {consultations.map((item) => (
                <div key={item.id} className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm text-xs space-y-3 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2E261B] gap-2">
                    <div>
                      <h4 className="font-serif text-lg text-[#F5EEDB] font-medium">{item.name}</h4>
                      <span className="text-[#9E9788]">{item.email} · {item.phone}</span>
                    </div>
                    <span className="bg-[#181818] border border-[#2E261B] text-[#C5A059] px-2.5 py-1 rounded-sm uppercase text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9E9788]">
                    <div>
                      <strong className="text-[#F5EEDB] block">Room:</strong>
                      <span>{item.room_type}</span>
                    </div>
                    <div>
                      <strong className="text-[#F5EEDB] block">Project:</strong>
                      <span>{item.project_type}</span>
                    </div>
                    <div>
                      <strong className="text-[#F5EEDB] block">Budget Tier:</strong>
                      <span>{item.budget}</span>
                    </div>
                  </div>

                  <div className="bg-[#181818] p-3 rounded border border-[#2E261B]">
                    <strong className="text-[#F5EEDB] block mb-1">Client Vision Note:</strong>
                    <p className="text-[#E5C378] italic leading-relaxed">&ldquo;{item.message}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Promotions
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Active Promotional Coupons
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { code: 'WELCOME10', type: '10% Off', min: '₹5,000 min order', cap: 'Max ₹5,000' },
                { code: 'FIFTHWALL15', type: '15% Off', min: '₹20,000 min order', cap: 'Max ₹10,000' },
                { code: 'LUXURY5000', type: 'Flat ₹5,000 Off', min: '₹30,000 min order', cap: 'Direct Deduction' },
              ].map((c) => (
                <div key={c.code} className="bg-[#141414] border border-[#C5A059] p-6 rounded-sm text-xs space-y-2 shadow-xl">
                  <span className="font-mono text-lg font-bold text-[#F5EEDB] block">{c.code}</span>
                  <span className="text-[#34D399] font-medium text-sm block">{c.type}</span>
                  <p className="text-[#9E9788]">{c.min}</p>
                  <p className="text-[#6E6759]">{c.cap}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: NEWSLETTER */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Direct Audience
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Subscribers ({subscribers.length})
              </h2>
            </div>

            <div className="bg-[#141414] border border-[#2E261B] rounded-sm p-6 text-xs divide-y divide-[#2E261B] shadow-xl">
              {subscribers.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between">
                  <span className="text-[#F5EEDB] font-medium">{s.email}</span>
                  <span className="text-[#9E9788] text-[10px]">
                    Subscribed {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                Brand Configuration
              </span>
              <h2 className="font-serif text-3xl font-light text-[#F5EEDB] mt-1">
                Showroom & Brand Identity
              </h2>
            </div>

            <div className="bg-[#141414] border border-[#2E261B] p-6 rounded-sm text-xs space-y-4 max-w-2xl shadow-xl">
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Brand Name</span>
                <span className="font-serif text-lg text-[#F5EEDB] font-medium">THE FIFTH WALL</span>
              </div>
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Tagline</span>
                <span className="text-[#F5EEDB]">Lighting. Interiors. Beyond.</span>
              </div>
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Showroom Location</span>
                <span className="text-[#F5EEDB]">E1/803, Vardan Khand, Sector 1, Gomti Nagar, Lucknow, Uttar Pradesh 226010</span>
              </div>
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Operating Hours</span>
                <span className="text-[#F5EEDB]">Mon – Sat, 10:30 am – 8:00 pm</span>
              </div>
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Concierge Email & Phone</span>
                <span className="text-[#F5EEDB]">studio@thefifthwall.in | +91 91 98216 699</span>
              </div>
              <div>
                <span className="text-[#9E9788] block uppercase text-[10px]">Complimentary Shipping Threshold</span>
                <span className="text-[#C5A059] font-medium">₹4,999 (499900 paise)</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
