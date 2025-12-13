export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  rating?: number;
  isHot?: boolean;
  type: 'featured' | 'grid';
}

export interface Category {
  id: string;
  name: string;
}