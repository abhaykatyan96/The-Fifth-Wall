import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
});

export const consultationSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  roomType: z.string().min(1, 'Please select a room type'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select an estimated budget'),
  message: z.string().min(10, 'Please share some details about your space (min 10 characters)'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(2, 'Name is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

export const couponValidateSchema = z.object({
  code: z.string().min(2).max(30).trim(),
  subtotalInPaise: z.number().nonnegative(),
});

export const razorpayOrderCreateSchema = z.object({
  cartItems: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddress: shippingAddressSchema,
  couponCode: z.string().optional().nullable(),
});

export const razorpayVerifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const adminProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  categoryId: z.string().min(1, 'Category is required'),
  shortDescription: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priceInRupees: z.number().positive('Price must be greater than 0'),
  compareAtPriceInRupees: z.number().optional().nullable(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  finish: z.string().optional(),
  color: z.string().optional(),
  style: z.string().optional(),
  stockQuantity: z.number().int().nonnegative().default(10),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
  primaryImageUrl: z.string().url('Primary image must be a valid URL'),
});
