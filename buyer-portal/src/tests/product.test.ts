import request from 'supertest';
import app from '../app';
import { generateTestJWT } from './utils';

const testUserToken = generateTestJWT();
const authHeader = { Authorization: `Bearer ${testUserToken}` };

describe('Product API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const res = await request(app).get('/api/products/1').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.product).toBeDefined();
      expect(res.body.product.id).toBe('1');
    });

    it('should return 404 for a non-existent product', async () => {
      const res = await request(app).get('/api/products/999').set(authHeader);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });
});
