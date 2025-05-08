export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  vendorId: string;
  category?: string;
}

// In-memory product store for demo purposes
export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    description: 'A smooth, ergonomic wireless mouse.',
    price: 25.99,
    imageUrl: 'https://example.com/mouse.jpg',
    vendorId: 'v1',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Yoga Mat',
    description: 'Eco-friendly, non-slip yoga mat.',
    price: 19.99,
    imageUrl: 'https://example.com/yogamat.jpg',
    vendorId: 'v2',
    category: 'Fitness'
  }
];
