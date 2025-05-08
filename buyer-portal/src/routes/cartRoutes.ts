import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController';
import { authenticateJWT } from '../middleware/authenticateJWT';

const router = Router();

// GET /api/cart
router.get('/', authenticateJWT, getCart);
// POST /api/cart
router.post('/', authenticateJWT, addToCart);
// PATCH /api/cart/:itemId
router.patch('/:itemId', authenticateJWT, updateCartItem);
// DELETE /api/cart/:itemId
router.delete('/:itemId', authenticateJWT, removeCartItem);

export default router;
