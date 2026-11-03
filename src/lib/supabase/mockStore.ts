import {
  Category,
  Product,
  Coupon,
  Order,
  ConsultationRequest,
  NewsletterSubscriber,
  ContactMessage,
  ProductReview,
  SiteSettingsGeneral,
  HeroSlide,
} from '@/types/database';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_SITE_SETTINGS,
  INITIAL_HERO_SLIDES,
  INITIAL_REVIEWS,
} from '../store/seedData';

// Global singleton to persist state in memory across server requests during runtime
class LuxuryStore {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private coupons: Coupon[] = [...INITIAL_COUPONS];
  private siteSettings: SiteSettingsGeneral = { ...INITIAL_SITE_SETTINGS };
  private heroSlides: HeroSlide[] = [...INITIAL_HERO_SLIDES];
  private reviews: ProductReview[] = [...INITIAL_REVIEWS];
  private orders: Order[] = [
    {
      id: 'ord-tfw-1001',
      order_number: 'TFW-2026-8910',
      user_id: 'user-demo-1',
      customer_name: 'Aditya Birla',
      customer_email: 'aditya.birla@example.com',
      customer_phone: '+91 98200 12345',
      shipping_address: {
        full_name: 'Aditya Birla',
        email: 'aditya.birla@example.com',
        phone: '+91 98200 12345',
        address_line1: 'Penthouse 42, Oberoi Sky Heights',
        address_line2: 'Worli Sea Face',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400018',
        delivery_instructions: 'Please call ahead before delivery.',
      },
      delivery_instructions: 'White-glove handling required for chandeliers.',
      subtotal_in_paise: 5630000,
      discount_in_paise: 500000,
      coupon_code: 'WELCOME10',
      shipping_in_paise: 0,
      total_in_paise: 5130000,
      status: 'shipped',
      payment_status: 'paid',
      payment_method: 'razorpay',
      razorpay_order_id: 'order_M1234567890',
      razorpay_payment_id: 'pay_M9876543210',
      tracking_number: 'BLUEDART-8891024',
      courier_partner: 'BlueDart Luxury Express',
      estimated_delivery: '2026-11-06T18:00:00Z',
      items: [
        {
          id: 'item-1',
          order_id: 'ord-tfw-1001',
          product_id: 'p0000001-0000-0000-0000-000000000005',
          product_name: 'Galaxy Arc',
          product_image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=85',
          quantity: 1,
          unit_price_in_paise: 3150000,
          total_price_in_paise: 3150000,
          created_at: '2026-10-30T10:00:00Z',
        },
        {
          id: 'item-2',
          order_id: 'ord-tfw-1001',
          product_id: 'p0000001-0000-0000-0000-000000000001',
          product_name: 'Halo Drift',
          product_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
          quantity: 1,
          unit_price_in_paise: 2480000,
          total_price_in_paise: 2480000,
          created_at: '2026-10-30T10:00:00Z',
        },
      ],
      created_at: '2026-10-30T10:00:00Z',
      updated_at: '2026-10-31T14:20:00Z',
    },
  ];
  private consultations: ConsultationRequest[] = [
    {
      id: 'cons-101',
      name: 'Rohan Mehra',
      email: 'rohan.mehra@example.com',
      phone: '+91 99887 76655',
      room_type: 'Living Room & Dining Foyer',
      project_type: 'Full Villa Renovation',
      budget: '₹5,00,000 - ₹10,00,000',
      message: 'Looking for statement chandeliers and indirect cove illumination for our new 5-BHK duplex in DLF Magnolias, Gurgaon.',
      status: 'pending',
      created_at: '2026-10-28T12:00:00Z',
      updated_at: '2026-10-28T12:00:00Z',
    },
  ];
  private newsletters: NewsletterSubscriber[] = [
    { id: 'sub-1', email: 'ananya.sharma@gmail.com', is_active: true, created_at: '2026-10-25' },
    { id: 'sub-2', email: 'kabir.oberoi@yahoo.com', is_active: true, created_at: '2026-10-27' },
  ];
  private contactMessages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Pooja Hegde',
      email: 'pooja.h@example.com',
      phone: '+91 98450 11223',
      subject: 'Custom Brass Finish for Oro Loop',
      message: 'Hello, can the Oro Loop pendant be electroplated in antique brushed bronze rather than champagne gold to match our kitchen fittings?',
      status: 'unread',
      created_at: '2026-11-01T09:15:00Z',
    },
  ];

  // Categories
  getCategories(): Category[] {
    return this.categories.filter((c) => c.is_active);
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category {
    const newCat: Category = {
      id: `c0000001-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.categories.push(newCat);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = {
      ...this.categories[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.categories[idx];
  }

  // Products
  getProducts(filters?: {
    categorySlug?: string;
    featured?: boolean;
    bestseller?: boolean;
    newArrival?: boolean;
    search?: string;
    minPriceInPaise?: number;
    maxPriceInPaise?: number;
    finish?: string;
    style?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popularity';
  }): Product[] {
    let result = this.products.filter((p) => p.is_active);

    if (filters?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (filters?.featured) {
      result = result.filter((p) => p.is_featured);
    }

    if (filters?.bestseller) {
      result = result.filter((p) => p.is_bestseller);
    }

    if (filters?.newArrival) {
      result = result.filter((p) => p.is_new_arrival);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.finish?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    if (filters?.minPriceInPaise !== undefined) {
      result = result.filter((p) => p.price_in_paise >= filters.minPriceInPaise!);
    }

    if (filters?.maxPriceInPaise !== undefined) {
      result = result.filter((p) => p.price_in_paise <= filters.maxPriceInPaise!);
    }

    if (filters?.finish) {
      result = result.filter((p) => p.finish?.toLowerCase().includes(filters.finish!.toLowerCase()));
    }

    if (filters?.style) {
      result = result.filter((p) => p.style?.toLowerCase().includes(filters.style!.toLowerCase()));
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price_in_paise - b.price_in_paise);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price_in_paise - a.price_in_paise);
          break;
        case 'popularity':
          result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
          break;
        case 'newest':
        default:
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    return result;
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const newProd: Product = {
      id: `p0000001-0000-0000-0000-${Date.now().toString().slice(-12)}`,
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Orders
  getOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.order_number === id);
  }

  getOrdersByEmail(email: string): Order[] {
    return this.orders.filter((o) => o.customer_email.toLowerCase() === email.toLowerCase());
  }

  createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: `TFW-2026-${randomHex}`,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string, courierPartner?: string): Order | null {
    const idx = this.orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx === -1) return null;
    this.orders[idx].status = status;
    if (trackingNumber) this.orders[idx].tracking_number = trackingNumber;
    if (courierPartner) this.orders[idx].courier_partner = courierPartner;
    this.orders[idx].updated_at = new Date().toISOString();
    return this.orders[idx];
  }

  // Coupons
  getCoupon(code: string): Coupon | undefined {
    return this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
  }

  getCoupons(): Coupon[] {
    return this.coupons;
  }

  createCoupon(coupon: Omit<Coupon, 'id' | 'times_used'>): Coupon {
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      times_used: 0,
      ...coupon,
    };
    this.coupons.push(newCoupon);
    return newCoupon;
  }

  // Consultations
  createConsultation(req: Omit<ConsultationRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): ConsultationRequest {
    const newReq: ConsultationRequest = {
      id: `cons-${Date.now()}`,
      ...req,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.consultations.unshift(newReq);
    return newReq;
  }

  getConsultations(): ConsultationRequest[] {
    return this.consultations;
  }

  updateConsultationStatus(id: string, status: ConsultationRequest['status'], adminNotes?: string): ConsultationRequest | null {
    const item = this.consultations.find((c) => c.id === id);
    if (!item) return null;
    item.status = status;
    if (adminNotes) item.admin_notes = adminNotes;
    item.updated_at = new Date().toISOString();
    return item;
  }

  // Newsletter
  subscribeNewsletter(email: string, source: string = 'footer'): NewsletterSubscriber {
    const existing = this.newsletters.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.is_active = true;
      return existing;
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      is_active: true,
      source,
      created_at: new Date().toISOString(),
    };
    this.newsletters.unshift(newSub);
    return newSub;
  }

  getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.newsletters;
  }

  // Contact
  createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...msg,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    this.contactMessages.unshift(newMsg);
    return newMsg;
  }

  getContactMessages(): ContactMessage[] {
    return this.contactMessages;
  }

  // Reviews
  getReviewsForProduct(productId: string): ProductReview[] {
    return this.reviews.filter((r) => r.product_id === productId && r.is_approved);
  }

  getAllReviews(): ProductReview[] {
    return this.reviews;
  }

  addReview(review: Omit<ProductReview, 'id' | 'created_at'>): ProductReview {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      ...review,
      created_at: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  // Settings & Hero
  getSiteSettings(): SiteSettingsGeneral {
    return this.siteSettings;
  }

  updateSiteSettings(settings: Partial<SiteSettingsGeneral>): SiteSettingsGeneral {
    this.siteSettings = { ...this.siteSettings, ...settings };
    return this.siteSettings;
  }

  getHeroSlides(): HeroSlide[] {
    return this.heroSlides;
  }

  updateHeroSlides(slides: HeroSlide[]): HeroSlide[] {
    this.heroSlides = [...slides];
    return this.heroSlides;
  }
}

// Global variable to survive hot reloading in development
const globalForStore = globalThis as unknown as { luxuryStore?: LuxuryStore };
export const mockStore = globalForStore.luxuryStore || new LuxuryStore();
if (process.env.NODE_ENV !== 'production') globalForStore.luxuryStore = mockStore;
