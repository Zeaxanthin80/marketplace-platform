import { Request, Response } from 'express';
import { products } from '../models/product';

export const getAllProducts = (req: Request, res: Response) => {
  // In a real app, add pagination, filtering, etc.
  res.json({ products });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
};
