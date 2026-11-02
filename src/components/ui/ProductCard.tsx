'use client';

import React, { useState } from 'react';
import { Product } from '../../data/products';
import { Badge } from './Badge';
import { fixImageUrl } from '../../lib/api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size?: string) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  isWishlisted?: boolean;
  portrait?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  portrait = false,
}) => {
  const { name, price, originalPrice, salePrice, image, images, isNew, isSale, badge, sizes } = product;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const hoverImage = images && images.length > 1 ? images[1] : null;

  const formatPrice = (value: number) =>
    `රු ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="group relative flex flex-col bg-white cursor-pointer">

      {/* IMAGE CONTAINER */}
      <div className={`relative w-full overflow-hidden bg-gray-50 ${portrait ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>

        {/* Primary image */}
        <img
          src={fixImageUrl(image, 600)}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hoverImage ? 'md:group-hover:opacity-0' : ''}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        {/* Hover image */}
        {hoverImage && (
          <img
            src={fixImageUrl(hoverImage, 600)}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {badge && <Badge>{badge}</Badge>}
          {isSale && !badge && <Badge variant="sale">SALE</Badge>}
          {isNew && !badge && <Badge variant="new">NEW</Badge>}
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 pb-2 flex flex-col gap-1 text-center">
        <h3 className="font-chakra font-normal text-[12px] uppercase tracking-[0.15em] text-gray-900 line-clamp-2 leading-relaxed">
          {name}
        </h3>

        <div className="mt-1 flex flex-col items-center justify-center gap-1.5 md:min-h-[28px]">

          {/* Price — hidden on hover on desktop */}
          <div className="flex items-baseline justify-center gap-2 md:group-hover:hidden">
            {salePrice !== undefined && salePrice < price ? (
              <>
                <span className="font-chakra font-normal text-[12px] text-[#E5003B] tracking-wider font-semibold">
                  {formatPrice(salePrice)}
                </span>
                <span className="font-chakra text-[11px] text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <>
                <span className="font-chakra font-normal text-[12px] text-gray-700 tracking-wider">
                  {formatPrice(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="font-chakra text-[11px] text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Sizes — shown on hover on desktop, always shown on mobile */}
          {sizes && sizes.length > 0 && (
            <div className="flex md:hidden md:group-hover:flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                    onAddToCart?.(product, size);
                  }}
                  className={`text-[9px] sm:text-[10px] font-chakra font-normal tracking-wider uppercase border px-2 sm:px-2.5 py-0.5 sm:py-1 transition-colors cursor-pointer ${selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};