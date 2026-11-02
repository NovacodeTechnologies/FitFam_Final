'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, ShoppingBag, X, Ruler, Plus, Minus, Zap } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { Footer } from '../components/layout/Footer';
import { fixImageUrl } from '../lib/api';

interface ProductDetailPageProps {
    products: Product[];
    onAddToCart: (product: Product, size?: string) => void;
    onToggleWishlist: (product: Product) => void;
    wishlistItems: Product[];
}

type Tab = 'description' | 'reviews';

// ── Size Chart Data ────────────────────────────────────────────────────────
const SIZE_CHARTS = {
    tops: {
        title: "Tops / T-Shirts / Tanks",
        columns: ["Size", "Chest (cm)", "Length (cm)"],
        rows: [
            ["XS", "88", "66"],
            ["S", "92", "68"],
            ["M", "96", "70"],
            ["L", "100", "72"],
            ["XL", "104", "74"],
            ["XXL", "108", "76"],
        ],
    },
    bottoms: {
        title: "Bottoms / Shorts / Pants",
        columns: ["Size", "Waist (cm)", "Hip (cm)", "Length (cm)"],
        rows: [
            ["XS", "64", "88", "38"],
            ["S", "68", "92", "39"],
            ["M", "72", "96", "40"],
            ["L", "76", "100", "41"],
            ["XL", "80", "104", "42"],
            ["XXL", "84", "108", "43"],
        ],
    },
    leggings: {
        title: "Leggings",
        columns: ["Size", "Waist (cm)", "Hip (cm)", "Inseam (cm)"],
        rows: [
            ["XS", "60", "86", "72"],
            ["S", "64", "90", "73"],
            ["M", "68", "94", "74"],
            ["L", "72", "98", "75"],
            ["XL", "76", "102", "76"],
            ["XXL", "80", "106", "77"],
        ],
    },
    topsset: {
        title: "Tops & Short Set",
        columns: ["Size", "Chest (cm)", "Length (cm)"],
        rows: [
            ["S", "92", "68"],
            ["M", "96", "70"],
            ["L", "100", "72"],
            ["XL", "104", "74"],
        ],
    },
};

function getChartType(subCategory?: string): keyof typeof SIZE_CHARTS | null {
    if (!subCategory) return 'tops';
    const sc = subCategory.toLowerCase();
    if (sc.includes('legging')) return 'leggings';
    if (sc.includes('tops & short set') || sc.includes('short set')) return 'topsset';
    if (sc.includes('short') || sc.includes('pant') || sc.includes('squat') || sc.includes('bottom')) return 'bottoms';
    if (sc.includes('tee') || sc.includes('tank') || sc.includes('stringer') || sc.includes('oversize') ||
        sc.includes('oversized') || sc.includes('dry-fit') || sc.includes('dry fit') ||
        sc.includes('crop') || sc.includes('top')) return 'tops';
    return 'tops';
}

// ── Size Chart Modal ──────────────────────────────────────────────────────
function SizeChartModal({
    isOpen,
    onClose,
    subCategory,
}: {
    isOpen: boolean;
    onClose: () => void;
    subCategory?: string;
}) {
    const chartType = getChartType(subCategory);
    const chart = chartType ? SIZE_CHARTS[chartType] : null;
    if (!isOpen || !chart) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <div>
                        <h3 className="font-chakra font-normal text-[11px] uppercase tracking-[0.3em] text-[#111111]">
                            Size Chart
                        </h3>
                        <p className="font-chakra font-normal text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                            {chart.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="border border-gray-200 hover:border-[#111111] p-1.5 transition-colors duration-200 cursor-pointer"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
                <div className="px-6 py-5 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#111111] text-white">
                                {chart.columns.map((col, i) => (
                                    <th
                                        key={col}
                                        className={`py-3 px-4 font-chakra font-normal text-[9px] uppercase tracking-[0.3em] ${i === 0 ? 'text-left' : 'text-center'}`}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chart.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {row.map((cell, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`py-3 px-4 font-chakra font-normal ${colIdx === 0
                                                ? 'text-[11px] uppercase tracking-[0.25em] text-[#111111] text-left'
                                                : 'text-center text-sm text-gray-500'
                                                }`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────
export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
    products,
    onAddToCart,
    onToggleWishlist,
    wishlistItems,
}) => {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
    const router = useRouter();

    const product = products.find((p) => p.id === id);

    const [selectedSize, setSelectedSize] = useState<string>(
        product?.sizes?.[0] ?? 'M'
    ); const [activeTab, setActiveTab] = useState<Tab>('description');
    const [qty, setQty] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImageIndex(0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="font-chakra font-normal text-[#111111] text-2xl uppercase tracking-[0.3em]">
                    Product Not Found
                </h1>
                <p className="font-chakra font-normal text-sm text-gray-400 tracking-wide">
                    The product you're looking for doesn't exist.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-chakra font-normal text-[10px] uppercase tracking-[0.3em] px-8 py-3 transition-all duration-300 cursor-pointer"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const isWishlisted = wishlistItems.some((w) => w.id === product.id);
    const related = products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4);

    const allImages = (product.images && product.images.length > 0)
        ? product.images
        : [product.image];

    return (
        <div className="min-h-screen bg-white">

            {/* Size Chart Modal */}
            <SizeChartModal
                isOpen={isSizeChartOpen}
                onClose={() => setIsSizeChartOpen(false)}
                subCategory={(product as any).subCategory}
            />

            {/* Breadcrumb */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <ol className="flex items-center gap-1.5 font-chakra font-normal text-[11px] uppercase tracking-[0.2em] text-gray-400 flex-wrap">
                    <li>
                        <button onClick={() => router.push('/')} className="hover:text-[#111111] transition-colors cursor-pointer">
                            Home
                        </button>
                    </li>
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span>{product.category}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
                    </li>
                </ol>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Left Image Gallery Section (Vertical Thumbnails + Main Image) ─────────────────────── */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">

                        {/* Vertical Thumbnails List */}
                        {allImages.length > 1 && (
                            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 bg-gray-50 border transition-all cursor-pointer overflow-hidden ${i === activeImageIndex
                                            ? 'border-black ring-1 ring-black'
                                            : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={fixImageUrl(img, 200)}
                                            alt={`Thumbnail ${i + 1}`}
                                            className="w-full h-full object-cover object-center"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Product Image Container */}
                        <div className="relative flex-1 aspect-[3/4] bg-[#f8f8f8] overflow-hidden">
                            <img
                                key={activeImageIndex}
                                src={fixImageUrl(allImages[activeImageIndex], 1200)}
                                alt={`${product.name} - image ${activeImageIndex + 1}`}
                                className="w-full h-full object-cover object-center transition-opacity duration-300"
                                decoding="async"
                            />
                            {product.badge && (
                                <span className="absolute top-4 left-4 bg-[#111111] text-white font-chakra font-normal text-[9px] uppercase tracking-[0.3em] px-2.5 py-1">
                                    {product.badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Right Details Section ───────────────────────── */}
                    <div className="lg:col-span-5 flex flex-col gap-6 pt-2">

                        <div>

                            {/* Product Title */}
                            <h1 className="font-chakra font-semibold text-[#111111] text-xl sm:text-2xl uppercase tracking-wider leading-snug">
                                {product.name}
                            </h1>

                            {/* Color Label */}
                            <p className="font-chakra text-[11px] uppercase tracking-widest text-gray-500 mt-1">
                                BLACK
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {product.salePrice !== undefined && product.salePrice < product.price ? (
                                <>
                                    <span className="font-chakra text-lg text-[#E5003B] font-semibold">
                                        Rs {product.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                    </span>
                                    <span className="font-chakra text-sm text-gray-400 line-through">
                                        Rs {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="font-chakra text-lg text-[#111111]">
                                        Rs {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="font-chakra text-sm text-gray-400 line-through">
                                            Rs {product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-chakra text-[11px] uppercase tracking-widest text-gray-500">
                                    Size:
                                </span>
                                <button
                                    onClick={() => setIsSizeChartOpen(true)}
                                    className="font-chakra text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#111111] cursor-pointer transition-colors flex items-center gap-1"
                                >
                                    <Ruler className="w-3 h-3" />
                                    Size Guide
                                </button>
                            </div>

                            <div className="grid grid-cols-5 gap-2">
                                {(product.sizes && product.sizes.length > 0
                                    ? product.sizes
                                    : ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                                ).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-11 border font-chakra text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${selectedSize === size
                                            ? 'bg-white text-[#111111] border-[#111111] font-semibold ring-1 ring-[#111111]'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => {
                                    for (let i = 0; i < qty; i++) onAddToCart(product, selectedSize);
                                }}
                                className="w-full h-12 bg-[#262626] hover:bg-black text-white font-chakra text-[11px] uppercase tracking-[0.25em] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                            >
                                Add To Cart
                            </button>

                            {/* Buy Now — skips cart, goes straight to checkout */}
                            <button
                                onClick={() => {
                                    router.push('/checkout');
                                }}
                                className="w-full h-12 bg-white border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-chakra text-[11px] uppercase tracking-[0.25em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
                            >
                                Buy Now
                            </button>

                            <button
                                onClick={() => onToggleWishlist(product)}
                                className={`w-full h-11 border font-chakra text-[10px] uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${isWishlisted
                                    ? 'border-red-300 text-red-500 bg-red-50'
                                    : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'
                                    }`}
                            >
                                {isWishlisted ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
                            </button>
                        </div>

                        {/* Accordion Tabs */}
                        <div className="border-t border-gray-200 pt-2 divide-y divide-gray-200 font-chakra">
                            <details className="group py-3 cursor-pointer">
                                <summary className="flex justify-between items-center text-[11px] uppercase tracking-widest text-[#111111] list-none font-medium">
                                    Description
                                    <span className="transition group-open:rotate-180">
                                        <Plus className="w-3.5 h-3.5 group-open:hidden" />
                                        <Minus className="w-3.5 h-3.5 hidden group-open:block" />
                                    </span>
                                </summary>
                                <p className="mt-3 text-xs text-gray-500 leading-relaxed font-sans whitespace-pre-line">
                                    {(product as any).descriptionAbout || product.description ||
                                        `Introducing the ${product.name}. Built for daily performance and training, constructed with lightweight water-resistant material.`
                                    }
                                </p>
                            </details>

                            <details className="group py-3 cursor-pointer">
                                <summary className="flex justify-between items-center text-[11px] uppercase tracking-widest text-[#111111] list-none font-medium">
                                    Features
                                    <span className="transition group-open:rotate-180">
                                        <Plus className="w-3.5 h-3.5 group-open:hidden" />
                                        <Minus className="w-3.5 h-3.5 hidden group-open:block" />
                                    </span>
                                </summary>
                                <p className="mt-3 text-xs text-gray-500 leading-relaxed font-sans whitespace-pre-line">
                                    {(product as any).descriptionFeatures ||
                                        "Gym workouts, daily athletic wear, and outdoor mobility training."
                                    }
                                </p>
                            </details>

                            <details className="group py-3 cursor-pointer">
                                <summary className="flex justify-between items-center text-[11px] uppercase tracking-widest text-[#111111] list-none font-medium">
                                    Care & Fabric
                                    <span className="transition group-open:rotate-180">
                                        <Plus className="w-3.5 h-3.5 group-open:hidden" />
                                        <Minus className="w-3.5 h-3.5 hidden group-open:block" />
                                    </span>
                                </summary>
                                <p className="mt-3 text-xs text-gray-500 leading-relaxed font-sans whitespace-pre-line">
                                    {(product as any).descriptionCare ||
                                        "TETRA-LITE® Water-Resistant & Breathable 4-way stretch blend fabric."
                                    }
                                </p>
                            </details>
                        </div>
                    </div>
                </div>

                {/* ── Related Products ──────────────────────────────── */}
                {related.length > 0 && (
                    <div className="border-t border-gray-100 pt-14 mt-10">
                        <h2 className="font-chakra font-normal text-[#111111] text-sm uppercase tracking-[0.3em] text-center mb-10">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {related.map((p) => (
                                <div key={p.id} className="cursor-pointer" onClick={() => router.push(`/product/${p.id}`)}>
                                    <ProductCard
                                        product={p}
                                        onAddToCart={onAddToCart}
                                        onToggleWishlist={onToggleWishlist}
                                        isWishlisted={wishlistItems.some((w) => w.id === p.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};