export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod';
export type DiscountType = 'percentage' | 'fixed';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price_in_paise: number;
  stock_quantity: number;
  finish?: string | null;
  dimensions?: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category?: Category | null;
  short_description: string | null;
  description: string;
  price_in_paise: number;
  compare_at_price_in_paise: number | null;
  material: string | null;
  dimensions: string | null;
  finish: string | null;
  color: string | null;
  style: string | null;
  voltage?: string | null;
  wattage?: string | null;
  bulb_type?: string | null;
  warranty?: string | null;
  stock_quantity: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  primary_image_url: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant | null;
}

export interface Cart {
  id: string;
  user_id?: string | null;
  session_id?: string | null;
  items: CartItem[];
  subtotal_in_paise: number;
  discount_in_paise: number;
  shipping_in_paise: number;
  total_in_paise: number;
  coupon_code?: string | null;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order_in_paise: number;
  max_discount_in_paise?: number | null;
  is_active: boolean;
  expires_at?: string | null;
  usage_limit?: number | null;
  times_used: number;
}

export interface ShippingAddressInput {
  full_name?: string;
  fullName?: string;
  email: string;
  phone: string;
  address_line1?: string;
  addressLine1?: string;
  address_line2?: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  delivery_instructions?: string;
  deliveryInstructions?: string;
  paymentMethod?: 'razorpay' | 'cod';
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id?: string | null;
  product_name: string;
  product_image: string;
  variant_name?: string | null;
  quantity: number;
  unit_price_in_paise: number;
  total_price_in_paise: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddressInput;
  delivery_instructions?: string | null;
  subtotal_in_paise: number;
  discount_in_paise: number;
  coupon_code?: string | null;
  shipping_in_paise: number;
  total_in_paise: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  tracking_number?: string | null;
  courier_partner?: string | null;
  estimated_delivery?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id?: string | null;
  customer_name: string;
  rating: number;
  title?: string | null;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  room_type: string;
  project_type: string;
  budget: string;
  message: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'closed';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  source?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface SiteSettingsGeneral {
  brand_name: string;
  tagline: string;
  brand_statement: string;
  showroom_address: string;
  showroom_hours: string;
  email: string;
  phone: string;
  whatsapp: string;
  free_shipping_threshold_paise: number;
  flat_shipping_rate_paise: number;
  warranty_years: number;
  instagram_url: string;
  facebook_url: string;
  pinterest_url: string;
}

export interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  secondary_text: string;
  secondary_link: string;
  image_url: string;
}
