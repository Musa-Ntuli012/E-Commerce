export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand?: string;
  sku: string;
  stockQuantity: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
] as const;

export type Province = typeof SA_PROVINCES[number];


