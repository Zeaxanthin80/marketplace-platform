import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

export function generateTestJWT(userId = 'test-user', email = 'test@example.com') {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
}
