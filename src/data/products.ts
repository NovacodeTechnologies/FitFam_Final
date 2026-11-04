export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: 'Men' | 'Women' | 'Accessories' | string;
  clothingType?: 'Tops' | 'Bottoms' | string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  saleDiscountAmount?: number;
  saleName?: string;
  image: string;
  images?: string[];
  isNew?: boolean;
  isNewProduct?: boolean;
  isSale?: boolean;
  badge?: string;
  tags?: string[];
  sizes?: string[];
  stock?: Record<string, number>;
  subText?: string;
  description?: string;
  descriptionAbout?: string;
  descriptionFeatures?: string;
  descriptionCare?: string;
  details?: string[];
  features?: string[];
  subCategory?: string;
  sizeGuide?: any;
  customSizeGuide?: {
    enabled: boolean;
    columns?: string[];
    rows?: any[];
    unit?: string;
    measurementNotes?: string;
  };
}

export const products: Product[] = [
  // New Collection
  {
    id: 'new-1',
    name: 'Revolution Oversize Tee – NO DAYS OFF',
    category: 'Men',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    isNew: true,
    badge: 'NEW',
    tags: ['New Arrivals', 'Top Rated']
  },
  {
    id: 'new-2',
    name: 'Revolution Oversize Tee – HEAVY',
    category: 'Men',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    isNew: true,
    badge: 'NEW',
    tags: ['New Arrivals']
  },
  {
    id: 'new-3',
    name: 'Revolution Oversize Tee – DRIP FITFAM',
    category: 'Men',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    isNew: true,
    badge: 'NEW',
    tags: ['New Arrivals', 'Features']
  },

  // Trending Now Products (From requirements)
  {
    id: 'trend-1',
    name: '2.5L Gym Water Bottle',
    category: 'Accessories',
    price: 3950,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'HOT',
    tags: ['Features', 'Top Rated']
  },
  {
    id: 'trend-2',
    name: 'Curve Tech Stringer Tank Top',
    category: 'Men',
    price: 1650,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'HOT',
    tags: ['Features', 'New Arrivals']
  },
  {
    id: 'trend-3',
    name: 'Curve Tech Stringer Tank Top Cotton – Black',
    category: 'Men',
    price: 1650,
    originalPrice: 2000,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'HOT',
    tags: ['Top Rated']
  },
  {
    id: 'trend-4',
    name: 'Curve Tech Stringer Tank Top DRY – FIT',
    category: 'Men',
    price: 1650,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'HOT',
    tags: ['New Arrivals', 'Features']
  },

  // Extra products to make categories feel full
  {
    id: 'women-1',
    name: 'Curve Soft Stringer Tank Top – Coral',
    category: 'Women',
    price: 3400,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'SALE',
    tags: ['Top Rated']
  },
  {
    id: 'women-2',
    name: 'Core Compression High-Waist Leggings',
    category: 'Women',
    price: 4200,
    originalPrice: 4800,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'HOT',
    tags: ['New Arrivals', 'Features']
  },
  {
    id: 'women-3',
    name: 'Oversized Tee',
    category: 'Women',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    isNew: true,
    badge: 'NEW',
    tags: ['New Arrivals']
  },
  {
    id: 'acc-2',
    name: 'FITFAM Grip Lifting Straps (Pair)',
    category: 'Accessories',
    price: 1800,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    isSale: true,
    badge: 'SALE',
    tags: ['Features']
  }
];
