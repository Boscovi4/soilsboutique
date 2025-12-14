export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  images?: string[]; // Array of image URLs for gallery
  rating?: number;
  isHot?: boolean;
  type: 'featured' | 'grid';
  sizes?: string[];
  color?: string;
  // Selected options for cart/order
  selectedSize?: string;
  selectedColor?: string;
  // Unique ID for cart items (to distinguish same product with different options)
  cartItemId?: string;
  quantity?: number; // Quantity in cart
  category?: string; // To allow filtering
}

export interface Category {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'user';
  preferences: {
    notifications: boolean;
    language: 'en' | 'tetum' | 'pt';
  };
}