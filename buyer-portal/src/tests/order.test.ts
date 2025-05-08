import request from 'supertest';
import app from '../app';
import { products } from '../models/product';
import { generateTestJWT } from './utils';

const testUserToken = generateTestJWT();
const authHeader = { Authorization: `Bearer ${testUserToken}` };

describe('Order API', () => {
  let orderId: string;

  beforeEach(async () => {
    // Reset cart and orders for test user
    await request(app).delete('/api/cart/nonexistent').set(authHeader); // Clear cart if exists
    // Add an item to the cart for checkout
    await request(app)
      .post('/api/cart')
      .set(authHeader)
      .send({ productId: products[0].id, quantity: 1 });
  });

  it('should place an order and clear the cart', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set(authHeader)
      .send({ shippingAddress: '123 Main St' });
    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.order.shippingAddress).toBe('123 Main St');
    orderId = res.body.order.id;

    // Cart should now be empty
    const cartRes = await request(app).get('/api/cart').set(authHeader);
    expect(cartRes.body.cart.items.length).toBe(0);
  });

  it('should return 400 if cart is empty', async () => {
    // Place order to empty cart
    await request(app)
      .post('/api/orders')
      .set(authHeader)
      .send({ shippingAddress: '123 Main St' });
    // Try placing another order (cart should now be empty for the same user)
    const res = await request(app)
      .post('/api/orders')
      .set(authHeader)
      .send({ shippingAddress: '123 Main St' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cart is empty');
  });

  it('should return 400 if shipping address missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set(authHeader)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Shipping address required');
  });

  it('should list all orders for the user', async () => {
    // Place an order
    await request(app).post('/api/orders').send({ shippingAddress: '123 Main St' });
    const res = await request(app).get('/api/orders').set(authHeader);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });

  it('should get order details by ID', async () => {
    // Place an order
    const orderRes = await request(app)
      .post('/api/orders')
      .set(authHeader)
      .send({ shippingAddress: '123 Main St' });
    const id = orderRes.body.order.id;
    const res = await request(app).get(`/api/orders/${id}`).set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.id).toBe(id);
  });

  it('should return 404 for non-existent order', async () => {
    const res = await request(app).get('/api/orders/nonexistent').set(authHeader);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Order not found');
  });
});
