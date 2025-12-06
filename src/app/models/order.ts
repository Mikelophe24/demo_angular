import { CartItem } from './cart';
import { Product } from './products';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export type Order = {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  total: number;
  totalAmount: number;
  items: OrderItem[];
  paymentStatus?: 'success' | 'failure';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string | Date;
  updatedAt?: string | Date;
};
