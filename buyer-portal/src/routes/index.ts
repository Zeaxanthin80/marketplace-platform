import { Router } from 'express';

import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Product endpoints
router.use('/', authRoutes); // /api/register and /api/login
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);

// Example health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default router;
