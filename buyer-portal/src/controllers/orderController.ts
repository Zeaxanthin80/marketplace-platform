import { Response } from 'express';
import { carts } from '../models/cart';
import { orders, Order } from '../models/order';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/authenticateJWT';

export const placeOrder = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { shippingAddress } = req.body;
  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address required' });
  }
  const cart = carts[userId];
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order: Order = {
    id: uuidv4(),
    userId,
    items: [...cart.items],
    total,
    createdAt: new Date().toISOString(),
    status: 'placed',
    shippingAddress,
  };
  if (!orders[userId]) orders[userId] = [];
  orders[userId].push(order);
  // Clear the cart
  cart.items = [];
  res.status(201).json({ order });
};

export const getOrders = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const userOrders = orders[userId] || [];
  res.json({ orders: userOrders });
};

export const getOrderById = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const userOrders = orders[userId] || [];
  const order = userOrders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
};
