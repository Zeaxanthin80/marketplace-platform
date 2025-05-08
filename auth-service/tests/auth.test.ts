import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/main';



describe('Authentication API', () => {
  beforeAll(async () => {
    // Register the user that will be used for login/protected route tests
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        roles: ['buyer']
      });
  });
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@example.com',
          password: 'password123',
          roles: ['buyer']
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toEqual('User registered successfully');
    });

    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@example.com'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Email and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toEqual('Login successful');
    });

    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid token', async () => {
      // Log in to get a real token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      const token = loginRes.body.token;
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 401 when accessing protected route without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toEqual(401);
    });
  });
});
