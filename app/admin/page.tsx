'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ouvnjumdagvuzavmxhgj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dm5qdW1kYWd2dXphdm14aGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg2NjYsImV4cCI6MjA1NjgxNDY2Nn0.eyJjYW1wYWlnbiI6InBsYXRmb3JtX3JlZmVycmFsIn0.eyjJb2NpcCI6InBsYXRmb3JtX3JlZmVycmFsIn0';
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

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Abaya');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN. Try 1234');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill in title and price.');
      return;
    }

    setLoading(true);
    try {
      let imageUrls: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file.size > 25 * 1024 * 1024) {
            alert(`File ${file.name} is larger than 25MB limit.`);
            setLoading(false);
            return;
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          imageUrls.push(publicUrlData.publicUrl);
        }
      }

      const mainImage = imageUrls.length > 0 ? imageUrls[0] : '';

      const { error: dbError } = await supabase.from('products').insert([
        {
          title,
          category,
          price,
          description,
          image: mainImage,
          images: imageUrls
        }
      ]);

      if (dbError) throw dbError;

      alert(`Product "${title}" added successfully!`);
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFiles(null);
      fetchProducts();
    } catch (error: any) {
      alert('Error uploading product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
          <input
            type="password"
            maxLength={4}
            placeholder="PIN: 1234"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest mb-4 focus:outline-rose-600"
          />
          <button type="submit" className="w-full bg-rose-700 text-white py-3 rounded-xl font-semibold hover:bg-rose-800 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-rose-600 font-semibold hover:underline">
            Logout
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm focus:outline-rose-600"
              placeholder="e.g., Luxury Abaya"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm bg-white focus:outline-rose-600"
            >
              <option value="Abaya">Abaya</option>
              <option value="Perfumes & Cosmetics">Perfumes & Cosmetics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Price (PKR)</label>
            <input
              type="text"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm focus:outline-rose-600"
              placeholder="e.g., 5500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm focus:outline-rose-600"
              placeholder="Details..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(e.target.files)}
              className="w-full p-3 border border-dashed rounded-xl text-xs text-gray-600 bg-rose-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-700 file:text-white hover:file:bg-rose-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-700 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-rose-800 transition disabled:bg-gray-400 shadow-md"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </form>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Existing Products ({products.length})</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  {p.image && <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded-lg" />}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{p.title}</h4>
                    <p className="text-xs text-gray-500">Rs. {p.price} | {p.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}