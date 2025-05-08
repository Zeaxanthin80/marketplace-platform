import { Product } from './product';

export interface CartItem {
  itemId: string; // unique per cart item
  product: Product;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

// In-memory cart store: userId -> Cart
export const carts: Record<string, Cart> = {};
