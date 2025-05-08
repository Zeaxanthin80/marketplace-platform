import { Router } from 'express';
import { placeOrder, getOrders, getOrderById } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/authenticateJWT';

const router = Router();

// POST /api/orders - Place an order
router.post('/', authenticateJWT, placeOrder);
// GET /api/orders - List all orders for user
router.get('/', authenticateJWT, getOrders);
// GET /api/orders/:id - Get order details
router.get('/:id', authenticateJWT, getOrderById);

export default router;
