"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  
  // Product Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("abaya");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Simple PIN code protection (Default PIN: 1234)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect PIN code! Try again.");
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !image) {
      alert("Please fill all details and select an image!");
      return;
    }

    alert(`Product "${title}" added successfully!`);
    // Clear Form
    setTitle("");
    setPrice("");
    setDescription("");
    setImage(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-rose-700">Zari's Fashion Admin</h2>
          <p className="text-xs text-gray-500 mt-1">Enter PIN to access dashboard</p>
          <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="p-2 border rounded-lg text-center text-lg tracking-widest focus:outline-rose-600"
            />
            <button
              type="submit"
              className="bg-rose-700 text-white py-2 rounded-lg font-semibold hover:bg-rose-800 transition"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <div>
          <h1 className="text-2xl font-bold text-rose-700">Add New Product</h1>
          <p className="text-xs text-gray-500">Upload new Abayas or Perfumes</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-red-600 underline font-semibold"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-xl shadow space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
          <input
            type="text"
            placeholder="e.g. Silk Butterfly Abaya"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm focus:outline-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm focus:outline-rose-600 bg-white"
          >
            <option value="abaya">👗 Abaya</option>
            <option value="cosmetics">✨ Perfume & Cosmetics</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Price (PKR)</label>
          <input
            type="text"
            placeholder="e.g. Rs. 4,500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm focus:outline-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Fabric detail, sizes, or scent notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded-lg text-sm focus:outline-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Upload Product Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-rose-700 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-rose-800 transition shadow mt-2"
        >
          Publish Product
        </button>
      </form>
    </main>
  );
}