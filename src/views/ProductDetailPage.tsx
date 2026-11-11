'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, ShoppingBag, X, Ruler, Plus, Minus, Zap, Info } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { Footer } from '../components/layout/Footer';
import { fixImageUrl } from '../lib/api';

interface ProductDetailPageProps {
    products: Product[];
    onAddToCart: (product: Product, size?: string, color?: string) => void;
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

// Size Chart Modal (Dynamic Admin Library + Custom Override + Fallback)
function SizeChartModal({
    isOpen,
    onClose,
    product,
}: {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}) {
    if (!isOpen || !product) return null;

    // 1. Determine active size chart source
    let title = "Size Chart";
    let columns: string[] = [];
    let rows: any[] = [];
    let notes: string | undefined = undefined;
    let unit: string | undefined = undefined;

    if (product.customSizeGuide?.enabled && product.customSizeGuide.columns?.length) {
        title = `${product.name} Custom Size Chart`;
        columns = product.customSizeGuide.columns;
        rows = product.customSizeGuide.rows || [];
        notes = product.customSizeGuide.measurementNotes;
        unit = product.customSizeGuide.unit;
    } else if (product.sizeGuide && typeof product.sizeGuide === 'object' && product.sizeGuide.columns?.length) {
        title = product.sizeGuide.name || "Size Guide";
        columns = product.sizeGuide.columns;
        rows = product.sizeGuide.rows || [];
        notes = product.sizeGuide.measurementNotes;
        unit = product.sizeGuide.unit;
    } else {
        const chartType = getChartType((product as any).subCategory);
        const fallback = chartType ? SIZE_CHARTS[chartType] : SIZE_CHARTS.tops;
        title = fallback.title;
        columns = fallback.columns;
        rows = fallback.rows;
    }

    // Normalize rows to arrays of cell values matching columns
    const normalizedRows: string[][] = rows.map((r: any) => {
        if (Array.isArray(r)) return r.map((c) => String(c ?? ""));
        if (typeof r === 'object' && r !== null) {
            return columns.map((col) => String(r[col] ?? "-"));
        }
        return [];
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-chakra font-normal text-[11px] uppercase tracking-[0.3em] text-[#111111]">
                                Size Chart
                            </h3>
                            {unit && (
                                <span className="border border-gray-200 px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-chakra text-gray-500">
                                    {unit === 'both' ? 'IN / CM' : unit.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <p className="font-chakra font-normal text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                            {title}
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
                                {columns.map((col, i) => (
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
                            {normalizedRows.map((rowCells, rowIdx) => (
                                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {rowCells.map((cell, colIdx) => (
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

                    {notes && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="font-chakra text-[10px] tracking-wider text-gray-500 leading-relaxed">
                                {notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

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

    // Phase 3: Variations state
    const hasVariations = Boolean(product?.hasVariations && product?.variations && product.variations.length > 0);
    const availableVariations = hasVariations ? product!.variations!.filter(v => v.isAvailable !== false) : [];
    const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

    const currentVariation = hasVariations && availableVariations.length > 0
        ? (availableVariations[selectedColorIndex] || availableVariations[0])
        : null;

    const availableSizes = currentVariation
        ? (currentVariation.sizes && currentVariation.sizes.length > 0 ? currentVariation.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'])
        : (product?.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

    const [selectedSize, setSelectedSize] = useState<string>(
        availableSizes[0] ?? 'M'
    );
    const [activeTab, setActiveTab] = useState<Tab>('description');
    const [qty, setQty] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // Sync selected size if available sizes change on variation switch
    useEffect(() => {
        if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
            setSelectedSize(availableSizes[0]);
        }
    }, [selectedColorIndex, availableSizes, selectedSize]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImageIndex(0);
        setSelectedColorIndex(0);
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

    // Collect all available images for this product (from base images + all variation images)
    const allProductImages = React.useMemo(() => {
        const list: string[] = [];
        const seen = new Set<string>();
        const add = (img?: string) => {
            if (img && !seen.has(img)) {
                seen.add(img);
                list.push(img);
            }
        };
        (product?.images || []).forEach(add);
        if (product?.image) add(product.image);
        availableVariations.forEach(v => {
            (v.images || []).forEach(add);
        });
        return list;
    }, [product, availableVariations]);

    // If variation has multiple images of its own (e.g. front & back of that specific color), use them.
    // Otherwise show all product images so all colors/images remain visible in the left thumbnail strip.
    const variationImages = (currentVariation && currentVariation.images && currentVariation.images.length > 0)
        ? currentVariation.images
        : [];
    const allImages = (variationImages.length > 1)
        ? variationImages
        : (allProductImages.length > 0 ? allProductImages : (product?.image ? [product.image] : []));

    return (
        <div className="min-h-screen bg-white">

            {/* Size Chart Modal */}
            <SizeChartModal
                isOpen={isSizeChartOpen}
                onClose={() => setIsSizeChartOpen(false)}
                product={product}
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
                                        onClick={() => {
                                            setActiveImageIndex(i);
                                            const clickedImg = allImages[i];
                                            const matchedVarIdx = availableVariations.findIndex(v => (v.images || []).includes(clickedImg));
                                            if (matchedVarIdx !== -1 && matchedVarIdx !== selectedColorIndex) {
                                                setSelectedColorIndex(matchedVarIdx);
                                            }
                                        }}
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
                                src={fixImageUrl(allImages[activeImageIndex] || allImages[0] || product.image, 1200)}
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
                            {currentVariation ? (
                                <p className="font-chakra text-[11px] uppercase tracking-widest text-gray-700 mt-1 font-semibold flex items-center gap-2">
                                    <span>COLOR: {currentVariation.colorName}</span>
                                    {currentVariation.sku && (
                                        <span className="text-[9px] text-gray-400 font-normal">SKU: {currentVariation.sku}</span>
                                    )}
                                </p>
                            ) : (
                                <p className="font-chakra text-[11px] uppercase tracking-widest text-gray-500 mt-1">
                                    {product.category}
                                </p>
                            )}
                        </div>

                        {/* Price (Variation-aware) */}
                        <div className="flex items-baseline gap-3">
                            {(() => {
                                const effectivePrice = currentVariation?.price ?? product.price;
                                const effectiveSale = currentVariation?.salePrice ?? product.salePrice;
                                if (effectiveSale !== undefined && effectiveSale < effectivePrice) {
                                    return (
                                        <>
                                            <span className="font-chakra text-lg text-[#E5003B] font-semibold">
                                                Rs {effectiveSale.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                            </span>
                                            <span className="font-chakra text-sm text-gray-400 line-through">
                                                Rs {effectivePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                            </span>
                                        </>
                                    );
                                }
                                return (
                                    <>
                                        <span className="font-chakra text-lg text-[#111111]">
                                            Rs {effectivePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                        </span>
                                        {product.originalPrice && product.originalPrice > effectivePrice && (
                                            <span className="font-chakra text-sm text-gray-400 line-through">
                                                Rs {product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                            </span>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Phase 3: Color Swatches Selector (ASRV-style) */}
                        {hasVariations && availableVariations.length > 0 && (
                            <div className="space-y-2 pt-1 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="font-chakra text-[11px] uppercase tracking-widest text-gray-500">
                                        Color: <strong className="text-black">{currentVariation?.colorName}</strong>
                                    </span>
                                    <span className="text-[10px] text-gray-400 tracking-wider font-chakra">
                                        {availableVariations.length} {availableVariations.length === 1 ? 'color' : 'colors'} available
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2.5 items-center">
                                    {availableVariations.map((v, idx) => {
                                        const isSelected = idx === selectedColorIndex;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedColorIndex(idx);
                                                    const targetVar = availableVariations[idx];
                                                    if (targetVar?.images && targetVar.images.length > 0) {
                                                        const targetImg = targetVar.images[0];
                                                        const found = allImages.indexOf(targetImg);
                                                        setActiveImageIndex(found !== -1 ? found : 0);
                                                    } else {
                                                        const colorLower = (targetVar?.colorName || '').toLowerCase().trim();
                                                        const found = colorLower ? allImages.findIndex(img => img.toLowerCase().includes(colorLower)) : -1;
                                                        setActiveImageIndex(found !== -1 ? found : 0);
                                                    }
                                                }}
                                                className={`group relative flex items-center gap-2 px-3 py-2 border transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-black bg-black text-white ring-1 ring-black'
                                                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                                                }`}
                                                title={v.colorName}
                                            >
                                                {/* Color circle or swatch */}
                                                <span
                                                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                                                    style={{ backgroundColor: (v as any).colorHex || v.colorCode || '#222222' }}
                                                />
                                                <span className="font-chakra text-[11px] uppercase tracking-wider font-semibold">
                                                    {v.colorName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                {availableSizes.map((size) => {
                                    const stockMap = currentVariation?.stock || product.stock || {};
                                    const sizeStock = stockMap[size];
                                    const isOutOfStock = sizeStock !== undefined && sizeStock <= 0;
                                    return (
                                        <button
                                            key={size}
                                            disabled={isOutOfStock}
                                            onClick={() => !isOutOfStock && setSelectedSize(size)}
                                            className={`relative h-11 border font-chakra text-[11px] uppercase tracking-wider transition-all duration-200 ${
                                                isOutOfStock
                                                    ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                                                    : selectedSize === size
                                                        ? 'bg-white text-[#111111] border-[#111111] font-semibold ring-1 ring-[#111111] cursor-pointer'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 cursor-pointer'
                                            }`}
                                        >
                                            {size}
                                            {isOutOfStock && (
                                                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-gray-400 text-white px-1 rounded font-normal">
                                                    OUT
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => {
                                    const colorToPass = currentVariation?.colorName;
                                    for (let i = 0; i < qty; i++) onAddToCart(product, selectedSize, colorToPass);
                                }}
                                className="w-full h-12 bg-[#262626] hover:bg-black text-white font-chakra text-[11px] uppercase tracking-[0.25em] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                            >
                                Add To Cart {currentVariation ? `(${currentVariation.colorName})` : ''}
                            </button>

                            {/* Buy Now — skips cart, goes straight to checkout */}
                            <button
                                onClick={() => {
                                    if (!product) return;
                                    const colorToPass = currentVariation?.colorName;
                                    const buyNowItem = {
                                        product,
                                        quantity: qty,
                                        size: selectedSize,
                                        ...(colorToPass ? { color: colorToPass } : {}),
                                    };
                                    localStorage.setItem('fitfam_buy_now', JSON.stringify(buyNowItem));
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