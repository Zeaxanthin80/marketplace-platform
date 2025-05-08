import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes';

dotenv.config();
console.log('main.ts JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

export default app; // Export for testing
