import { Response } from 'express';
import { carts, CartItem } from '../models/cart';
import { products } from '../models/product';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/authenticateJWT';

export const getCart = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const cart = carts[userId] || { userId, items: [] };
  res.json({ cart });
};

export const addToCart = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { productId, quantity } = req.body;
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  let cart = carts[userId];
  if (!cart) {
    cart = { userId, items: [] };
    carts[userId] = cart;
  }
  const existing = cart.items.find(item => item.product.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ itemId: uuidv4(), product, quantity });
  }
  res.status(201).json({ cart });
};

export const updateCartItem = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { itemId } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }
  const cart = carts[userId];
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.find(i => i.itemId === itemId);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  item.quantity = quantity;
  res.json({ cart });
};

export const removeCartItem = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { itemId } = req.params;
  const cart = carts[userId];
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const idx = cart.items.findIndex(i => i.itemId === itemId);
  if (idx === -1) return res.status(404).json({ message: 'Cart item not found' });
  cart.items.splice(idx, 1);
  res.json({ cart });
};
