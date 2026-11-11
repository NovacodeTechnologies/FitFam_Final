'use client';

import { useStore } from '@/context/StoreContext';
import { ProductDetailPage } from '@/views/ProductDetailPage';

export default function Page() {
  const {
    products,
    isLoadingProducts,
    addToCart,
    toggleWishlist,
    wishlistItems,
  } = useStore();

  return (
    <ProductDetailPage
      products={products}
      isLoadingProducts={isLoadingProducts}
      onAddToCart={addToCart}
      onToggleWishlist={toggleWishlist}
      wishlistItems={wishlistItems}
    />
  );
}