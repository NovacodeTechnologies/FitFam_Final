'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { api, fixImageUrl } from '@/lib/api';
import { Check, X, ShoppingBag, Heart } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'cart' | 'wishlist' | 'success';
}

interface StoreContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  products: Product[];
  isLoadingProducts: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
  showToast: (text: string, type: 'cart' | 'wishlist' | 'success') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage once on client
  useEffect(() => {
    try {
      const cachedCart = localStorage.getItem('fitfam_cart');
      if (cachedCart) setCartItems(JSON.parse(cachedCart));
      const cachedWishlist = localStorage.getItem('fitfam_wishlist');
      if (cachedWishlist) setWishlistItems(JSON.parse(cachedWishlist));
    } catch (e) {
      console.error('Error loading from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/store/products');
        const mapped = (res.data.products || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          isNewProduct: p.isNewProduct,
          image: fixImageUrl(p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/600'),
          images: (p.images || []).map(fixImageUrl),
        }));
        setProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('fitfam_cart', JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('fitfam_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems, isHydrated]);

  // Listen for external clear-cart events
  useEffect(() => {
    const handler = () => setCartItems([]);
    window.addEventListener('fitfam:clear-cart', handler);
    return () => window.removeEventListener('fitfam:clear-cart', handler);
  }, []);

  const showToast = (text: string, type: 'cart' | 'wishlist' | 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (product: Product, size?: string, color?: string) => {
    const resolvedSize = size ?? product.sizes?.[0] ?? 'ONE SIZE';
    const resolvedColor = color || (product.hasVariations && product.variations && product.variations.length > 0 ? product.variations[0].colorName : undefined);
    const existing = cartItems.find(
      (item) => item.product.id === product.id && item.size === resolvedSize && item.color === resolvedColor
    );
    const itemLabel = resolvedColor ? `${product.name} (${resolvedColor} / ${resolvedSize})` : `${product.name} (${resolvedSize})`;
    if (existing) {
      showToast(`Increased quantity of ${itemLabel} in cart!`, 'cart');
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === product.id && item.size === resolvedSize && item.color === resolvedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      showToast(`${itemLabel} added to cart!`, 'cart');
      setCartItems((prev) => [...prev, { product, quantity: 1, size: resolvedSize, color: resolvedColor }]);
    }
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const itemMatch = (item: CartItem) =>
      item.product.id === productId &&
      (!size || item.size === size) &&
      (!color || item.color === color);
    const match = cartItems.find(itemMatch);
    if (match) {
      const label = match.color ? `${match.product.name} (${match.color} / ${match.size})` : `${match.product.name}${match.size ? ` (${match.size})` : ''}`;
      showToast(`${label} removed from cart.`, 'success');
    }
    setCartItems((prev) => prev.filter((item) => !itemMatch(item)));
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        const matches =
          item.product.id === productId &&
          (!size || item.size === size) &&
          (!color || item.color === color);
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const toggleWishlist = (product: Product) => {
    const isSaved = wishlistItems.some((item) => item.id === product.id);
    if (isSaved) {
      showToast(`${product.name} removed from wishlist.`, 'wishlist');
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      showToast(`${product.name} saved to wishlist!`, 'wishlist');
      setWishlistItems((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const product = wishlistItems.find((item) => item.id === productId);
    if (product) showToast(`${product.name} removed from wishlist.`, 'wishlist');
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subText && product.subText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        wishlistItems,
        products,
        isLoadingProducts,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        removeFromWishlist,
        clearCart,
        showToast,
      }}
    >
      {children}

      {/* FLOATING TOASTS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#111111] text-white border border-gray-800 shadow-2xl p-4 flex items-center justify-between gap-3 animate-slide-up rounded-sm"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'cart' && <ShoppingBag className="w-4 h-4 text-indigo-400" />}
              {toast.type === 'wishlist' && <Heart className="w-4 h-4 text-red-500 fill-current" />}
              {toast.type === 'success' && <Check className="w-4 h-4 text-green-400" />}
              <span className="text-xs font-semibold uppercase tracking-wider">{toast.text}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}