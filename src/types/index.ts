export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  inStock: boolean;
  telegramMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  note: string | null;
  telegramUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: (Order & { product: { name: string } })[];
}
