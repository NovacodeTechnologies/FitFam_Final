'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ChevronRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../data/products';
import { Footer } from '../components/layout/Footer';
import { fixImageUrl } from '../lib/api';

interface WishlistPageProps {
    wishlistItems: Product[];
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
    wishlistItems,
    onAddToCart,
    onToggleWishlist,
}) => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const formatPrice = (value: number) =>
        `Rs ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR`;

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between">
            <div>
                {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1">
                    <nav className="flex items-center gap-1.5 font-chakra font-normal text-[11px] uppercase tracking-[0.2em] text-gray-400 flex-wrap">
                        <button
                            onClick={() => router.push('/')}
                            className="hover:text-[#111111] transition-colors cursor-pointer"
                        >
                            Home
                        </button>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-[#111111]">Wishlist</span>
                    </nav>
                </div>

                {/* ── PAGE TITLE ─────────────────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <h1 className="font-chakra font-semibold text-2xl sm:text-3xl text-[#111111] uppercase tracking-[0.2em]">
                        Your Wishlist
                    </h1>
                    {wishlistItems.length > 0 && (
                        <p className="font-chakra text-[11px] uppercase tracking-[0.25em] text-gray-400 mt-2">
                            {wishlistItems.length} saved item{wishlistItems.length > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* ── CONTENT CONTAINER ───────────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {wishlistItems.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
                            <div className="w-14 h-14 border border-gray-200 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-gray-300 stroke-[1.5]" />
                            </div>
                            <h2 className="font-chakra font-normal text-sm uppercase tracking-[0.25em] text-[#111111]">
                                Your wishlist is empty
                            </h2>
                            <p className="font-chakra font-normal text-[11px] text-gray-400 tracking-wider max-w-xs uppercase">
                                Save items you love and come back to them anytime.
                            </p>
                            <button
                                onClick={() => router.push('/shop')}
                                className="mt-4 bg-[#111111] text-white font-chakra font-normal text-[10px] uppercase tracking-[0.3em] px-8 py-3.5 hover:bg-black transition-colors duration-200 cursor-pointer"
                            >
                                Browse All Products
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Items grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
                                {wishlistItems.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group relative bg-white border border-gray-200 hover:border-[#111111] transition-colors duration-200"
                                    >
                                        {/* Image */}
                                        <div
                                            className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/product/${product.id}`)}
                                        >
                                            <img
                                                src={fixImageUrl(product.image, 600)}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            {product.badge && (
                                                <span className="absolute top-3 left-3 bg-[#111111] text-white font-chakra font-normal text-[9px] uppercase tracking-[0.3em] px-2 py-0.5">
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Remove from wishlist button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleWishlist(product);
                                                }}
                                                className="absolute top-3 right-3 bg-white/90 text-gray-500 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#111111] hover:text-white cursor-pointer"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 flex flex-col justify-between gap-3">
                                            <div>
                                                <p className="font-chakra text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                                                    {product.category}
                                                </p>
                                                <h3
                                                    className="font-chakra font-normal text-xs sm:text-sm text-[#111111] uppercase tracking-wider line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors"
                                                    onClick={() => router.push(`/product/${product.id}`)}
                                                >
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Price */}
                                            <div className="flex flex-wrap items-baseline gap-2">
                                                <span className="font-chakra text-xs sm:text-sm text-[#111111]">
                                                    {formatPrice(product.price)}
                                                </span>
                                                {product.salePrice !== undefined && product.salePrice < product.price ? (
                                                    <>
                                                        <span className="font-chakra text-xs sm:text-sm text-[#E5003B] font-semibold">
                                                            {formatPrice(product.salePrice)}
                                                        </span>
                                                        <span className="font-chakra text-[11px] text-gray-400 line-through">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-chakra text-xs sm:text-sm text-[#111111]">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                            <span className="font-chakra text-[11px] text-gray-300 line-through">
                                                                {formatPrice(product.originalPrice)}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => onAddToCart(product)}
                                                className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white font-chakra font-normal text-[10px] uppercase tracking-[0.25em] py-3 hover:bg-black transition-colors duration-200 cursor-pointer mt-1"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom CTA */}
                            <div className="mt-14 text-center">
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="border border-gray-300 text-[#111111] font-chakra font-normal text-[10px] uppercase tracking-[0.3em] px-8 py-3.5 hover:border-[#111111] transition-colors cursor-pointer"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};