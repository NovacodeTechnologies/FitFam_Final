'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ChevronRight, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { fixImageUrl } from '../lib/api';

interface CartItem {
    product: Product;
    quantity: number;
    size: string;
    color?: string;
}

interface CartPageProps {
    cartItems: CartItem[];
    onRemoveFromCart: (productId: string, size?: string, color?: string) => void;
    onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
    onOpenCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
    cartItems,
    onRemoveFromCart,
    onUpdateQuantity,
    onOpenCheckout,
}) => {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const formatPrice = (value: number) =>
        `රු ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const subtotal = cartItems.reduce((sum, item) => {
        const priceToUse = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
        return sum + priceToUse * item.quantity;
    }, 0);
    const deliveryFee = cartItems.length > 0 ? 500 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1 w-full">
                <nav className="flex items-center gap-1.5">
                    <button
                        onClick={() => router.push('/')}
                        className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] hover:text-[#111111] transition-colors cursor-pointer"
                    >
                        Home
                    </button>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <span className="font-chakra text-[10px] uppercase tracking-widest text-[#111111] font-semibold">Cart</span>
                </nav>
            </div>

            {/* Title */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center w-full">
                <h1 className="font-chakra text-3xl sm:text-4xl font-bold uppercase tracking-[0.15em] text-[#111111]">
                    Your Cart
                </h1>
                {cartItems.length > 0 && (
                    <p className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] mt-2">
                        {cartItems.reduce((n, i) => n + i.quantity, 0)} item{cartItems.reduce((n, i) => n + i.quantity, 0) !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1">

                {/* ── EMPTY STATE ───────────────────────────────────────── */}
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7 text-gray-300" />
                        </div>
                        <h2 className="font-chakra text-sm font-bold uppercase tracking-widest text-[#111111]">
                            Your cart is empty
                        </h2>
                        <p className="font-chakra text-xs text-[#555555] tracking-wide max-w-xs">
                            Add some athletic gear and come back to check out.
                        </p>
                        <div className="mt-2">
                            <Button variant="outline" size="md" onClick={() => router.push('/shop')}>
                                Shop Now
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                        {/* ── CART ITEMS ────────────────────────────────────── */}
                        <div className="flex-1 min-w-0">

                            {/* Header row */}
                            <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 pb-3 border-b border-gray-100">
                                <span className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] font-bold">Product</span>
                                <span className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] font-bold text-center w-28">Quantity</span>
                                <span className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] font-bold text-right w-24">Total</span>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-100">
                                {cartItems.map(({ product, quantity, size, color }) => (
                                    <div key={`${product.id}-${size}-${color || 'def'}`} className="py-6 flex gap-4 items-start">

                                        {/* Image */}
                                        <div
                                            className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 bg-gray-50 overflow-hidden cursor-pointer"
                                            onClick={() => router.push(`/product/${product.id}`)}
                                        >
                                            <img src={fixImageUrl(product.image, 200)} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-chakra text-[10px] uppercase tracking-widest text-[#555555] mb-0.5">
                                                    {product.category}
                                                </p>
                                                <h3
                                                    className="font-chakra text-sm font-semibold text-[#111111] tracking-wide line-clamp-2 cursor-pointer hover:underline mb-0.5"
                                                    onClick={() => router.push(`/product/${product.id}`)}
                                                >
                                                    {product.name}
                                                </h3>
                                                <p className="font-chakra text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                                                    {color ? `Color: ${color} · ` : ''}Size: {size}
                                                </p>
                                                <div className="flex gap-2">
                                                    {product.salePrice !== undefined ? (
                                                        <>
                                                            <p className="font-chakra text-xs text-[#E5003B] font-semibold tracking-wide">
                                                                {formatPrice(product.salePrice)} each
                                                            </p>
                                                            <p className="font-chakra text-[11px] text-gray-400 line-through tracking-wide mt-0.5">
                                                                {formatPrice(product.price)}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="font-chakra text-xs text-[#555555] tracking-wide">
                                                            {formatPrice(product.price)} each
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Qty + total + remove */}
                                            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 flex-shrink-0">

                                                {/* Quantity stepper */}
                                                <div className="flex items-center border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            if (quantity > 1) onUpdateQuantity(product.id, quantity - 1, size, color);
                                                            else onRemoveFromCart(product.id, size, color);
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-[#555555] hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-chakra w-8 text-center text-sm font-semibold text-[#111111]">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(product.id, quantity + 1, size, color)}
                                                        className="w-8 h-8 flex items-center justify-center text-[#555555] hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Line total */}
                                                <p className="font-chakra text-sm sm:w-24 sm:text-right font-bold text-[#111111]">
                                                    {formatPrice((product.salePrice !== undefined ? product.salePrice : product.price) * quantity)}
                                                </p>

                                                {/* Remove */}
                                                <button
                                                    onClick={() => onRemoveFromCart(product.id, size)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue shopping */}
                            <div className="pt-4">
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="font-chakra text-[10px] uppercase font-bold tracking-widest text-[#555555] hover:text-[#111111] transition-colors cursor-pointer"
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* ── ORDER SUMMARY ─────────────────────────────────── */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="border border-gray-100 p-6 sticky top-24">
                                <h2 className="font-chakra text-[11px] font-bold uppercase tracking-widest text-[#111111] mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="font-chakra text-xs tracking-wide text-[#555555]">Subtotal</span>
                                        <span className="font-chakra text-xs tracking-wide text-[#111111] font-semibold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-chakra text-xs tracking-wide text-[#555555]">Delivery fee</span>
                                        <span className="font-chakra text-xs tracking-wide text-[#111111] font-semibold">{formatPrice(deliveryFee)}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                                        <span className="font-chakra text-xs font-bold uppercase tracking-widest text-[#111111]">Total</span>
                                        <span className="font-chakra text-xs font-bold tracking-wide text-[#111111]">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Koko note */}
                                <p className="font-chakra text-[10px] text-[#555555] tracking-wide mb-5">
                                    or 3 interest-free payments of{' '}
                                    <span className="font-bold text-indigo-600">{formatPrice(total / 3)}</span>{' '}
                                    with <span className="font-extrabold uppercase tracking-wider text-indigo-600">koko</span>
                                </p>

                                <Button variant="primary" size="md" fullWidth onClick={onOpenCheckout}>
                                    Proceed to Checkout <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                                </Button>

                                <p className="font-chakra text-[10px] text-center text-[#555555] tracking-wide mt-3">
                                    Cash on Delivery &amp; Koko accepted
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};