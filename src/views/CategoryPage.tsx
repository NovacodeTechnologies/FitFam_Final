'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';



import React, { useEffect } from 'react';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { Product } from '../data/products';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

interface CategoryPageProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
}

type CategoryKey = 'women' | 'men' | 'accessories';

interface CategoryMeta {
  label: string;
  productKey: Product['category'];
}

const categoryMeta: Record<CategoryKey, CategoryMeta> = {
  women: { label: 'Women', productKey: 'Women' },
  men: { label: 'Men', productKey: 'Men' },
  accessories: { label: 'Accessories', productKey: 'Accessories' },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  products,
  isLoading,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
}) => {
  const params = useParams();
  const categoryId = (typeof params?.categoryId === 'string' ? params.categoryId : Array.isArray(params?.categoryId) ? params.categoryId[0] : '') as CategoryKey;
  const subCategory = typeof params?.subCategory === 'string' ? params.subCategory : Array.isArray(params?.subCategory) ? params.subCategory[0] : undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const clothingType = searchParams.get('clothingType');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryId, subCategory]);

  const key = (categoryId ?? '').toLowerCase() as CategoryKey;
  const meta = categoryMeta[key] || (categoryId ? {
    label: decodeURIComponent(categoryId).charAt(0).toUpperCase() + decodeURIComponent(categoryId).slice(1),
    productKey: decodeURIComponent(categoryId),
  } : null);

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="font-chakra text-2xl font-bold uppercase tracking-[0.15em] text-[#111111]">
          Category not found
        </h1>
        <p className="font-chakra text-xs text-[#555555] tracking-wide">
          The category you're looking for doesn't exist.
        </p>
        <div className="mt-4">
          <Button variant="outline" size="md" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const decodedSubCategory = subCategory ? decodeURIComponent(subCategory) : null;

  const categoryProducts = products.filter((p) => {
    const matchesCategory = p.category?.toLowerCase() === meta.productKey?.toLowerCase();
    const matchesClothing = !clothingType || (p as any).clothingType === clothingType;
    if (!decodedSubCategory) return matchesCategory && matchesClothing;

    const productSub: string = ((p as any).subCategory ?? '').toLowerCase();
    const filterSub = decodedSubCategory.toLowerCase();

    // 'camo' is a series overview — match any subCategory that starts with 'camo'
    const matchesSubCategory =
      filterSub === 'camo'
        ? productSub.startsWith('camo')
        : productSub === filterSub;

    return matchesCategory && matchesClothing && matchesSubCategory;
  });

  // Display 'Camo Series' as the page title when the filter is the overview
  const pageTitle =
    !decodedSubCategory
      ? clothingType
        ? `${meta.label} ${clothingType}`  // e.g. "Men Tops", "Women Bottoms"
        : meta.label
      : decodedSubCategory.toLowerCase() === 'camo'
        ? 'Camo Series'
        : decodedSubCategory;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1 w-full">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => router.push('/')}
            className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] hover:text-[#111111] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          {decodedSubCategory ? (
            <>
              <button
                onClick={() => router.push(`/category/${categoryId}`)}
                className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] hover:text-[#111111] transition-colors cursor-pointer"
              >
                {meta.label}
              </button>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="font-chakra text-[10px] uppercase tracking-widest text-[#111111] font-semibold">
                {decodedSubCategory}
              </span>
            </>
          ) : (
            <span className="font-chakra text-[10px] uppercase tracking-widest text-[#111111] font-semibold">
              {meta.label}
            </span>
          )}
        </nav>
      </div>

      {/* ── PAGE TITLE ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center w-full">
        <h1 className="font-chakra text-3xl sm:text-4xl font-bold uppercase tracking-[0.15em] text-[#111111]">
          {pageTitle}
        </h1>
        {decodedSubCategory && (
          <p className="font-chakra text-xs text-[#555555] tracking-widest uppercase mt-2">
            {meta.label} Collection
          </p>
        )}
      </div>

      {/* ── PRODUCTS GRID ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#111111] rounded-full animate-spin" />
            <p className="font-chakra text-[10px] font-bold uppercase tracking-widest text-[#555555]">
              Loading Collection...
            </p>
          </div>

        ) : categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="font-chakra text-sm font-bold uppercase tracking-widest text-[#111111]">
              No items yet
            </h2>
            <p className="font-chakra text-xs text-[#555555] tracking-wide max-w-xs">
              {decodedSubCategory
                ? `No ${decodedSubCategory} products found. Check back soon!`
                : "We're stocking up this collection. Check back soon for new arrivals."
              }
            </p>
            <div className="mt-2">
              <Button variant="outline" size="md" onClick={() => router.push(`/category/${categoryId}`)}>
                {decodedSubCategory ? `View All ${meta.label}` : 'Explore Other Categories'}
              </Button>
            </div>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {categoryProducts.map((product) => {
              const isWishlisted = wishlistItems.some((w) => w.id === product.id);
              return (
                <div
                  key={product.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={(p) => { onAddToCart(p); }}
                    onToggleWishlist={(p) => { onToggleWishlist(p); }}
                    isWishlisted={isWishlisted}
                    portrait
                  />
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};