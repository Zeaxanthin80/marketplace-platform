import { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
}

// In-memory order store: userId -> Order[]
export const orders: Record<string, Order[]> = {};
