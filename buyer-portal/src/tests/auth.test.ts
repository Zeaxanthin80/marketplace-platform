import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  const testEmail = 'testuser@example.com';
  const testPassword = 'password123';

  it('should register a new user and return a JWT', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should not allow duplicate registration', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe('User already exists');
  });

  it('should not register with invalid email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'bademail', password: testPassword });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email format');
  });

  it('should not register with short password', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'newuser@example.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password must be at least 6 characters');
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password required');
  });

  it('should login with correct credentials and return a JWT', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should not login with missing fields', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password required');
  });
});
