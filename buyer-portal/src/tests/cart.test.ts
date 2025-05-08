import request from 'supertest';
import app from '../app';
import { products } from '../models/product';
import { generateTestJWT } from './utils';

const testUserToken = generateTestJWT();
const authHeader = { Authorization: `Bearer ${testUserToken}` };

describe('Cart API', () => {
  let testItemId: string;

  it('should start with an empty cart', async () => {
    const res = await request(app).get('/api/cart').set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body.cart).toBeDefined();
    expect(Array.isArray(res.body.cart.items)).toBe(true);
    expect(res.body.cart.items.length).toBe(0);
  });

  it('should add an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set(authHeader)
      .send({ productId: products[0].id, quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.cart.items.length).toBe(1);
    expect(res.body.cart.items[0].product.id).toBe(products[0].id);
    expect(res.body.cart.items[0].quantity).toBe(2);
    testItemId = res.body.cart.items[0].itemId;
  });

  it('should update item quantity in the cart', async () => {
    const res = await request(app)
      .patch(`/api/cart/${testItemId}`)
      .set(authHeader)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

  it('should remove an item from the cart', async () => {
    const res = await request(app)
      .delete(`/api/cart/${testItemId}`)
      .set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body.cart.items.length).toBe(0);
  });

  it('should return 404 when updating a non-existent item', async () => {
    const res = await request(app)
      .patch('/api/cart/nonexistent')
      .set(authHeader)
      .send({ quantity: 2 });
    expect(res.status).toBe(404);
  });

  it('should return 404 when deleting a non-existent item', async () => {
    const res = await request(app)
      .delete('/api/cart/nonexistent')
      .set(authHeader);
    expect(res.status).toBe(404);
  });
});
