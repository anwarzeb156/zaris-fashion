'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ouvnjumdagvuzavmxhgj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_iwI39JBrd7cfHt32thFphg_K9Sqp';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('All Items');
  const [loading, setLoading] = useState(true);
  const [selectedImageMap, setSelectedImageMap] = useState<{ [key: string]: string }>({});
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    fetchProducts();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('📲 App screen par save karne ke liye browser menu ya share button se "Add to Home Screen" choose karein.');
    }
  };

  const filteredProducts = activeTab === 'All Items' 
    ? products 
    : products.filter(p => p.category.toLowerCase().includes(activeTab.toLowerCase().replace('s', '')));

  const handleThumbnailClick = (productId: string, imgUrl: string) => {
    setSelectedImageMap((prev) => ({ ...prev, [productId]: imgUrl }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Permanent Header with Always-Visible Install Button */}
      <header className="bg-rose-700 text-white py-4 px-4 shadow-md sticky top-0 z-50 flex items-center justify-between max-w-5xl mx-auto rounded-b-xl">
        <div className="text-left">
          <h1 className="text-xl font-bold tracking-wide">Zari's Fashion</h1>
          <p className="text-rose-100 text-[10px]">Abayas & Luxury Fragrances</p>
        </div>

        {/* ALWAYS VISIBLE INSTALL BUTTON */}
        <button
          onClick={handleInstallClick}
          className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg transition transform active:scale-95 animate-bounce"
        >
          <span className="text-base">📲</span>
          <span>Install App</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Welcome to Zari's Fashion</h2>
          <p className="text-gray-500 text-xs mt-1">Handcrafted Abayas & Exclusive Perfume Brand</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {['All Items', 'Abaya', 'Perfumes & Cosmetics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab 
                  ? 'bg-rose-700 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab === 'Abaya' ? '👗 Abayas' : tab === 'Perfumes & Cosmetics' ? '✨ Perfumes & Cosmetics' : '📦 All Items'}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium text-sm">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
            <p className="text-gray-500 text-sm font-medium">No products found in this category.</p>
            <p className="text-gray-400 text-xs mt-1">Upload items from the admin panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const allImages = product.images && product.images.length > 0 
                ? product.images 
                : product.image ? [product.image] : [];
              const currentImage = selectedImageMap[product.id] || allImages[0] || '';

              return (
                <div key={product.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="h-64 bg-gray-100 relative overflow-hidden">
                      {currentImage ? (
                        <img src={currentImage} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image Available</div>
                      )}
                    </div>

                    {allImages.length > 1 && (
                      <div className="flex gap-2 p-2 bg-gray-50 overflow-x-auto border-b">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleThumbnailClick(product.id, img)}
                            className={`w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                              currentImage === img ? 'border-rose-600' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 rounded mb-2">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-gray-800 text-base mb-1">{product.title}</h3>
                      <p className="text-gray-600 text-xs mb-4 leading-relaxed">{product.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold">PRICE</span>
                      <span className="font-bold text-gray-900 text-base">Rs. {product.price}</span>
                    </div>
                    <a
                      href={`https://wa.me/?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.title)}%20priced%20at%20Rs.%20${product.price}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                    >
                      Order via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}