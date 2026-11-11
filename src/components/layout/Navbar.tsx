'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, X, Heart } from 'lucide-react';
import { Product } from '../../data/products';
import SaleBanner from '../ui/SaleBanner';
import MaintenanceBanner from '../ui/MaintenanceBanner';

interface NavbarProps {
  cartItems: { product: Product; quantity: number; size: string }[];
  wishlistItems: Product[];
  onRemoveFromCart: (productId: string, size?: string) => void;
  onUpdateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onSearchQueryChange: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  wishlistItems,
  onSearchQueryChange,
  setActiveCategory
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState<'men' | 'women' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQueryChange(searchTerm);
    setIsSearchOpen(false);
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchQueryChange('');
  };

  // Navbar turns opaque when scrolled or hovered
  const isOpaque = !isHomePage || isScrolled || isHovered;

  return (
    <>
      {/* TOP HEADER NAVIGATION */}
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setOpenMenu(null); }}
        className="fixed top-0 left-0 w-full z-40 flex flex-col"
      >
        {/* ============================================================== 
            SITE MAINTENANCE BANNER (Comment / uncomment block as needed)  
            ============================================================== 
        <MaintenanceBanner
          message="SYSTEM MAINTENANCE IN PROGRESS — OUR SERVICES ARE CURRENTLY UNDERGOING SCHEDULED UPGRADES."
          subtext="Ordering & some features may be temporarily limited. We appreciate your patience!"
        />
            ============================================================== */}

        <div className={`w-full transition-all duration-500 ${isOpaque ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
          <div className="w-full px-4 md:px-6 lg:px-10 flex items-center h-16 relative">

            {/* LEFT: Navigation Links & Mobile Menu Button */}
            <div className="flex items-center flex-1 h-full">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-1 mr-3 transition-colors cursor-pointer ${isOpaque ? 'text-gray-900' : 'text-white'}`}
                aria-label="Open Menu"
              >
                <div className="flex flex-col justify-center gap-1.5 w-5">
                  <span className={`h-0.5 w-5 transition-transform ${isOpaque ? 'bg-gray-900' : 'bg-white'}`} />
                  <span className={`h-0.5 w-3.5 transition-transform ${isOpaque ? 'bg-gray-900' : 'bg-white'}`} />
                  <span className={`h-0.5 w-4.5 transition-transform ${isOpaque ? 'bg-gray-900' : 'bg-white'}`} />
                </div>
              </button>

              <nav className="hidden md:flex items-center space-x-8 h-full">
                {/* Men */}
                <div className="relative h-full flex items-center">
                  <button
                    onMouseEnter={() => setOpenMenu('men')}
                    className={`relative text-[13px] font-chakra font-normal tracking-[0.2em] uppercase transition-colors py-2 cursor-pointer ${isOpaque ? 'text-gray-900 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
                  >
                    Men
                    <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 ${openMenu === 'men' ? 'w-full' : 'w-0'}`} />
                  </button>
                </div>

                {/* Women */}
                <div className="relative h-full flex items-center">
                  <button
                    onMouseEnter={() => setOpenMenu('women')}
                    className={`relative text-[13px] font-chakra font-normal tracking-[0.2em] uppercase transition-colors py-2 cursor-pointer ${isOpaque ? 'text-gray-900 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
                  >
                    Women
                    <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 ${openMenu === 'women' ? 'w-full' : 'w-0'}`} />
                  </button>
                </div>

                {/* Accessories */}
                <div className="relative h-full flex items-center group">
                  <Link href="/category/accessories"
                    onMouseEnter={() => setOpenMenu(null)}
                    className={`relative text-[13px] font-chakra font-normal tracking-[0.2em] uppercase transition-colors py-2 ${isOpaque ? 'text-gray-900 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
                  >
                    Accessories
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </div>
              </nav>
            </div>

            {/* CENTER: Brand Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <Link href="/" onClick={() => setActiveCategory('all')} className="flex items-center gap-1.5 md:gap-3 group cursor-pointer">
                <div className="flex flex-col justify-center">
                  <div className={`w-4 md:w-6 h-[2px] md:h-[3px] mb-1 md:mb-1.5 transition-colors [clip-path:polygon(0_0,100%_0,calc(100%-5px)_100%,0_100%)] ${isOpaque ? 'bg-[#111111]' : 'bg-white'}`}></div>
                  <div className={`w-3 md:w-4 h-[2px] md:h-[3px] mb-1 md:mb-1.5 transition-colors [clip-path:polygon(0_0,100%_0,calc(100%-5px)_100%,0_100%)] ${isOpaque ? 'bg-[#111111]' : 'bg-white'}`}></div>
                  <div className={`w-2 md:w-2.5 h-[2px] md:h-[3px] transition-colors [clip-path:polygon(0_0,100%_0,calc(100%-5px)_100%,0_100%)] ${isOpaque ? 'bg-[#111111]' : 'bg-white'}`}></div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className={`font-chakra text-[16px] md:text-[28px] tracking-[0.2em] md:tracking-[0.4em] font-bold transition-colors ${isOpaque ? 'text-[#111111]' : 'text-white'}`}>
                    FITFAM
                  </span>
                  <span className={`font-chakra text-[7px] md:text-[10px] tracking-[0.4em] md:tracking-[0.8em] font-normal uppercase transition-colors mt-0.5 md:mt-1 ${isOpaque ? 'text-[#888888]' : 'text-white/70'}`}>
                    ACTIVE
                  </span>
                </div>
              </Link>
            </div>

            {/* RIGHT: Icon Actions */}
            <div className="flex items-center space-x-3 md:space-x-5 ml-auto">
              {/* Direct Navigation: Account */}
              <button
                onClick={() => router.push('/account')}
                className={`relative group flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${isOpaque ? 'text-gray-800 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
              >
                <User className="w-[16px] h-[16px] stroke-[1.5]" />
                <span className="hidden md:inline text-[9px] font-chakra font-normal tracking-[0.15em] uppercase">Account</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>

              {/* Direct Navigation: Wishlist */}
              <button
                onClick={() => router.push('/wishlist')}
                className={`relative group flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${isOpaque ? 'text-gray-800 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
              >
                <div className="relative">
                  <Heart className="w-[16px] h-[16px] stroke-[1.5]" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-[#D4AF37] text-white rounded-full text-[7px] font-bold flex items-center justify-center font-mono">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-[9px] font-chakra font-normal tracking-[0.15em] uppercase">Wishlist</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`relative group flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${isOpaque ? 'text-gray-800 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
              >
                <Search className="w-[16px] h-[16px] stroke-[1.5]" />
                <span className="hidden md:inline text-[9px] font-chakra font-normal tracking-[0.15em] uppercase">Search</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>

              {/* Direct Navigation: Cart */}
              <button
                onClick={() => router.push('/cart')}
                className={`relative group flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${isOpaque ? 'text-gray-800 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
              >
                <div className="relative">
                  <ShoppingBag className="w-[16px] h-[16px] stroke-[1.5]" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-[#D4AF37] text-white rounded-full text-[7px] font-bold flex items-center justify-center font-mono">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-[9px] font-chakra font-normal tracking-[0.15em] uppercase">Cart</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Sale Banner goes right under the main nav bar */}
        <SaleBanner isOpaque={isOpaque} />

        {/* MEGA MENU: MEN */}
        {openMenu === 'men' && (
          <div className="w-full bg-white border-t border-gray-100 shadow-xl hidden md:block" onMouseLeave={() => setOpenMenu(null)}>
            <div className="max-w-7xl mx-auto px-16 py-8 flex gap-16">
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Featured</span>
                <Link href="/category/men" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">All Men</Link>
                <Link href="/category/men/UNMARKED" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Unmarked</Link>
                <Link href="/category/men/CAMO" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Camo Series</Link>
              </div>
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Tops</span>
                <Link href="/category/men/DRY-FIT%20T%20Shirt" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Dry-Fit T-Shirts</Link>
                <Link href="/category/men/Oversize" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Oversize</Link>
                <Link href="/category/men/Stringers" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Stringers</Link>
                <Link href="/category/men/Tank%20Tops" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Tank Tops</Link>
                <Link href="/category/men/CAMO%20Dry-Fit%20Tees" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Camo Dry-Fit Tees</Link>
              </div>
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Bottoms</span>
                <Link href="/category/Men?clothingType=Bottoms" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Shorts</Link>
                <Link href="/category/men/Pants" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Pants</Link>
                <Link href="/category/men/CAMO%20Premium%20Shorts" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Camo Premium Shorts</Link>
                <Link href="/category/men/CAMO%20Squat%20Short" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Camo Squat Shorts</Link>
              </div>
            </div>
          </div>
        )}

        {/* MEGA MENU: WOMEN */}
        {openMenu === 'women' && (
          <div className="w-full bg-white border-t border-gray-100 shadow-xl hidden md:block" onMouseLeave={() => setOpenMenu(null)}>
            <div className="max-w-7xl mx-auto px-16 py-8 flex gap-16">
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Featured</span>
                <Link href="/category/women" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">All Women</Link>
                <Link href="/category/women/Tops%20%26%20Short%20Set" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Tops & Short Set</Link>
              </div>
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Tops</span>
                <Link href="/category/women/Crop%20Tops" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Crop Tops</Link>
                <Link href="/category/women/Oversize" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Oversize</Link>
              </div>
              <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] font-chakra font-semibold tracking-[0.2em] text-gray-400 uppercase pb-2 border-b border-gray-100">Bottoms</span>
                <Link href="/category/women/Shorts" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Shorts</Link>
                <Link href="/category/women/Leggings" onClick={() => setOpenMenu(null)} className="text-[12px] font-chakra font-normal uppercase text-gray-700 hover:text-[#D4AF37] tracking-wider transition-colors py-0.5">Leggings</Link>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH PANEL */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md py-4 px-4 z-50">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search premium sportswear..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); onSearchQueryChange(e.target.value); }}
                className="w-full text-sm outline-none bg-transparent py-2 border-b border-gray-200 focus:border-black transition-colors"
                autoFocus
              />
              {searchTerm && (
                <button type="button" onClick={clearSearch} className="p-1 text-gray-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="bg-black text-white px-4 py-2 text-xs uppercase font-semibold tracking-wider hover:bg-gray-900 cursor-pointer">
                Find
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[290px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex flex-col justify-center">
                <div className="w-4 h-[2px] mb-1 bg-[#111111]"></div>
                <div className="w-3 h-[2px] mb-1 bg-[#111111]"></div>
                <div className="w-2 h-[2px] bg-[#111111]"></div>
              </div>
              <span className="font-chakra text-lg font-bold tracking-widest text-gray-900">MENU</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 font-chakra">
            {/* Men Section */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase block mb-3 border-b border-gray-100 pb-1">Men</span>
              <div className="pl-2 space-y-3 flex flex-col">
                <Link href="/category/men" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">All Men</Link>
                <Link href="/category/men/UNMARKED" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Unmarked</Link>
                <Link href="/category/men/CAMO" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Camo Series</Link>
                <Link href="/category/men/DRY-FIT%20T%20Shirt" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Dry-Fit T-Shirts</Link>
                <Link href="/category/men/Oversize" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Oversize</Link>
                <Link href="/category/Men?clothingType=Bottoms" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Shorts</Link>
              </div>
            </div>

            {/* Women Section */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase block mb-3 border-b border-gray-100 pb-1">Women</span>
              <div className="pl-2 space-y-3 flex flex-col">
                <Link href="/category/women" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">All Women</Link>
                <Link href="/category/women/Tops%20%26%20Short%20Set" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Tops & Short Set</Link>
                <Link href="/category/women/Crop%20Tops" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Crop Tops</Link>
                <Link href="/category/women/Oversize" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Oversize</Link>
                <Link href="/category/Women?clothingType=Bottoms" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Shorts</Link>
                <Link href="/category/women/Leggings" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">Leggings</Link>
              </div>
            </div>

            {/* Accessories Section */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase block mb-3 border-b border-gray-100 pb-1">Accessories</span>
              <div className="pl-2 flex flex-col">
                <Link href="/category/accessories" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] uppercase text-gray-800 hover:text-[#D4AF37] tracking-wider transition-colors">All Accessories</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};