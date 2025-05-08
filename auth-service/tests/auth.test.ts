import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/main';

// Mock the User model and repository
jest.mock('../src/models/user', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: '$2b$10$X/XZkwh5mGwpxKxYyRGxXuEcBCaP9oI4YEMkiJJCT6TQEgkDTeKES', // hashed 'password123'
    roles: ['buyer'],
    validatePassword: jest.fn().mockImplementation((password) => {
      return password === 'password123';
    })
  };
  
  return {
    User: jest.fn().mockImplementation(() => mockUser)
  };
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'valid_token') {
      return { userId: '123' };
    }
    throw new Error('Invalid token');
  })
}));

describe('Authentication API', () => {
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
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid_token');
      
      expect(res.statusCode).toEqual(200);
    });

    it('should return 401 when accessing protected route without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toEqual(401);
    });
  });
});
