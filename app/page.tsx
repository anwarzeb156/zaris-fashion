'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('All Items');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = activeTab === 'All Items' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-rose-700 text-white py-6 px-4 text-center">
        <h1 className="text-3xl font-bold">Zari's Fashion</h1>
        <p className="text-rose-100 text-sm mt-1">Abayas & Luxury Fragrances</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome to Zari's Fashion</h2>
          <p className="text-gray-500 text-sm mt-1">Handcrafted Abayas & Exclusive Perfume Brand</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {['All Items', 'Abaya', 'Perfumes & Cosmetics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab 
                  ? 'bg-rose-700 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'Abaya' ? '👗 Abayas' : tab === 'Perfumes & Cosmetics' ? '✨ Perfumes & Cosmetics' : '📦 All Items'}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found. Add products from the admin panel!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-48 bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 rounded mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{product.title}</h3>
                  <p className="text-gray-600 text-xs mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Rs. {product.price}</span>
                    <a
                      href={`https://wa.me/?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.title)}%20priced%20at%20Rs.%20${product.price}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                    >
                      Order via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}